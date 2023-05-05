<template>
  <q-page padding>
    <q-breadcrumbs class="q-mb-lg">
      <q-breadcrumbs-el
        class="text-primary"
        label="Homepage"
        icon="home"
        to="/MainLayout/Home"
      />
      <q-breadcrumbs-el label="Downloadable File" icon="download" />
    </q-breadcrumbs>

    <q-card class="light-shadow no-shadow">
      <q-bar class="bg-primary text-white">
        <div class="col text-left text-weight-bold">Downloadable List</div>
      </q-bar>
      <q-card-section>
        <q-table
          flat
          class="my-sticky-column-table"
          title="Downloadables"
          :rows="rows"
          :columns="columns"
          v-model:pagination="pagination"
          v-model:selected="selected"
          @selection="selection"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
          row-key="id"
          selection="single"
        >
          <template v-slot:top-right>
            <div class="row q-gutter-sm">
              <q-btn-group>
                <!-- <q-btn color="primary" flat icon="mdi-cloud-upload-outline">
                  <q-menu style="min-width: 100px">
                    <q-uploader
                      label="Uploader"
                      url="http://10.10.120.19:1336/api/upload"
                      fieldName="files"
                      style="max-width: 300px"
                      class="light-shadow no-shadow"
                    />
                  </q-menu>
                </q-btn> -->
                <q-btn
                  :disable="selected.length === 0"
                  @click="
                    openURL(
                      'http://10.10.120.19:1336' + file.data.attributes.url
                    )
                  "
                  flat
                  color="primary"
                  icon="download"
                >
                  <q-tooltip>View</q-tooltip>
                </q-btn>
                <!-- <q-btn
                  :disable="selected.length === 0"
                  @click="confirm()"
                  flat
                  color="negative"
                  icon="delete"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn> -->
              </q-btn-group>

              <!-- <q-input
                borderless
                dense
                filled
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append><q-icon name="mdi-magnify" /></template>
              </q-input> -->
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import qs from "qs";
import filesize from "filesize.js";
import { date, useQuasar, openURL } from "quasar";
import { ref, reactive, onMounted, getCurrentInstance, watch } from "vue";

const $q = useQuasar();
const app = getCurrentInstance().appContext.config.globalProperties;

const file = ref("");
const text = ref("");
const customer = ref("");

const columns = [
  {
    name: "name",
    required: true,
    label: "Filename",
    align: "left",
    field: (row) => row.attributes.upload.data.attributes.name,
  },
  {
    name: "size",
    label: "Size",
    align: "left",
    field: (row) => filesize(row.attributes.upload.data.attributes.size),
    sortable: true,
  },
  {
    name: "createdAt",
    label: "Created At",
    align: "left",
    field: (row) => date.formatDate(row.attributes.createdAt, "MMMM DD, YYYY"),
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
const rows = ref([]);
const loading = ref(false);
const filter = ref("");
const selected = ref([]);

async function fetchFromServer(startRow, count, filter, sortBy, descending) {
  const query = qs.stringify(
    { start: startRow, limit: count },
    { encodeValuesOnly: true }
  );

  const config = {
    method: "get",
    url: `http://10.10.120.19:1336/api/upload-files?populate=*`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  // console.log("filter", filter);

  if (filter) {
    config.url += `&filters[upload.data.attributes.name][$contains]=${encodeURIComponent(
      filter
    )}`;
  }

  const response = await app.$axios(config);
  return response.data;
}

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const filter = props.filter;

  loading.value = true;
  const fetchCount =
    rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
  const startRow = (page - 1) * rowsPerPage;
  const returnedData = await fetchFromServer(
    startRow,
    fetchCount,
    filter,
    sortBy,
    descending
  );

  rows.value = returnedData.data.map((r) => r);
  // console.log("rows", rows.value);
  pagination.value.rowsNumber = returnedData.meta.pagination.total;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  loading.value = false;
}

function loadRequest() {
  onRequest({ pagination: pagination.value, filter: undefined });
}

async function selection(details) {
  file.value = details.rows[0].attributes.upload;
  // console.log("file.value", file.value);
}

// async function deleteFile() {
//   const configJobOrder = {
//     method: "delete",
//     url: `http://10.10.120.19:1336/api/upload-files?populate=*&${file.value.id}`,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   const response = await app.$axios(configJobOrder);
// }

function confirm() {
  let options = {
    position: "top",
    title: "Confirm",
    message: "Are you sure you want to proceed?",
    ok: {
      unelevated: true,
    },
    cancel: {
      flat: true,
    },
  };

  $q.dialog(options)
    .onOk((password) => {
      deleteFile();
    })
    .onCancel(() => {})
    .onDismiss(() => {});
}

onMounted(async () => {
  loadRequest();
});
</script>
