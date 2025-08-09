import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL + '/api/v1';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
    config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('access_token')
    return config
}, (error) => {
    Promise.reject(error)
});

axios.interceptors.response.use(
    response => {
        return response
    },
    async error => {
        const toastModule = await import('@/plugins/ionic-toast');
        if(error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            toastModule.showToast({
                message: 'Su sesión ha expirado. Por favor, inicie sesión de nuevo.',
                color: 'danger',
                buttons: ['Cerrar'],
                position: 'top'
            });
            const module = await import('@/router')
            const router = module.default
            router.push({ name: 'login' })
        } else {
            toastModule.showToast({
                message: 'Error: ' + error.response.statusText,
                color: 'danger',
                buttons: ['Cerrar'],
                position: 'bottom'
            });
        }

        return Promise.reject(error)
    }
);

export default axios;
