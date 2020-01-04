import axios from 'axios'

export async function fetchImageBlob(resource) {
  const axiosInstance = axios.create({
    timeout: 0,
    responseType: 'blob'
  })

  try {
    const { data } = await axiosInstance.get(resource)
    return data
  } catch (error) {
    throw error
  }
}
