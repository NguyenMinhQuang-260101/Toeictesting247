import { Request } from 'express'
import formidable, { File } from 'formidable'
import { exec } from 'child_process'
import fs from 'fs'
import {
  UPLOAD_AUDIO_DIR,
  UPLOAD_AUDIO_TEMP_DIR,
  UPLOAD_IMAGE_TEMP_DIR,
  UPLOAD_VIDEO_DIR,
  UPLOAD_VIDEO_TEMP_DIR
} from '~/constants/dir'

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxTotalFileSize: 10 * 1024 * 1024 * 4, // 40MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No file uploaded'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadAudio = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_AUDIO_DIR,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'audio' && Boolean(mimetype?.includes('audio/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.audio)) {
        return reject(new Error('No file uploaded'))
      }
      const audios = files.audio as File[]
      audios.forEach((audio) => {
        const ext = getExtension(audio.originalFilename as string)
        fs.renameSync(audio.filepath, audio.filepath + '.' + ext)
        audio.newFilename = audio.newFilename + '.' + ext
        audio.filepath = audio.filepath + '.' + ext
      })
      resolve(files.audio as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('video/') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('No file uploaded'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
        video.filepath = video.filepath + '.' + ext
      })

      resolve(files.video as File[])
    })
  })
}

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_AUDIO_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

export const getExtension = (fullname: string) => {
  const namearr = fullname.split('.')
  return namearr[namearr.length - 1]
}

export const deleteAllFiles = (dir: string) => {
  if (process.platform === 'win32') {
    exec(`del /Q ${dir}\\*`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error occurred while deleting files:', error)
        return false
      }

      if (stderr) {
        console.error('Error output:', stderr)
        return false
      }
    })
  } else {
    exec(`rm -f ${dir}/*`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error occurred while deleting files:', error)
        return false
      }

      if (stderr) {
        console.error('Error output:', stderr)
        return false
      }
    })
  }
  return true
}
