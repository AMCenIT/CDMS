<script>
import { onMounted, ref, defineProps, getCurrentInstance, watch } from "vue";
import {
  getALLOneShopRequestDataOneShop,
  getCustomerDataAllaios,
  getAllCustomerDataOneShop,
  postCustomerData,
  getAllType,
  getIndutries,
  validateCompany,
  validateEmails,
  validateCustomerID,
  validateDates,
  getAllCustomerData,
  postCustomerDataaiosApi,
  systemsFilter,
  pjoisTotalFilters,
  validateId,
  validateTsrNo,
} from "src/provider.js";
import { useQuasar, QSpinnerGears } from "quasar";
import { oneshop } from "src/boot/axios";
import { computed } from "@vue/reactivity";
import { physmet } from "src/boot/axios";
import axios from "axios";
import moment from "moment";

// customer Data
export default {
  props: ["customerCount"],
  setup(props) {
    const idExist = ref([]);
    const existingIds = ref([]);
    const completedOrders = ref([]);
    const app = getCurrentInstance().appContext.config.globalProperties;
    const returningCustomers = ref([]);
    const newCustomers = ref([]);
    const osCustomer = ref([]);
    const oldCustomers = ref([]);
    const allTsr = ref([]);
    // console.log("props", props);
    const physmetCustomerTotal = ref(0);
    const physmetCustomer = ref({});
    const oneShopCustomerTotal = ref(0);
    const counts = ref({});
    const qs = require("qs");
    const $q = useQuasar();
    const count = ref(1);
    const aiosUser = ref([]);
    const oneShopCustomer = ref([]);
    const displayName = ref("");
    const company_name = ref("");
    const email = ref("");
    const contactNo = ref("");
    const address = ref("");
    const region = ref("");
    const province = ref("");
    const municipality = ref("");

    const ulimsCustomer = ref([]);

    const account_type = ref("");
    const typelabel = ref("");
    const typeid = ref("");
    const type_options = ref([]);
    const types = ref([]);

    const sector_options = ref([]);
    const industries = ref([]);
    const sectorlabel = ref("");
    const sectorid = ref("");
    // oneshopdata
    const osindustry = ref("");
    const ostype = ref("");

    const existCompany = ref([]);
    const customerExist = ref([]);
    const duplicatedCustomer = ref(null);

    const existEmail = ref([]);

    const systems = ref([]);

    const p_accountType = ref("");
    const p_sector = ref("");
    const p_companyName = ref("");
    const p_displayName = ref("");
    const p_contactNo = ref("");
    const p_email = ref("");
    const p_address = ref("");
    const p_region = ref("");
    const p_province = ref("");
    const p_municipality = ref("");

    const physmetTotal = ref(0);

    const existingTsrNo = ref([]);
    const existingId = ref([]);

    const resultaios = ref([]);
    const resultos = ref([]);

    const oscustomerid = ref([]);
    const aioscustomerid = ref([]);
    const hasRecordsFrom2019 = ref([]);
    const customerIds = ref([]);
    const hasRecord = ref(null);
    const hasRec = ref(null);

    const sss = ref([]);

    async function getTypes() {
      types.value = await getAllType();
      // console.log("types.value", types.value);
      sss.value = types.value.map(function (type) {
        let attrObj = type.attributes;
        type_options.value.push({
          id: type.id,
          label: attrObj.label,
        });
        // return type_options.value;
      });
    }

    async function getSectors() {
      industries.value = await getIndutries();
      // console.log("industries.value", industries.value);
      industries.value.map(function (sector) {
        let attrObj = sector.attributes;
        sector_options.value.push({
          id: sector.id,
          label: attrObj.label,
        });
        // return sector_options.value;
      });
    }
    async function getAiosUser(startRow, count) {
      const query = qs.stringify(
        {
          $skip: startRow,
          $limit: count,
        },

        {
          encodeValuesOnly: true,
        }
      );

      aiosUser.value = await getCustomerDataAllaios(query);
      // console.log("AIOS CUSTOMER RESPONSE", aiosUser.value);
      return aiosUser.value;
    }

    async function getAllCustomerOneShop() {
      oneShopCustomer.value = await getAllCustomerDataOneShop();
      // console.log("oneShopCustomer.value", oneShopCustomer.value);
      oneShopCustomerTotal.value = oneShopCustomer.value.data
        .map(function (val, idx, arr) {
          for (var i = 0; i < idx; i++) {
            if (arr[i].company === val.company) {
              val.isTrue = true;
              return val;
            }
          }
          val.isTrue = false;
          return val;
        })
        .filter((d) => d.isTrue === false).length;

      // console.log("oneShopCustomerTotal.value", oneShopCustomerTotal.value);

      // oneShopCustomerTotal.value.data
      //   .map((d) => d.isTrue)
      //   .filter((d) => d === false);

      // console.log("oneShopCustomer.value", oneShopCustomer.value);
    }

    async function getDataPhysmet() {
      axios
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
          physmetCustomer.value = response;
          physmetCustomerTotal.value = response.data.meta.pagination.total;
          // console.log('erick response data', physmetCustomer.value.data)
        });
    }

    async function getAllCustomerULIMS() {
      const config = {
        method: "get",
        url: "",
        headers: {
          "Content-Type": "application/json",
        },
      };
      config.url = `http://10.10.120.5/ulims/lab/customer/test?&$limit=1000`;
      // console.log("config.url", config.url);

      ulimsCustomer.value = await app.$axios(config);
      // console.log("ulimsCustomer.value.data", ulimsCustomer.value.data);
      // return axios
      //   .request({
      //     method: "get",
      //     baseURL: "http://10.10.120.5/ulims/lab/customer/test?$limit=1000",
      //   })
      //   .then(function (customers) {
      //     console.log("customer.data", customers.data);
      //     return customers.data;
      //   });
    }
    async function getCustomer() {
      customerExist.value = await getAllCustomerData();
      customerIds.value = customerExist.value.data.data.map((o) => ({
        id: o.attributes.customer_id,
      }));
      // console.log("customer", customerIds.value);
      // console.log("customerExist.value", customerExist.value);
      // console.log("customerExist.value.data", customerExist.value.data);
      return customerExist.value.data;
    }

    // async function getCustomersWithOrdresThisYear() {
    //   const thisYear = moment().year();
    //   const query = {
    //     _dateCOMPLETED: {
    //       $gte: moment([thisYear, 0, 1]).format(),
    //     },
    //   };
    //   const responseOrder = await getALLOneShopRequestDataOneShop(
    //     qs.stringify(query)
    //   );
    //   // console.log("responseOrder", responseOrder);
    //   osCustomer.value = responseOrder.data.map((req) => req.customer._id);
    //   // console.log("osCustomer.value", osCustomer.value);
    //   return osCustomer.value;
    // }

    // async function getAllCustomerOrderAllYear() {
    //   const query = {
    //     _dateCOMPLETED: {
    //       $regex: "2023|2022|2021|2020",
    //     },
    //     $limit: 5000,
    //   };
    //   const responseOrder = await getALLOneShopRequestDataOneShop(
    //     qs.stringify(query)
    //   );
    //   // console.log("responseOrder", responseOrder);
    //   allTsr.value = responseOrder.data.map((req) => req.customer._id);
    //   // console.log("allTsr", allTsr.value);
    //   return allTsr.value;
    // }

    // async function getReturningCustomer() {
    //   const customerIds = allTsr.value;
    //   const processedIds = [];

    //   // Use a Map to keep track of the latest order for each customer id
    //   const namesOfCustomer = [];
    //   const intExt = [];
    //   const latestOrdersByCustomerId = new Map();
    //   for (const customerId of customerIds) {
    //     if (processedIds.includes(customerId)) {
    //       continue;
    //     }

    //     const query = {
    //       "customer._id": customerId,
    //       $sort: { _dateCOMPLETED: -1, date: -1 },
    //       _dateCOMPLETED: {
    //         $regex: "2023|2022|2021|2020",
    //       },
    //       $limit: 2,
    //     };
    //     const responseOrder = await getALLOneShopRequestDataOneShop(
    //       qs.stringify(query)
    //     );
    //     // console.log("responseOrder", responseOrder.data[0]);

    //     const lastOrder = responseOrder.data[0];
    //     const beforeLastOrder = responseOrder.data[1];

    //     if (lastOrder) {
    //       const lastOrderDate = moment(
    //         lastOrder._dateCOMPLETED || lastOrder.date
    //       );
    //       namesOfCustomer.push(lastOrder ? lastOrder.customer.company : null);
    //       intExt.push(lastOrder ? lastOrder.customer.intExt : null);

    //       if (!latestOrdersByCustomerId.has(customerId)) {
    //         latestOrdersByCustomerId.set(customerId, lastOrderDate);
    //       } else {
    //         const prevLatestOrderDate =
    //           latestOrdersByCustomerId.get(customerId);
    //         if (lastOrderDate.isAfter(prevLatestOrderDate)) {
    //           latestOrdersByCustomerId.set(customerId, lastOrderDate);
    //         }
    //       }

    //       processedIds.push(customerId);
    //     }
    //   }

    //   // Convert the Map to an array of customer objects with the latest order date
    //   const customers = Array.from(latestOrdersByCustomerId.entries()).map(
    //     ([customerId, lastOrderDate], index) => {
    //       const company = namesOfCustomer[index];
    //       const types = intExt[index];
    //       const latestOrderDate = latestOrdersByCustomerId.get(customerId);
    //       return {
    //         id: customerId,
    //         name: company,
    //         date: latestOrderDate,
    //         types: types,
    //       };
    //     }
    //   );
    //   // console.log("customers", customers);

    //   const dateNow = new Date();
    //   const now = moment(dateNow);
    //   const oneYearAgo = moment().subtract(1, "year");

    //   // Filter the customers to get returning customers and new customers
    //   returningCustomers.value = customers.filter((customer) => {
    //     const daysSinceLastOrder = now.diff(customer.date, "days");
    //     return daysSinceLastOrder > 365 && daysSinceLastOrder < 730;
    //   });
    //   newCustomers.value = customers.filter((customer) => {
    //     const daysSinceLastOrder = now.diff(customer.date, "days");
    //     return daysSinceLastOrder < 365;
    //   });

    //   oldCustomers.value = customers.filter((customer) => {
    //     const daysSinceLastOrder = now.diff(customer.date, "days");
    //     return daysSinceLastOrder < 1095;
    //   });

    //   // console.log("returningCustomers", returningCustomers.value);
    //   // console.log("newCustomers", newCustomers.value);
    //   // console.log("oldCustomers", oldCustomers.value);

    //   return { newCustomers, returningCustomers, oldCustomers };
    // }

    async function filterPhysmetTotal() {
      physmetTotal.value = await pjoisTotalFilters();
      console.log("physmetTotal.value", physmetTotal.value.length);
      // return physmetTotal.value
    }

    // async function getOneShopCompletedOrders() {
    //   const currentYear = new Date().getFullYear();
    //   const yearAgo = currentYear - 1;
    //   const twoYearsAgo = currentYear - 2;
    //   const threeYearsAgo = currentYear - 3;
    //   // const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    //   // const endOfYear = new Date(new Date().getFullYear() + 1, 0, 0);
    //   const query = {
    //     "statuss.action": "Completed",
    //     // "customer.intExt": "External",
    //     _dateCOMPLETED: {
    //       $regex: `${currentYear}|${yearAgo}|${twoYearsAgo}|${threeYearsAgo}|2019`,
    //     },
    //     $sort: {
    //       _dateCOMPLETED: 1,
    //     },
    //     $limit: 5000,
    //   };
    //   // console.log("query", query);
    //   const orderData = await getALLOneShopRequestDataOneShop(
    //     qs.stringify(query)
    //   );
    //   console.log("query", query);
    //   // console.log("completedOrders.value", completedOrders.value.data);
    //   completedOrders.value = orderData.data.map((order) => {
    //     return {
    //       customerId: order.customer._id,
    //       dateCompleted: moment(order._dateCOMPLETED).format("LL"),
    //       dateLastUpdated: order.dateLastUpdated,
    //       tsrNo: order.tsrNo ? order.tsrNo : order._tsrNo ? order._tsrNo : null,
    //     };
    //   });
    //   // console.log("completedOrders.value", completedOrders.value);

    //   const hasDuplicate =
    //     orderData.data.filter((order, index, array) => {
    //       return array.some((o, i) => {
    //         return i !== index && o.tsrNo === order.tsrNo;
    //       });
    //     }).length > 0;

    //   if (hasDuplicate) {
    //     console.log("There are duplicate tsrNo values in the orderData array.");
    //   } else {
    //     console.log(
    //       "There are no duplicate tsrNo values in the orderData array."
    //     );
    //   }

    //   // console.log("completedOrders.value", completedOrders.value);
    //   return completedOrders.value;
    // }

    async function syncDataBase() {
      // const currentYear = await getAllRecords();
      if (oneShopCustomer.value === 0 && aiosUser.value === 0) {
        $q.loading.hide();
        $q.notify({
          color: "red",
          textColor: "white",
          icon: "cloud_done",
          message: "No Data",
        });
      } else {
        $q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: "primary",
          messageColor: "blue",
          message: "PLEASE WAIT...",
        });
        // console.log("oneShopCustomer.value", oneShopCustomer.value);

        await Promise.all(
          aiosUser.value.data.map(async (aiosCustomer) => {
            account_type.value = aiosCustomer.account_type;
            osindustry.value = Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0]
              : aiosCustomer.sector;
            company_name.value = aiosCustomer.company_name;
            displayName.value =
              aiosCustomer.first_name + " " + aiosCustomer.last_name;
            contactNo.value = aiosCustomer.mobile;
            email.value = aiosCustomer.email;
            address.value =
              aiosCustomer.house_bldg_st +
              " " +
              aiosCustomer.brgy_district +
              " " +
              aiosCustomer.city_municipality +
              " " +
              aiosCustomer.state_province;
            region.value = aiosCustomer.region;
            province.value = aiosCustomer.state_province;
            municipality.value = aiosCustomer.city_municipality;
            aioscustomerid.value = aiosCustomer._id;
            // console.log("aiosCustomer.customer_id", aiosCustomer._id);

            const query = qs.stringify(
              {
                $eq: aioscustomerid.value,
              },
              {
                encodeValuesOnly: true,
              }
            );
            const response = await validateCustomerID(query);
            // console.log("response", response);
            await Promise.all(
              response.map(async (element) => {
                // console.log("test", element);
                let attrObj = element.attributes;
                existEmail.value = attrObj.customer_id;
                // console.log(
                //   "element.attributes",
                //   element.attributes.customer_id
                // );
              })
            );

            let intExt = null;
            if (aiosCustomer.account_type === "External") {
              intExt = 1;
            } else if (aiosCustomer.account_type === "Internal") {
              intExt = 2;
            } else {
              intExt = 3;
            }

            let sector = null;
            if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "A. Agriculture, forestry and fishing"
                : aiosCustomer.sector === "A. Agriculture, forestry and fishing"
            ) {
              sector = 22;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "B. Mining and Quarrying"
                : aiosCustomer.sector === "B. Mining and Quarrying"
            ) {
              sector = 23;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
                : aiosCustomer.sector ===
                  "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
            ) {
              sector = 24;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C1. (Mftg) Food Products and Beverages"
                : aiosCustomer.sector ===
                  "C1. (Mftg) Food Products and Beverages"
            ) {
              sector = 25;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
                : aiosCustomer.sector ===
                  "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
            ) {
              sector = 26;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
                : aiosCustomer.sector ===
                  "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
            ) {
              sector = 27;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C2. (Mftg) Nonmetallic Mineral Products"
                : aiosCustomer.sector ===
                  "C2. (Mftg) Nonmetallic Mineral Products"
            ) {
              sector = 28;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
                : aiosCustomer.sector ===
                  "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
            ) {
              sector = 29;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C4. (Mftg) Basic Precious / Nonferrous Metals"
                : aiosCustomer.sector ===
                  "C4. (Mftg) Basic Precious / Nonferrous Metals"
            ) {
              sector = 30;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
                : aiosCustomer.sector ===
                  "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
            ) {
              sector = 31;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C6a. (Mftg - Fabricated Metal Products) Forging"
                : aiosCustomer.sector ===
                  "C6a. (Mftg - Fabricated Metal Products) Forging"
            ) {
              sector = 32;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C6b. (Mftg - Fabricated Metal Products) Machining"
                : aiosCustomer.sector ===
                  "C6b. (Mftg - Fabricated Metal Products) Machining"
            ) {
              sector = 33;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
                : aiosCustomer.sector ===
                  "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
            ) {
              sector = 34;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "C7. (Mftg) Metal Working"
                : aiosCustomer.sector === "C7. (Mftg) Metal Working"
            ) {
              sector = 35;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C8. (Mftg) Electronics (Computer, electronic and optical products)"
                : aiosCustomer.sector ===
                  "C8. (Mftg) Electronics (Computer, electronic and optical products)"
            ) {
              sector = 36;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
                : aiosCustomer.sector ===
                  "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
            ) {
              sector = 37;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "D. Electricity, gas, steam and air-conditioning supply"
                : aiosCustomer.sector ===
                  "D. Electricity, gas, steam and air-conditioning supply"
            ) {
              sector = 38;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "E. Water supply, sewerage, waste management and remediation activities"
                : aiosCustomer.sector ===
                  "E. Water supply, sewerage, waste management and remediation activities"
            ) {
              sector = 39;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "F. Construction"
                : aiosCustomer.sector === "F. Construction"
            ) {
              sector = 40;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
                : aiosCustomer.sector ===
                  "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
            ) {
              sector = 41;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "H. Transportation and Storage"
                : aiosCustomer.sector === "H. Transportation and Storage"
            ) {
              sector = 42;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "I. Accommodation and food service activities"
                : aiosCustomer.sector ===
                  "I. Accommodation and food service activities"
            ) {
              sector = 43;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "J. Information and Communication"
                : aiosCustomer.sector === "J. Information and Communication"
            ) {
              sector = 44;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "K. Financial and insurance activities"
                : aiosCustomer.sector ===
                  "K. Financial and insurance activities"
            ) {
              sector = 45;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "L. Real estate activities"
                : aiosCustomer.sector === "L. Real estate activities"
            ) {
              sector = 46;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "M. Professional, scientific and technical services"
                : aiosCustomer.sector ===
                  "M. Professional, scientific and technical services"
            ) {
              sector = 47;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "N. Administrative and support service activities / Government"
                : aiosCustomer.sector ===
                  "N. Administrative and support service activities / Government"
            ) {
              sector = 48;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "O. Public administrative and defense; compulsory social security"
                : aiosCustomer.sector ===
                  "O. Public administrative and defense; compulsory social security"
            ) {
              sector = 49;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "P. Education"
                : aiosCustomer.sector === "P. Education"
            ) {
              sector = 50;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "Q. Human health and social work activities"
                : aiosCustomer.sector ===
                  "Q. Human health and social work activities"
            ) {
              sector = 51;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "R. Arts, entertainment and recreation"
                : aiosCustomer.sector ===
                  "R. Arts, entertainment and recreation"
            ) {
              sector = 52;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] === "S. Other service activities"
                : aiosCustomer.sector === "S. Other service activities"
            ) {
              sector = 53;
            } else if (
              Array.isArray(aiosCustomer.sector)
                ? aiosCustomer.sector[0] ===
                  "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
                : aiosCustomer.sector ===
                  "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
            ) {
              sector = 54;
            } else {
              sector = 55;
            }

            const aiosData = ref({
              data: {
                displayName: "",
                contactPerson: "",
                email: "",
                contactNo: "",
                region: "",
                province: "",
                municipality: "",
                address: "",
                system: "AIOS",
                types: [intExt],
                industries: [sector],
                customer_id: "",
                oldNew: "New",
                // dateCreated: [],
                isSynced: null,
              },
            });

            // console.log("test", aiosCustomer.system_user_type);
            if (existEmail.value != aiosCustomer._id) {
              aiosData.value.data.displayName = aiosCustomer.company_name;
              aiosData.value.data.contactPerson =
                aiosCustomer.first_name + " " + aiosCustomer.last_name;
              aiosData.value.data.email = aiosCustomer.email;
              aiosData.value.data.contactNo = aiosCustomer.mobile;
              aiosData.value.data.region = aiosCustomer.region;
              aiosData.value.data.province = aiosCustomer.state_province;
              aiosData.value.data.municipality = aiosCustomer.city_municipality;
              aiosData.value.data.address =
                aiosCustomer.house_bldg_st +
                " " +
                aiosCustomer.brgy_district +
                " " +
                aiosCustomer.city_municipality +
                " " +
                aiosCustomer.state_province;
              aiosData.value.data.customer_id = aiosCustomer._id;
              // aiosData.value.data.dateCreated = aiosCustomer.created_at;
              // aiosData.value.data.oldNew = ;
              // console.log("aios success", aiosData.value);
              // console.log("existEmail.value", existEmail.value);
              await postCustomerData(aiosData.value);
              $q.notify({
                color: "green-4",
                textColor: "white",
                icon: "cloud_done",
                message: "You have successfully inserted the customer data",
              });
              // $q.loading.hide();
              // aiosCustomer.isSynced = true;
              // return aiosCustomer;
              // }
              // console.log("aiosUser.value", aiosUser.value);
              // console.log("aiosData.value.data.types", aiosData.value.data.types)
              // else {
              //   console.log("error");
              //   $q.notify({
              //     color: "red-4",
              //     textColor: "white",
              //     icon: "cloud_done",
              //     message: "Error insert for AIOS",
              //   });
              //   $q.loading.hide();
            }
            // aiosCustomer.isSynced = false;
            // return aiosCustomer;
          })
        );
        // try {
        await Promise.all(
          oneShopCustomer.value.data.map(async (oscustomer, index) => {
            // console.log("hasRe", test);
            account_type.value = oscustomer.intExt;
            osindustry.value = Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector;
            company_name.value = oscustomer.company;
            displayName.value = oscustomer.contact;
            contactNo.value = oscustomer.telno;
            email.value = oscustomer.email;
            address.value =
              oscustomer.street +
              " " +
              oscustomer.brgy +
              " " +
              oscustomer.citymun +
              " " +
              oscustomer.province;
            region.value = oscustomer.region;
            province.value = oscustomer.province;
            municipality.value = oscustomer.citymun;
            oscustomerid.value = oscustomer._id;

            const query = qs.stringify(
              {
                $eq: oscustomerid.value,
              },
              {
                encodeValuesOnly: true,
              }
            );
            const response = await validateCustomerID(query);
            // console.log("response", response);
            await Promise.all(
              response.map(async (element) => {
                // console.log("test", element);
                let attrObj = element.attributes;
                existCompany.value = attrObj.customer_id;
                // console.log("attrObj", attrObj.displayName);
              })
            );

            // console.log("customerid.value", customerid.value);

            let intExt = null;
            if (oscustomer.intExt === "External") {
              intExt = 1;
            } else if (oscustomer.intExt === "Internal") {
              intExt = 2;
            } else {
              intExt = 3;
            }

            let sector = null;
            if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "A. Agriculture, forestry and fishing"
                    : oscustomer.sector[0] ===
                      "A. Agriculture, forestry and fishing"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "A. Agriculture, forestry and fishing"
                  : oscustomer.sector === "A. Agriculture, forestry and fishing"
                : false
            ) {
              sector = 22;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label === "B. Mining and Quarrying"
                    : oscustomer.sector[0] === "B. Mining and Quarrying"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label === "B. Mining and Quarrying"
                  : oscustomer.sector === "B. Mining and Quarrying"
                : false
            ) {
              sector = 23;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
                    : oscustomer.sector[0] ===
                      "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
                  : oscustomer.sector ===
                    "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
                : false
            ) {
              sector = 24;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C1. (Mftg) Food Products and Beverages"
                    : oscustomer.sector[0] ===
                      "C1. (Mftg) Food Products and Beverages"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C1. (Mftg) Food Products and Beverages"
                  : oscustomer.sector ===
                    "C1. (Mftg) Food Products and Beverages"
                : false
            ) {
              sector = 25;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
                    : oscustomer.sector[0] ===
                      "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery))"
                  : oscustomer.sector ===
                    "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
                : false
            ) {
              sector = 26;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
                    : oscustomer.sector[0] ===
                      "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
                  : oscustomer.sector ===
                    "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
                : false
            ) {
              sector = 27;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C2. (Mftg) Nonmetallic Mineral Products"
                    : oscustomer.sector[0] ===
                      "C2. (Mftg) Nonmetallic Mineral Products"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C2. (Mftg) Nonmetallic Mineral Products"
                  : oscustomer.sector ===
                    "C2. (Mftg) Nonmetallic Mineral Products"
                : false
            ) {
              sector = 28;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
                    : oscustomer.sector[0] ===
                      "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
                  : oscustomer.sector ===
                    "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
                : false
            ) {
              sector = 29;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C4. (Mftg) Basic Precious / Nonferrous Metals"
                    : oscustomer.sector[0] ===
                      "C4. (Mftg) Basic Precious / Nonferrous Metals"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C4. (Mftg) Basic Precious / Nonferrous Metals"
                  : oscustomer.sector ===
                    "C4. (Mftg) Basic Precious / Nonferrous Metals"
                : false
            ) {
              sector = 30;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
                    : oscustomer.sector[0] ===
                      "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
                  : oscustomer.sector ===
                    "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
                : false
            ) {
              sector = 31;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C6a. (Mftg - Fabricated Metal Products) Forging"
                    : oscustomer.sector[0] ===
                      "C6a. (Mftg - Fabricated Metal Products) Forging"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C6a. (Mftg - Fabricated Metal Products) Forging"
                  : oscustomer.sector ===
                    "C6a. (Mftg - Fabricated Metal Products) Forging"
                : false
            ) {
              sector = 32;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C6b. (Mftg - Fabricated Metal Products) Machining"
                    : oscustomer.sector[0] ===
                      "C6b. (Mftg - Fabricated Metal Products) Machining"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C6b. (Mftg - Fabricated Metal Products) Machining"
                  : oscustomer.sector ===
                    "C6b. (Mftg - Fabricated Metal Products) Machining"
                : false
            ) {
              sector = 33;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
                    : oscustomer.sector[0] ===
                      "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
                  : oscustomer.sector ===
                    "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
                : false
            ) {
              sector = 34;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label === "C7. (Mftg) Metal Working"
                    : oscustomer.sector[0] === "C7. (Mftg) Metal Working"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label === "C7. (Mftg) Metal Working"
                  : oscustomer.sector === "C7. (Mftg) Metal Working"
                : false
            ) {
              sector = 35;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C8. (Mftg) Electronics (Computer, electronic and optical products)"
                    : oscustomer.sector[0] ===
                      "C8. (Mftg) Electronics (Computer, electronic and optical products)"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C8. (Mftg) Electronics (Computer, electronic and optical products)"
                  : oscustomer.sector ===
                    "C8. (Mftg) Electronics (Computer, electronic and optical products)"
                : false
            ) {
              sector = 36;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
                    : oscustomer.sector[0] ===
                      "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
                  : oscustomer.sector ===
                    "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
                : false
            ) {
              sector = 37;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "D. Electricity, gas, steam and air-conditioning supply"
                    : oscustomer.sector[0] ===
                      "D. Electricity, gas, steam and air-conditioning supply"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "D. Electricity, gas, steam and air-conditioning supply"
                  : oscustomer.sector ===
                    "D. Electricity, gas, steam and air-conditioning supply"
                : false
            ) {
              sector = 38;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "E. Water supply, sewerage, waste management and remediation activities"
                    : oscustomer.sector[0] ===
                      "E. Water supply, sewerage, waste management and remediation activities"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "E. Water supply, sewerage, waste management and remediation activities"
                  : oscustomer.sector ===
                    "E. Water supply, sewerage, waste management and remediation activities"
                : false
            ) {
              sector = 39;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label === "F. Construction"
                    : oscustomer.sector[0] === "F. Construction"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label === "F. Construction"
                  : oscustomer.sector === "F. Construction"
                : false
            ) {
              sector = 40;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
                    : oscustomer.sector[0] ===
                      "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
                  : oscustomer.sector ===
                    "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
                : false
            ) {
              sector = 41;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "H. Transportation and Storage"
                    : oscustomer.sector[0] === "H. Transportation and Storage"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label === "H. Transportation and Storage"
                  : oscustomer.sector === "H. Transportation and Storage"
                : false
            ) {
              sector = 42;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "I. Accommodation and food service activities"
                    : oscustomer.sector[0] ===
                      "I. Accommodation and food service activities"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "I. Accommodation and food service activities"
                  : oscustomer.sector ===
                    "I. Accommodation and food service activities"
                : false
            ) {
              sector = 43;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "J. Information and Communication"
                    : oscustomer.sector[0] ===
                      "J. Information and Communication"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "J. Information and Communication"
                  : oscustomer.sector === "J. Information and Communication"
                : false
            ) {
              sector = 44;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "K. Financial and insurance activities"
                    : oscustomer.sector[0] ===
                      "K. Financial and insurance activities"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "K. Financial and insurance activities"
                  : oscustomer.sector ===
                    "K. Financial and insurance activities"
                : false
            ) {
              sector = 45;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label === "L. Real estate activities"
                    : oscustomer.sector[0] === "L. Real estate activities"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label === "L. Real estate activities"
                  : oscustomer.sector === "L. Real estate activities"
                : false
            ) {
              sector = 46;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "M. Professional, scientific and technical services"
                    : oscustomer.sector[0] ===
                      "M. Professional, scientific and technical services"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "M. Professional, scientific and technical services"
                  : oscustomer.sector ===
                    "M. Professional, scientific and technical services"
                : false
            ) {
              sector = 47;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "N. Administrative and support service activities / Government"
                    : oscustomer.sector[0] ===
                      "N. Administrative and support service activities / Government"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "N. Administrative and support service activities / Government"
                  : oscustomer.sector ===
                    "N. Administrative and support service activities / Government"
                : false
            ) {
              sector = 48;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "O. Public administrative and defense; compulsory social security"
                    : oscustomer.sector[0] ===
                      "O. Public administrative and defense; compulsory social security"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "O. Public administrative and defense; compulsory social security"
                  : oscustomer.sector ===
                    "O. Public administrative and defense; compulsory social security"
                : false
            ) {
              sector = 49;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label === "P. Education"
                    : oscustomer.sector[0] === "P. Education"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label === "P. Education"
                  : oscustomer.sector === "P. Education"
                : false
            ) {
              sector = 50;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "Q. Human health and social work activities"
                    : oscustomer.sector[0] ===
                      "Q. Human health and social work activities"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "Q. Human health and social work activities"
                  : oscustomer.sector ===
                    "Q. Human health and social work activities"
                : false
            ) {
              sector = 51;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "R. Arts, entertainment and recreation"
                    : oscustomer.sector[0] ===
                      "R. Arts, entertainment and recreation"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "R. Arts, entertainment and recreation"
                  : oscustomer.sector ===
                    "R. Arts, entertainment and recreation"
                : false
            ) {
              sector = 52;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "S. Other service activities"
                    : oscustomer.sector[0] === "S. Other service activities"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label === "S. Other service activities"
                  : oscustomer.sector === "S. Other service activities"
                : false
            ) {
              sector = 53;
            } else if (
              oscustomer.sector
                ? Array.isArray(oscustomer.sector)
                  ? typeof oscustomer.sector[0] === "object"
                    ? oscustomer.sector[0].label ===
                      "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
                    : oscustomer.sector[0] ===
                      "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
                  : typeof oscustomer.sector === "object"
                  ? oscustomer.sector.label ===
                    "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
                  : oscustomer.sector ===
                    "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
                : false
            ) {
              sector = 54;
            } else {
              sector = 55;
            }
            // const currentYearTSR = completedOrders.value.find(
            //   (c) => c.customerId === oscustomer._id
            // );
            // console.log("currentYear", currentYearTSR);
            // const hasRecord = hasRec.value[index]?.hasRecord;
            // console.log("has", hasRecord);
            const hasRecord = hasRecordsFrom2019.value.find(
              (record) => record.id === oscustomer._id
            );
            // console.log("has", hasRecord);
            // const newc = newCustomers.value.find(
            //   (n) => n.id === oscustomer._id
            // );
            // const returning = returningCustomers.value.find(
            //   (r) => r.id === oscustomer._id
            // );
            // const old = oldCustomers.value.find((o) => o.id === oscustomer._id);
            // console.log("old", old);

            // const mappedCurrent = currentYear.map((item) => {
            //   if (item.data) {
            //     const d = item.data.map((i) => {
            //       return i.id;
            //     });
            //     const c = item.data.map((i) => {
            //       return i.attributes.customer_id;
            //     });
            //     const x = item.data.map((i) => {
            //       return i.attributes.dateCompleted;
            //     });
            //     return {
            //       id: [...d],
            //       customer_id: [...c],
            //       dateCompleted: [...x],
            //     };
            //   } else {
            //     return {
            //       id: item.id,
            //       customer_id: item.attributes.customer_id,
            //       dateCompleted: item.attributes.dateCompleted,
            //     };
            //   }
            // });

            // console.log("mappedData", mappedCurrent);
            // mappedCurrent.map((m) => {
            //   if (m.data) {
            //     const data = m.data.map((d) => {
            //       d.id;
            //     });
            //     console.log("Data", data);
            //   } else {
            //     console.log("m.id", m.id);
            //   }
            // });

            // currentYear.forEach((c) => {
            //   if (c.data) {
            //     c.data.map((r) => {
            //       console.log("r", r.attributes.customer_id);
            //     });
            //   }
            // });

            // const commonIds = currentIds.filter((id) => dataIds.includes(id));

            // console.log("commonIds", commonIds);

            const oneShopData = ref({
              data: {
                displayName: "",
                contactPerson: "",
                email: "",
                contactNo: "",
                region: "",
                province: "",
                municipality: "",
                address: "",
                system: "OneShop",
                types: [intExt],
                industries: [sector],
                customer_id: "",
                oldNew: "",
                dateCreated: [],
                isSynced: null,
                hasRecordFrom2019: hasRecord ? true : false,
                // new: newc ? true : false,
                // returning: returning ? true : false,
                // old: old ? true : false,
                // current_year_tsrs: [],
              },
            });

            // if (hasRecord === oscustomer._id) {
            //   oneShopData.value.data.hasRecordsFrom2019 = true;
            // }
            // console.log(
            //   "oneShopData.value",
            //   oneShopData.value.data.current_year_tsrs
            // );
            // mappedCurrent.forEach((item) => {
            //   if (
            //     Array.isArray(item.customer_id) &&
            //     item.customer_id.includes(oscustomer._id)
            //   ) {
            //     oneShopData.value.data.current_year_tsrs.push(...item.id);
            //   } else if (item.customer_id === oscustomer._id) {
            //     oneShopData.value.data.current_year_tsrs.push(item.id);
            //   }
            // });

            if (existCompany.value != oscustomer._id) {
              oneShopData.value.data.displayName = oscustomer.company;
              oneShopData.value.data.contactPerson = oscustomer.contact;
              oneShopData.value.data.email = oscustomer.email;
              oneShopData.value.data.contactNo = oscustomer.telno;
              oneShopData.value.data.region = oscustomer.region;
              oneShopData.value.data.province = oscustomer.province;
              oneShopData.value.data.municipality = oscustomer.citymun;
              oneShopData.value.data.address =
                oscustomer.street +
                " " +
                oscustomer.brgy +
                " " +
                oscustomer.citymun +
                " " +
                oscustomer.province;
              oneShopData.value.data.customer_id = oscustomer._id;
              oneShopData.value.data.oldNew = oscustomer.oldNew;
              oneShopData.value.data.dateCreated = oscustomer
                ? oscustomer.created_at
                : oscustomer.dateCreated;
              oneShopData.value.data.isSynced = oscustomer.isSynced;

              // currentYear.forEach((item) => {
              //   if (item.data) {
              //     item.data.forEach((i) => {
              //       if (i.attributes.customer_id === oscustomer._id) {
              //         oneShopData.value.data.current_year_tsrs.push(i.id);
              //       }
              //     });
              //   } else if (item.attributes.customer_id === oscustomer._id) {
              //     oneShopData.value.data.current_year_tsrs.push(item.id);
              //   }
              // });

              // if (hasRecordsFrom2019.value === oscustomer._id) {
              //   oneShopData.value.data.hasRecordsFrom2019 = true;
              // }
              // oneShopData.value.data.hasRecordsFrom2019 =
              //   oscustomer.hasRecordsFrom2019;
              // oneShopData.value.data.types.intExt = Array.isArray(oscustomer.intExt) ? oscustomer.intExt[0] : oscustomer.intExt;
              // data.value.data.types.id = typeid.value;
              // data.value.data.types.label = typelabel.value;
              // data.value.data.industries.id = sectorid.value;
              // console.log("data", existCompany.value);
              // console.log("created_at", oscustomer.created_at);
              // if (oscustomer.isSynced === 1 || oscustomer.isSynced === true) {
              //   oscustomer.
              // }

              await postCustomerData(oneShopData.value);
              $q.notify({
                color: "green-4",
                textColor: "white",
                icon: "cloud_done",
                message: "You have successfully inserted the customer data",
              });
              // $q.loading.hide();
            }
            // console.log(
            //   "oneShopData.value.data.hasRecordsFrom2019",
            //   oneShopData.value.data.hasRecordsFrom2019
            // );
            // console.log("created_at", oscustomer.created_at);
            // console.log("oneShopData.value", oscustomer)
            // else {
            //   $q.notify({
            //     color: "red-4",
            //     textColor: "white",
            //     icon: "cloud_done",
            //     message: "No new customer",
            //   });
            //   $q.loading.hide();
            // }
            // $q.loading.hide();
          })
        );

        await Promise.all(
          ulimsCustomer.value.data.map(async (ulimscustomer) => {
            account_type.value = ulimscustomer.type;
            osindustry.value = ulimscustomer.industry;
            company_name.value = ulimscustomer.displayName;
            contactNo.value = ulimscustomer.contactNo;
            email.value = ulimscustomer.email;
            address.value =
              ulimscustomer.address +
              ulimscustomer.municipality +
              ulimscustomer.province +
              ulimscustomer.region;
            region.value = ulimscustomer.region;
            province.value = ulimscustomer.province;
            municipality.value = ulimscustomer.municipality;
            // oscustomerid.value = ulimscustomer._id;
          })
        );
        //   resultos.value = osresponse.filter(
        //     (os) => os.status !== 400 && os.isSynced === true
        //   );
        // } catch (error) {
        //   // console.error(error);
        // }
        location.reload();
      }
    }

    // async function loadHasRecord() {
    //   try {
    //     const response = await axios.get(
    //       "http://10.10.120.32:3030/requests?statuss.action=Completed&_dateCOMPLETED[$regex]=2019&$limit=1000"
    //     );
    //     hasRecordsFrom2019.value = response.data.data.map((h) => ({
    //       id: h.customer._id,
    //     }));
    //     // console.log("hasRecordsFrom2019", hasRecordsFrom2019.value);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    // async function getAllRecords() {
    //   const token =
    //     "881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01";
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   };
    //   const pageSize = 10;
    //   const response = await axios.get(
    //     `http://10.10.120.19:1336/api/transactions?pagination[page]=1&pagination[pageSize]=${pageSize}`,
    //     config
    //   );
    //   const total = parseInt(response.data.meta.pagination.total);
    //   const totalPages = Math.ceil(total / pageSize);
    //   // console.log("totalPages", totalPages);
    //   let allRecords = response.data.data;
    //   const promises = [];
    //   for (let page = 2; page <= totalPages; page++) {
    //     promises.push(
    //       axios.get(
    //         `http://10.10.120.19:1336/api/transactions?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    //         config
    //       )
    //     );
    //   }
    //   const results = await Promise.all(promises);
    //   results.forEach((result) => {
    //     allRecords = allRecords.concat(result.data);
    //   });
    //   // console.log("allRecords", allRecords);
    //   return allRecords;
    // }

    async function getAllCustomer() {
      const token =
        "881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01";
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const pageSize = 10;
      const response = await axios.get(
        `http://10.10.120.19:1336/api/customers?pagination[page]=1&pagination[pageSize]=${pageSize}`,
        config
      );
      const total = parseInt(response.data.meta.pagination.total);
      const totalPages = Math.ceil(total / pageSize);
      // console.log("totalPages", totalPages);
      let allRecords = response.data.data;
      const promises = [];
      for (let page = 2; page <= totalPages; page++) {
        promises.push(
          axios.get(
            `http://10.10.120.19:1336/api/customers?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
            config
          )
        );
      }
      const results = await Promise.all(promises);
      results.forEach((result) => {
        allRecords = allRecords.concat(result.data);
      });
      // console.log("allRecords", allRecords);
      return allRecords;
    }

    // async function postCompletedOrdersToApi() {
    //   const token =
    //     "881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01";
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   };
    //   try {
    //     for (let order of completedOrders.value) {
    //       const tsrNo = order.tsrNo;
    //       const query = qs.stringify(
    //         {
    //           $eq: tsrNo,
    //         },
    //         {
    //           encodeValuesOnly: true,
    //         }
    //       );
    //       const response = await validateTsrNo(query);
    //       // console.log("response", response);
    //       response.map(async (element) => {
    //         let attrObj = element.attributes;
    //         existingTsrNo.value = attrObj.tsrNo;
    //       });
    //       // console.log("order", order);
    //       // console.log("existingTsrNo.value", existingTsrNo.value);

    //       if (existingTsrNo.value != order.tsrNo) {
    //         const payload = {
    //           data: {
    //             customerTSR: order,
    //             dateLastUpdated: order.dateLastUpdated,
    //             customer_id: order.customerId,
    //             dateCompleted: order.dateCompleted,
    //             tsrNo: order.tsrNo,
    //           },
    //         };
    //         // });

    //         console.log("Payload:", payload);
    //         const response = await axios.post(
    //           "http://10.10.120.19:1336/api/transactions",
    //           payload,
    //           config
    //         );
    //         // console.log("API response:", response.data);
    //       } else {
    //         // console.log("Skipping order:", order);
    //       }
    //     }
    //   } catch (error) {
    //     console.log("API error:", error.message);
    //   }
    // }

    // async function postCustomerRelation() {
    //   const relation = await getAllCustomer();
    //   const token =
    //     "881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01";
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   };
    //   const currentYear = await getAllRecords();
    //   try {
    //     const ids = [];
    //     const currentYears = [];
    //     const currentIds = [];

    //     const customerIds = relation
    //       .flatMap((item) =>
    //         item.data
    //           ? item.data.map((i) => ({
    //               customerId: i.attributes?.customer_id,
    //               id: i.id,
    //             }))
    //           : item.attributes?.customer_id && {
    //               customerId: item.attributes.customer_id,
    //               id: item.id,
    //             }
    //       )
    //       .filter(Boolean);

    //     const currentCustomerIds = currentYear
    //       .flatMap((item) =>
    //         item.data
    //           ? item.data.map((i) => ({
    //               customerId: i.attributes?.customer_id,
    //               id: i.id,
    //             }))
    //           : item.attributes?.customer_id && {
    //               customerId: item.attributes.customer_id,
    //               id: item.id,
    //             }
    //       )
    //       .filter(Boolean);

    //     const matchingIds = [];

    //     // Loop through the record IDs and send a PUT request for each ID with a common customer ID
    //     for (let i = 0; i < customerIds.length; i++) {
    //       const customerId = customerIds[i];
    //       const customer_Id = customerId.customerId;
    //       const id = customerId.id;
    //       const query = qs.stringify(
    //         {
    //           $eq: customer_Id,
    //         },
    //         {
    //           encodeValuesOnly: true,
    //         }
    //       );
    //       const response = await validateId(query);
    //       let idExist = [];

    //       response.forEach((element) => {
    //         existingId.value = element.attributes.customer_id;
    //         idExist.push(element.id);
    //       });

    //       if (existingId.value === customer_Id) {
    //         const payload = {
    //           data: {
    //             transactions: idExist.map((id) => ({
    //               id,
    //             })),
    //           },
    //         };
    //         // console.log("payload", payload.data.transactions);
    //         const response = await axios.put(
    //           `http://10.10.120.19:1336/api/updateCustomer/${id}`,
    //           payload
    //           // config
    //         );
    //         // console.log("response", response);
    //         // }
    //       } else {
    //         // console.log("Skipping order:");
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    // This implementation fetches the existing orders from the API at the beginning of the function, then uses the Array.includes method to check if each order object has a dateLastUpdated value that already exists in the array of existing orders. If a match is found, the function logs a message and skips that order. If there is no match, the function posts the order to the API as before, and adds its dateLastUpdated value to the existingOrders array.

    // watch([hasRecordsFrom2019, customerIds], () => {
    //   hasRec.value = customerIds.value.map((customer) => {
    //     const hasRecord = hasRecordsFrom2019.value.some(
    //       (record) => record.id === customer.id
    //     );
    //     return {
    //       hasRecord: hasRecord,
    //     };
    //   });
    //   // const haha = customerIds.value.map((customer) => ({
    //   //   id: customer.id,
    //   // }));
    //   // console.log("haha", haha);
    //   // console.log("hasRec.value", hasRec.value);
    // });

    // watch(osCustomer, (newVal, oldVal) => {
    //   if (newVal !== null) {
    //     getReturningCustomer();
    //   }
    // });

    // watch(allTsr, (newVal, oldVal) => {
    //   if (newVal !== null) {
    //     getReturningCustomer();
    //   }
    // });

    onMounted(async () => {
      // postCustomerRelation();
      // getCustomersWithOrdresThisYear();
      // getReturningCustomer();
      // const oneShopData = await getAllCustomerDataOneShop();
      // console.log("aaa", oneShopData);
      getAiosUser();
      getTypes();
      getSectors();
      getAllCustomerOneShop();
      getCustomer();
      filterPhysmetTotal();
      // syncDataBase();
      getDataPhysmet();
      // loadHasRecord();
      getAllCustomerULIMS();
      // getOneShopCompletedOrders();
      // getAllRecords();
      // getAllCustomerOrderAllYear();
      getAllCustomer();
    });
    return {
      // postCustomerRelation,
      getAllCustomer,
      completedOrders,
      // getCustomersWithOrdresThisYear,
      // getReturningCustomer,
      hasRec,
      hasRecordsFrom2019,
      customerIds,
      hasRecord,
      // loadHasRecord,
      sss,
      physmetCustomerTotal,
      typelabel,
      count,
      aiosUser,
      oneShopCustomer,
      displayName,
      company_name,
      email,
      contactNo,
      address,
      region,
      province,
      municipality,
      account_type,
      typeid,
      type_options,
      types,
      sector_options,
      industries,
      sectorlabel,
      sectorid,
      osindustry,
      ostype,
      existCompany,
      customerExist,
      getTypes,
      getAiosUser,
      getSectors,
      getAllCustomerOneShop,
      getCustomer,
      syncDataBase,
      getDataPhysmet,
      filterPhysmetTotal,
      getAllCustomerULIMS,
      systems,
      existEmail,
      duplicatedCustomer,
      counts,
      oneShopCustomerTotal,
      physmetCustomer,
      physmetTotal,
      resultaios,
      resultos,
      oscustomerid,
      aioscustomerid,
      ulimsCustomer,
      returningCustomers,
      newCustomers,
      osCustomer,
      oldCustomers,
      // getOneShopCompletedOrders,
      existingTsrNo,
      // getAllRecords,
      // getAllCustomerOrderAllYear,
      allTsr,
      existingIds,
      idExist,
    };
  },
};
</script>

<template>
  <div>
    <!-- <pre>{{ oneShopCustomer.data }}</pre> -->
    <!-- <div v-for="(d, index) in counts" :key="index">{{ index }} : {{ d }}</div> -->
    <!-- <pre>{{ duplicatedCustomer.filter((d) => d === true) }}</pre> -->
    <div v-if="(isSynced = true)">
      <!-- {{ oneShopCustomerTotal }} -->
      <!-- {{ customerCount }} {{ oneShopCustomerTotal }} New data
      {{ customerCount - oneShopCustomerTotal }} -->
      <!-- New Costumer(s) {{ oneShopCustomer }}  {{customerCount }} -->
      <q-btn
        label="Sync Data"
        @click="syncDataBase"
        icon="sync"
        color="primary"
        unelevated
      >
        <q-badge
          v-if="
            // physmetCustomerTotal +
            physmetTotal.length +
            oneShopCustomer.total +
            aiosUser.total -
            customerCount
          "
          color="red"
          floating
          >{{
            // physmetCustomerTotal +
            physmetTotal.length +
            oneShopCustomer.total +
            aiosUser.total -
            customerCount
          }}</q-badge
        >
      </q-btn>
    </div>
    <div v-if="(isSynced = false)"></div>
  </div>
</template>
