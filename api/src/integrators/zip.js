import path from 'path'
import rimraf from 'rimraf'
import JSZip from 'jszip'
import fs from 'fs'

const ZIP_OUTPUT_FOLDER = './uploads'

/**
 *
 * @param {Array[String]} outputFiles array of paths to zip
 * @param {String} zipName what to name the zip file
 * @param {Boolean} deleteFiles pass true to delete the files after zipping
 */
const compress = async function(outputFiles, zipName, deleteFiles) {
  if (outputFiles.length < 1) {
    return // Probably error condition
  }

  // Assumes all output files are in the same directory
  const dir = path.dirname(outputFiles[0])
  const zipPath = path.join(ZIP_OUTPUT_FOLDER, `${zipName}.zip`)
  await zipDir(dir, zipPath, zipName)

  if (deleteFiles) {
    rimraf(dir, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  return zipPath
}

/**
 * Zips an input folder to the given output path
 * Non-recursive, only zips non-directory files found
 * at the top-level of inputDirPath
 *
 * Returns a promise that fulfills when zip is written
 */

const zipDir = function(inputDirPath, outputFilePath, zipName) {
  return new Promise(async (resolve, reject) => {
    const zip = new JSZip()

    const files = await fs.promises.readdir(inputDirPath)
    console.log(files)

    Promise.all(files.map(async (file) => {
      const realPath = path.join(inputDirPath, file)
      const stat = await fs.promises.stat(realPath)
      if (stat.isFile()) {
        const fileStream = fs.createReadStream(realPath)
        return zip.file(file, fileStream)
      }
      // zip.folder(file)
    }))

    console.log(zip)

    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(path.resolve(ZIP_OUTPUT_FOLDER, `${zipName}.zip`)))
      .on('finish', () => {
        console.log("zip file written.")
        resolve()
      })
      .on('error', reject)

    // Stream zip to output path
  })
}

const streamDataToFile = function(content, outputFilePath) {
  return new Promise((resolve, reject) => {
    const zipStream = content.pipe(fs.createWriteStream(outputFilePath))

    zipStream.on('close', resolve)
    zipStream.on('error', reject)
  })
}

module.exports = zipDir


module.exports = {
  compress
}
