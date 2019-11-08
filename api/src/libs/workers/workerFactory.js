/**
 * Create a happy little worker_thread factory to
 * run your blocking tasks.
 *
 * Module returns a function that can be invoked to execute
 * the given runnerName in a worker thread. Returned function
 * takes any number of arguments and passes them through to the
 * runner.
 *
 * Runner args must be cloneable objects or the main thread cannot
 * pass them to the worker thread
 */
import path from 'path'
import { Worker } from 'worker_threads'
import runners from '../../constants/runners'
const runnerFiles = Object.values(runners)

const currentDir = __dirname

export default (runnerName) => {
  if (!runnerFiles.includes(runnerName)) {
    throw new Error(`${runnerName} is not a valid runner`)
  }

  const filename = `./runners/${runnerName}.js`
  const filePath = path.resolve(currentDir, filename)

  return (...args) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(filePath, {
        workerData: args
      })
      worker.on('message', resolve)
      worker.on('error', reject)
      worker.on('exit', (code) => {
        if (code !== 0) { reject(new Error(`Worker ${runnerName} stopped with exit code ${code}`)) }
      })
    })
  }
}