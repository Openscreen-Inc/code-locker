import Axios from 'axios'

export const axios = Axios.create({
  baseURL: process.env.BACKEND_URL,
})

export const api = {
  getScan: (id) => axios(`/scan/${id}`),
  getItem: (id) => axios(`/${id}`),
  updateItem: ({id, type, status, condition, renter}) => axios.patch('/', {id, type, status, condition, renter}),
  createItem: ({type, name, description}) => axios.post('/', {type, name, description}),
  listItems: () => axios('/'),
}

export default api
