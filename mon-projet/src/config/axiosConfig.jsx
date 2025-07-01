import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:7777',
});

axiosConfig.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }

    if (config.data instanceof FormData) {
      // Cas FormData : ne pas définir Content-Type manuellement
      // Axios s'en occupe automatiquement

    } else if (typeof config.data === 'object' && config.data !== null) {
      // Cas JSON standard
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Intercepteur de réponse inchangé
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userData");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
