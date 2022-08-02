<script>
import {
  ref,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  computed,
} from "vue";
import AddCustomer from "src/components/addCustomer.vue";
import CustomerData from "src/components/CustomerData.vue";
import AreaChart from "src/components/AreaChart.vue";
import Doughnut from "src/components/Doughnut.vue";
import Bar from "src/components/Bar.vue";
import Line from "src/components/Line.vue";
import Pie from "src/components/Pie.vue";

import { useQuasar } from "quasar";
import { getAllCustomerData } from "src/provider.js";

export default {
  components: {
    AddCustomer,
    CustomerData,
    AreaChart,
    Doughnut,
    Bar,
    Line,
    Pie,
  },
  setup() {
    const qs = require("qs");
    const loading = ref(false);
    const filter = ref("");
    const length = ref("");
    const lengthaios = ref("");

    const paginationStart = ref(null);
    const paginationLimit = ref(null);

    const aiosUser = ref([]);
    const strapiApiCustomer = ref([]);

    const customerInfo = ref([]);
    const customerInfoPromise = ref([]);

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
    const columns = ref([
      // {
      //   name: "id",
      //   align: "center",
      //   label: "    No.",
      //   field: "id",
      //   sortable: true,
      // },
      // {
      //   name: "displayName",
      //   align: "center",
      //   label: "Company",
      //   field: "displayName",
      //   sortable: true,
      // },
      {
        name: "contactPerson",
        align: "center",
        label: "Contact Person",
        field: "contactPerson",
        sortable: true,
      },
      // {
      //   name: "email",
      //   align: "center",
      //   label: "Email",
      //   field: "email",
      //   sortable: true,
      // },
      // {
      //   name: "contactNo",
      //   align: "center",
      //   label: "Contact Number",
      //   field: "contactNo",
      //   sortable: true,
      // },
      // {
      //   name: "address",
      //   align: "center",
      //   label: "Address",
      //   field: "address",
      //   sortable: true,
      // },
    ]);

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
      const query = qs.stringify(
        {
          populate: ["industry", "type"],
          pagination: {
            start: startRow,
            limit: count,
          },
        },
        {
          encodeValuesOnly: true,
        }
      );

      const response = await getAllCustomerData(query);
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

    onMounted(() => {
      loadAlldata();
    });

    return {
      metaObj: ref(""),
      customerInfo,
      newCustomer: ref(false),
      duplicatedCustomer: ref(false),
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
      onRequest,
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },

      columns,
      rows,

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
    <div class="q-pa-md row justify-center">
      <div class="q-pa-sm col-12 col-md-4">
        <q-table
          title="Treats"
          :rows="rowsCustomer"
          :columns="columns"
          row-key="id"
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
              style="border-radius: 5px"
              align="center"
              class="bg-secondary col text-white q-pa-md"
            >
              <q-icon name="report" size="1.4em" class="q-mr-md" />
              <label>Returning Customer</label>
            </div>
          </template>

          <br />
          <br />
          <template v-slot:body="props">
            <q-tr :props="props">
              <!-- <q-td key="index" :props="props">
              <pre>{{ props.pageIndex + 1 }}</pre>
            </q-td> -->
              <q-td key="contactPerson" :props="props">
                <!-- {{ props.row.attributes.contactPerson }} -->
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- next -->
      <div class="q-pa-sm col-12 col-md-3">
        <q-table
          title="Treats"
          :rows="rowsCustomer"
          :columns="columns"
          row-key="id"
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
              style="border-radius: 5px"
              align="center"
              class="bg-secondary col text-white q-pa-md"
            >
              <q-icon name="report" size="1.4em" class="q-mr-md" />

              <label rounded>Duplicated Data</label>
            </div>
          </template>

          <br />
          <br />
          <template v-slot:body="props">
            <q-tr :props="props">
              <!-- <q-td key="index" :props="props">
              <pre>{{ props.pageIndex + 1 }}</pre>
            </q-td> -->
              <q-td key="contactPerson" :props="props">
                <!-- {{ props.row.attributes.contactPerson }} -->
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- next -->

      <div class="q-pa-sm col-12 col-md-5">
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
              <AddCustomer :rowsCustomer="rowsCustomer" />
            </div>

            <q-space />
            <div>
              <q-input
                borderless
                dense
                debounce="300"
                color="primary"
                v-model="filter"
                label="Search"
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
              <q-td key="contactPerson" :props="props">
                {{ props.row.attributes.contactPerson }}
              </q-td>

              <!-- <q-td key="contactNo" :props="props">
                {{ props.row.attributes.contactNo }}
              </q-td> -->

              <q-td key="action" :props="props">
                <CustomerData :customer="props.row" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- next -->
    </div>
    <br />

    <div row class="row justify-center">
      <div
        style="border-radius: 5px"
        class="col-12 bg-white col-md-4 q-pa-md q-ma-sm"
      >
        <Pie />
      </div>

      <div
        style="border-radius: 5px"
        class="col-12 bg-white col-md-4 q-pa-md q-ma-sm"
      >
        <AreaChart />
      </div>
      <div
        style="border-radius: 5px"
        class="col-12 bg-white col-md-3 q-pa-md q-ma-sm"
      >
        <Doughnut />
      </div>
    </div>

    <div row class="row justify-center">
      <div
        style="border-radius: 5px"
        class="col-12 bg-white col-md-6 q-pa-md q-ma-sm"
      >
        <Line />
      </div>

      <div
        style="border-radius: 5px"
        class="col-12 bg-white col-md-5 q-pa-md q-ma-sm"
      >
        <Bar />
      </div>
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
  </div>
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
</style>
