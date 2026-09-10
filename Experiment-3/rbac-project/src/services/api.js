import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// Request Interceptor
// Automatically attaches JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
// Handles unauthorized responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Access token expired. Refresh required.");

      const oldToken = localStorage.getItem("token");

      if (oldToken) {
        try {
          // Import dynamically to avoid circular dependency
          const { refreshAccessToken } = await import("./auth");

          const newToken = refreshAccessToken(oldToken);

          if (newToken) {
            localStorage.setItem("token", newToken);

            // Retry original request with new token
            error.config.headers.Authorization = `Bearer ${newToken}`;

            return api(error.config);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;