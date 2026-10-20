import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function scanMessage(message) {
  const { data } = await api.post("/scan", { message });
  return data;
}

export async function scanImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/scan/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getDashboard() {
  const { data } = await api.get("/dashboard");
  return data;
}

export async function healthCheck() {
  const { data } = await api.get("/health");
  return data;
}
