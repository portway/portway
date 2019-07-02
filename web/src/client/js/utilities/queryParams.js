export const parseParams = (queryParams) => {
  const query = {}
  const pairs = (queryParams[0] === '?' ? queryParams.substr(1) : queryParams).split('&')
  if (pairs[0] === '') return {}
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export const convertParams = (paramsObject) => {
  const joinByEquals = pair => pair.join('=')
  const params = Object.entries(paramsObject).map(joinByEquals).join('&')
  if (params) {
    return `?${params}`
  } else {
    return ''
  }
}
