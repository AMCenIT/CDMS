import { api, aiosapi, oneshop } from "boot/axios";

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

const getCustomerDataaios = function () {
  return aiosapi.get("users").then(function (users) {
    return users.data;
  });
};
// Oneshop
const getCustomerDataOneShop = function () {
  return oneshop.get("customers?$limit=1000").then(function (customers) {
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

export const loginAios = () => {
  return loginApiAios();
};

export const getAllCustomerData = (query) => {
  return getCustomerData(query);
};

export const getCustomerDataAllaios = () => {
  return getCustomerDataaios();
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
