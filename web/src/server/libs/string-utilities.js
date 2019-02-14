// https://stackoverflow.com/questions/2519818/create-a-permalink-with-javascript
export const makePermalinkWithString = (str) => {
  return str
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-*|-*$/g, '')
    .toLowerCase()
}
