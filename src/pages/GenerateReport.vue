<template>
  <q-page padding>
    <q-breadcrumbs class="q-mb-lg">
      <q-breadcrumbs-el
        class="text-primary"
        label="Homepage"
        icon="home"
        to="/MainLayout/Home"
      />
      <q-breadcrumbs-el label="Generate Report" icon="summarize" />
    </q-breadcrumbs>
    <q-card class="light-shadow no-shadow">
      <q-bar class="bg-primary text-white">
        <div class="col text-left text-weight-bold">
          CLIENTS/CUSTOMERS TRANSACTIONS
        </div>
      </q-bar>
      <div class="q-pa-md">
        <q-table
          flat
          class="my-sticky-column-table"
          :rows="rows"
          :columns="columns"
          v-model:pagination="pagination"
          :loading="loading"
          @request="onRequest"
          :filter="filter"
          :date="date"
          binary-state-sort
          row-key="id"
        >
          <template v-slot:top-left>
            <div class="row">
              <q-select
                filled
                v-model="date"
                :options="yearSelection"
                clearable
                @update:model-value="loadAlldata()"
                label="Select Year"
                style="width: 150px; margin-right: 15px"
              />

              <q-select
                filled
                v-model="intExt"
                :options="selectIntEx"
                clearable
                @update:model-value="loadAlldata()"
                label="Account Type"
                style="width: 150px"
              />
            </div>
          </template>
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              filled
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append><q-icon name="mdi-magnify" /></template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="no" :props="props">{{ props.rowIndex + 1 }}</q-td>
              <q-td
                key="delivery_unit"
                :props="props"
                v-if="
                  props.row.attributes.customer.data.attributes.system ===
                  'OneShop'
                "
              >
                TSS
              </q-td>
              <q-td
                key="delivery_unit"
                :props="props"
                v-if="
                  props.row.attributes.customer.data.attributes.system ===
                  'PJOIS'
                "
              >
                MPRD
              </q-td>
              <q-td key="month" :props="props">{{
                new Date(props.row.attributes.dateCompleted).toLocaleString(
                  undefined,
                  { month: "long" }
                )
              }}</q-td>
              <q-td key="customer" :props="props">
                {{ props.row.attributes.customer.data.attributes.displayName }}
              </q-td>
              <q-td key="classification" :props="props">{{}}</q-td>
              <q-td key="sector" :props="props">
                {{
                  props.row.attributes.customer.data.attributes.industries
                    .data[0].attributes.label
                }}
              </q-td>
              <q-td
                key="check"
                :props="props"
                v-if="
                  props.row.attributes.dateCompleted &&
                  props.row.attributes.dateCompleted.includes('2019')
                "
              >
                with 2019 record
              </q-td>
              <q-td :props="props" v-else> no 2019 record </q-td>
              <q-td
                key="corrected"
                v-if="
                  props.row.attributes.dateCompleted &&
                  props.row.attributes.dateCompleted.includes('2019')
                "
                :props="props"
                >RETURNING</q-td
              >
              <q-td v-else> NEW </q-td>
              <q-td key="intExt" :props="props">{{
                props.row.attributes.customer.data.attributes.types.data[0]
                  .attributes.label
              }}</q-td>
              <q-td key="rowCounter" :props="props">{{
                props.rowIndex + 1
              }}</q-td>
              <q-td key="uniqueRow" :props="props"> </q-td>
              <q-td key="uniqueNot" :props="props"> </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  getAllCustomerData,
  searchAllData,
  getALLOneShopRequestDataOneShop,
} from "src/provider.js";
import moment from "moment";
import exportFromJSON from "export-from-json";
import axios from "axios";
import { ref, onMounted, nextTick, getCurrentInstance, watch } from "vue";
import { useQuasar } from "quasar";
export default {
  setup() {
    const currentYear = new Date().getFullYear();
    const yearSelection = ref([
      currentYear.toString(),
      (currentYear - 1).toString(),
      (currentYear - 2).toString(),
      (currentYear - 3).toString(),
    ]);
    const currentYearTsr = ref([]);
    const app = getCurrentInstance().appContext.config.globalProperties;
    const loading = ref(false);

    const rows = ref([]);
    const length = ref("");
    const qs = require("qs");
    const $q = useQuasar();
    const customerIds = ref([]);
    const returningCustomers = ref([]);
    const newCustomers = ref([]);
    const allTsr = ref([]);
    const filter = ref("");
    const date = ref(null);
    const intExt = ref(null);
    const selectIntEx = ref(["External", "Internal", "Student"]);

    const columns = [
      {
        name: "no",
        required: true,
        label: "No.",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "delivery_unit",
        align: "left",
        label: "Delivery Unit",
        field: "delivery_unit",
        sortable: true,
      },
      {
        name: "month",
        align: "left",
        label: "Month",
        field: "month",
        sortable: true,
      },
      {
        name: "customer",
        align: "left",
        label: "Client/Customer",
        field: "customer",
        sortable: true,
      },
      {
        name: "classification",
        align: "left",
        label: "Classification",
        field: "classification",
        sortable: true,
      },
      {
        name: "sector",
        align: "left",
        label: "Sector",
        field: "sector",
        sortable: true,
      },
      {
        name: "check",
        align: "left",
        label: "Check records from 2019",
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: "corrected",
        align: "left",
        label: "Corrected Classification",
        field: "corrected",
        sortable: true,
      },
      {
        name: "intExt",
        align: "left",
        label: "Internal or External",
        field: "intExt",
        sortable: true,
      },
      {
        name: "rowCounter",
        align: "left",
        label: "Row Counter",
        field: "rowCounter",
        sortable: true,
      },
      {
        name: "uniqueRow",
        align: "left",
        label: "Unique Row#",
        field: "uniqueRow",
        sortable: true,
      },
      {
        name: "uniqueNot",
        align: "left",
        label: "Unique or Not",
        field: "uniqueNot",
        sortable: true,
      },
    ];

    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 5,
    });

    async function loadCurrentYearTsr(
      startRow,
      count,
      filter,
      sortBy,
      descending,
      date,
      intExt
    ) {
      const config = {
        method: "get",
        url: `http://10.10.120.19:1336/api/transactions?populate[customer][populate][0]=industries&populate[customer][populate][1]=types&pagination[start]=${startRow}&pagination[limit]=${count}`,
        headers: {
          Authorization:
            "Bearer " +
            "881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01",
        },
      };

      if (filter) {
        config.url =
          config.url +
          `&filters[$or][0][customer][displayName][$contains]=${filter}&filters[$or][1][customer][contactPerson][$contains]=${filter}&filters[$or][2][tsrNo]=${filter}`;
      }

      if (date) {
        config.url = config.url + `&filters[dateCompleted][$contains]=${date}`;
      }

      if (intExt) {
        config.url =
          config.url +
          `&filters[$or][0][customer][types][label][$eq]=${intExt}`;
      }

      const response = await app.$axios(config);
      return response.data;
    }

    async function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;
      const date = props.date;
      const intExt = props.intExt;

      loading.value = true;
      const fetchCount =
        rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
      const startRow = (page - 1) * rowsPerPage;
      const returnedData = await loadCurrentYearTsr(
        startRow,
        fetchCount,
        filter,
        sortBy,
        descending,
        date,
        intExt
      );

      rows.value = returnedData.data;

      // = returnedData.data.map(function (val, idx, arr) {
      //   for (var i = 0; i < idx; i++) {
      //     if (
      //       arr[i].attributes.customers.data[0].attributes.hasRecordFrom2019 ===
      //       true
      //     ) {
      //       val.isReturning = "RETURNING";
      //       return val;
      //     }
      //   }
      //   val.isReturning = false;
      //   return val;
      // });
      pagination.value.rowsNumber = returnedData.meta.pagination.total;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
      loading.value = false;
    }

    function loadAlldata(currentValue) {
      onRequest({
        pagination: pagination.value,
        filter: undefined,
        date: date.value,
        intExt: intExt.value,
      });
    }

    onMounted(() => {
      loadAlldata();
    });
    return {
      columns,
      currentYearTsr,
      loadCurrentYearTsr,
      loadAlldata,
      onRequest,
      rows,
      length,
      loading,
      pagination,
      currentYear,
      customerIds,
      returningCustomers,
      newCustomers,
      filter,
      yearSelection,
      date,
      intExt,
      selectIntEx,
    };
  },
};
</script>
<style></style>
