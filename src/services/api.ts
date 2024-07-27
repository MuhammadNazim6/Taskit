import axios from "axios";
const Api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
    withCredentials: true,
});

export default Api; 