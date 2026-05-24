import api from './api'

const sid = (id) => encodeURIComponent(String(id))

export const getPayments = () => api.get('/payments')
export const updatePaymentStatus = (id, data) => api.put(`/payments/${sid(id)}/status`, data)
export const exportPaymentsCsv = () => api.get('/payments/export', { responseType: 'blob' })

export default { getPayments, updatePaymentStatus, exportPaymentsCsv }
