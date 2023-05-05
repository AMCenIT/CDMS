<template>
  <div>
    <q-btn
      color="primary"
      v-for="size in ['sm']"
      :key="size"
      :size="size"
      icon="remove_red_eye"
      flat
      class="q-pa-md"
      @click="viewTransaction(request)"
      dense
    />
  </div>
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
        <q-tabs
          v-model="tabs"
          dense
          class="bg-black"
          active-color="white"
          align="justify"
          narrow-indicator
        >
          <q-tab name="details" label="Details" />
          <q-tab name="orders" label="Orders" />
        </q-tabs>

        <q-tab-panels v-model="tabs" animated class="bg-white text-black">
          <q-tab-panel name="details">
            <q-table
              title="Transaction Details"
              hide-pagination
              hide-bottom
              hide-header
              grid
            >
            </q-table>
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input
                  v-model="text"
                  hint="Service"
                  :dense="dense"
                  readonly
                  class="q-mr-lg"
                  label="TEST"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input
                  v-model="text"
                  hint="Job Type"
                  :dense="dense"
                  readonly
                  class="q-mr-lg"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input
                  v-model="text"
                  hint="Date Created"
                  :dense="dense"
                  readonly
                  class="q-mr-lg"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input
                  v-model="text"
                  hint="Target Completion Date"
                  :dense="dense"
                  readonly
                  class="q-mr-lg"
                  label="TEST"
                />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="orders"> </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { api, aiosapi, oneshop } from "boot/axios";
import { useQuasar } from "quasar";
import axios from "axios";
export default {
  setup() {
    const $q = useQuasar();

    // delete Data
    const deleteId = ref(null);

    const oneShopReq = ref([]);
    const aiosReq = ref([]);
    const pjoisReq = ref([]);

    const osReq = ref([]);
    const physmetReq = ref([]);
    const amcenReq = ref([]);
    const selected_top = ref("");
    const viewTransactionModal = ref(false);
    const sectors = ref("");
    const filterView = ref("");

    const columnsView = [
      {
        name: "tsrNo",
        required: true,
        label: "TSR No.",
        align: "left",
        field: "tsrNo",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "jobtype",
        align: "center",
        label: "Job Type",
        field: "jobtype",
        sortable: true,
      },
      {
        name: "status",
        align: "center",
        label: "Status",
        field: "status",
        sortable: true,
      },
      {
        name: "servicename",
        label: "Service Name",
        field: (val) => val.service.name,
        sortable: true,
      },
      { name: "date", label: "Date", field: "date" },
    ];

    const columnsViewPhysmet = [
      {
        name: "jobOrderNo",
        required: true,
        label: "Job Order No.",
        align: "left",
        field: "jobOrderNo",
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "status", label: "Status", field: "status", sortable: true },
      {
        name: "createdAt",
        label: "Date Created",
        field: (val) => moment(val.createdAt).format("ll"),
      },
      {
        name: "updatedAt",
        label: "Last Updated",
        field: (val) => moment(val.updatedAt).format("ll"),
      },
    ];

    const columnsViewAmcen = [
      {
        name: "id",
        required: true,
        label: "Job Order No.",
        align: "left",
        field: "id",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "job_type",
        align: "center",
        label: "Job Type",
        field: "job_type",
        sortable: true,
      },
      {
        name: "service_type",
        align: "center",
        label: "Service",
        field: "service_type",
        sortable: true,
      },
      {
        name: "status",
        align: "center",
        label: "Status",
        field: "status",
        sortable: true,
      },
      {
        name: "date",
        align: "center",
        label: "Date Created",
        field: (val) => val.history.date,
        sortable: true,
      },
    ];

    async function viewTransaction(row) {
      console.log("row", row);
      viewTransactionModal.value = true;
      // console.log("test", viewTransactionModal.value);
    }
    onMounted(() => {});

    return {
      viewTransaction,
      viewTransactionModal,
      columnsView,
      columnsViewAmcen,
      columnsViewPhysmet,
      physmetReq,
      text: ref(""),
      dense: ref(false),
      selected_top,
      sectors,
      dialog: ref(false),
      maximizedToggle: ref(true),
      tabs: ref("details"),

      filterView,
    };
  },
};
</script>

<style></style>
