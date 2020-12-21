import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.post(
    baseUrl, newObject, config
  ).catch(() => {
    throw 'There was an error creating the blog'
  })
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll, create, setToken }
