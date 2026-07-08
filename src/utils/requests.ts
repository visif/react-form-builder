import fetch from 'isomorphic-fetch'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  OPTIONS: '',
}

export function post(url: string, data: unknown): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then((response: Response) => {
    if (!response.ok) {
      throw new Error(`POST ${url} failed with status ${response.status}`)
    }
    return response
  })
}

export function get(url: string): Promise<unknown> {
  return fetch(url, {
    method: 'GET',
    headers,
  }).then((response: Response) => {
    if (!response.ok) {
      throw new Error(`GET ${url} failed with status ${response.status}`)
    }
    return response.json()
  })
}
