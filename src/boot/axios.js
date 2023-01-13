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
  // baseURL: "https://ccd-mirdc.ap.ngrok.io",
  baseURL: "http://10.10.120.19:1336",
  headers: {
    "Content-Type": "application/json",
  },
}); //Production
// const aiosapi = axios.create({ baseURL: "https://aios-mirdc.ap.ngrok.io" }); // Production
const aiosapi = axios.create({
  baseURL: "http://10.10.120.126:3030/",
  // baseURL: "https://aios-mirdc.ap.ngrok.io/",
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

const physmet = axios
  .request({
    method: "get",
    baseURL: "http://10.10.120.32:1337/api/job-orders",
    headers: {
      Authorization:
        "Bearer" +
        "1a951bf72526c8dcf2abb2143458e612442d4814f1ddd9d6d2c58af3ead67d769c5115c63da7a633a1d8d6cfaaaa9fe4adfb62dafda09fc5cc083bea930035197c24f013c905ae5ca0884376fc0153cc419565f4209f27ae7c983fd340a6d963a371f5a1236f517ec038c633d0cad60754cefbb62247fe98b1d6bb1b40fc5f8a",
    },
  })
  .then((response) => {
    // console.log('erick response data', response.data)
  });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$api = aiosapi;
  app.config.globalProperties.$api = oneshop;
  app.config.globalProperties.$api = physmet;

  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, aiosapi, oneshop, physmet };
