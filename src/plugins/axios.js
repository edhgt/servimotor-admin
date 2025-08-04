import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL + '/api/v1';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
    config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('access_token')
    return config
}, (error) => {
    Promise.reject(error)
})
export default axios;
