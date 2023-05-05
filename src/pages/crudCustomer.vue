<script>
import {
  ref,
  onBeforeMount,
  onMounted,
  computed,
  nextTick,
  getCurrentInstance,
  watch,
} from "vue";
// import AddCustomer from "src/components/addCustomer.vue";
import CustomerData from "src/components/CustomerData.vue";
import syncCustomerData from "src/components/syncCustomerData.vue";
import { useQuasar, QInput, QSelect } from "quasar";
import {
  getAllCustomerData,
  searchAllData,
  getALLOneShopRequestDataOneShop,
} from "src/provider.js";
import moment from "moment";
import exportFromJSON from "export-from-json";
import axios from "axios";

export default {
  components: {
    // AddCustomer,
    CustomerData,
    syncCustomerData,
    QInput,
    QSelect,
  },
  setup() {
    const completedOrders = ref([]);
    const app = getCurrentInstance().appContext.config.globalProperties;
    const statusOptions = ref(["To receive", "For action"]);

    const typeOfSystemOptions = ref(["OneShop", "PJOIS", "AIOS", "ULIMS"]);
    const typeOfSystem = ref(null);

    const accountTypeOptions = ref(["Internal", "External", "Student"]);
    const accountTypeModel = ref(null);

    const oldNewOptions = ref(["New", "Returning", "Old"]);
    const oldNewModel = ref(null);

    const recordOptions = ref(["with 2019 record"]);
    const recordModel = ref(null);
    const hasRecordsFrom2019 = ref([]);
    const customerIds = ref([]);
    const hasRecord = ref(null);
    const hasRec = ref(null);

    const sectorCovOptions = ref([]);
    const monthOptions = ref([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]);
    const monthModel = ref("");
    const sectorCovModel = ref(null);

    const startDate = ref("");
    const endDate = ref("");

    const qs = require("qs");
    const loading = ref(false);

    const length = ref("");
    const lengthaios = ref("");

    const paginationStart = ref(null);
    const paginationLimit = ref(null);

    const aiosUser = ref([]);
    const strapiApiCustomer = ref([]);

    const customerInfo = ref([]);
    const customerInfoPromise = ref([]);

    const searchModel = ref(null);
    const searchQuery = ref("");

    const industries = ref([]);
    const rowCount = ref(10);
    const $q = useQuasar();
    let timer;
    const rows = ref([]);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    });

    const rowsCustomer = ref([]);
    const originalRows = ref([]);

    const oneShopReq = ref([]);
    const osRequest = ref([]);

    // const selectedDate = ref(null);
    // const dateOptions = ref([]);
    // const dateOptionss = ref([]);
    // const selectedMonth = ref(null);
    // const selectedYear = ref(null);

    const columns = ref([
      {
        name: "displayName",
        align: "left",
        label: "Company Name",
        field: (row) => row.name,
        format: (val) => `${val}`,
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
        name: "email",
        align: "left",
        label: "Email",
        field: "email",
        sortable: true,
      },
      {
        name: "system",
        align: "left",
        label: "System",
        field: "system",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Actions",
        field: "action",
      },
    ]);

    // const columnTrans = ref([
    //    {
    //     name: "displayName",
    //     align: "center",
    //     label: "Company Name",
    //     field: (row) => row.name,
    //     format: (val) => `${val}`,
    //     sortable: true,
    //   },
    //   {
    //     name: "contactNo",
    //     align: "center",
    //     label: "Contact Number",
    //     field: "contactNo",
    //     sortable: true,
    //   },
    //   {
    //     name: "email",
    //     align: "center",
    //     label: "Email",
    //     field: "email",
    //     sortable: true,
    //   },
    //   {
    //     name: "action",
    //     align: "center",
    //     label: "Actions",
    //     field: "action",
    //   },
    // ])

    onBeforeMount(async function () {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    // function getMonthTimestamps(year, month) {
    //   const startDate = new Date(year, month, 1);
    //   const endDate = new Date(year, month + 1, 0);
    //   const startTimestamp = Math.floor(startDate.getTime());
    //   const endTimestamp = Math.floor(endDate.getTime()) + 86399; // add 23 hours, 59 minutes, 59 seconds to get end of day timestamp
    //   return { startTimestamp, endTimestamp };
    // }

    // const year = ref(2022);
    // const month = ref(0); // January
    // const { startTimestamp, endTimestamp } = getMonthTimestamps(
    //   year.value,
    //   month.value
    // );
    // console.log("test", startTimestamp, endTimestamp);

    async function fetchFromServer(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {
          $or: {},
          industries: {},
          types: {},
        },
        populate: ["industries", "types", "current_year_tsrs"],
        pagination: {
          start: startRow,
          limit: count,
          sort: {
            id: -1,
          },
        },
      };

      if (searchModel.value) {
        // console.log("searchModel", searchModel.value);
        query.filters.$or[0] = {
          displayName: {
            $contains: searchModel.value,
          },
        };
        query.filters.$or[1] = {
          email: {
            $contains: searchModel.value,
          },
        };
      } else {
        // console.log("Filter None");
      }

      if (typeOfSystem.value) {
        query.filters.system = {
          $eq: typeOfSystem.value,
        };
      }

      if (accountTypeModel.value) {
        query.filters.types = {
          label: {
            $eq: accountTypeModel.value,
          },
        };
      }

      // if (oldNewModel.value === "Returning") {
      //   query.filters.returning = {
      //     $eq: true,
      //   };
      // }

      // if (oldNewModel.value === "New") {
      //   query.filters.new = {
      //     $eq: true,
      //   };
      // }

      // if (oldNewModel.value === "Old") {
      //   query.filters.old = {
      //     $eq: true,
      //   };
      // }
      // console.log("sectorCovMode", sectorCovModel.value);

      if (sectorCovModel.value) {
        query.filters.industries.label = {
          $eq: sectorCovModel.value.label,
        };
      }

      if (startDate.value && endDate.value) {
        query.filters.dateCreated = {
          $gte: moment(startDate.value).format(),
          $lte: moment(endDate.value).format(),
        };
      }

      if (recordModel.value) {
        query.filters.hasRecordFrom2019 = {
          $eq: true,
        };
      }

      if (monthModel.value) {
        query.filters.current_year_tsrs = {
          dateCompleted: {
            $contains: monthModel.value,
          },
        };
      }
      // console.log("has", hasRec.value);
      // console.log("hasRecordsFrom2019", hasRecordsFrom2019);
      // console.log("query", query);

      // if (filter) {
      //   query.$search = filter;
      // }

      const response = await getAllCustomerData(qs.stringify(query));
      customerIds.value = response.data.data.map((o) => ({
        id: o.attributes.customer_id,
      }));
      // customerIds.value.forEach((customer) => {
      //   hasRecord.value = hasRecordsFrom2019.value.some(
      //     (record) => record.id === customer.id
      //   );
      //   console.log("hasRecord", hasRecord.value);
      //   // const customerIndex = oneShopCustomer.value.data.findIndex(
      //   //   (c) => c.attributes.customer_id === customer.id
      //   // );
      //   // if (customerIndex >= 0) {
      //   //   oneShopCustomer.value.data[customerIndex].hasRecordsFrom2019 =
      //   //     hasRecord;
      //   // }
      // });
      console.log("customerIds.value", customerIds.value);
      // console.log("response", response.data);
      return response.data;
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
      rowsCustomer.value = returnedData.data.map((r) => r);

      // don't forget to update local pagination object

      pagination.value.rowsNumber = returnedData.meta.pagination.total;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
      // console.log("rowsPerPage", sortBy);

      // ...and turn of loading indicator
      loading.value = false;
      length.value = returnedData.meta.pagination.total;
      // }, 1500);
    }

    async function loadAlldata() {
      await nextTick();
      onRequest({
        pagination: pagination.value,
        filter: undefined,
      });
      // console.log("accountTypeModel", accountTypeModel.value);
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

    async function loadIndustries() {
      const config = {
        method: "get",
        url: "http://10.10.120.19:1336/industry-limitless",
      };

      const response = await app.$axios(config);
      sectorCovOptions.value = response.data.data.map((o) => ({
        id: o.id,
        label: o.label,
      }));
      // console.log("sectorCovOptions.value", sectorCovOptions.value);
    }

    async function loadHasRecord() {
      try {
        const response = await axios.get(
          "http://10.10.120.32:3030/requests?statuss.action=Completed&_dateCOMPLETED[$regex]=2019&$limit=1000"
        );
        hasRecordsFrom2019.value = response.data.data.map((h) => ({
          id: h.customer._id,
        }));
        // console.log("hasRecordsFrom2019", hasRecordsFrom2019.value);
      } catch (error) {
        console.error(error);
      }
    }

    watch([hasRecordsFrom2019, customerIds], () => {
      hasRec.value = customerIds.value.map((customer) => {
        const hasRecord = hasRecordsFrom2019.value.some(
          (record) => record.id === customer.id
        );
        return {
          hasRecord: hasRecord,
        };
      });
      // console.log("hasRec.value", hasRec.value);
    });

    onMounted(() => {
      // const currentYear = 2019;
      // const futureYears = 5; // 2019 to 2023 is 5 years
      // const months = [
      //   { label: "January", value: 1 },
      //   { label: "February", value: 2 },
      //   { label: "March", value: 3 },
      //   { label: "April", value: 4 },
      //   { label: "May", value: 5 },
      //   { label: "June", value: 6 },
      //   { label: "July", value: 7 },
      //   { label: "August", value: 8 },
      //   { label: "September", value: 9 },
      //   { label: "October", value: 10 },
      //   { label: "November", value: 11 },
      //   { label: "December", value: 12 },
      // ];
      // const year = [
      //   { label: "2019", value: 2019 },
      //   { label: "2020", value: 2020 },
      //   { label: "2021", value: 2021 },
      //   { label: "2022", value: 2022 },
      //   { label: "2023", value: 2023 },
      // ];
      // // for (let i = 0; i < futureYears; i++) {
      // //   const year = currentYear + i;
      // dateOptions.value = [
      //   ...dateOptions.value,
      //   ...months.map(({ label, value }) => ({
      //     label: `${label}`,
      //     value,
      //     year,
      //     timestamp: new Date(year, value - 1).getTime(),
      //   })),
      // ];
      // console.log("dateOptions.value", dateOptions.value);

      // dateOptionss.value = [
      //   ...dateOptionss.value,
      //   ...year.map(({ label, value }) => ({
      //     label: `${label}`,
      //     value,
      //     year,
      //     timestamp: new Date(year, value - 1).getTime(),
      //   })),
      //   // console.log("dateOptions.value", dateOptions.value.timestamp),
      // ];
      // // }
      // console.log("dateOptionss.value", dateOptionss.value);
      loadIndustries();
      loadAlldata();
      searchData();
      loadHasRecord();
      // getOneShopCompletedOrders();
    });

    return {
      completedOrders,
      // getOneShopCompletedOrders,
      hasRec,
      loadHasRecord,
      recordOptions,
      recordModel,
      loadIndustries,
      metaObj: ref(""),
      customerInfo,
      newCustomer: ref(false),
      duplicatedCustomer: ref(false),
      loading,
      filter: ref(""),
      rowCount,
      reviewuploadQuotation: false,
      rowsCustomer,
      industries,
      length,
      lengthaios,
      aiosUser,
      pagination,
      onRequest,
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },

      columns,
      rows,
      searchModel,
      loadAlldata,
      statusOptions,
      typeOfSystemOptions,
      typeOfSystem,
      accountTypeOptions,
      accountTypeModel,
      oldNewOptions,
      oldNewModel,
      startDate,
      endDate,
      sectorCovOptions,
      sectorCovModel,
      osRequest,
      oneShopReq,
      hasRecordsFrom2019,
      customerIds,
      hasRecord,
      monthOptions,
      monthModel,
      // selectedDate,
      // dateOptions,
      // dateOptionss,
      // getMonthTimestamps,
      // year,
      // month,
      // selectedMonth,
      // selectedYear,

      showLoading() {
        $q.loading.show({
          message: "Syncing Customer's Infomation. Please wait...",
        });
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 3000);
      },

      filterSearch() {
        return searchQuery.value.filter((entry) =>
          searchQuery.value.length
            ? Object.keys(searchQuery.value[0]).some((key) =>
                ("" + entry[key]).toLowerCase().includes(searchModel.value)
              )
            : true
        );
      },
      exportFile() {
        // console.log("rows", rowsCustomer.value);
        const rows = rowsCustomer.value.map((row, index) => {
          let checkRecordsFrom2019 = "no record for 2019";
          let checkReturning = "";
          let checkNew = "";
          let checkRN = "";
          let checkOld = "";
          const hasRecord = hasRec.value[index].hasRecord;
          if (hasRecord === true) {
            checkRecordsFrom2019 = "with 2019 record";
          }
          if (row.attributes.returning === true) {
            checkReturning = "RETURNING";
          }
          if (row.attributes.new === true) {
            checkNew = "NEW";
          }

          if (row.attributes.old === true) {
            checkOld = "OLD";
          }

          if (
            row.attributes.returning === null &&
            row.attributes.new === null
          ) {
            checkRN = "NEW";
          }
          // console.log("hasR", hasRecord);
          return {
            "No.": index + 1,
            System: row.attributes.system,
            "Date Created": moment(row.attributes.dateCreated).format("LL"),
            "Client/Customer Name": row.attributes.displayName,
            Classification: checkNew
              ? "NEW"
              : checkReturning
              ? "RETURNING"
              : checkOld
              ? "OLD"
              : checkRN
              ? "NEW"
              : "",
            Sector: row.attributes.industries.data[0].attributes.label,
            "Check Records From 2019": checkRecordsFrom2019,
            "Corrected Classification": checkNew
              ? "NEW"
              : checkReturning
              ? "RETURNING"
              : checkRN
              ? "NEW"
              : "",
            "Internal/External": row.attributes.types.data[0].attributes.label,
            "Row Counter": index + 1,
            "Unique Row#": "",
            "Unique or Not?": "",
          };
        });
        const fileName = "Customer Data";
        const exportType = exportFromJSON.types.csv;
        const data = rows;

        if (data) exportFromJSON({ data, fileName, exportType });
      },
    };
  },
};
</script>

<template>
  <div class="bg-grey-2">
    <q-breadcrumbs class="q-mb-lg">
      <q-breadcrumbs-el
        class="text-primary"
        label="Homepage"
        icon="home"
        to="/MainLayout/Home"
      />
      <q-breadcrumbs-el label="Customer Page" icon="people" />
    </q-breadcrumbs>
    <div class="row justify-center">
      <div class="q-pa-sm col-12 col-md-12">
        <div class="text-right q-mb-md">
          <q-btn
            @click="exportFile"
            icon="mdi-export"
            text-color="primary"
            label="Export CSV"
            class="text-weight-bold"
          />
        </div>
        <q-card class="light-shadow no-shadow">
          <q-bar class="bg-primary text-white">
            <div class="col text-left text-weight-bold">Customer List</div>
          </q-bar>
          <q-table
            :rows="rowsCustomer"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
            :filter="filter"
            @request="onRequest"
            binary-state-sort
          >
            <template v-slot:top>
              <div class="q-mr-sm q-mb-sm">
                <syncCustomerData :customerCount="pagination.rowsNumber" />
                <!-- v-if="pagination.rowsNumber" -->
              </div>
              <div class="q-mr-sm q-mb-sm">
                <!-- <AddCustomer :rowsCustomer="rowsCustomer" /> -->
                <div>
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
                              @update:model-value="loadAlldata()"
                              v-model="typeOfSystem"
                              :options="typeOfSystemOptions"
                              label="Type of System"
                              clearable
                              map-options
                            />
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-select
                              clearable
                              @update:model-value="loadAlldata"
                              v-model="accountTypeModel"
                              :options="accountTypeOptions"
                              label="Account Type"
                              map-options
                            />
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-select
                              clearable
                              @update:model-value="loadAlldata"
                              v-model="oldNewModel"
                              :options="oldNewOptions"
                              label="New/Returning/Old"
                            />
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-select
                              clearable
                              @update:model-value="loadAlldata"
                              v-model="monthModel"
                              :options="monthOptions"
                              label="Filter by Month"
                            />
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-select
                              clearable
                              @update:model-value="loadAlldata"
                              v-model="sectorCovModel"
                              :options="sectorCovOptions"
                              label="Sector Coverage"
                            />
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-select
                              clearable
                              @update:model-value="loadAlldata"
                              v-model="recordModel"
                              :options="recordOptions"
                              label="Customer with 2019 Record"
                            />
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <!-- <q-input
                            filled
                            v-model="startDate"
                            mask="date"
                            :rules="['date']"
                            label="Date Created"
                          >
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy
                                  cover
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
                                  <q-date v-model="dateCreated">
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
                          </q-input> -->
                            <q-input
                              filled
                              v-model="startDate"
                              mask="date"
                              :rules="['date']"
                              label="Date Completed From"
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
                            <q-input
                              filled
                              v-model="endDate"
                              mask="date"
                              :rules="['date']"
                              label="Date Completed To"
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
                            <q-btn
                              @click="loadAlldata()"
                              color="primary"
                              label="filter"
                            ></q-btn>

                            <!-- <q-btn
                            @click="oneshopRequestsloadAlldata()"
                            color="secondary"
                            label="filter"
                          ></q-btn> -->
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>

              <q-space />
              <div>
                <!-- <q-btn-toggle
                v-model="model"
                spread
                no-caps
                toggle-color="primary"
                color="white"
                text-color="black"
                :options="[
                  { label: 'Option 1', value: 'one' },
                  { label: 'Option 2', value: 'two' },
                ]"
              /> -->
                <q-input
                  filled
                  v-model="searchModel"
                  use-input
                  @update:model-value="loadAlldata()"
                  hide-selected
                  fill-input
                  input-debounce="300"
                  options-dense
                  :display-value="$q.lang.table.columns"
                  map-options
                  hint=""
                  dense
                  debounce="300"
                  color="primary"
                  label="Search..."
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>

            <br />
            <br />
            <template v-slot:body="props">
              <q-tr :props="props">
                <!-- <q-td key="index" :props="props">
              <pre>{{ props.pageIndex + 1 }}</pre>
            </q-td> -->
                <q-td key="displayName" :props="props">
                  {{ props.row.attributes.displayName }}
                </q-td>

                <q-td key="contactNo" :props="props">
                  {{ props.row.attributes.contactNo }}
                </q-td>

                <q-td key="email" :props="props">
                  {{ props.row.attributes.email }}
                </q-td>

                <q-td key="email" :props="props">
                  {{ props.row.attributes.system }}
                </q-td>

                <q-td key="action" :props="props">
                  <CustomerData :customer="props.row" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>

      <!-- next -->
    </div>
    <br />

    <div class="q-pa-md row justify-center">
      <div class="q-pa-sm col-12 col-md-8">
        <!-- <q-table
          :rows="rowsCustomer"
          :columns="columns"
          row-key="name"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:top>
            <div class="text-secondary text-weight-bolder shadow-1 col q-ma-md">
              <label class="text-h4 q-ma-md">Customer Transactions</label>
            </div>
          </template>

          <br />
          <br />
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="displayName" :props="props">
                {{ props.row.attributes.contactPerson }}
              </q-td>

              <q-td key="contactNo" :props="props">
                {{ props.row.attributes.contactNo }}
              </q-td>

              <q-td key="email" :props="props">
                {{ props.row.attributes.email }}
              </q-td>
              <q-td key="action" :props="props">
                <CustomerData :customer="props.row" />
              </q-td>
            </q-tr>
          </template>
        </q-table> -->
      </div>

      <!-- next -->
    </div>
  </div>
</template>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
