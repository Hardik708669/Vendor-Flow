import api from './api'

const sid = (id) => encodeURIComponent(String(id))

export const getOrders = () => api.get('/orders')
export const getOrderById = (id) => api.get(`/orders/${sid(id)}`)
export const createOrder = (data) => api.post('/orders', data)
export const updateOrderStatus = (id, status) => api.put(`/orders/${sid(id)}/status`, { status })

export default { getOrders, getOrderById, createOrder, updateOrderStatus }
