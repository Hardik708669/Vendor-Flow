import api from './api'

const sid = (id) => encodeURIComponent(String(id))

export const getCustomers = () => api.get('/customers')
export const getCustomerById = (id) => api.get(`/customers/${sid(id)}`)
export const createCustomer = (data) => api.post('/customers', data)
export const updateCustomer = (id, data) => api.put(`/customers/${sid(id)}`, data)
export const deleteCustomer = (id) => api.delete(`/customers/${sid(id)}`)

export default { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer }
