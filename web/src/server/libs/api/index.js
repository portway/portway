import urlLib from 'url'
import axios from 'axios'

const URL = urlLib.URL

/**
 * API Interface for the DangerAPI
 *
 * Note this code will not be the SDK for the DangerAPI
 * as it does not remember credentials as it's requesting
 * resources for a multitude of users
 */

class DangerApi {
  constructor(opts) {
    const url = (typeof opts === 'object') ? opts.url : opts

    if (typeof (url) !== 'string' && url.length < 1) {
      throw new Error('Must pass a url option to the DangerAPI constructor')
    }

    const baseURL = new URL('api/', url)

    this.axiosInstance = axios.create({
      baseURL: baseURL.toString(),
      timeout: 5000
    })
  }

  /**
   * @param {String} resource
   * @param {String} token
   */
  async request(resource, token) {
    const res = await this.send(resource, token)
    return res
  }

  /**
   * Authenticates a user and returns a token
   * @param {String} email
   * @param {String} password
   * @return {String} token
   */
  async authenticate(email, password) {
    const res = await this.send({
      url: 'login',
      method: 'POST',
      data: {
        email,
        password
      }
    })
    return res.data.token
  }

  async send(config, token) {
    // Do whatever with token to auth future requests
    return await this.axiosInstance.request(config)
  }
}


export default DangerApi