import axios from "axios";
import { AnyType } from "../../types";
import { appconfig } from "./app.config";

const axiosInstance = axios.create({
  baseURL: appconfig.apiBaseUrl || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getMethod = async <T>(url: string, config = {}) => {
  const response = await axiosInstance.get<T>(url, config);
  return response.data;
};

export const postMethod = async <T>(
  url: string,
  data?: AnyType,
  config = {}
): Promise<AnyType> => {
  const response = await axiosInstance.post<T>(url, data, config);
  return response.data;
};

export const patchMethod = async <T>(
  url: string,
  data?: AnyType,
  config = {}
) => {
  const response = await axiosInstance.patch<T>(url, data, config);
  return response.data;
};

export const putMethod = async <T>(
  url: string,
  data?: AnyType,
  config = {}
) => {
  const response = await axiosInstance.put<T>(url, data, config);
  return response.data;
};

export const deleteMethod = async <T>(url: string, config = {}) => {
  const response = await axiosInstance.delete<T>(url, config);
  return response.data;
};
