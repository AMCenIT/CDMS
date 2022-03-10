import { api } from "boot/axios";

const getCustomerData = function () {
  return api
    .get("/api/customers/?populate=industry&populate=type&populate=type")
    .then(function (customers) {
      return customers.data.data;
    });
};
const populateindustry = function () {
  return api
    .get("/api/customers/?populate=industry")
    .then(function (customers) {
      return customers.data.data;
    });
};

const postCustomerDataApi = async function (customer) {
  await api.post("/api/customers", customer).then((res) => {
    console.log("post data", res.data);
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
  return api.get("api/industries").then(function (industries) {
    return industries.data.data;
  });
};

const getType = function () {
  return api.get("api/types").then(function (industries) {
    return industries.data.data;
  });
};

export const getAllCustomerData = () => {
  return getCustomerData();
};

export const populateAllIndutries = () => {
  return populateindustry();
};

export const postCustomerData = (customer) => {
  return postCustomerDataApi(customer);
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
