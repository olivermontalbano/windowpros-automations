/**
 * Shared API Client
 * Provides a configured axios instance with interceptors for logging and error handling
 */

import axios, { AxiosInstance, AxiosError } from "axios";

/**
 * Creates a configured axios instance for API calls
 * @param {string} baseURL - Base URL for the API
 * @param {Record<string, string>} headers - Headers to include in all requests
 * @param {number} timeout - Request timeout in milliseconds (default: 10000)
 * @return {AxiosInstance} Configured axios instance
 */
export function createApiClient(
  baseURL: string,
  headers: Record<string, string> = {},
  timeout = 10000
): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    timeout,
  });

  // Request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      const method = config.method?.toUpperCase();
      const url = config.url;
      console.log(`API Request: ${method} ${baseURL}${url}`);
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // Server responded with error status
        console.error(
          `API Error: ${error.response.status} ${error.response.statusText}`,
          error.response.data
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error("API Network Error:", error.message);
      } else {
        // Something else happened
        console.error("API Error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return client;
}
