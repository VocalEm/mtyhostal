import axios from "axios";

// 1. CREA LA INSTANCIA DE AXIOS
const api = axios.create({
  // Asegúrate de que esta URL coincida con la URL 'https'
  // de tu backend en el archivo launchSettings.json
  baseURL: "https://localhost:7233/api",
});

// 2. CONFIGURA EL INTERCEPTOR PARA ENVIAR EL JWT
// Esto se ejecuta ANTES de que cada petición sea enviada
api.interceptors.request.use(
  (config) => {
    // Busca el token en el localStorage
    const token = localStorage.getItem("token");

    // Si el token existe, lo añade a la cabecera de autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
