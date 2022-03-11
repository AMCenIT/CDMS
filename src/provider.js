import { api } from "boot/axios";

const getCustomerData = function () {
  return api
    .get("api/customers/?populate=industry&populate=type")
    .then(function (customers) {
      return customers.data.data;
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
