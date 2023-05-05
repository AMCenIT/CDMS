import { api, aiosapi, oneshop, physmet } from "boot/axios";
import { getTransitionRawChildren } from "vue";
import axios from "axios";

const loginApiAios = async function () {
  await aiosapi
    .post("/authentication", {
      strategy: "local",
      email: "it.amcen@gmail.com",
      password: "123456",
    })
    .then((res) => {
      console.log("post data", res.data);
    });
};

// get Customer AIOS

const getCustomerDataaios = function (query) {
  return aiosapi.get("users?" + query).then(function (users) {
    // console.log("test", users.data)
    return users.data;
  });
};

// POST customer AIOS

const postCustomerDataaios = async function (customer) {
  await aiosapi.post("customerSignUp", customer).then((res) => {
    console.log("post data", res.data);
  });
};

// Get aios all transaction
const getTransactionDataaios = function (query) {
  return aiosapi.get("transactions?" + query).then(function (transactions) {
    return transactions.data;
  });
};

// const getJobOrderDataPhysmet = function (query) {
//   return axios
//     .request({
//       method: "get",
//       baseURL: "http://10.10.120.32:1337/api/job-orders?" + query,
//       headers: {
//         Authorization:
//           "Bearer" +
//           "1a951bf72526c8dcf2abb2143458e612442d4814f1ddd9d6d2c58af3ead67d769c5115c63da7a633a1d8d6cfaaaa9fe4adfb62dafda09fc5cc083bea930035197c24f013c905ae5ca0884376fc0153cc419565f4209f27ae7c983fd340a6d963a371f5a1236f517ec038c633d0cad60754cefbb62247fe98b1d6bb1b40fc5f8a",
//       },
//     })
//     .then(function (response) {
//       // console.log("request.data", request.data);
//       return response.data;
//     });
//   // console.log("physmet", physmet);
// };

// Oneshop
const getCustomerDataOneShop = function () {
  return oneshop.get("customers?$limit=1000").then(function (customers) {
    // console.log("customer.data", customers.data);
    return customers.data;
  });
};

// Oneshop request
const getRequestDataOneShop = function (query) {
  // console.log("ONEEEe", query);
  return oneshop.get("requests?" + query).then(function (request) {
    // console.log("request.data", request.data);
    return request.data;
  });
};
// Oneshop via table
const getCustomerDataOneShopTable = function (query) {
  return oneshop.get("customers?" + query).then(function (customers) {
    // console.log("oneshop query ", customers.data);
    return customers.data;
  });
};

const getCustomerData = function (query) {
  return api.get("/api/customers?" + query).then(function (customers) {
    return customers;
  });
};

const getJobOrderDataPhysmet = function (query) {
  return physmet.then(function (request) {
    console.log("requestasdq", request);
    return request;
  });
};

// add
const postCustomerDataApi = async function (customer) {
  await api.post("/api/customers", customer).then((res) => {
    console.log("post data", res.data);
  });
};

// delete

const deleteCustomer = async function (id) {
  let errorMessage = "";
  await api
    .delete("/api/customers/" + id)
    .then((res) => {
      console.log("deleted question", res);
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  console.log(id);
};

const editCustomer = async function (id, customer) {
  let errorMessage = "";
  console.log("customer edit", customer);
  await api.put("api/customers/" + id, customer).then((res) => {
    console.log(res);
  });
};

const loginApiSSO = function (username, password) {
  return api
    .post("api/auth/local", {
      identifier: username.toString(),
      password: password.toString(),
    })
    .then(function (response) {
      setJWT(response.data.jwt);
    });
};

const getIndustry = function () {
  return api
    .get("api/industries?pagination[start]=0&pagination[limit]=40")
    .then(function (industries) {
      return industries.data.data;
    });
};

const getType = function () {
  return api.get("api/types").then(function (industries) {
    return industries.data.data;
  });
};

// Searh API
const searhAPI = function (query) {
  return api.get("api/custumers?" + query).then(function (searchdata) {
    return searchdata.data.data;
  });
};

// Email Exist
const existCompany = function (company) {
  return api
    .get(
      "http://10.10.120.19:1336/api/customers?filters[displayName][$eq]" +
        company
    )
    .then(function (response) {
      // console.log("test", response);
      return response.data.data;
    });
};

const existCustomerID = function (customerid) {
  return api
    .get(
      "http://10.10.120.19:1336/api/customers?filters[customer_id][$eq]" +
        customerid
    )
    .then(function (response) {
      // console.log("test", response);
      return response.data.data;
    });
};

const existTsrNo = function (tsrNo) {
  return api
    .get(
      "http://10.10.120.19:1336/api/transactions?filters[tsrNo][$eq]" + tsrNo
    )
    .then(function (response) {
      // console.log("test", response);
      return response.data.data;
    });
};

const existId = function (id) {
  return api
    .get(
      "http://10.10.120.19:1336/api/transactions?filters[customer_id][$eq]" +
        id +
        "&pagination[page]=1&pagination[pageSize]=500"
    )
    .then(function (response) {
      // console.log("test", response);
      return response.data.data;
    });
};

// For existed email
const existEmail = function (email) {
  return api
    .get("http://10.10.120.19:1336/api/customers?filters[email][$eq]" + email)
    .then(function (response) {
      // console.log("test", response.data.data);
      return response.data.data;
    });
};

// For System Filtering
const systemFilter = function (system) {
  return api
    .get("http://10.10.120.19:1336/api/customers?filters[system][$eq]" + system)
    .then(function (response) {
      // console.log("system data", response);
      return response.data.data;
    });
};

const pjoisTotalFilter = function (system) {
  return api
    .get("http://10.10.120.19:1336/api/customers?filters[system][$eq]=PJOIS")
    .then(function (response) {
      // console.log("system data", response);
      return response.data.data;
    });
};

const searchAll = function (search) {
  return api
    .get("http://10.10.120.19:1336/api/customers?" + search)
    .then(function (response) {
      // console.log("response", response.data);
      return response.data.data;
    });
};

const systemDashboard = function (dashboard) {
  return api
    .get("http://10.10.120.19:1336/api/dashboard" + dashboard)
    .then(function (response) {
      console.log("response", response);
      return response;
    });
};

export const systemsDashboard = (query) => {
  return systemDashboard(query);
};

export const systemsFilter = (query) => {
  return systemFilter(query);
};

export const pjoisTotalFilters = (query) => {
  return pjoisTotalFilter(query);
};

export const searchAllData = (query) => {
  return searchAll(query);
};

export const postCustomerDataaiosApi = (data) => {
  return postCustomerDataaios(data);
};

export const validateCompany = (query) => {
  return existCompany(query);
};

export const validateCustomerID = (query) => {
  return existCustomerID(query);
};

export const validateTsrNo = (query) => {
  return existTsrNo(query);
};

export const validateId = (query) => {
  return existId(query);
};

export const validateEmails = (query) => {
  return existEmail(query);
};

export const loginAios = () => {
  return loginApiAios();
};

export const getAllCustomerData = (query) => {
  // console.log("query", query);
  return getCustomerData(query);
};
// aios Customer
export const getCustomerDataAllaios = (query) => {
  return getCustomerDataaios(query);
};

// AIOS transactions
export const getTransactionDataAllaios = (query) => {
  return getTransactionDataaios(query);
};

// physmet transactions
export const getJobOrderPhysmet = (query) => {
  // console.log("queryqueryqueryqueryqueryquery", query);
  return getJobOrderDataPhysmet(query);
};

export const getAllCustomerDataOneShop = () => {
  return getCustomerDataOneShop();
};

// pjois
export const getAllCustomerPhysmet = (query) => {
  return getCustomerDataPhysmet(query);
};

export const postCustomerData = (customer) => {
  // console.log("customer", customer);
  return postCustomerDataApi(customer);
};

export const deleteCustomerData = (id) => {
  return deleteCustomer(id);
};

export const editCustomerData = (id, customer) => {
  return editCustomer(id, customer);
};
export const loginToSSOStrapi = (username, password) => {
  return loginApiSSO(username, password);
};

export const getIndutries = () => {
  return getIndustry();
};

export const getAllType = () => {
  return getType();
};

export const getQueryCustomerDataOneShopTable = (query) => {
  return getCustomerDataOneShopTable(query);
};

export const getALLOneShopRequestDataOneShop = (query) => {
  return getRequestDataOneShop(query);
};

export const getsearchAPI = (query) => {
  return searhAPI(query);
};
