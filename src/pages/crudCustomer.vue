<script>
import { ref, onBeforeMount, onMounted, computed } from "vue";
import AddCustomer from "src/components/addCustomer.vue";
import CustomerData from "src/components/CustomerData.vue";
import syncCustomerData from "src/components/syncCustomerData.vue";
import { useQuasar } from "quasar";
import { getAllCustomerData } from "src/provider.js";

export default {
  components: {
    AddCustomer,
    CustomerData,
    syncCustomerData,
  },
  setup() {
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
      {
        name: "displayName",
        align: "center",
        label: "Company Name",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "contactNo",
        align: "center",
        label: "Contact Number",
        field: "contactNo",
        sortable: true,
      },
      {
        name: "email",
        align: "center",
        label: "Email",
        field: "email",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        label: "Actions",
        field: "action",
      },
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
          populate: ["industries", "types"],
          pagination: {
            start: startRow,
            limit: count,
            sort: {
              id: -1,
            },
          },
        },
        {
          encodeValuesOnly: true,
        }
      );

      // if (filter) {
      //   query.$search = filter;
      // }

      const response = await getAllCustomerData(query);
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
    <div align="center" class="text-secondary text-weight-bolder shadow">
      <h3>CDMS CRUD TABLE</h3>
    </div>

    <div class="q-pa-md row justify-center">
      <div class="q-pa-sm col-12 col-md-8">
        <q-table
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
            <div class="q-mr-sm q-mb-sm">
              <syncCustomerData :customerCount="pagination.rowsNumber" />
              <!-- v-if="pagination.rowsNumber" -->
            </div>
            <div class="q-mr-sm q-mb-sm">
              <AddCustomer :rowsCustomer="rowsCustomer" />
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
              <q-td key="displayName" :props="props">
                {{ props.row.attributes.displayName }}
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
        </q-table>
      </div>

      <!-- next -->
    </div>
    <br />

    <div class="q-pa-md row justify-center">
      <div class="q-pa-sm col-12 col-md-8">
        <q-table
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
              <label class="text-h4 q-ma-md">Inline Edit Customer</label>
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
        </q-table>
      </div>

      <!-- next -->
    </div>
  </div>
</template>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
