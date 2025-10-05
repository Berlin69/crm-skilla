import axios from "axios"

const BASE_URL = import.meta.env.VITE_SKILLA_BASE_URL ?? "https://api.skilla.ru"
const TOKEN = import.meta.env.VITE_SKILLA_TOKEN ?? "testtoken"

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {Authorization: `Bearer ${TOKEN}`},
})