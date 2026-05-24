import api from './api'

export const getReportAnalytics = () => api.get('/reports/analytics')
export const exportReportPdf = () => api.get('/reports/export/pdf', { responseType: 'blob' })
