import { Request } from 'express'
import {
  deleteAllFiles,
  getNameFromFullname,
  handleUploadAudio,
  handleUploadImage,
  handleUploadVideo
} from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import path from 'path'
import { envConfig, isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'

class MediasService {
  async uploadImage(req: Request) {
    const directoryPathImageTemp = path.resolve(__dirname, UPLOAD_IMAGE_TEMP_DIR)
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/image/${newName}.jpg`
            : `http://localhost:${envConfig.port}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    if (deleteAllFiles(directoryPathImageTemp)) return result
  }

  async uploadAudio(req: Request) {
    const files = await handleUploadAudio(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${envConfig.host}/static/audio-stream/${file.newFilename}`
          : `http://localhost:${envConfig.port}/static/audio-stream/${file.newFilename}`,
        type: MediaType.Audio
      }
    })
    return result
  }

  async uploadVideo(req: Request) {
    const directoryPathVideoTemp = path.resolve(__dirname, UPLOAD_VIDEO_TEMP_DIR)
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${envConfig.host}/static/video-stream/${file.newFilename}`
          : `http://localhost:${envConfig.port}/static/video-stream/${file.newFilename}`,
        type: MediaType.Video
      }
    })
    // if (deleteAllFiles(directoryPathVideoTemp)) return result
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
