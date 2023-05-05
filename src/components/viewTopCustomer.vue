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
      @click="viewCustomerDetails(customer)"
      dense
    />
  </div>
  <q-dialog
    v-model="viewCustomerDetailsModal"
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
          v-model="tab"
          dense
          class="bg-black"
          active-color="white"
          align="justify"
          narrow-indicator
        >
          <q-tab name="details"
            ><q-icon size="30px" name="mdi-card-account-details" /><strong
              >Details</strong
            ></q-tab
          >
          <q-tab name="orders"
            ><q-icon size="30px" name="mdi-tray-full" /><strong
              >TSR</strong
            ></q-tab
          >
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-white text-black">
          <q-tab-panel name="details">
            <q-table
              title="Customer Details"
              hide-pagination
              hide-bottom
              hide-header
              grid
            >
            </q-table>
            <p class="q-ml-md text-weight-medium">
              Total No. of Transaction:
              <strong>{{ totalTransaction }}</strong>
            </p>
            <div style="margin-left: 16px">
              <!-- {{ duplicateData._id }} -->
              <!-- <pre>{{ duplicateData }}</pre> -->
              <div class="row q-mt-lg">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Company Name"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="customer.attributes.displayName"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Contact Person"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="customer.attributes.contactPerson"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Sector"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="
                        customer.attributes.industries.data[0].attributes.label
                      "
                    />
                  </strong>
                </div>
              </div>
              <div class="row q-mt-xl">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Contact No."
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="customer.attributes.contactNo"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Email Address"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="customer.attributes.email"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Address"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="customer.attributes.address"
                    />
                  </strong>
                </div>
              </div>
              <div class="row q-mt-xl q-mb-xl">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Account Type"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="
                        customer.attributes.types.data[0].attributes.label
                      "
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="Old/New"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="customer.attributes.oldNew"
                    />
                  </strong>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <strong
                    ><q-input
                      v-model="text"
                      hint="System Registered"
                      :dense="dense"
                      readonly
                      class="q-mr-lg"
                      :label="customer.attributes.system"
                    />
                  </strong>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="orders">
            <!-- <pre>{{ oneShopReq }}</pre> -->
            <div v-if="customer.attributes.system === 'OneShop'">
              <q-table
                grid
                card-class="bg-dark text-white"
                title="Customer TSR: OneShop"
                row-key="name"
                :filter="filterView"
                hide-header
                :rows="osReq"
                :columns="columnsView"
              >
                <template v-slot:top-right>
                  <q-input
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

                <template
                  v-if="customer.attributes.system === 'OneShop'"
                  v-slot:item="props"
                >
                  <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4"
                    :item="props"
                  >
                    <!-- <pre>{{ props }}</pre> -->
                    <q-card class="bg-dark text-white">
                      <q-card-section class="text-left">
                        <p>
                          <label>TSR No.</label>
                          <br />
                          <strong>{{ props.row.tsrNo }}</strong>
                        </p>
                        <p>
                          <label>Job Type</label>
                          <br />
                          <strong
                            v-if="
                              props.row.jobtype === 'For Quotation' &&
                              props.row.status !== 'New' &&
                              props.row.status !== 'For customer approval' &&
                              props.row.status !== 'Cancelled' &&
                              props.row.status !== 'Deferred'
                            "
                            >{{ props.row.jobtype }} (Quoted)</strong
                          >
                          <strong
                            v-else-if="props.row.jobtype === 'Actual Time'"
                            >{{ props.row.jobtype }}</strong
                          >
                          <strong
                            v-else-if="props.row.jobtype === 'Time Sharing'"
                            >{{ props.row.jobtype }}</strong
                          >
                          <strong
                            v-else-if="
                              props.row.jobtype === 'For Quotation' &&
                              props.row.status === 'New' &&
                              props.row.status === 'For customer approval' &&
                              props.row.status === 'Cancelled' &&
                              props.row.status === 'Deferred'
                            "
                            >{{ props.row.jobtype }} (Quotation)</strong
                          >
                        </p>
                        <p>
                          <label>Status</label>
                          <br />
                          <strong>{{ props.row.status }}</strong>
                        </p>
                        <p>
                          <label>Service Name</label>
                          <br />
                          <strong>{{ props.row.service.name }}</strong>
                        </p>
                        <p>
                          <label>Date Created</label>
                          <br />
                          <strong>{{ props.row._dateCREATED }}</strong>
                        </p>
                        <p>
                          <label>Date Completed</label>
                          <br />
                          <strong>{{ props.row._dateCOMPLETED }}</strong>
                        </p>
                        <!-- <p>
                          <label>Date Last Updated</label>
                          <br />
                          <strong>{{
                            moment(props.row.dateLastUpdated).format("ll")
                          }}</strong>
                        </p> -->
                      </q-card-section>
                      <q-separator />
                      <!-- <q-card-section class="flex flex-center">
                        <div>test g</div>
                      </q-card-section> -->
                    </q-card>
                  </div>
                </template>
              </q-table>

              <q-table
                grid
                card-class="bg-dark text-white"
                title="Customer Orders: Physmet"
                row-key="name"
                :filter="filterView"
                hide-header
                hide
                :rows="physmetReq"
                :columns="columnsViewPhysmet"
              >
                <template v-slot:top-right>
                  <q-input
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
            </div>

            <q-table
              v-if="customer.attributes.system === 'PJOIS'"
              grid
              card-class="bg-dark text-white"
              title="Customer Orders"
              row-key="name"
              :filter="filterView"
              hide-header
              :rows="physmetReq"
              :columns="columnsViewPhysmet"
            >
              <template v-slot:top-right>
                <q-input
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

            <q-table
              v-if="customer.attributes.system === 'AIOS'"
              grid
              card-class="bg-dark text-white"
              title="Customer Orders"
              row-key="name"
              :filter="filterView"
              hide-header
              :rows="amcenReq"
              :columns="columnsViewAmcen"
            >
              <template v-slot:top-right>
                <q-input
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
            <!-- <div class="text-h5">
                Total No. of Order: {{ oneShopReq.total }}
              </div>
              <div class="q-pa-sm row items-start q-gutter-xl">
                <q-card
                  class="my-card"
                  style="width: 100%; max-width: 300px"
                  v-for="osReq in oneShopReq.data"
                  :key="osReq"
                >
                  <q-card-section class="bg-dark text-white">
                    <div class="text-h6">{{ osReq.tsrNo }}</div>
                  </q-card-section>

                  <q-card-actions vertical align="left">
                    <div class="text-subtitle1 text-dark">
                      {{ osReq.jobtype }}
                    </div>
                    <div class="text-subtitle1 text-dark">
                      {{ osReq.service.name }}
                    </div>
                    <div class="text-subtitle1 text-dark">
                      {{ osReq.status }}
                    </div>
                    <div class="text-subtitle1 text-dark">{{ osReq.date }}</div>
                  </q-card-actions>
                </q-card>
              </div> -->
            <!-- <div v-if="customer.attributes.system == 'OneShop'">
                {{ oneShopReq.data[0].tsrNo }}
              </div> -->
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { api, aiosapi, oneshop } from "boot/axios";
import { useQuasar } from "quasar";
import axios from "axios";
import moment from "moment";

export default {
  props: ["customer"],
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
    const viewCustomerDetailsModal = ref(false);
    const sectors = ref("");
    const filterView = ref("");
    const totalTransaction = ref(0);

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

    async function viewCustomerDetails(row) {
      axios
        .request({
          method: "get",
          baseURL:
            "http://10.10.120.32:3030/requests?statuss.action=Completed&customer._id=" +
            row.attributes.customer_id +
            "&$limit=1000",
        })
        .then((response) => {
          oneShopReq.value = response.data;
          // console.log("oneShopReq.value", oneShopReq.value);

          osReq.value = oneShopReq.value.data.map(function (val, idx, arr) {
            for (var i = 0; i < idx; i++) {
              if (arr[i].tsrNo === val.tsrNo) {
                return val;
              }
            }
            return val;
          });

          //   console.log("osReq", osReq.value);
          // osReq.value = oneShopReq.value.data.forEach((element) => {
          //   // console.log("element", element.tsrNo);
          // });
          // oneShopReq.value.forEach((element) => {
          //   console.log("element", element);
          // });
          // physmetCustomerTotal.value = response.data.meta.pagination.total;
          // console.log("erick response data", oneShopReq.value.data.data[0]);
        });
      axios
        .request({
          method: "get",
          baseURL:
            `http://10.10.120.32:1337/api/job-orders?populate=*&filters[customer_id][$eq]=` +
            row.attributes.customer_id +
            "&$limit=100",
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
            // console.log("val", val);
            for (var i = 0; i < idx; i++) {
              if (arr[i].jobOrderNo === val.jobOrderNo) {
                return val;
              }
              // console.log("val.jobOrderNo", val.jobOrderNo);
            }
            // console.log("physmetReq.value", physmetReq.value);
            return val;
          });
          // console.log("physmetReq.value", physmetReq.value);
        })
        .catch((error) => {
          console.log(error);
        });

      await aiosapi
        .get("/transactions?requester._id=" + row.attributes.customer_id)
        .then((response) => {
          aiosReq.value = response.data;
          // console.log("aiosReq.value", aiosReq.value);

          amcenReq.value = aiosReq.value.data.map(function (val, idx, arr) {
            // console.log("val", val);
            for (var i = 0; i < idx; i++) {
              if (arr[i].id === val.id) {
                return val;
              }
            }
            return val;
          });
        })
        .catch((error) => {
          console.error(error);
        });
      // console.log("row", row);
      selected_top.value = row.attributes;
      viewCustomerDetailsModal.value = true;
      // console.log("row-customerid", row.attributes.customer_id);
      sectors.value = Array.isArray(row.sector) ? row.sector[0] : row.sector;
    }

    // watch for changes in reactive variables
    watch([oneShopReq, pjoisReq, aiosReq], () => {
      // compute totalTransaction value
      const oneShopTotal = parseInt(oneShopReq.value.total) || 0;
      const pjoisTotal = parseInt(pjoisReq.value.meta.pagination.total) || 0;
      const aiosTotal = parseInt(aiosReq.value.total) || 0;
      totalTransaction.value = oneShopTotal + pjoisTotal + aiosTotal;
    });

    return {
      viewCustomerDetails,
      columnsView,
      columnsViewAmcen,
      columnsViewPhysmet,
      physmetReq,
      text: ref(""),
      dense: ref(false),
      selected_top,
      viewCustomerDetailsModal,
      sectors,
      dialog: ref(false),
      maximizedToggle: ref(true),
      tab: ref("details"),
      filterView,
      osReq,
      aiosReq,
      pjoisReq,
      amcenReq,
      oneShopReq,
      totalTransaction,
    };
  },
};
</script>

<style></style>
