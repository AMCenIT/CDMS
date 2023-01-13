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
// import CustomerDuplicates from "src/components/CustomerData.vue";
import AreaChart from "src/components/AreaChart.vue";
import Doughnut from "src/components/Doughnut.vue";
import Bar from "src/components/Bar.vue";
import Line from "src/components/Line.vue";
import Pie from "src/components/Pie.vue";

import { useQuasar, LocalStorage, SessionStorage } from "quasar";
import {
  getAllCustomerData,
  systemsFilter,
  searchAllData,
  getAllCustomerDataOneShop,
} from "src/provider.js";
import { aiosapi } from "src/boot/axios";
import exportFromJSON from "export-from-json";
import { physmet } from "src/boot/axios";

// const stringOptions = ["AIOS", "ULIMS", "ONESHOP", "PJOIS"];

export default {
  components: {
    AddCustomer,
    CustomerData,
    AreaChart,
    Doughnut,
    Bar,
    Line,
    Pie,
    // CustomerDuplicates,
  },
  props: ["customer"],
  setup() {
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

    const viewCustomerModal = ref(false);
    const selected_data = ref("");

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
    const duplipagination = ref({
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
        name: "name",
        required: true,
        label: "Company Name",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
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
        name: "action",
        align: "left",
        label: "Action",
        field: "action",
        sortable: true,
      },

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
      //   const config = {
      //   method: 'get',
      //   url: `http://10.10.120.19:1336/api/customers?pagination[start]=${startRow}&pagination[limit]=${count}&[populate]=%2A&sort[0]=publishedAt%3Adesc&sort[1]=updatedAt%3Adesc`,
      //   headers: {
      //     'Authorization': 'Bearer ' + '881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01'
      //   }
      // }
      const query = {
        filters: {},
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };
      // {
      //   encodeValuesOnly: true,
      // }
      // );
      console.log("query", query);
      if (searchModel.value) {
        // console.log("searchModel", searchModel.value);
        query.filters.displayName = {
          $contains: searchModel.value,
        };
        // config.url = config.url+`&filters[$or][0][displayName][$contains]=${searchModel.value}&filters[$or][1][contactPerson][$contains]=${searchModel.value}`
      } else {
        // console.log("Filter None");
      }
      if (model.value) {
        // console.log("model.value", model.value);
        query.filters.system = {
          $eq: model.value,
        };
      } else {
        console.log("Filter None");
      }
      const response = await getAllCustomerData(qs.stringify(query));
      // console.log("erickpogi", response);
      customerInfoPromise.value = response.data;
      console.log("customerInfoPRomise.value", customerInfoPromise.value);

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
      console.log("rowCustomer", rowsCustomer.value);
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
            if (arr[i].company === val.company) {
              val.isTrue = true;
              return val;
            }
          }
          val.isTrue = false;
          return val;
        })
        .filter((d) => d.isTrue);

      console.log("duplicatedCustomer", duplicateData.value);

      // duplicateData.value = returnedData.data.map((r) => r);
      // console.log("duplicate", duplicateData.value);

      // don't forget to update local pagination object

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

    onMounted(() => {
      dupliCustomerData();
      loadAlldata();
      systemType();
      searchData();
      $q.localStorage.set(customerInfoPromise.value);
      const value = $q.localStorage.getItem(customerInfoPromise.value);
      // console.log("boboobo", value);
    });

    return {
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
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },

      columns,
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
      filterView: ref(""),
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
      dense: ref(false),
      viewCustomerModal,
      selected_data,

      viewCustomer(row) {
        console.log(row);
        let index = duplicateData.value.indexOf(row);
        console.log(duplicateData.value.indexOf(row));
        selected_data.value = row;
        viewCustomerModal.value = true;
        sectors.value = Array.isArray(row.sector) ? row.sector[0] : row.sector;
      },
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
    };
  },
};
</script>

<template>
  <div class="q-pa-md bg-blue-grey-6">
    <div class="q-pa-md row justify-center">
      <div class="q-pa-sm col-12 col-md-6">
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
              class="bg-secondary col text-white q-pa-md row items-center justify-center"
            >
              <q-icon name="report" size="2em" class="q-mr-md" />
              <label class="text-h6">Returning Customer</label>
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

      <div class="q-pa-sm col-12 col-md-6">
        <q-table
          title="Treats"
          :rows="duplicateData"
          :columns="columnDuplicates"
          row-key="id"
          @request="dupliOnRequest"
          :loading="loading"
          :filter="filter"
          binary-state-sort
        >
          <template v-slot:top>
            <div
              style="border-radius: 5px"
              class="bg-secondary col text-white q-pa-md row items-center justify-center"
            >
              <q-icon name="report" size="2em" class="q-mr-md" />
              <label class="text-h6">Duplicate Customers</label>
            </div>
            <!-- <q-btn
              @click="downloadFile()"
              class="np-btn"
              color="primary"
              icon-right="archive"
              label="Export"
            /> -->
          </template>

          <br />
          <br />

          <template v-slot:body="props">
            <q-tr :props="props">
              <!-- <q-td key="index" :props="props">
              <pre>{{ props.pageIndex + 1 }}</pre>
            </q-td> -->
              <q-td key="contactPerson" :props="props">
                {{ props.row.company }}
              </q-td>
              <q-td key="contactPerson" :props="props">
                {{ props.row.contact }}
              </q-td>
              <q-td key="action" :props="props">
                <!-- {{ props.row._id }} -->
                <q-btn
                  class="glossy"
                  round
                  color="secondary"
                  icon="remove_red_eye"
                  @click="viewCustomer(props.row)"
                />
              </q-td>
              <!-- <q-td key="systemUser" :props="props">
                {{ props }}
              </q-td> -->
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- next -->

      <div class="q-pa-sm col-12 col-md-12">
        <!-- <pre>{{ rowsCustomer }}</pre> -->
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
            <!-- <pre>{{ options }}</pre> -->
            <!-- <q-btn @click="loadAlldata" label="Click" /> -->

            <!-- <q-select
              filled
              v-model="model"
              use-input
              @update:model-value="loadAlldata()"
              hide-selected
              outlined
              fill-input
              input-debounce="300"
              options-dense
              :display-value="$q.lang.table.columns"
              map-options
              :options="options"
              option-value="name"
              options-cover
              @filter="filterFn"
              label="System Filter"
              hint=""
              clearable
              style="width: 200px; padding-bottom: 32px"
            > -->
            <q-select
              outlined
              v-model="model"
              :options="options"
              @update:model-value="loadAlldata()"
              label="System Filter"
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

            <q-space />
            <div>
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
                borderless
                dense
                debounce="300"
                @filter="filterSearch"
                color="primary"
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
              <q-td key="contactPerson" :props="props">
                {{ props.row.attributes.contactPerson }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.attributes.email }}
              </q-td>
              <q-td key="contactNo" :props="props">
                {{ props.row.attributes.contactNo }}
              </q-td>
              <q-td key="address" :props="props">
                {{ props.row.attributes.address }}
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
    <q-dialog
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
                <!-- {{ duplicateData._id }} -->
                <!-- <pre>{{ duplicateData }}</pre> -->
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
    </q-dialog>
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
