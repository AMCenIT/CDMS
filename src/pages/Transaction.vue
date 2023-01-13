<script>
import { ref, onBeforeMount, onMounted, computed } from "vue";
import { date, useQuasar } from "quasar";
import {
  getCustomerDataAllaios,
  getTransactionDataAllaios,
  getQueryCustomerDataOneShopTable,
  getALLOneShopRequestDataOneShop,
} from "src/provider.js";

export default {
  components: {},
  setup() {
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
    const rowsCustomer = ref([]);
    const originalRows = ref([]);
    const columns = ref([
      {
        name: "item_name",
        align: "left",
        label: "Item Name",
        field: "item_name",
        sortable: true,
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
      console.log("aiosTransactions.value", returnedData);
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

    async function oneshopRequestfetchFromServer(startRow, count) {
      const query = {
        created_at: {},
        intExt: {
          name: {},
          code: {},
        },
        $skip: startRow,
        $limit: count,
      };
      console.log("query", query);
      if (intexModel.value) {
        query.intExt.name = intexModel.value;
      }
      if (endDate.value) {
        query.created_at.$lte = endDate.value;
      }
      if (startDate.value) {
        query.created_at.$gte = startDate.value;
      }
      // if (intexModel.value) {
      //   query.intExt.name.$nme = intexModel.value;
      // }
      oneShopTransactions.value = await getALLOneShopRequestDataOneShop(
        qs.stringify(query)
      );
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
      console.log("reOneshopReq.value", reOneshopReq.value);

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

    onMounted(() => {
      asiosCustomerloadAlldata();
      loadAlldata();
      oneshopCustomerloadAlldata();
      oneshopRequestsloadAlldata();
    });

    return {
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

      tab: ref("ulims"),

      intexModel,
      options,

      oneshopRequestsloadAlldata,
      // getStartEndDate,

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
  <div class="q-pa-md bg-blue-grey-6">
    <div class="col-12">
      <q-expansion-item
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
                <!-- <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="item_name" :props="props">
                {{ props.row.item_name }}
              </q-td>

              <q-td key="contactNo" :props="props">
                {{ props.row.job_type }}
              </q-td>
            </q-tr>
          </template> -->
              </q-table>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="q-mt-lg">
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
                  <!-- <pre>{{ props }}</pre> -->
                </template>
              </q-table>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="q-mt-lg">
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
                  <!-- <pre>{{ props }}</pre> -->
                </template>
              </q-table>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="shadow-1 overflow-hidden"
        style="font-size: 3rem; line-height: 3.125rem; letter-spacing: normal"
        icon="perm_identity"
        label="TRANSACTIONS TABLE"
        header-class="bg-secondary text-white"
        expand-icon-class="text-white"
      >
        <div class="row items-center">
          <div class="q-pa-md">
            <div class="row items-center">
              <q-input
                filled
                v-model="startDate"
                mask="date"
                :rules="['date']"
                class="bg-white"
                label="Start Date"
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
                class="bg-white q-ml-md"
                label="End Date"
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
              <div class="bg-white q-ml-md">
                <q-select
                  outlined
                  v-model="intexModel"
                  @update:model-value="oneshopRequestsloadAlldata()"
                  :options="options"
                  label="Internal/External"
                  clearable
                  map-options
                  style="width: 200px"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <q-btn
              @click="oneshopRequestsloadAlldata()"
              color="secondary"
              label="filter"
            ></q-btn>
          </div>
        </div>

        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="bg-teal shadow-2"
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
                <q-table
                  :loading="loading"
                  :filter="filter"
                  @request="onRequest"
                  binary-state-sort
                >
                  <template v-slot:top>
                    <div
                      class="text-secondary text-weight-bolder shadow-1 col q-ma-md"
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
              </div>
            </q-tab-panel>

            <q-tab-panel name="oneshop">
              <div class="q-pa-sm col-12 col-md-4">
                <q-table
                  :rows="reOneshopReq"
                  :columns="osrcolumns"
                  row-key="id"
                  v-model:pagination="osrpagination"
                  :loading="loading"
                  @request="oneshoprequestonRequest"
                  binary-state-sort
                >
                  <template v-slot:top>
                    <div
                      class="text-secondary text-weight-bolder shadow-1 col q-ma-md"
                    >
                      <label class="text-h4 q-ma-md"
                        >ONE SHOP TRANSACTION</label
                      >
                    </div>
                  </template>

                  <br />
                  <br />
                  <template v-slot:body="props">
                    <!-- <pre>{{ props.row }}</pre> -->
                    <q-tr :props="props">
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
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>

            <q-tab-panel name="aios">
              <div class="q-pa-sm col-12 col-md-4">
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
                      class="text-secondary text-weight-bolder shadow-1 col q-ma-md"
                    >
                      <label class="text-h4 q-ma-md">AIOS TRANSACTION</label>
                    </div>
                  </template>

                  <br />
                  <br />
                  <template v-slot:body="props">
                    <!-- <pre>{{ props.row }}</pre> -->
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
                    <!-- <pre>{{ props }}</pre> -->
                  </template>
                </q-table>
              </div>
            </q-tab-panel>

            <q-tab-panel name="pjois">
              <div class="q-pa-sm col-12 col-md-4">
                <q-table
                  :loading="loading"
                  :filter="filter"
                  @request="onRequest"
                  binary-state-sort
                >
                  <template v-slot:top>
                    <div
                      class="text-secondary text-weight-bolder shadow-1 col q-ma-md"
                    >
                      <label class="text-h4 q-ma-md">PJOIS TRANSACTION</label>
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
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-expansion-item>
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
