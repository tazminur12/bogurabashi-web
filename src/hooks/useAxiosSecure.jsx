import axios from "axios";
import { useMemo } from "react";

const useAxiosSecure = () => {
  const axiosSecure = useMemo(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://bogurabashi-server.vercel.app";
    const instance = axios.create({
      baseURL: apiBaseUrl,
      withCredentials: true,
    });

    // Add request interceptor
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
