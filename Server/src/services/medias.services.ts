import { Request } from 'express'
import {
  deleteAllFiles,
  getNameFromFullname,
  handleUploadAudio,
  handleUploadImage,
  handleUploadVideo
} from '~/utils/file'
import sharp from 'sharp'
import {
  UPLOAD_AUDIO_DIR,
  UPLOAD_IMAGE_DIR,
  UPLOAD_IMAGE_TEMP_DIR,
  UPLOAD_VIDEO_DIR,
  UPLOAD_VIDEO_TEMP_DIR
} from '~/constants/dir'
import path from 'path'
import { envConfig, isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { uploadFileToS3 } from '~/utils/s3'
import mime from 'mime'
import fsPromise from 'fs/promises'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class MediasService {
  async uploadImage(req: Request) {
    const directoryPathImageTemp = path.resolve(__dirname, UPLOAD_IMAGE_TEMP_DIR)
    const directoryPathImage = path.resolve(__dirname, UPLOAD_IMAGE_DIR)

    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })

        // Một cách khác để xoá file
        //** await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)]) **

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
        // return {
        //   url: isProduction
        //     ? `${envConfig.host}/static/image/${newFullFilename}`
        //     : `http://localhost:${envConfig.port}/static/image/${newFullFilename}`,
        //   type: MediaType.Image
        // }
      })
    )
    if (deleteAllFiles(directoryPathImageTemp) && deleteAllFiles(directoryPathImage)) return result
  }

  async uploadAudio(req: Request) {
    const directoryPathAudio = path.resolve(__dirname, UPLOAD_AUDIO_DIR)
    const files = await handleUploadAudio(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'audios/' + file.newFilename,
          filepath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Audio
        }

        // return {
        //   url: isProduction
        //     ? `${envConfig.host}/static/audio-stream/${file.newFilename}`
        //     : `http://localhost:${envConfig.port}/static/audio-stream/${file.newFilename}`,
        //   type: MediaType.Audio
        // }
      })
    )
    if (deleteAllFiles(directoryPathAudio)) return result
  }

  async uploadVideo(req: Request) {
    const directoryPathVideo = path.resolve(__dirname, UPLOAD_VIDEO_DIR)
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'videos/' + file.newFilename,
          filepath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }

        // return {
        //   url: isProduction
        //     ? `${envConfig.host}/static/video-stream/${file.newFilename}`
        //     : `http://localhost:${envConfig.port}/static/video-stream/${file.newFilename}`,
        //   type: MediaType.Video
        // }
      })
    )
    if (deleteAllFiles(directoryPathVideo)) return result
  }
}

const mediasService = new MediasService()
export default mediasService
