import { boot } from "quasar/wrappers";
import axios from "axios";
import store from "../store";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: "http://10.10.120.19:1336" }); //Dev
const api = axios.create({
  baseURL: "https://ccd-mirdc.ap.ngrok.io",
  headers: {
    "Content-Type": "application/json",
  },
}); //Production
// const aiosapi = axios.create({ baseURL: "https://aios-mirdc.ap.ngrok.io" }); // Production
const aiosapi = axios.create({
  baseURL: "http://10.10.120.126:3030/",
  headers: {
    "Content-Type": "application/json",
  },
}); // Production
// const aiosapi = axios.create({ baseURL: "http://10.10.120.25:81" }); //  statging
const oneshop = axios.create({ baseURL: "http://10.10.120.32:3030" });

aiosapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = `Bearer ` + token;

  return config;
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$api = aiosapi;
  app.config.globalProperties.$api = oneshop;

  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, aiosapi, oneshop };
