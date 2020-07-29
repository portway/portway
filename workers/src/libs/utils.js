
export const promisifyStreamPipe = (readStream, writeStream) => {
  return new Promise((resolve, reject) => {
    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('finish', resolve)
    readStream.pipe(writeStream)
  })
}