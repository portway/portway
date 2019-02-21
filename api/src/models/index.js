import fs from 'fs'
import path from 'path'
const basename = path.basename(module.filename)
const modelFilePaths = []

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename
  })
  .forEach((file) => {
    if (file.slice(-3) !== '.js') return
    modelFilePaths.push(file)
  })

export {
  modelFilePaths
}
