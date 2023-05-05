<script>
import {
  ref,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  computed,
  watchEffect,
  watch,
} from "vue";
// import AddCustomer from "src/components/addCustomer.vue";
// import CustomerData from "src/components/CustomerData.vue";
// import CustomerDuplicates from "src/components/CustomerData.vue";
// import AreaChart from "src/components/AreaChart.vue";
import CustomerDetails from "src/components/viewTopCustomer.vue";

import Doughnut from "src/components/Doughnut.vue";
import Bar from "src/components/Bar.vue";
import Line from "src/components/Line.vue";
import Pie from "src/components/Pie.vue";
import moment from "moment";
import axios from "axios";

import { useQuasar, LocalStorage, SessionStorage } from "quasar";
import {
  getAllCustomerData,
  systemsFilter,
  searchAllData,
  getAllCustomerDataOneShop,
  getALLOneShopRequestDataOneShop,
} from "src/provider.js";
import { aiosapi } from "src/boot/axios";
import exportFromJSON from "export-from-json";
import { physmet } from "src/boot/axios";

// const stringOptions = ["AIOS", "ULIMS", "ONESHOP", "PJOIS"];

export default {
  components: {
    // AreaChart,
    CustomerDetails,
    Doughnut,
    Bar,
    Line,
    Pie,
    // CustomerDuplicates,
  },
  props: ["customer"],
  setup() {
    const $q = useQuasar();
    const NodeCache = require("node-cache");
    const cache = new NodeCache({ stdTTL: 60 * 60 }); // cache for 1 hour

    const createdTimestamp = ref(1548381347815); // Example timestamp value
    const isReturningCustomer = ref(false);

    const duplicateData = ref([]);
    const oneShopCustomer = ref([]);
    const searchModel = ref(null);
    const searchQuery = ref("");
    const model = ref(null);
    const qs = require("qs");
    const loading = ref(false);
    const filter = ref("");
    const length = ref("");
    const lengthaios = ref("");

    const options = ref([]);
    const filter_system = ref([]);

    const paginationStart = ref(null);
    const paginationLimit = ref(null);

    const aiosUser = ref([]);
    const strapiApiCustomer = ref([]);

    const customerInfo = ref([]);
    const customerInfoPromise = ref([]);
    const companyName = ref("");
    const contactPerson = ref("");
    const contactNo = ref("");
    const category = ref("");
    const region = ref("");
    const province = ref("");
    const city_minu = ref("");
    const brgy = ref("");
    const str_ad = ref("");
    const em_ad = ref("");
    const types = ref("");
    const sectors = ref("");

    const oneshopTopCustomer = ref([]);

    const viewCustomerModal = ref(false);
    const viewCustomerDetailsModal = ref(false);
    const viewTopCustomerModal = ref(false);
    const viewReturningCustomerModal = ref(false);
    const viewDupliCustomerModal = ref(false);
    const selected_data = ref("");
    const selected_top = ref("");

    const filterView = ref("");

    const arrayofReturning = ref([]);

    const totalCustomer = ref(0);
    const customeridPerSystem = ref("");

    const oneShopReq = ref([]);
    const osReq = ref([]);
    const osCustomer = ref([]);
    const returningCustomers = ref(0);
    const newCustomers = ref([]);
    const oldCustomers = ref([]);
    const topCustomerRows = ref([]);
    const totalReturning = ref(0);
    const returningCustomer = ref([]);

    const pjoisReq = ref([]);
    const physmetReq = ref([]);

    const completedOrders = ref([]);
    const topRows = ref([]);

    const industries = ref([]);
    const rowCount = ref(10);
    let timer;
    const rows = ref([]);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });
    const duplipagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });

    const topcuspagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });
    const rowsCustomer = ref([]);
    const rowsTopCustomer = ref([]);
    const originalRows = ref([]);

    const pleasewait = ref(true);
    const columns = ref([
      // {
      //   name: "id",
      //   align: "center",
      //   label: "    No.",
      //   field: "id",
      //   sortable: true,
      // },
      {
        name: "displayName",
        align: "left",
        label: "Company Name",
        field: "displayName",
        sortable: true,
      },
      {
        name: "contactPerson",
        align: "left",
        label: "Contact Person",
        field: "contactPerson",
        sortable: true,
      },
      {
        name: "email",
        align: "left",
        label: "Email",
        field: "email",
        sortable: true,
      },
      {
        name: "contactNo",
        align: "left",
        label: "Contact Number",
        field: "contactNo",
        sortable: true,
      },
      {
        name: "address",
        align: "left",
        label: "Address",
        field: "address",
        sortable: true,
      },
    ]);

    const columnDuplicates = [
      {
        name: "company",
        required: true,
        label: "Company Name",
        align: "left",
        field: (row) => row.company,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "intExt",
        align: "left",
        label: "Account Type",
        field: (row) => row.intExt,
        sortable: true,
      },

      {
        name: "isOneshop",
        align: "left",
        label: "System",
        field: (row) => row.isOneshop,
        sortable: true,
      },

      // {
      //   name: "action",
      //   align: "left",
      //   label: "Action",
      //   field: "action",
      //   sortable: true,
      // },

      // {
      //   name: "systemUser",
      //   align: "left",
      //   label: "System User",
      //   field: "systemUser",
      //   sortable: true,
      // },
    ];

    const rowDuplicates = [];

    const columnsView = [
      {
        name: "desc",
        required: true,
        label: "Dessert (100g serving)",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "calories",
        align: "center",
        label: "Calories",
        field: "calories",
        sortable: true,
      },
      { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
      { name: "carbs", label: "Carbs (g)", field: "carbs" },
    ];

    const rowsView = [
      {
        name: "Frozen Yogurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
      },
      {
        name: "Ice cream sandwich",
        calories: 237,
        fat: 9.0,
        carbs: 37,
      },
      {
        name: "Eclair",
        calories: 262,
        fat: 16.0,
        carbs: 23,
      },
      {
        name: "Cupcake",
        calories: 305,
        fat: 3.7,
        carbs: 67,
      },
      {
        name: "Gingerbread",
        calories: 356,
        fat: 16.0,
        carbs: 49,
      },
      {
        name: "Jelly bean",
        calories: 375,
        fat: 0.0,
        carbs: 94,
      },
      {
        name: "Lollipop",
        calories: 392,
        fat: 0.2,
        carbs: 98,
      },
      {
        name: "Honeycomb",
        calories: 408,
        fat: 3.2,
        carbs: 87,
      },
      {
        name: "Donut",
        calories: 452,
        fat: 25.0,
        carbs: 51,
      },
      {
        name: "KitKat",
        calories: 518,
        fat: 26.0,
        carbs: 65,
      },
    ];

    const topColumns = [
      {
        name: "displayName",
        required: true,
        label: "Company Name",
        align: "left",
        field: (row) => row.attributes.displayName,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "system",
        required: true,
        label: "System",
        align: "left",
        field: (row) => row.attributes.system,
        sortable: true,
      },
      {
        name: "types",
        required: true,
        label: "Account Type",
        align: "left",
        field: (row) => row.attributes.types.data[0].attributes.label,
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "View Details",
        field: "action",
      },
    ];

    const returningCol = [
      {
        name: "displayName",
        required: true,
        label: "Company Name",
        align: "left",
        field: (row) => row.attributes.displayName,
        format: (val) => `${val}`,
        sortable: true,
      },
      // {
      //   name: "_dateCOMPLETED",
      //   required: true,
      //   label: "Last Date Completed",
      //   align: "left",
      //   field: (row) => row.date,
      //   format: (val) => `${val}`,
      //   sortable: true,
      // },
      {
        name: "_dateCOMPLETED",
        required: true,
        label: "Account Type",
        align: "left",
        field: (row) => row.attributes.types.data[0].attributes.label,
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    onBeforeMount(async function () {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    async function fetchFromServer(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const cacheKey = `fetchFromServer-${startRow}-${count}-${filter}-${sortBy}-${descending}`;

      // check if response is already in cache
      const cacheValue = cache.get(cacheKey);
      if (cacheValue) {
        return cacheValue;
      }
      const query = {
        filters: {},
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };

      const response = await getAllCustomerData(qs.stringify(query));
      // cache the response
      cache.set(cacheKey, response.data);
      // console.log("erickpogi", response);
      // customerInfoPromise.value = response.data;
      totalCustomer.value = response.data.meta.pagination.total;
      return response.data;
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'

    async function duplicateCustomerfetchFromServer(startRow, count) {
      const query = qs.stringify(
        {
          $skip: startRow,
          $limit: count,
        },

        {
          encodeValuesOnly: true,
        }
      );

      // duplicateData.value = oneShopCustomer.value.data
      //   .map(function (val, idx, arr) {
      //     for (var i = 0; i < idx; i++) {
      //       if (arr[i].company === val.company) {
      //         val.isTrue = true;
      //         return val;
      //       }
      //     }
      //     val.isTrue = false;
      //     return val;
      //   })
      //   .filter((d) => d.isTrue);

      // console.log("duplicatedCustomer", duplicateData.value);

      oneShopCustomer.value = await getAllCustomerDataOneShop(query);

      return oneShopCustomer.value;
    }

    async function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      // setTimeout(() => {
      // update rowsCount with appropriate value
      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // fetch data from "server"
      const returnedData = await fetchFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      );
      // clear out existing data and add new
      // customerInfoPromise.value = returnedData;
      rowsCustomer.value = returnedData.data.map((r) => r);
      // duplicateData.value = returnDuplicateData.data.map((r) => r);
      // console.log("rowCustomer", rowsCustomer.value);
      // console.log("rowDuplicates", duplicateData.value);
      // console.log("returnedData", rowsCustomer.value);

      // don't forget to update local pagination object

      pagination.value.rowsNumber = returnedData.meta.pagination.total;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;

      // ...and turn of loading indicator
      loading.value = false;
      length.value = returnedData.meta.pagination.total;
      // }, 1500);
    }

    async function dupliOnRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      // setTimeout(() => {
      // update rowsCount with appropriate value
      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? duplipagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // fetch data from "server"
      duplicateData.value = await duplicateCustomerfetchFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      );
      // clear out existing data and add new
      // customerInfoPromise.value = returnedData;

      duplicateData.value = oneShopCustomer.value.data
        .map(function (val, idx, arr) {
          for (var i = 0; i < idx; i++) {
            if (
              arr[i].company.replace(/[^a-zA-Z0-9]/g, "") ===
              val.company.replace(/[^a-zA-Z0-9]/g, "")
            ) {
              val.isTrue = true;
              val.isOneshop = "OneShop";
              return val;
            }
          }
          val.isTrue = false;
          val.isOneshop = false;
          return val;
        })
        .filter((d) => d.isTrue);

      // console.log("duplicatedCustomer", duplicateData.value);

      // duplicateData.value = returnedData.data.map((r) => r);
      // console.log("duplicate", duplicateData.value);

      // don't forget to update local pagination object

      // console.log("duplipagination.value", duplipagination.value);

      duplipagination.value.rowsNumber = duplicateData.value.total;
      duplipagination.value.page = page;
      duplipagination.value.rowsPerPage = rowsPerPage;
      duplipagination.value.sortBy = sortBy;
      duplipagination.value.descending = descending;

      // ...and turn of loading indicator
      loading.value = false;
      length.value = duplicateData.value.total;
      // }, 1500);
    }

    async function onTopRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      // setTimeout(() => {
      // update rowsCount with appropriate value
      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // fetch data from "server"
      const returnedData = await fetchFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      );
      // clear out existing data and add new
      // customerInfoPromise.value = returnedData;
      rowsTopCustomer.value = returnedData.data.map((r) => r);
      // duplicateData.value = returnDuplicateData.data.map((r) => r);
      // console.log("rowsTopCustomer", rowsTopCustomer.value);
      // console.log("rowDuplicates", duplicateData.value);
      // console.log("returnedData", rowsCustomer.value);

      // don't forget to update local pagination object

      pagination.value.rowsNumber = returnedData.meta.pagination.total;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;

      // ...and turn of loading indicator
      loading.value = false;
      length.value = returnedData.meta.pagination.total;
      // }, 1500);
    }

    async function loadAlldata() {
      onRequest({
        pagination: pagination.value,
        filter: undefined,
      });
    }

    async function dupliCustomerData() {
      dupliOnRequest({
        pagination: duplipagination.value,
        filter: undefined,
      });
    }

    async function topCustomerData() {
      onTopRequest({
        pagination: topcuspagination.value,
        filter: undefined,
      });
    }

    async function searchData() {
      const qs = require("qs");
      const query = {};
      // {
      //   searchModel.value
      // },
      // {
      //   encodeValuesOnly: true,
      // },
      const response = await searchAllData(query);
      response.forEach((element) => {
        let attrObj = element.attributes;
        searchQuery.value = attrObj.contactPerson;
        // console.log("test", searchQuery.value);
      });
    }

    async function systemType() {
      const qs = require("qs");
      const query = qs.stringify(
        {
          $eq: (options.value = ["OneShop", "AIOS", "ULIMS", "PJOIS"]),
        },
        {
          encodeValuesOnly: true,
        }
      );
      const response = await systemsFilter(query);
      // console.log("response", response);
      // response.forEach((element) => {
      //   filter_system.value = element.attributes;
      //   console.log("test", filter_system.value);
      // });
    }

    // const filtered = computed(() =>
    //   customerInfoPromise.value.data.map((name, item) => {
    //     if (
    //       name.attribute.filter((x) => x.displayName === item.name).length > 1
    //     )
    //       return true;
    //   })
    // );
    // const filtered = computed(() =>
    //   customerInfoPromise.value.data.map((val, idx, arr) => {
    //     let attrObj = val.attributes;
    //     duplicateData.value = attrObj.displayName;
    //     for (var i = 1; i < idx; i++) {
    //       if (arr[i].attributes.displayName === duplicateData.value) {
    //         return true;
    //       }
    //     }
    //     // if (val.attributes.displayName) {
    //     //   return arr[i].attributes.displayName;
    //     // }
    //     console.log("testasdasdasd", duplicateData.value);
    //     return duplicateData.value;
    //   })
    // );

    // async function getCustomersWithOrdersThisYear(row) {
    //   console.log("row", row);
    // }

    // async function getAllOneShopRequest() {
    //   const response = await getALLOneShopRequestDataOneShop();
    //   // console.log("getAllOneShopRequest", response);
    // }

    async function getCustomersWithOrdersThisYear() {
      const thisYear = moment().year();
      const query = {
        dateCompleted: {
          $gte: moment([thisYear, 0, 1]).format(),
        },
      };
      // console.log("qweqwew", query);

      const responseOrder = await getALLOneShopRequestDataOneShop(
        qs.stringify(query)
      );
      // console.log("responseOrder", responseOrder);
      osCustomer.value = responseOrder.data.map((req) => req.customer._id);
      // console.log("osCustomer.value", osCustomer.value);
      return osCustomer.value;
    }

    async function getReturningCustomer() {
      const customerIds = osCustomer.value;
      const processedIds = [];

      // Use a Map to keep track of the latest order for each customer id
      const namesOfCustomer = [];
      const intExt = [];
      const latestOrdersByCustomerId = new Map();
      for (const customerId of customerIds) {
        if (processedIds.includes(customerId)) {
          continue;
        }

        const query = {
          "customer._id": customerId,
          $sort: { _dateCOMPLETED: -1, date: -1 },
          $limit: 1,
        };
        const responseOrder = await getALLOneShopRequestDataOneShop(
          qs.stringify(query)
        );
        const lastOrder = responseOrder.data[0];

        if (lastOrder) {
          const lastOrderDate = moment(
            lastOrder._dateCOMPLETED || lastOrder.date
          );
          namesOfCustomer.push(lastOrder ? lastOrder.customer.company : null);
          intExt.push(lastOrder ? lastOrder.customer.intExt : null);

          if (!latestOrdersByCustomerId.has(customerId)) {
            latestOrdersByCustomerId.set(customerId, lastOrderDate);
          } else {
            const prevLatestOrderDate =
              latestOrdersByCustomerId.get(customerId);
            if (lastOrderDate.isAfter(prevLatestOrderDate)) {
              latestOrdersByCustomerId.set(customerId, lastOrderDate);
            }
          }

          processedIds.push(customerId);
        }
      }

      // Convert the Map to an array of customer objects with the latest order date
      const customers = Array.from(latestOrdersByCustomerId.entries()).map(
        ([customerId, lastOrderDate], index) => {
          const company = namesOfCustomer[index];
          const types = intExt[index];
          const latestOrderDate = latestOrdersByCustomerId.get(customerId);
          return {
            id: customerId,
            name: company,
            date: latestOrderDate,
            types: types,
          };
        }
      );
      // console.log("customers", customers);

      const dateNow = new Date();
      const now = moment(dateNow);
      const oneYearAgo = moment().subtract(1, "year");

      // Filter the customers to get returning customers and new customers
      returningCustomers.value = customers.filter((customer) => {
        const daysSinceLastOrder = now.diff(customer.date, "days");
        return daysSinceLastOrder > 365 && daysSinceLastOrder < 730;
      });
      newCustomers.value = customers
        .filter((customer) => {
          const daysSinceLastOrder = now.diff(customer.date, "days");
          return daysSinceLastOrder < 365;
        })
        .map((customer) => customer.id);

      // oldCustomers.value = customers.filter((customer) => {
      //   const daysSinceLastOrder = now.diff(customer.date, "days");
      //   return daysSinceLastOrder >= 365 && daysSinceLastOrder < 1095;
      // });

      // console.log("returningCustomers", returningCustomers.value);
      // console.log("newCustomers", newCustomers.value);
      // console.log("oldCustomers", oldCustomers.value);

      return { newCustomers, returningCustomers, oldCustomers };
    }

    async function getReturningCustomers() {
      const query = {
        populate: ["industries", "types"],
        filters: {
          returning: {
            $eq: true,
          },
        },
        pagination: {
          limit: 1000,
        },
      };
      const response = await getAllCustomerData(qs.stringify(query));
      returningCustomer.value = response.data.data.map((r) => r);
      totalReturning.value = response.data.meta.pagination.total;
      return returningCustomer.value;
    }

    // async function getReturningCustomer() {
    //   const customerIds = osCustomer.value;
    //   // console.log("customerIds", customerIds);
    //   const lastOrderDates = [];
    //   const namesOfCustomer = [];
    //   const intExt = [];
    //   for (const customerId of customerIds) {
    //     const query = {
    //       "customer._id": customerId,
    //       // "customer.intExt": "External",
    //       $sort: { $or: [{ _dateCOMPLETED: -1 }, { date: -1 }] },
    //       $limit: 1,
    //     };
    //     const responseOrder = await getALLOneShopRequestDataOneShop(
    //       qs.stringify(query)
    //     );
    //     const lastOrder = responseOrder.data[0];
    //     const lastOrderDate = lastOrder
    //       ? moment(lastOrder._dateCOMPLETED)
    //       : null;
    //     lastOrderDates.push(lastOrderDate);
    //     namesOfCustomer.push(lastOrder ? lastOrder.customer.company : null);
    //     intExt.push(lastOrder ? lastOrder.customer.intExt : null);
    //   }

    //   const dateNow = new Date();
    //   const now = moment(dateNow);
    //   const oneYearAgo = moment().subtract(1, "year");
    //   returningCustomers.value = customerIds
    //     .filter((customerId, index) => {
    //       const lastOrderDate = lastOrderDates[index];
    //       const nameOfCustomer = namesOfCustomer[index];
    //       const types = intExt[index];
    //       if (!lastOrderDate) {
    //         return false;
    //       }
    //       const daysSinceLastOrder = now.diff(lastOrderDate, "days");
    //       return daysSinceLastOrder >= 365 && daysSinceLastOrder < 730;
    //     })
    //     .map((customerId, index) => {
    //       return {
    //         id: customerId,
    //         name: namesOfCustomer[index],
    //         types: intExt[index],
    //         date: lastOrderDates[index],
    //       };
    //     });

    //   const newCustomers = customerIds.filter((customerId, index) => {
    //     const lastOrderDate = lastOrderDates[index];
    //     if (!lastOrderDate) {
    //       return true;
    //     }
    //     const daysSinceLastOrder = now.diff(lastOrderDate, "days");
    //     return daysSinceLastOrder < 365;
    //   });

    //   // const oldCustomers = customerIds.filter((customerId, index) => {
    //   //   const lastOrderDate = lastOrderDates[index];
    //   //   if (!lastOrderDate) {
    //   //     return false;
    //   //   }
    //   //   const daysSinceLastOrder = now.diff(lastOrderDate, "days");
    //   //   return daysSinceLastOrder >= 365 && daysSinceLastOrder < 1095;
    //   // });
    //   console.log("returningCustomers", returningCustomers.value);
    //   // console.log("oldCustomers", oldCustomers);
    //   console.log("newCustomers", newCustomers);
    //   // const returningCustomers = customerIds.filter((customerId, index) => {
    //   //   const lastOrderDate = lastOrderDates[index];
    //   //   const now = moment();
    //   //   // console.log("now", now);
    //   //   const oneYearAgo = moment().subtract(1, "year");
    //   //   // console.log("oneYearAgo", oneYearAgo);
    //   //   return (
    //   //     lastOrderDate && lastOrderDate.isBetween(oneYearAgo, now, null, "[]") // check if the last order date is within the past year
    //   //   );
    //   // });
    //   // console.log("returning", returningCustomers);
    //   // arrayofReturning.value = returningCustomers.value.map((m, i) => {
    //   //   return {
    //   //     date: m._i,
    //   //     name: namesOfCustomer[i],
    //   //   };
    //   // });
    //   // console.log("arrayofReturning", arrayofReturning);
    //   return { newCustomers, returningCustomers };
    // }
    watch(osCustomer, (newVal, oldVal) => {
      if (newVal !== null) {
        getReturningCustomer();
      }
    });
    // const getLastOrderDates = async () => {
    //   const customerIds = osCustomer.value;
    //   const lastOrderDates = [];
    //   const namesOfCustomer = [];
    //   for (const customerId of customerIds) {
    //     const query = {
    //       "customer._id": customerId,
    //       $sort: { _dateCOMPLETED: -1 },
    //       $limit: 1,
    //     };
    //     const responseOrder = await getALLOneShopRequestDataOneShop(
    //       qs.stringify(query)
    //     );
    //     const lastOrder = responseOrder.data[0];
    //     // console.log("lastOrder", lastOrder);
    //     const lastOrderDate = lastOrder
    //       ? moment(lastOrder._dateCOMPLETED)
    //       : null;
    //     lastOrderDates.push(lastOrderDate);
    //     namesOfCustomer.push(lastOrder ? lastOrder.customer.company : null);
    //   }
    //   const returningCustomers = customerIds.filter((customerId, index) => {
    //     const lastOrderDate = lastOrderDates[index];
    //     const now = moment();
    //     const oneYearAgo = moment().subtract(1, "year");
    //     return (
    //       lastOrderDate && lastOrderDate.isBetween(oneYearAgo, now, null, "[]") // check if the last order date is within the past year
    //     );
    //   });
    //   console.log("returning", returningCustomers);
    //   return { returningCustomers };
    //   // return { lastOrderDates, namesOfCustomer };
    // };

    // const countReturningCustomer = watchEffect(async () => {
    //   const { lastOrderDates, namesOfCustomer } = await getLastOrderDates();
    //   // console.log("lastOrderDates", lastOrderDates);

    //   returningCustomers.value = lastOrderDates.filter((lastOrderDate) => {
    //     if (!lastOrderDate) {
    //       return false;
    //     }
    //     const threeYearsAgo = moment().subtract(0, "years");
    //     const lastOrderYear = lastOrderDate.year();
    //     const currentYear = moment().year();
    //     return (
    //       lastOrderYear <= threeYearsAgo.year() &&
    //       currentYear === threeYearsAgo.year()
    //     );
    //   });

    //   arrayofReturning.value = returningCustomers.value.map((m, i) => {
    //     return {
    //       date: m._i,
    //       name: namesOfCustomer[i],
    //     };
    //   });

    //   // console.log("arrayofReturning", arrayofReturning.value);
    //   // console.log("returningCustomers", returningCustomers.value);
    //   return arrayofReturning.value;
    // });

    async function getOneShopCompletedOrders() {
      const query = {
        "statuss.action": "Completed",
        // "customer.intExt": "External",
      };
      // console.log("query", query);
      completedOrders.value = await getALLOneShopRequestDataOneShop(
        qs.stringify(query)
      );
      // console.log("completedOrders.value", completedOrders.value.data);
      return completedOrders.value.data;
    }

    async function getTopCustomer() {
      const customers = {};
      const orderCompeleted = await getOneShopCompletedOrders();
      orderCompeleted.forEach((order) => {
        // console.log("order", order);
        const customerId = order.customer._id;
        // console.log("customerId", customerId);
        if (!customers[customerId]) {
          customers[customerId] = {
            customerId: customerId,
            totalCompletedOrders: 0,
          };
        }
        customers[customerId].totalCompletedOrders++;
        // console.log("customers", customers);
      });
      return Object.values(customers).sort((a, b) => {
        // console.log(
        //   "sadasadsadaqweqw",
        //   b.totalCompletedOrders - a.totalCompletedOrders
        // );
        return b.totalCompletedOrders - a.totalCompletedOrders;
      });
    }

    async function topCustomer() {
      oneshopTopCustomer.value = await getTopCustomer();
      // console.log("oneshopTopCustomer", oneshopTopCustomer.value);
    }

    async function topCustomerRow() {
      const response = await getTopCustomer();
      // console.log("response", response);
      const cusID = response.map((element) => element.customerId);

      // console.log("cusID", cusID);
      const countOrder = response.map(
        (element) => element.totalCompletedOrders
      );
      const cusWithCount = cusID.map((id, index) => ({
        customerId: id,
        totalCompletedOrders: countOrder[index],
      }));
      // console.log("cusWithCount", cusWithCount);
      // console.log(
      //   "asdasdasd",
      //   cusWithCount.find((c) => c.customerId)
      // );
      // responseOrder.data.map((req) => req.customer._id);
      // console.log("rere", countOrder);
      const query = {
        populate: ["industries", "types"],
        filters: {
          customer_id: {
            $in: [
              cusWithCount[0].customerId,
              cusWithCount[1].customerId,
              cusWithCount[2].customerId,
              cusWithCount[3].customerId,
              cusWithCount[4].customerId,
            ],
          },
          // types: {
          //   label: {
          //     $eq: "External",
          //   },
          // },
        },
      };
      // console.log("query", query);
      const queriedCustomer = await getAllCustomerData(qs.stringify(query));
      // console.log("queriedCustomer", queriedCustomer);
      topCustomerRows.value = queriedCustomer.data.data.map(function (
        val,
        idx,
        arr
      ) {
        const customer = cusWithCount.find(
          (c) => c.customerId === val.attributes.customer_id
        );
        if (customer) {
          val.isCounted = true;
          val.isCount = customer.totalCompletedOrders;
        } else {
          val.isCounted = false;
        }
        return val;
      });
      topRows.value = topCustomerRows.value.sort(
        (a, b) => b.isCount - a.isCount
      );
      return topRows.value;
    }

    // async function getReturningCustomer(filter) {
    //   const config = {
    //     method: "get",
    //     url: `http://10.10.120.32:3030/requests?`,
    //     headers: {
    //       "Content-Type": "application/json",
    //       // Authorization:
    //       //   "Bearer " +
    //       //   "881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01",
    //     },
    //   };
    //   // if (filter) {
    //   //   config.url = config.url;
    //   //   // + `created_at=${returningCustomers.value._i}`;
    //   // }
    //   // console.log(
    //   //   "config.url + `created_at=${returningCustomers.value._i}`",
    //   //   config.url
    //   //   // + `created_at=${returningCustomers.value}`
    //   // );
    // }

    onMounted(() => {
      getReturningCustomers();
      getReturningCustomer();
      topCustomerRow();
      topCustomer();
      getTopCustomer();
      getOneShopCompletedOrders();
      // getAllOneShopRequest();
      dupliCustomerData();
      topCustomerData();
      loadAlldata();
      systemType();
      searchData();
      getCustomersWithOrdersThisYear();
      // getLastOrderDates();
      // countReturningCustomer;

      setTimeout(() => {
        pleasewait.value = false;
      }, 20000); // Wait 20 seconds before setting loading to false

      // $q.localStorage.set(customerInfoPromise.value);
      // const value = $q.localStorage.getItem(customerInfoPromise.value);

      // const now = Date.now();
      // const elapsedTime = now - createdTimestamp.value;
      // console.log("elapsedTime", elapsedTime);
      // if (elapsedTime >= 1000 * 60 * 60 * 24 * 365 * 3) {
      //   isReturningCustomer.value = true;
      // }
      // console.log("boboobo", value);
    });

    return {
      pleasewait,
      arrayofReturning,
      getReturningCustomer,
      returningCol,
      topCustomerRows,
      topCustomerRow,
      oneshopTopCustomer,
      topCustomer,
      getTopCustomer,
      completedOrders,
      getOneShopCompletedOrders,
      returningCustomers,
      // countReturningCustomer,
      // getLastOrderDates,
      // getAllOneShopRequest,
      getCustomersWithOrdersThisYear,
      topCustomerData,
      loadAlldata,
      dupliCustomerData,
      metaObj: ref(""),
      customerInfo,
      newCustomer: ref(false),
      customerInfoPromise,
      duplicatedCustomer: ref([]),
      loading,
      filter,
      rowCount,
      reviewuploadQuotation: false,
      rowsCustomer,
      industries,
      length,
      lengthaios,
      aiosUser,
      pagination,
      systemType,
      searchData,
      onRequest,
      dupliOnRequest,
      onTopRequest,
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },

      columns,
      topRows,
      rows,
      options,
      filter_system,
      model,
      searchModel,
      searchQuery,
      duplicateData,
      oneShopCustomer,
      rowDuplicates,
      columnDuplicates,
      duplipagination,
      dialog: ref(false),
      maximizedToggle: ref(true),
      tab: ref("details"),
      filterView,
      columnsView,
      rowsView,
      companyName,
      contactPerson,
      contactNo,
      category,
      region,
      province,
      city_minu,
      brgy,
      str_ad,
      em_ad,
      types,
      sectors,
      text: ref(""),
      dense: ref(false),
      viewCustomerModal,
      viewCustomerDetailsModal,
      viewTopCustomerModal,
      viewReturningCustomerModal,
      selected_data,
      selected_top,
      topColumns,
      topcuspagination,
      rowsTopCustomer,

      isReturningCustomer,

      totalCustomer,
      customeridPerSystem,
      oneShopReq,
      osReq,
      physmetReq,
      pjoisReq,

      osCustomer,

      transactChart: ref(false),
      sectChart: ref(false),
      viewDupliCustomerModal,
      getReturningCustomers,
      totalReturning,
      returningCustomer,

      viewCustomer(row) {
        console.log("row", row);
        // console.log("rwqrq", row);
        let index = duplicateData.value.indexOf(row);
        console.log(duplicateData.value.indexOf(row));
        selected_data.value = row;
        viewCustomerModal.value = true;
        // sectors.value = Array.isArray(row.sector) ? row.sector[0] : row.sector;
      },
      // viewCustomerDetails(row) {
      //   selected_top.value = row;
      //   viewCustomerDetailsModal.value = true;
      //   console.log("row", row);
      //   sectors.value = Array.isArray(row.sector) ? row.sector[0] : row.sector;
      // },
      downloadFile() {
        const data = duplicateData.value;
        const fileName = "records of duplicates";
        const exportType = exportFromJSON.types.csv;

        if (data) exportFromJSON({ data, fileName, exportType });
      },

      filterFn(val, update, abort) {
        update(() => {
          const needle = val.toLowerCase();
          options.value.filter((v) => v.toLowerCase().indexOf(needle) > -1);
        });
      },

      filterSearch() {
        console.log("test", searchQuery.value);
        return searchQuery.value.filter((entry) =>
          searchQuery.value.length
            ? Object.keys(searchQuery.value[0]).some((key) =>
                ("" + entry[key]).toLowerCase().includes(searchModel.value)
              )
            : true
        );
      },

      showLoading() {
        $q.loading.show({
          message: "Syncing Customer's Infomation. Please wait...",
        });
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 3000);
      },

      viewTopCustomer() {
        viewTopCustomerModal.value = true;
      },

      viewDupliCustomer() {
        viewDupliCustomerModal.value = true;
      },

      viewReturningCustomer() {
        viewReturningCustomerModal.value = true;
      },
    };
  },
};
</script>

<template>
  <div>
    <div class="bg-grey-2">
      <q-breadcrumbs class="q-mb-lg">
        <q-breadcrumbs-el
          class="text-primary"
          label="Homepage"
          icon="home"
          to="/MainLayout/Home"
        />
        <q-breadcrumbs-el label="Dashboard" icon="dashboard" />
      </q-breadcrumbs>

      <div class="row">
        <div class="col-12 col-sm-12 col-md-3">
          <q-card
            style="width: 60%; margin: 0 auto"
            v-ripple
            class="my-box cursor-pointer q-hoverable"
            @click="$router.push('/MainLayout/crudCustomer')"
          >
            <q-card-section class="bg-primary">
              <div
                class="col text-h6 ellipsis row items-center text-white text-weight-light"
              >
                <q-icon name="people" class="text-h6" /><label class="q-ml-sm"
                  >Total Customer</label
                >
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h3 text-weight-light">
                {{ totalCustomer }}
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-12 col-md-3">
          <q-card style="width: 60%; margin: 0 auto">
            <q-card-section class="bg-primary">
              <div
                v-if="$q.platform.is.desktop"
                class="col text-h6 ellipsis row items-center text-white text-weight-light"
              >
                <q-icon name="people" class="text-h6" /><label class="q-ml-sm"
                  >Returning Customers</label
                >
              </div>
              <!-- <div
                v-if="$q.platform.is.mobile"
                class="col text-h6 ellipsis row items-center text-white text-weight-light"
              >
                <q-icon name="people" class="text-h6" /><label class="q-ml-sm"
                  >Returning Customers</label
                >
              </div> -->
            </q-card-section>
            <q-card-section>
              <div class="row items-center justify-between">
                <div class="text-h3 text-weight-light">
                  {{ totalReturning }}
                </div>
                <div class="text-h3 text-weight-light">
                  <q-btn
                    @click="viewReturningCustomer()"
                    padding="xs lg"
                    color="primary"
                    icon="remove_red_eye"
                  >
                    <q-tooltip> View Returning Customer </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-12 col-md-3">
          <q-card style="width: 60%; margin: 0 auto">
            <q-card-section class="bg-primary">
              <div
                class="col text-h6 ellipsis row items-center text-white text-weight-light"
              >
                <q-icon name="people" class="text-h6" /><label class="q-ml-sm"
                  >Top Customer</label
                >
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row justify-center">
                <div class="text-h3 text-weight-light">
                  <q-btn
                    @click="viewTopCustomer()"
                    padding="xs lg"
                    color="primary"
                    icon="remove_red_eye"
                  >
                    <q-tooltip> View Top Customer </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-12 col-md-3">
          <q-card style="width: 60%; margin: 0 auto">
            <q-card-section class="bg-primary">
              <div
                v-if="$q.platform.is.desktop"
                class="col text-h6 ellipsis row items-center text-white text-weight-light"
              >
                <q-icon name="people" class="text-h6" /><label class="q-ml-sm"
                  >Duplicate Customers</label
                >
              </div>
              <!-- <div
                v-if="$q.platform.is.mobile"
                class="col text-h6 ellipsis row items-center text-white text-weight-light"
              >
                <q-icon name="people" class="text-h6" /><label class="q-ml-sm"
                  >Duplicate Customers</label
                >
              </div> -->
            </q-card-section>
            <q-card-section>
              <div class="row justify-between">
                <div class="text-h3 text-weight-light">
                  {{ duplicateData.length }}
                </div>
                <div class="text-h3 text-weight-light">
                  <q-btn
                    @click="viewDupliCustomer()"
                    padding="xs lg"
                    color="primary"
                    icon="remove_red_eye"
                  >
                    <q-tooltip> View Duplicate Customers </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <!-- <br /> -->
    <div class="row justify-around items-center">
      <div style="border-radius: 5px" class="col-12 col-md-4 q-pa-md q-ma-sm">
        <Pie />
      </div>

      <!-- <div
        style="border-radius: 5px"
        class="col-12 bg-white col-md-4 q-pa-md q-ma-sm"
      >
        <AreaChart />
      </div> -->
      <div style="border-radius: 5px" class="col-12 col-md-4 q-pa-md q-ma-sm">
        <strong
          ><label class="row justify-center">ACCOUNT TYPES CHART</label></strong
        >

        <Doughnut />
      </div>
    </div>
    <div class="row justify-around items-center">
      <div class="q-pa-md q-ma-sm">
        <q-card
          style="width: 210px"
          v-ripple
          class="my-card my-box cursor-pointer q-hoverable"
          @click="transactChart = true"
        >
          <q-img src="~assets/tsr-chart.png">
            <div class="absolute-bottom text-subtitle2 text-center">
              TSR Graph
            </div>
          </q-img>
        </q-card>
      </div>

      <div class="q-pa-md q-ma-sm">
        <q-card
          style="width: 210px"
          v-ripple
          class="my-card my-box cursor-pointer q-hoverable"
          @click="sectChart = true"
        >
          <q-img src="~assets/sector-chart.png">
            <div class="absolute-bottom text-subtitle2 text-center">
              Industry Graph
            </div>
          </q-img>
        </q-card>
      </div>
    </div>

    <div>
      <q-dialog v-model="transactChart" persistent>
        <q-card style="width: 100%; max-width: 1080px">
          <q-card-section class="row items-center q-pb-none">
            <q-space />
            <div class="bg-primary text-white" style="border-radius: 50%">
              <q-btn icon="close" flat round dense v-close-popup></q-btn>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div
                style="border-radius: 5px"
                class="col-12 bg-white col-md-10 q-pa-md q-ma-sm"
              >
                <strong
                  ><label class="row justify-center"
                    >TRANSACTIONS CHART</label
                  ></strong
                >
                <Line />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="sectChart" persistent>
        <q-card style="width: 100%; max-width: 1080px">
          <q-card-section class="row items-center q-pb-none">
            <q-space />
            <div class="bg-primary text-white" style="border-radius: 50%">
              <q-btn icon="close" flat round dense v-close-popup />
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div
                style="border-radius: 5px"
                class="col-12 bg-white col-md-10 q-pa-md q-ma-sm"
              >
                <strong
                  ><label class="row justify-center"
                    >CUSTOMER PER INDUSTRY CHART</label
                  ></strong
                >
                <Bar />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>

    <q-dialog v-model="viewTopCustomerModal" persistent>
      <q-card style="width: 100%; max-width: 860px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Top Customer</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-table
            title=""
            :rows="topRows"
            :columns="topColumns"
            row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <!-- <pre>{{ props }}</pre> -->
                <q-td key="displayName">
                  {{ props.row.attributes.displayName }}
                </q-td>
                <q-td key="system">
                  {{ props.row.attributes.system }}
                </q-td>
                <q-td key="types">
                  {{ props.row.attributes.types.data[0].attributes.label }}
                </q-td>
                <q-td key="action" :props="props">
                  <CustomerDetails :customer="props.row" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="viewDupliCustomerModal" persistent>
      <q-card style="width: 100%; max-width: 860px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Duplicate Customers</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-table
            title=""
            :rows="duplicateData"
            :columns="columnDuplicates"
            row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <!-- <pre>{{ props }}</pre> -->
                <q-td key="company">
                  {{ props.row.company }}
                </q-td>
                <q-td key="intExt">
                  {{ props.row.intExt }}
                </q-td>
                <q-td key="isOneshop">
                  {{ props.row.isOneshop }}
                </q-td>
                <!-- <q-td key="action" :props="props">
                  <CustomerDetails :customer="props.row" />
                </q-td> -->
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="viewReturningCustomerModal" persistent>
      <q-card style="width: 100%; max-width: 860px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Returning Customer</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-table
            title=""
            :rows="returningCustomer"
            :columns="returningCol"
            row-key="name"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <!-- <div align="center" class="q-pa-md row items-start q-gutter-md">
      <q-card align="center" class="my-card" @click="newCustomer = true">
        <q-card-section class="text-black">
          <div class="text-h6">NEW Customer</div>
          <div class="text-subtitle2">Total = 5</div>
          <q-icon name="person" color="primary" size="4rem" />
        </q-card-section>

        <q-separator />
      </q-card>

      <q-card align="center" class="my-card">
        <q-card-section class="text-black">
          <div class="text-h6">
            Returning Customer (No transaction w/in 3 years)
          </div>
          <q-icon name="warning" color="primary" size="4rem" />
          <div class="q-pa-md" style="max-width: 350px">
            <q-list bordered separator>
              <q-item clickable v-ripple>
                <q-item-section>Trinmar</q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>John Doe</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>Juan Dela Cruz</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-separator />
      </q-card>
    </div> -->
  <!-- <q-dialog
      v-model="viewCustomerModal"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-secondary text-white">
        <q-bar>
          <q-space />
          <q-btn
            dense
            flat
            icon="minimize"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip v-if="maximizedToggle" class="bg-white text-secondary"
              >Minimize</q-tooltip
            >
          </q-btn>
          <q-btn
            dense
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-secondary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-secondary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card class="q-ma-xl">
          <q-tabs
            v-model="tab"
            dense
            class="bg-grey-3 text-grey-7"
            active-color="secondary"
            indicator-color="purple"
            align="justify"
          >
            <q-tab name="details" label="Details" />
            <q-tab name="orders" label="Orders" />
          </q-tabs>

          <q-tab-panels v-model="tab" animated class="bg-secondary text-white">
            <q-tab-panel name="details">
              <q-table
                title="Customer Details"
                hide-pagination
                hide-bottom
                hide-header
                grid
              >
              </q-table>
              <div>
                {{ duplicateData._id }}
                <pre>{{ duplicateData }}</pre>
                <h5 class="text-dark">
                  <strong>Company Name:</strong> {{ selected_data.company }}
                </h5>
                <h5 class="text-dark">
                  <strong>Contact Person:</strong> {{ selected_data.contact }}
                </h5>
                <h5 class="text-dark">
                  <strong>Sector:</strong>
                  {{ sectors }}
                </h5>
                <h5 class="text-dark">
                  <strong>Contact Number:</strong> {{ selected_data.telno }}
                </h5>
                <h5 class="text-dark">
                  <strong>Email:</strong> {{ selected_data.email }}
                </h5>
                <h5 class="text-dark">
                  <strong>Address:</strong>
                  {{
                    selected_data.street +
                    ", " +
                    selected_data.brgy +
                    ", " +
                    selected_data.citymun +
                    ", " +
                    selected_data.province +
                    ", " +
                    selected_data.region
                  }}
                </h5>
                <h5 class="text-dark">
                  <strong>Account Type:</strong> {{ selected_data.intExt }}
                </h5>
                <h5 class="text-dark">
                  <strong>Old/New:</strong> {{ selected_data.oldNew }}
                </h5>
              </div>
            </q-tab-panel>

            <q-tab-panel name="orders">
              <q-table
                grid
                card-class="bg-dark text-white"
                title="Customer Orders"
                :rows="rowsView"
                :columns="columnsView"
                row-key="name"
                :filter="filterView"
                hide-header
              >
                <template v-slot:top-right>
                  <q-input
                    borderless
                    dense
                    debounce="300"
                    v-model="filterView"
                    placeholder="Search"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-card>
    </q-dialog> -->
  <!-- <q-dialog
    v-model="viewCustomerDetailsModal"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-secondary text-white">
      <q-bar>
        <q-space />
        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-secondary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-secondary"
            >Maximize</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-secondary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card class="q-ma-xl">
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3 text-grey-7"
          active-color="secondary"
          indicator-color="purple"
          align="justify"
        >
          <q-tab name="details" label="Details" />
          <q-tab name="orders" label="Orders" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-secondary text-white">
          <q-tab-panel name="details">
            <q-table
              title="Customer Details"
              hide-pagination
              hide-bottom
              hide-header
              grid
            >
            </q-table>

            <div style="margin-left: 16px">
              {{ duplicateData._id }}
              <pre>{{ duplicateData }}</pre>
              <div class="row q-mt-lg">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Company Name"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.displayName"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Contact Person"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.contactPerson"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Sector"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.industries.data[0].attributes.label"
                    />
                  </strong>
                </div>
              </div>
              <div class="row q-mt-xl">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Contact No."
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.contactNo"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Email Address"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.email"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Address"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.address"
                    />
                  </strong>
                </div>
              </div>
              <div class="row q-mt-xl q-mb-xl">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Account Type"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.types.data[0].attributes.label"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Old/New"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.oldNew"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="System Registered"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="selected_top.system"
                    />
                  </strong>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="orders">
            <template>
              <q-table
                grid
                card-class="bg-dark text-white"
                title="Customer Orders"
                :rows="rowsView"
                :columns="columnsView"
                row-key="name"
                :filter="filterView"
                hide-header
              >
                <template v-slot:top-right>
                  <q-input
                    borderless
                    dense
                    debounce="300"
                    v-model="filterView"
                    placeholder="Search"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
              </q-table>
            </template>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-card>
  </q-dialog> -->
</template>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.np-btn {
  padding: 2px 8px;
  margin: 12px 8px;
  border: 1px solid #107fda;
  width: 110px;
  background: #107fda;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  position: absolute;
  top: 370px;
  left: 5px;
}
</style>
