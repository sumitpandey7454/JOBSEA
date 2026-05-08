import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ---- Auth ----
export const authApi = {
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  sendOtp: (phoneNumber) => api.post('/auth/phone/send-otp', { phoneNumber }),
  verifyOtp: (phoneNumber, otp) => api.post('/auth/phone/verify-otp', { phoneNumber, otp }),
}

// ---- Categories ----
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
}

// ---- Jobs ----
export const jobApi = {
  getAll: (page = 0, size = 10) => api.get(`/jobs?page=${page}&size=${size}`),
  getByCategory: (categoryId, page = 0, size = 10) =>
    api.get(`/jobs/category/${categoryId}?page=${page}&size=${size}`),
  search: (keyword, page = 0, size = 10) =>
    api.get(`/jobs/search?keyword=${keyword}&page=${page}&size=${size}`),
  getFeatured: () => api.get('/jobs/featured'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
}
// ---- Contact ----
export const contactApi = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
}
export default api