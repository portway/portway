import path from 'path'
import rimraf from 'rimraf'
import yazl from 'yazl'
import fs from 'fs'

/**
 *
 * @param {Array[String]} outputFiles array of paths to zip
 * @param {String} zipName what to name the zip file
 * @param {Boolean} deleteFiles pass true to delete the files after zipping
 */
const compressDirectory = async function (directoryPath, zipName, deleteFiles, outputPath) {
  const files = (await getRecursiveDirectoryFiles(directoryPath)).map(file => file.replace(`${directoryPath}/`, ''))

  if (files.length < 1) {
    return // Probably error condition
  }

  // Assumes all output files are in the same directory
  const zipPath = path.join(outputPath, `${zipName}.zip`)
  await zipFiles(files, directoryPath, zipPath)

  if (deleteFiles) {
    rimraf(directoryPath, (err) => {
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

const zipFiles = function (files, fileBasePath, zipOutputPath) {
  return new Promise(async (resolve, reject) => {
    const zipfile = new yazl.ZipFile()

    files.map((file) => {
      zipfile.addFile(path.resolve(fileBasePath, file), file)
    })

    zipfile.end()

    // Stream zip to output path
    const zipStream = zipfile.outputStream.pipe(fs.createWriteStream(zipOutputPath))

    zipStream.on('close', resolve)
    zipStream.on('error', reject)
  })
}

const getRecursiveDirectoryFiles = async function (dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const entryPath = path.resolve(dir, entry.name)
    return entry.isDirectory() ? getRecursiveDirectoryFiles(entryPath) : entryPath
  }))
  return Array.prototype.concat(...files)
}

module.exports = {
  compressDirectory
}
