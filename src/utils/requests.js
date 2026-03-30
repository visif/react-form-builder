import fetch from 'isomorphic-fetch'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  OPTIONS: '',
}

export function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`POST ${url} failed with status ${response.status}`)
    }
    return response
  })
}

export function get(url) {
  return fetch(url, {
    method: 'GET',
    headers,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`GET ${url} failed with status ${response.status}`)
    }
    return response.json()
  })
}
