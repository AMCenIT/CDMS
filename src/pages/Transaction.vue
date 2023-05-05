<script>
import {
  ref,
  onBeforeMount,
  onMounted,
  computed,
  getCurrentInstance,
} from "vue";
import { date, useQuasar } from "quasar";
import {
  getCustomerDataAllaios,
  getTransactionDataAllaios,
  getQueryCustomerDataOneShopTable,
  getALLOneShopRequestDataOneShop,
  getAllCustomerData,
} from "src/provider.js";
import moment from "moment";
import axios from "axios";

export default {
  components: {},
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties;
    const tsrData = ref("");
    const qs = require("qs");
    const loading = ref(false);
    const asiosloading = ref(false);

    const reOneshopReq = ref([]);

    const dateFilter = ref([]);

    const length = ref("");
    const lengthaios = ref("");

    const paginationStart = ref(null);
    const paginationLimit = ref(null);

    const aiosUser = ref([]);
    const aiosCustomer = ref([]);

    const oneshopCustomer = ref([]);

    const aiosTransactions = ref([]);

    const strapiApiCustomer = ref([]);

    const oneShopTransactions = ref([]);

    const customerInfo = ref([]);
    const customerInfoPromise = ref([]);

    const industries = ref([]);
    const rowCount = ref(10);
    const $q = useQuasar();
    let timer;
    const rows = ref([]);
    const aiosrows = ref([]);

    const startDate = ref("");
    const endDate = ref("");

    const intexModel = ref(null);
    const options = ref(["Internal", "External", "Student"]);

    const customerExist = ref([]);

    const tab = ref("ulims");

    const pjoisReq = ref([]);
    const ulimsReq = ref([]);
    const physmetReq = ref([]);

    const formattedTargeDate = ref("");

    const jobtypeModel = ref(null);

    const viewTransactionModal = ref(false);
    const formattedDateCreated = ref(false);

    const textForRate = ref("");

    const totalRateBill = ref(0);

    const optionJobType = ref([
      "Actual Time",
      "Time Sharing",
      "Quoted",
      "Quotation",
    ]);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });

    const aiospagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });
    const ospagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });

    const osrpagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });
    const pjoisReqPagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });
    const rowsCustomer = ref([]);
    const originalRows = ref([]);
    const columns = ref([
      {
        name: "tsrNo",
        align: "left",
        label: "TSR No.",
        field: "tsrNo",
        sortable: true,
      },
      {
        name: "company_name",
        align: "left",
        label: "Company Name",
        field: "company_name",
        sort: true,
      },
      {
        name: "Job_type",
        align: "left",
        label: "Job Type",
        field: "jobtype",
        sortable: true,
      },
      {
        name: "account_type",
        align: "left",
        label: "Account Type",
        field: "accounttype",
        sortable: true,
      },
    ]);

    const osrcolumns = ref([
      {
        name: "tsrNo",
        align: "left",
        label: "TSR No.",
        field: "tsrNo",
        sortable: true,
      },
      {
        name: "company_name",
        align: "left",
        label: "Company Name",
        field: "company_name",
        sortable: true,
      },
      {
        name: "jobtype",
        align: "left",
        label: "Job Type",
        field: "jobtype",
        sortable: true,
      },
      {
        name: "accounttype",
        align: "left",
        label: "Account Type",
        field: "accounttype",
        sortable: true,
      },
      {
        name: "action",
        align: "left",
        label: "Action",
        field: "action",
        sortable: true,
      },
    ]);

    const oscolumns = ref([
      {
        name: "companyname",
        align: "left",
        label: "Company name",
        field: "company_name",
        sortable: true,
      },
      {
        name: "contactPerson",
        align: "left",
        label: "Contact Person",
        field: "contact_person",
        sortable: true,
      },
      {
        name: "contact",
        align: "left",
        label: "Contact Number",
        field: "contact",
        sortable: true,
      },
    ]);

    const aioscolumns = ref([
      {
        name: "companyname",
        align: "left",
        label: "Company name",
        field: "company_name",
        sortable: true,
      },
      {
        name: "contactPerson",
        align: "left",
        label: "Contact Person",
        field: "contact_person",
        sortable: true,
      },
      {
        name: "email",
        align: "left",
        label: "Email",
        field: "email",
        sortable: true,
      },
    ]);

    const physmetColumns = ref([
      {
        name: "jobOrderNo",
        align: "left",
        label: "Job Order No.",
        field: "jobOrderNo",
        sortable: true,
      },
      {
        name: "preparedBy",
        align: "left",
        label: "Prepared By",
        field: "preparedBy",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: "status",
        sortable: true,
      },
    ]);

    onBeforeMount(async function () {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    // async function getAiosUser() {
    //   aiosUser.value = await getCustomerDataAllaios();
    // }

    // async function getTransactionDataAll() {
    //   const response = await getTransactionDataAllaios();
    // }

    async function fetchFromServer(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = qs.stringify(
        {
          $skip: startRow,
          $limit: count,
        },

        {
          encodeValuesOnly: true,
        }
      );

      const response = await getTransactionDataAllaios(query);
      // console.log("AIOS TRANSACTION RESPOSE", response);
      return response;
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'

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
      // console.log("aiosTransactions.value", returnedData);
      aiosTransactions.value = returnedData.data.map((r) => r);

      // don't forget to update local pagination object

      pagination.value.rowsNumber = returnedData.total;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;

      // ...and turn of loading indicator
      loading.value = false;
      length.value = returnedData.total;
      // }, 1500);
    }

    async function loadAlldata() {
      onRequest({
        pagination: pagination.value,
        filter: undefined,
      });
    }

    // Aios customer table

    async function aiosCustomerfetchFromServer(startRow, count) {
      const query = qs.stringify(
        {
          $skip: startRow,
          $limit: count,
        },

        {
          encodeValuesOnly: true,
        }
      );

      const response = await getCustomerDataAllaios(query);
      // console.log("AIOS CUSTOMER RESPONSE", response);
      return response;
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'

    async function aiosonRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      // setTimeout(() => {
      // update rowsCount with appropriate value
      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? aiospagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // fetch data from "server"
      const returnedData = await aiosCustomerfetchFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      );
      // clear out existing data and add new
      // customerInfoPromise.value = returnedData;
      aiosCustomer.value = returnedData.data.map((r) => r);
      // console.log(
      //   "RETURN AIOS Customer",
      //   returnedData.data.map((r) => r)
      // );

      // don't forget to update local pagination object

      aiospagination.value.rowsNumber = returnedData.total;
      aiospagination.value.page = page;
      aiospagination.value.rowsPerPage = rowsPerPage;
      aiospagination.value.sortBy = sortBy;
      aiospagination.value.descending = descending;

      // ...and turn of loading indicator
      loading.value = false;
      length.value = returnedData.total;
      // }, 1500);
    }

    async function asiosCustomerloadAlldata() {
      aiosonRequest({
        pagination: aiospagination.value,
        filter: undefined,
      });
    }

    // Onshop Customer Table

    // Aios customer table

    async function oneshopCustomerfetchFromServer(startRow, count) {
      const query = qs.stringify(
        {
          $skip: startRow,
          $limit: count,
        },

        {
          encodeValuesOnly: true,
        }
      );

      const response = await getQueryCustomerDataOneShopTable(query);
      return response;
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'

    async function oneshoponRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      // setTimeout(() => {
      // update rowsCount with appropriate value
      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? ospagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // fetch data from "server"
      const returnedData = await oneshopCustomerfetchFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      );
      // clear out existing data and add new
      // customerInfoPromise.value = returnedData;
      oneshopCustomer.value = returnedData.data.map((r) => r);
      // console.log(
      //   "RETURN One shop Customer",
      //   returnedData.data.map((r) => r)
      // );

      // don't forget to update local pagination object

      ospagination.value.rowsNumber = returnedData.total;
      ospagination.value.page = page;
      ospagination.value.rowsPerPage = rowsPerPage;
      ospagination.value.sortBy = sortBy;
      ospagination.value.descending = descending;

      // ...and turn of loading indicator
      loading.value = false;
      length.value = returnedData.total;

      // }, 1500);
    }

    async function oneshopCustomerloadAlldata() {
      oneshoponRequest({
        pagination: ospagination.value,
        filter: undefined,
      });
    }

    // Onshop Requests

    // Aios customer table

    async function oneshopRequestfetchFromServer(startRow, count, filter) {
      const query = {
        $sort: {},
        status: {},
        created_at: {},
        $skip: startRow,
        $limit: count,
      };

      if (filter) {
        query["$or"] = [
          { "customer.company": { $regex: filter } },
          { tsrNo: { $regex: filter } },
          // add more fields to search here
        ];
      }
      console.log("query", query);

      if (intexModel.value) {
        query["intExt.name"] = intexModel.value;
      }
      if (endDate.value && startDate.value) {
        query["created_at"] = {
          $lte: moment(endDate.value).format(),
          $gte: moment(startDate.value).format(),
        };
      }
      if (jobtypeModel.value) {
        query["jobtype"] = jobtypeModel.value;
        if (jobtypeModel.value === "Quoted") {
          query["jobtype"] = "For Quotation";
          query.$sort = {
            _dateCREATED: -1,
          };
          query.status = {
            $nin: ["New", "For customer approval", "Cancelled", "Deferred"],
          };

          // "status"[$nin] = [
          //   "New",
          //   "For customer approval",
          //   "Cancelled",
          //   "Deferred",
          // ];
          // ("$sort"["_dateCREATED"] = -1),
          // ("status"[$nin] = [
          //   "New",
          //   "For customer approval",
          //   "Cancelled",
          //   "Deferred",
          // ]);
        }
        if (jobtypeModel.value === "Quotation") {
          query["jobtype"] = "For Quotation";
          query.$sort = {
            _dateCREATED: -1,
          };
          query.status = {
            $in: ["New", "For customer approval", "Cancelled", "Deferred"],
          };
        }
      }
      // if (startDate.value) {
      //   query["created_at"] = {
      //     $gte: moment(startDate.value).format(),
      //   };
      // }
      // console.log("endDate.value",endDate.value)

      // if (intexModel.value) {
      //   query.intExt.name.$nme = intexModel.value;
      // }
      oneShopTransactions.value = await getALLOneShopRequestDataOneShop(
        qs.stringify(query)
      );
      // console.log("query", query, moment(endDate.value).format());
      return oneShopTransactions.value;
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'

    async function oneshoprequestonRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      // setTimeout(() => {
      // update rowsCount with appropriate value
      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? osrpagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // fetch data from "server"
      reOneshopReq.value = await oneshopRequestfetchFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      );
      // clear out existing data and add new
      // customerInfoPromise.value = returnedData;
      reOneshopReq.value = oneShopTransactions.value.data.map((r) => r);
      // console.log("reOneshopReq.value", reOneshopReq.value);

      // don't forget to update local pagination object
      osrpagination.value.rowsNumber = oneShopTransactions.value.total;
      osrpagination.value.page = page;
      osrpagination.value.rowsPerPage = rowsPerPage;
      osrpagination.value.sortBy = sortBy;
      osrpagination.value.descending = descending;

      // ...and turn of loading indicator
      loading.value = false;
      length.value = reOneshopReq.value.total;

      // }, 1500);
    }

    async function oneshopRequestsloadAlldata() {
      oneshoprequestonRequest({
        pagination: osrpagination.value,
        filter: undefined,
      });
    }

    // async function physmetonRequest() {}

    async function getCustomer() {
      customerExist.value = await getAllCustomerData();
      // customerExist.value = customerEx.data.data.map(async (element) => {
      //   const system = element.system;
      //   console.log("system", system);
      // });
      // console.log("customerExist.value", customerExist.value);
      // console.log("customerExist.value.data", customerExist.value.data);
      return customerExist.value;
    }

    async function viewTransaction(row) {
      console.log("row", row);
      tsrData.value = row;
      formattedTargeDate.value = moment(tsrData.value.targetDate).format("ll");
      formattedDateCreated.value = moment(tsrData.value._dateCREATED).format(
        "ll"
      );
      viewTransactionModal.value = true;

      totalRateBill.value = row.heatTreatment.map((t) => {
        return Number(t.htMachine.costKilo) * Number(t.htWeight);
      });
      // console.log("totalRateBill", totalRateBill.value);
    }

    // async function getStartEndDate() {
    //   const query = qs.stringify(
    //     {
    //       // $skip: startRow,
    //       // $limit: count,
    //       created_at: {
    //         $lte: endDate.value,
    //         $gte: startDate.value,
    //       },
    //       // "customer.intExt": "External"
    //       // created_at['$lte']: 1479664146607,
    //       // created_at['$gte']: 1479664146607
    //     },

    //     {
    //       encodeValuesOnly: true,
    //     }
    //   );
    //   console.log("query", query);
    //   dateFilter.value = await getALLOneShopRequestDataOneShop(query);
    //   console.log("response", dateFilter.value);
    //   return dateFilter.value;
    // }

    async function pjoisFromServer(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const config = {
        method: "get",
        url: "",
        headers: {
          Authorization:
            "Bearer " +
            `1a951bf72526c8dcf2abb2143458e612442d4814f1ddd9d6d2c58af3ead67d769c5115c63da7a633a1d8d6cfaaaa9fe4adfb62dafda09fc5cc083bea930035197c24f013c905ae5ca0884376fc0153cc419565f4209f27ae7c983fd340a6d963a371f5a1236f517ec038c633d0cad60754cefbb62247fe98b1d6bb1b40fc5f8a`,
        },
      };

      // if (selected.value.length === 0 && selected1.value.length === 0) {
      config.url = `http://10.10.120.32:1337/api/job-orders?filters[isDeleted][$eq]=false&pagination[start]=${startRow}&pagination[limit]=${count}&populate[samples][populate]=%2A&sort[0]=publishedAt%3Adesc&sort[1]=updatedAt%3Adesc`;
      // console.log(config.url);
      // } else {
      //   config.url = `http://10.10.120.32:1337/api/job-orders?filters[isDeleted][$eq]=false&pagination[start]=${startRow}&pagination[limit]=${count}&populate[samples][populate]=%2A&sort[0]=publishedAt%3Adesc&sort[1]=updatedAt%3Adesc${
      //     layoutPrint.value
      //       ? `&filters[customer][$contains]=${jobOrder.value.customer?.displayName}`
      //       : ""
      //   }`;
      // }

      if (filter) {
        config.url =
          config.url +
          `&filters[$or][0][customer][$contains]=${filter}&filters[$or][1][jobOrderNo][$contains]=${filter}`;
      }

      const response = await app.$axios(config);
      return response.data;
    }

    async function pjoisOnRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;
      const fetchCount =
        rowsPerPage === 0 ? pjoisReqPagination.value.rowsNumber : rowsPerPage;
      const startRow = (page - 1) * rowsPerPage;
      const returnedData = await pjoisFromServer(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending
      );

      rows.value = returnedData.data;
      pjoisReqPagination.value.rowsNumber = returnedData.meta.pagination.total;
      pjoisReqPagination.value.page = page;
      pjoisReqPagination.value.rowsPerPage = rowsPerPage;
      pjoisReqPagination.value.sortBy = sortBy;
      pjoisReqPagination.value.descending = descending;
      loading.value = false;
    }

    function pjoisLoadRequest(currentValue) {
      pjoisOnRequest({
        pagination: pjoisReqPagination.value,
        filter: undefined,
      });
    }

    onMounted(() => {
      pjoisLoadRequest();
      asiosCustomerloadAlldata();
      loadAlldata();
      oneshopCustomerloadAlldata();
      oneshopRequestsloadAlldata();
      getCustomer();

      axios
        .request({
          method: "get",
          baseURL: `http://10.10.120.32:1337/api/job-orders?filters[isDeleted][$eq]=false&pagination[start]=0&populate[samples][populate]=%2A&sort[0]=publishedAt%3Adesc&sort[1]=updatedAt%3Adesc`,
          headers: {
            Authorization:
              "Bearer" +
              "1a951bf72526c8dcf2abb2143458e612442d4814f1ddd9d6d2c58af3ead67d769c5115c63da7a633a1d8d6cfaaaa9fe4adfb62dafda09fc5cc083bea930035197c24f013c905ae5ca0884376fc0153cc419565f4209f27ae7c983fd340a6d963a371f5a1236f517ec038c633d0cad60754cefbb62247fe98b1d6bb1b40fc5f8a",
          },
        })
        .then((response) => {
          pjoisReq.value = response.data;
          // console.log("pjoisReq.value", pjoisReq.value);

          physmetReq.value = pjoisReq.value.data.map(function (val, idx, arr) {
            for (var i = 0; i < idx; i++) {
              if (arr[i].jobOrderNo === val.jobOrderNo) {
                return val;
              }
              // console.log("val.jobOrderNo", val.jobOrderNo);
            }
            // console.log("physmetReq.value", physmetReq.value);
            return val;
          });
          console.log("physmetReq.value", pjoisReq.value);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    return {
      pjoisReqPagination,
      pjoisLoadRequest,
      metaObj: ref(""),
      customerInfo,
      aiosCustomer,
      oneshopCustomer,
      aioscolumns,
      oscolumns,
      newCustomer: ref(false),
      duplicatedCustomer: ref(false),
      loading,
      asiosloading,
      filter: ref(""),
      rowCount,
      reviewuploadQuotation: false,
      rowsCustomer,
      industries,
      aiosTransactions,
      oneShopTransactions,
      length,
      lengthaios,
      aiosUser,
      pagination,
      aiospagination,
      ospagination,
      osrpagination,
      osrcolumns,
      onRequest,
      pjoisOnRequest,
      aiosonRequest,
      oneshoponRequest,
      oneshoprequestonRequest,
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },

      columns,
      rows,
      aiosrows,
      startDate,
      endDate,

      reOneshopReq,
      dateFilter,

      tab,

      intexModel,
      options,
      optionJobType,
      jobtypeModel,

      ulimsReq,

      tsrData,
      formattedTargeDate,
      formattedDateCreated,

      oneshopRequestsloadAlldata,
      getCustomer,
      customerExist,
      // getStartEndDate,

      physmetReq,
      pjoisReq,
      physmetColumns,

      viewTransaction,
      viewTransactionModal,
      maximizedToggle: ref(true),
      tabs: ref("details"),
      dense: ref(false),
      text: ref(""),
      num: ref(0),
      textForRate,
      totalRateBill,

      showLoading() {
        $q.loading.show({
          message: "Syncing Customer's Infomation. Please wait...",
        });
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 3000);
      },
    };
  },
};
</script>

<template>
  <div class="q-pa-md bg-grey-2">
    <q-breadcrumbs class="q-mb-lg">
      <q-breadcrumbs-el
        class="text-primary"
        label="Homepage"
        icon="home"
        to="/MainLayout/Home"
      />
      <q-breadcrumbs-el label="Transactions Page" icon="sort" />
    </q-breadcrumbs>
    <div class="col-12">
      <!-- <q-expansion-item
        class="shadow-1 overflow-hidden"
        style="
          font-size: 3rem;
          line-height: 3.125rem;
          letter-spacing: normal;
          margin-bottom: 20px;
        "
        icon="perm_identity"
        label="CUSTOMERS DATA TABLE"
        header-class="bg-secondary text-white"
        expand-icon-class="text-white"
      >
        <q-card>
          <q-card-section>
            <div class="q-pa-sm col-12 col-md-4">
              <q-table
                v-model:pagination="pagination"
                :loading="loading"
                :filter="filter"
                @request="onRequest"
                binary-state-sort
                hide-header
                hide-bottom
              >
                <template v-slot:top>
                  <div
                    class="text-secondary text-weight-bolder shadow-1 col q-ma-md"
                  >
                    <label class="text-h4 q-ma-md">ULIMS CUSTOMER</label>
                  </div>
                </template>

                <br />
                <br />
                <! <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="item_name" :props="props">
                {{ props.row.item_name }}
              </q-td>

              <q-td key="contactNo" :props="props">
                {{ props.row.job_type }}
              </q-td>
            </q-tr>
          </template> -->
      <!-- </q-table> -->
      <!-- </div> -->
      <!-- </q-card-section> -->
      <!-- </q-card> -->
      <!-- <q-card class="q-mt-lg">
          <q-card-section>
            <div class="q-pa-sm col-12 col-md-4">
              <q-table
                :rows="oneshopCustomer"
                :columns="oscolumns"
                row-key="id"
                v-model:pagination="ospagination"
                :loading="loading"
                :filter="filter"
                @request="oneshoponRequest"
                binary-state-sort
              >
                <template v-slot:top>
                  <div
                    class="text-secondary text-weight-bolder shadow-1 col q-ma-md"
                  >
                    <label class="text-h4 q-ma-md">ONE SHOP CUSTOMER</label>
                  </div>
                </template>
                <br />
                <br />
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="companyname" :props="props">
                      {{ props.row.company }}
                    </q-td>

                    <q-td key="contactPerson" :props="props">
                      {{ props.row.contact }}
                    </q-td>

                    <q-td key="contact" :props="props">
                      {{ props.row.telno }}
                    </q-td>
                  </q-tr>
                  <<pre>{{ props }}</pre> -->
      <!-- </template> -->
      <!-- </q-table> -->
      <!-- </div>
          </q-card-section>
        </q-card> -->
      <!-- <q-card class="q-mt-lg">
          <q-card-section>
            <div class="q-pa-sm col-12 col-md-4">
              <q-table
                :rows="aiosCustomer"
                :columns="aioscolumns"
                row-key="id"
                v-model:pagination="aiospagination"
                :loading="loading"
                :filter="filter"
                @request="aiosonRequest"
                binary-state-sort
              >
                <template v-slot:top>
                  <div
                    class="text-secondary text-weight-bolder shadow-1 col q-ma-md"
                  >
                    <label class="text-h4 q-ma-md">AIOS CUSTOMER</label>
                  </div>
                </template>

                <br />
                <br />
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="companyname" :props="props">
                      {{ props.row.company_name }}
                    </q-td>

                    <q-td key="contactPerson" :props="props">
                      {{ props.row.first_name }}
                      <span>{{ props.row.last_name }}</span>
                    </q-td>

                    <q-td key="email" :props="props">
                      {{ props.row.email }}
                    </q-td>
                  </q-tr>
                  < <pre>{{ props }}</pre> -->
      <!-- </template>
              </q-table>
            </div>
          </q-card-section>
        </q-card> -->
      <!-- </q-expansion-item> -->

      <!-- <q-expansion-item
        class="shadow-1 overflow-hidden"
        style="font-size: 3rem; line-height: 3.125rem; letter-spacing: normal"
        icon="perm_identity"
        label="TRANSACTIONS TABLE"
        header-class="bg-secondary text-white"
        expand-icon-class="text-white" -->
      <!-- <pre>{{ rowsCustomer }}</pre> -->
      <q-dialog
        v-model="viewTransactionModal"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="bg-primary text-white">
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
            <q-card-section>
              <!-- <q-table hide-pagination hide-bottom grid>
                <template v-slot:title-header>
                  <div class="q-pt-lg">
                    <h4 class="q-mb-md text-black">Transaction Details</h4>
                  </div>
                </template>
              </q-table> -->
              <div class="q-ma-lg">
                <div class="row">
                  <div
                    class="col-xs-12 col-sm-6 col-md-12 q-mb-md text-black text-center"
                  >
                    <div v-if="tsrData._tsrNo">
                      <strong>{{ tsrData._tsrNo }}</strong>
                    </div>
                    <div v-else>
                      <strong>{{ tsrData.tsrNo }}</strong>
                    </div>
                    <div v-if="tsrData.company">
                      <strong>{{ tsrData.company }}</strong>
                    </div>
                    <div v-else>
                      <strong>{{ tsrData.customer.company }}</strong>
                    </div>
                    <div v-if="tsrData.customer.address">
                      {{ tsrData.customer.address }}
                    </div>
                    <div v-else>
                      {{
                        tsrData.customer.brgy +
                        ", " +
                        tsrData.customer.citymun +
                        ", " +
                        tsrData.customer.province
                      }}
                    </div>
                    <div>{{ tsrData.customer.contact }}</div>
                    <div>{{ tsrData.customer.telno }}</div>
                  </div>
                </div>
                <q-card class="q-pa-md">
                  <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-12 q-mb-md">
                      <div class="text-black text-h5 text-weight-medium">
                        Transaction Details
                      </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3">
                      <q-input
                        v-model="text"
                        hint="Service"
                        :dense="dense"
                        readonly
                        class="q-mr-lg"
                        :label="tsrData.service.name"
                        label-color="black"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3">
                      <q-input
                        v-model="text"
                        hint="Job Type"
                        :dense="dense"
                        readonly
                        class="q-mr-lg"
                        :label="tsrData.jobtype"
                        label-color="black"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3">
                      <q-input
                        v-if="tsrData.date"
                        v-model="text"
                        hint="Date Created"
                        :dense="dense"
                        readonly
                        class="q-mr-lg"
                        :label="tsrData.date"
                        label-color="black"
                      />
                      <q-input
                        v-else
                        v-model="text"
                        hint="Date Created"
                        :dense="dense"
                        readonly
                        class="q-mr-lg"
                        :label="formattedDateCreated"
                        label-color="black"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3">
                      <q-input
                        v-model="text"
                        hint="Target Completion Date"
                        :dense="dense"
                        readonly
                        class="q-mr-lg"
                        :label="formattedTargeDate"
                        label-color="black"
                      />
                    </div>
                  </div>
                  <div>
                    <q-separator color="black" class="q-mt-lg q-mb-lg" />
                  </div>
                  <div>
                    <div class="row">
                      <div class="col-xs-12 col-sm-6 col-md-12">
                        <div class="text-black text-subtitle2">Items</div>
                      </div>
                    </div>

                    <div
                      class="row"
                      v-for="(item, index) in tsrData.items"
                      :key="item"
                      :index="index"
                    >
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="(index + 1).toString()"
                          hint="Item #"
                          label-color="black"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          hint="Item"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="item.item"
                          label-color="black"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          hint="Specification"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="item.spec"
                          label-color="black"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          hint="Material"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="item.material"
                          label-color="black"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          hint="Quantity"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="item.qty.toString()"
                          label-color="black"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          hint="Unit"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="item.unit"
                          label-color="black"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <q-separator color="black" class="q-mt-lg q-mb-lg" />
                  </div>
                  <div>
                    <div class="row">
                      <div class="col-xs-12 col-sm-6 col-md-12">
                        <div class="text-black text-subtitle2">
                          Job Requirements
                        </div>
                      </div>
                    </div>
                    <div
                      class="row"
                      v-for="(item, index) in tsrData.items"
                      :key="item"
                      :index="index"
                    >
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="(index + 1).toString()"
                          hint="Item"
                          label-color="black"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          hint="Item Description"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="item.item"
                          label-color="black"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          hint="Quantity"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="item.qty.toString()"
                          label-color="black"
                        />
                      </div>
                      <div
                        v-for="(op, idx) in item.operationAndMachines"
                        :key="op"
                        :index="idx"
                        class="col-xs-12 col-sm-6 col-md-2"
                      >
                        <q-input
                          v-model="text"
                          hint="Operation"
                          :dense="dense"
                          readonly
                          class="q-mr-lg"
                          :label="op.operation"
                          label-color="black"
                        />
                      </div>
                      <div v-if="item.operationAndMachines.machine">
                        <div
                          v-for="(mach, idx) in item.operationAndMachines
                            .machine"
                          :key="mach"
                          :index="idx"
                          class="col-xs-12 col-sm-6 col-md-2"
                        >
                          <q-input
                            v-model="text"
                            hint="Machine"
                            :dense="dense"
                            readonly
                            class="q-mr-lg"
                            :label="mach.MachineName"
                            label-color="black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="tsrData.customer.intExt === 'External'">
                    <q-separator color="black" class="q-mt-lg q-mb-lg" />
                  </div>
                  <div v-if="tsrData.customer.intExt === 'External'">
                    <div class="row">
                      <div class="col-xs-12 col-sm-6 col-md-12">
                        <div class="text-black text-subtitle2">
                          Rates/Billing
                        </div>
                      </div>
                    </div>
                    <div
                      class="row"
                      v-for="(heatTreat, idx) in tsrData.heatTreatment"
                      :key="heatTreat"
                      :index="idx"
                    >
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="heatTreat.htMachine.machineName"
                          label-color="black"
                          hint="Machine"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="heatTreat.htMachine.unit"
                          label-color="black"
                          hint="Unit"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="heatTreat.htMachine.costKilo"
                          label-color="black"
                          hint="Unit Price"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="heatTreat.htWeight.toString()"
                          label-color="black"
                          hint="Weight"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="totalRateBill[idx].toString()"
                          label-color="black"
                          hint="Total"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12 col-sm-6 col-md-10 q-mt-md">
                        <div class="text-black text-subtitle">Remarks:</div>
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-2 q-mt-md">
                        <div class="text-black text-subtitle">
                          <strong
                            >Total Bill:
                            {{
                              totalRateBill
                                .reduce((acc, curr) => acc + curr, 0)
                                .toFixed(2)
                            }}</strong
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <q-separator color="black" class="q-mt-lg q-mb-lg" />
                  </div>
                  <div>
                    <div class="row">
                      <div class="col-xs-12 col-sm-6 col-md-12">
                        <div class="text-black text-subtitle2">Signatory</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="tsrData.tss"
                          label-color="black"
                          hint="Prepared by"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="tsrData.reviewName.Name"
                          label-color="black"
                          hint="Reviewed by"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input
                          v-model="text"
                          :dense="dense"
                          readonly
                          :label="tsrData.approveName.Name"
                          label-color="black"
                          hint="Approved by"
                        />
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </q-card-section>
          </q-card>
        </q-card>
      </q-dialog>
      <div v-if="tab === 'oneshop'" class="q-pb-md">
        <q-btn
          icon="filter_list"
          color="primary"
          unelevated
          no-caps
          label="Filter"
        >
          <q-menu>
            <q-list class="q-pa-md" style="min-width: 400px">
              <q-item-label header>Filter</q-item-label>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="intexModel"
                    @update:model-value="oneshopRequestsloadAlldata()"
                    :options="options"
                    label="Internal/External"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="jobtypeModel"
                    @update:model-value="oneshopRequestsloadAlldata()"
                    :options="optionJobType"
                    label="JobType"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="startDate"
                    mask="date"
                    :rules="['date']"
                    label="From"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="startDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="endDate"
                    mask="date"
                    :rules="['date']"
                    label="To"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="endDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn
                    @click="oneshopRequestsloadAlldata()"
                    color="primary"
                    label="filter"
                  ></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <div v-if="tab === 'ulims'" class="q-pb-md">
        <q-btn
          icon="filter_list"
          color="primary"
          unelevated
          no-caps
          label="Filter"
        >
          <q-menu>
            <q-list class="q-pa-md" style="min-width: 400px">
              <q-item-label header>Filter</q-item-label>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="intexModel"
                    :options="options"
                    label="Internal/External"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="jobtypeModel"
                    :options="optionJobType"
                    label="JobType"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="startDate"
                    mask="date"
                    :rules="['date']"
                    label="From"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="startDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="endDate"
                    mask="date"
                    :rules="['date']"
                    label="To"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="endDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn color="primary" label="filter"></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div v-if="tab === 'aios'" class="q-pb-md">
        <q-btn
          icon="filter_list"
          color="primary"
          unelevated
          no-caps
          label="Filter"
        >
          <q-menu>
            <q-list class="q-pa-md" style="min-width: 400px">
              <q-item-label header>Filter</q-item-label>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="intexModel"
                    :options="options"
                    label="Internal/External"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="jobtypeModel"
                    :options="optionJobType"
                    label="JobType"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="startDate"
                    mask="date"
                    :rules="['date']"
                    label="From"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="startDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="endDate"
                    mask="date"
                    :rules="['date']"
                    label="To"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="endDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn color="primary" label="filter"></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div v-if="tab === 'pjois'" class="q-pb-md">
        <q-btn
          icon="filter_list"
          color="primary"
          unelevated
          no-caps
          label="Filter"
        >
          <q-menu>
            <q-list class="q-pa-md" style="min-width: 400px">
              <q-item-label header>Filter</q-item-label>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="intexModel"
                    :options="options"
                    label="Internal/External"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="jobtypeModel"
                    :options="optionJobType"
                    label="JobType"
                    clearable
                    map-options
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="startDate"
                    mask="date"
                    :rules="['date']"
                    label="From"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="startDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    filled
                    v-model="endDate"
                    mask="date"
                    :rules="['date']"
                    label="To"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="endDate">
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn color="primary" label="filter"></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="bg-primary shadow-2"
          active-color="white"
          indicator-color="black"
          align="justify"
          narrow-indicator
        >
          <q-tab name="ulims" label="ULIMS" />
          <q-tab name="oneshop" label="OneShop" />
          <q-tab name="aios" label="AIOS" />
          <q-tab name="pjois" label="PJOIS" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="ulims">
            <div class="q-pa-sm col-12 col-md-4">
              <q-bar class="bg-primary text-white">
                <div class="col text-left text-weight-bold">
                  ULIMS TRANSACTION LIST
                </div>
              </q-bar>
              <q-table
                :loading="loading"
                :filter="filter"
                @request="onRequest"
                binary-state-sort
              >
                <template v-slot:top> </template>

                <br />
                <br />
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="item_name" :props="props">
                      {{ props.row.item_name }}
                    </q-td>

                    <q-td key="contactNo" :props="props">
                      {{ props.row.job_type }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <q-tab-panel name="oneshop">
            <div class="q-pa-sm col-12 col-md-4">
              <q-bar class="bg-primary text-white">
                <div class="col text-left text-weight-bold">
                  ONESHOP TRANSACTION LIST
                </div>
              </q-bar>
              <q-table
                :rows="reOneshopReq"
                :columns="osrcolumns"
                row-key="id"
                v-model:pagination="osrpagination"
                :loading="loading"
                @request="oneshoprequestonRequest"
                binary-state-sort
                :filter="filter"
              >
                <template v-slot:top-right>
                  <q-input
                    borderless
                    dense
                    filled
                    debounce="300"
                    v-model="filter"
                    placeholder="Search"
                  >
                    <template v-slot:append
                      ><q-icon name="mdi-magnify"
                    /></template>
                  </q-input>
                </template>

                <br />
                <br />
                <template v-slot:body="props">
                  <!-- <pre>{{ props.row }}</pre> -->
                  <q-tr :props="props">
                    <q-td key="tsrNo" :props="props">
                      {{ props.row.tsrNo }}
                    </q-td>
                    <q-td key="company_name" :props="props">
                      {{ props.row.customer.company }}
                      <!-- <div
                          class="column"
                          v-for="(item, index) in props.row.items"
                          :key="item.value"
                        >
                          <span
                            ><strong>{{ index + 1 }}</strong
                            >. {{ item.item }}</span
                          >
                        </div> -->
                    </q-td>
                    <q-td key="jobtype" :props="props">
                      {{ props.row.jobtype }}
                    </q-td>
                    <q-td key="accounttype" :props="props">
                      {{ props.row.intExt.name }}
                    </q-td>
                    <q-td key="action" :props="props">
                      <q-btn
                        color="primary"
                        v-for="size in ['sm']"
                        :key="size"
                        :size="size"
                        icon="remove_red_eye"
                        flat
                        class="q-pa-md"
                        @click="viewTransaction(props.row)"
                        dense
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <q-tab-panel name="aios">
            <div class="q-pa-sm col-12 col-md-4">
              <q-bar class="bg-primary text-white">
                <div class="col text-left text-weight-bold">
                  AIOS TRANSACTION LIST
                </div>
              </q-bar>
              <q-table
                :rows="aiosTransactions"
                :columns="columns"
                row-key="id"
                v-model:pagination="pagination"
                :loading="loading"
                :filter="filter"
                @request="onRequest"
                binary-state-sort
              >
                <template v-slot:top-right> </template>

                <br />
                <br />
                <template v-slot:body="props">
                  <!-- <pre>{{ props.row }}</pre> -->
                  <q-tr>
                    <q-td key="tsrNo" :props="props">
                      {{ props.row.id }}
                      <!-- <div
                          class="column"
                          v-for="(item, index) in props.row.items"
                          :key="item.value"
                        >
                          <span
                            ><strong>{{ index + 1 }}</strong
                            >. {{ item.item_name }}</span
                          >
                        </div> -->
                    </q-td>
                    <q-td key="company_name">
                      {{ props.row.requester.company_name }}
                    </q-td>
                    <q-td key="Job_type" :props="props">
                      {{ props.row.job_type }}
                    </q-td>
                    <q-td key="account_type" :props="props">
                      {{ props.row.requester.account_type }}
                    </q-td>
                  </q-tr>
                  <!-- <pre>{{ props }}</pre> -->
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <q-tab-panel name="pjois">
            <div class="q-pa-sm col-12 col-md-4">
              <q-bar class="bg-primary text-white">
                <div class="col text-left text-weight-bold">
                  PJOIS TRANSACTION LIST
                </div>
              </q-bar>
              <q-table
                flat
                class="my-sticky-column-table"
                :rows="rows"
                :columns="physmetColumns"
                v-model:pagination="pjoisReqPagination"
                :loading="loading"
                :filter="filter"
                @request="pjoisOnRequest"
                binary-state-sort
                row-key="id"
              >
                <!-- <template v-slot:top> </template> -->
                <template v-slot:top-right>
                  <q-input
                    borderless
                    dense
                    filled
                    debounce="300"
                    v-model="filter"
                    placeholder="Search"
                  >
                    <template v-slot:append
                      ><q-icon name="mdi-magnify"
                    /></template>
                  </q-input>
                </template>

                <br />
                <br />
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="jobOrderNo" :props="props">
                      {{ props.row.jobOrderNo }}
                    </q-td>

                    <q-td key="preparedBy" :props="props">
                      {{ props.row.preparedBy }}
                    </q-td>
                    <q-td key="status" :props="props">
                      {{ props.row.status }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <!-- </q-expansion-item> -->
    </div>
    <!-- Customer -->
    <!-- <div align="center" class="text-secondary text-weight-bolder shadow">
      <h3>CUSTOMERS DATA TABLE</h3>
    </div> -->

    <!-- <br /> -->
    <!-- <div class="row justify-center"></div> -->
    <!-- Next -->
    <!-- <div align="center" class="text-secondary text-weight-bolder shadow">
      <h3>TRANSACTIONS TABLE</h3>
    </div> -->

    <!-- <br /> -->
    <!-- <div class="row justify-center">
      <!- <div class="q-pa-sm col-12 col-md-4">
        <q-table
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
          hide-header
          hide-bottom
        >
          <template v-slot:top>
            <div
              class="text-secondary text-weight-bolder shadow-1 col q-ma-md text-center"
            >
              <label class="text-h4 q-ma-md">ULIMS TRANSACTION</label>
            </div>
          </template>

          <br />
          <br />
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="item_name" :props="props">
                {{ props.row.item_name }}
              </q-td>

              <q-td key="contactNo" :props="props">
                {{ props.row.job_type }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div> -->

    <!-- Oneshop transaction -->

    <!-- <div class="q-pa-sm col-12 col-md-4">
        <q-table
          :rows="oneShopTransactions"
          :columns="osrcolumns"
          row-key="id"
          v-model:pagination="osrpagination"
          :loading="loading"
          :filter="filter"
          @request="oneshoprequestonRequest"
          binary-state-sort
        >
          <template v-slot:top>
            <div
              class="text-secondary text-weight-bolder shadow-1 col q-ma-md text-center"
            >
              <label class="text-h4 q-ma-md">ONE SHOP TRANSACTION</label>
            </div>
          </template>

          <br />
          <br />
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="item_name" :props="props">
                {{ props.row.customer.company }}
              </q-td>
              <q-td key="jobtype" :props="props">
                {{ props.row.jobtype }}
              </q-td>
              <q-td key="accounttype" :props="props">
                {{ props.row.intExt.name }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div> -->

    <!-- AIOS TRANSACTIONS -->

    <!-- <div class="q-pa-sm col-12 col-md-4">
        <q-table
          :rows="aiosTransactions"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:top>
            <div
              class="text-secondary text-weight-bolder shadow-1 col q-ma-md text-center"
            >
              <label class="text-h4 q-ma-md">AIOS TRANSACTION</label>
            </div>
          </template>

          <br />
          <br />
          <template v-slot:body="props">
            <pre>{{ props.row }}</pre>
            <q-tr>
              <q-td>
                <div
                  class="column"
                  v-for="(item, index) in props.row.items"
                  :key="item.value"
                >
                  <span
                    ><strong>{{ index + 1 }}</strong
                    >. {{ item.item_name }}</span
                  >
                </div>
              </q-td>

              <q-td key="Job_type" :props="props">
                {{ props.row.job_type }}
              </q-td>
              <q-td key="account_type" :props="props">
                {{ props.row.requester.account_type }}
              </q-td>
            </q-tr>
            <pre>{{ props }}</pre>
          </template>
        </q-table>
      </div> -->
    <!-- next -->
    <!-- </div> -->
  </div>
</template>
