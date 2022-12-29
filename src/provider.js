import { api, aiosapi, oneshop } from "boot/axios";
import { getTransitionRawChildren } from "vue";

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
// Oneshop
const getCustomerDataOneShop = function () {
  return oneshop.get("customers?$limit=1000").then(function (customers) {
    return customers.data;
  });
};

// Oneshop request
const getRequestDataOneShop = function (query) {
  console.log("ONEEEe", query);
  return oneshop.get("requests?" + query).then(function (request) {
    return request.data;
  });
};
// Oneshop via table
const getCustomerDataOneShopTable = function (query) {
  return oneshop.get("customers?" + query).then(function (customers) {
    console.log("oneshop query ", customers.data);
    return customers.data;
  });
};

const getCustomerData = function (query) {
  return api.get("/api/customers?" + query).then(function (customers) {
    return customers;
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

export const searchAllData = (query) => {
  return searchAll(query);
};

export const postCustomerDataaiosApi = (data) => {
  return postCustomerDataaios(data);
};

export const validateCompany = (query) => {
  return existCompany(query);
};

export const validateEmails = (query) => {
  return existEmail(query);
};

export const loginAios = () => {
  return loginApiAios();
};

export const getAllCustomerData = (query) => {
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

export const getAllCustomerDataOneShop = () => {
  return getCustomerDataOneShop();
};

export const postCustomerData = (customer) => {
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
