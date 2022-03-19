<template>
  <div class="q-pa-md">
    <!-- <div class="q-pa-md">
      <q-btn color="teal" @click="showLoading" label="Sync Customer Data" />
    </div> -->

    <q-dialog v-model="newCustomer">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">New Customer</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Erick Edquiban</q-item-label>
                <q-item-label caption
                  >Amcen Integrated Online System</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Trinmar Boado</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Alec Bardiano</q-item-label>
                <q-item-label caption>One Shop</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Haredonvi Tagaban</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Christian Peria</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="duplicatedCustomer">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">Duplicated Data</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="negative" name="delete" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Erick Edquiban</q-item-label>
                <q-item-label caption
                  >Amcen Integrated Online System</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="negative" name="delete" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Trinmar Boado</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="negative" name="delete" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Alec Bardiano</q-item-label>
                <q-item-label caption>One Shop</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row justify-end"></div>
    <syncCustomerData />
    <br />
    <div class="q-pa-md">
      <q-table
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        :filter="filter"
        @request="onRequest"
        binary-state-sort
      >
        <template v-slot:top>
          <div>
            <label class="q-pa-md text-h4"> Customer Table </label><br />
            <label class="q-pa-md">{{ length + " " + "Entries found" }}</label>
          </div>
          <q-space />
          <div>
            <br />
            <AddCustomer :rowsCustomer="rowsCustomer" /><br />
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
            <q-td key="index" :props="props">
              {{ props.row.index }}
            </q-td>

            <q-td key="contactPerson" :props="props">
              {{ props.row.contactPerson }}
            </q-td>

            <q-td key="contactNo" :props="props">
              {{ props.row.contactNo }}
            </q-td>

            <q-td key="action" :props="props">
              <CustomerData :customer="props.row" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <br />

    <div align="center" class="q-pa-md row items-start q-gutter-md">
      <q-card align="center" class="my-card" @click="newCustomer = true">
        <q-card-section class="text-black">
          <div class="text-h6">NEW Customer</div>
          <div class="text-subtitle2">Total = 5</div>
          <q-icon name="person" color="primary" size="4rem" />
        </q-card-section>

        <q-separator />
      </q-card>

      <q-card align="center" class="my-card" @click="duplicatedCustomer = true">
        <q-card-section class="text-black">
          <div class="text-h6">Duplicated User</div>
          <div class="text-subtitle2">Total = 3</div>
          <q-icon name="group" color="primary" size="4rem" />
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
    </div>
  </div>
</template>

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
    const filter = ref("");
    const length = ref("");
    const lengthaios = ref("");

    const paginationStart = ref("");
    const paginationLimit = ref("");

    const aiosUser = ref([]);
    const strapiApiCustomer = ref([]);

    const customerInfo = ref([]);
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
      rowsNumber: 1000,
    });
    const rowsCustomer = ref([]);
    const originalRows = ref([]);
    const columns = ref([
      {
        name: "index",
        align: "center",
        label: "    No.",
        field: "index",
        sortable: true,
      },
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
      {
        name: "contactNo",
        align: "center",
        label: "Contact Number",
        field: "contactNo",
        sortable: true,
      },
      // {
      //   name: "address",
      //   align: "center",
      //   label: "Address",
      //   field: "address",
      //   sortable: true,
      // },
      {
        name: "action",
        align: "center",
        field: "action",
      },
    ]);

    onBeforeMount(async function () {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    async function getAllCustomer() {
      const qs = require("qs");
      const query = qs.stringify(
        {
          populate: ["industry", "type"],
          pagination: {
            limit: 5,
            start: 0,
            skip: 5,
          },
        },
        {
          encodeValuesOnly: true,
        }
      );

      const total = qs.stringify(
        {
          pagination: {
            page: 1,
            pageSize: 1000,
          },
        },
        {
          encodeValuesOnly: true,
        }
      );

      console.log(total);
      strapiApiCustomer.value = await getAllCustomerData(total);
      length.value = strapiApiCustomer.value.data.meta.pagination.total;
      // table
      customerInfo.value = await getAllCustomerData(query);
    }

    function fetchFromServer(startRow, count, filter, sortBy, descending) {
      console.log(customerInfo.value);
      customerInfo.value.data.data.map(function (customer, index) {
        let attrObj = customer.attributes;
        originalRows.value.push({
          index: index + 1,
          id: customer.id,
          displayName: attrObj.displayName,
          email: attrObj.email,
          contactPerson: attrObj.contactPerson,
          contactNo: attrObj.contactNo,
          address: attrObj.address,
          industry: attrObj.industry.data,
          type: attrObj.type.data,
        });
        return originalRows.value;
      });
      const data = filter
        ? originalRows.value.filter((row) => row.name.includes(filter))
        : originalRows.value.slice();

      console.log("ORIGINALROWS", originalRows);

      // handle sortBy
      if (sortBy) {
        const sortFn =
          sortBy === "desc"
            ? descending
              ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
              : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
            : descending
            ? (a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy])
            : (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
        data.sort(sortFn);
      }
      console.log("DATA", data);

      return data.slice(startRow, startRow + count);
    }

    // emulate 'SELECT count(*) FROM ...WHERE...'
    function getRowsNumberCount(filter) {
      customerInfo.value.data.data.map(function (customer, index) {
        let attrObj = customer.attributes;
        originalRows.value.push({
          index: index + 1,
          id: customer.id,
          displayName: attrObj.displayName,
          email: attrObj.email,
          contactPerson: attrObj.contactPerson,
          contactNo: attrObj.contactNo,
          address: attrObj.address,
          industry: attrObj.industry.data,
          type: attrObj.type.data,
        });
        return originalRows.value;
      });
      if (!filter) {
        return originalRows.value.length;
      }
      let count = 0;
      originalRows.value.forEach((treat) => {
        console.log("TREAT", treat);
        if (treat.name.includes(filter)) {
          ++count;
        }
      });
      console.log("LENGTH", originalRows.value.length);
      console.log("COUNT", count);

      return count;
    }

    function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      loading.value = true;

      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        pagination.value.rowsNumber = getRowsNumberCount(filter);

        console.log("PIGINTAION ROWSNUMBER", pagination.value);

        // get all rows if "All" (0) is selected
        const fetchCount =
          rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage;

        // fetch data from "server"
        const returnedData = fetchFromServer(
          startRow,
          fetchCount,
          filter,
          sortBy,
          descending
        );

        // clear out existing data and add new
        rows.value.splice(0, rows.value.length, ...returnedData);
        console.log("ROWS VALUE", rows.value);
        console.log("RETUNED DATA", returnedData);

        // don't forget to update local pagination object
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;

        // ...and turn of loading indicator
        loading.value = false;
      }, 1500);
    }

    onMounted(() => {
      getAllCustomer();
      // get initial data from server (1st page)
      onRequest({
        pagination: pagination.value,
        filter: undefined,
      });
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
