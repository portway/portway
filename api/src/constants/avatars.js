import { URL } from 'url'

// Avatar CDN shared across environments
const BASE_URL = 'https://www.portwaycontent.com'

const AVATAR_PATH = 'avatars'
const AVATAR_FILES = [
  '1.svg',
  '2.svg',
  '3.svg',
  '4.svg',
  '5.svg',
  '6.svg',
  '7.svg',
  '8.svg',
  '9.svg'
]

export const AVATAR_URLS = AVATAR_FILES.map((file) => {
  return (new URL([AVATAR_PATH, file].join('/'), BASE_URL)).toString()
})
