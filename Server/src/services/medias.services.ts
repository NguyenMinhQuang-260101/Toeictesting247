import { Request } from 'express'
import { getNameFromFullname, handleUploadImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import path from 'path'
import { envConfig, isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { exec } from 'child_process'

class MediasService {
  async handleUploadImage(req: Request) {
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

    if (process.platform === 'win32') {
      exec(`del /Q ${directoryPathImageTemp}\\*`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error occurred while deleting files:', error)
          return
        }

        if (stderr) {
          console.error('Error output:', stderr)
          return
        }

        return stdout
      })
    } else {
      exec(`rm -f ${directoryPathImageTemp}/*`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error occurred while deleting files:', error)
          return
        }

        if (stderr) {
          console.error('Error output:', stderr)
          return
        }

        return stdout
      })
    }

    return result
  }
}

const mediasService = new MediasService()
export default mediasService
