<template>
  <div class="row items-center justify-between">
    <strong class="text-center"><label>SYSTEMS CHART</label></strong>

    <q-btn class="transparent" icon="filter_list" unelevated no-caps>
      <q-menu>
        <q-list class="q-pa-md" style="min-width: 400px">
          <q-item-label header>Filter</q-item-label>
          <q-item>
            <q-item-section>
              <q-input
                filled
                v-model="startDate"
                mask="date"
                :rules="['date']"
                label="From"
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
                label="To"
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
  <Pie
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Pie } from "vue-chartjs";
import moment from "moment";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

import { getAllCustomerData } from "src/provider.js";
import { onMounted, ref, nextTick } from "vue";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "PieChart",
  components: {
    Pie,
  },
  props: {
    chartId: {
      type: String,
      default: "pie-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const startDate = ref("");
    const endDate = ref("");
    const chartData = ref({
      labels: ["OneShop", "ULIMS", "AIOS", "PJOIS"],
      datasets: [
        {
          backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
          data: [0, 0, 0, 0],
        },
      ],
    });
    // console.log("chartData.value.labels", chartData.value.labels);
    const model = ref(null);
    const qs = require("qs");

    const customerExist = ref([]);
    const attrSystem = ref([]);

    const customerTotalOneShop = ref(0);
    const customerTotalULIMS = ref(0);
    const customerTotalAIOS = ref(0);
    const customerTotalPJOIS = ref(0);

    async function getCustomerOneShop(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {},
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };
      if (chartData.value.labels) {
        // console.log("query", query)
        query.filters.system = {
          $eq: chartData.value.labels[0],
        };
      }

      if (startDate.value && endDate.value) {
        query.filters.dateCreated = {
          $gte: moment(startDate.value).format(),
          $lte: moment(endDate.value).format(),
        };
      }

      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalOneShop.value = customerExist.data.meta.pagination.total;
      chartData.value.datasets[0].data = [
        customerTotalOneShop,
        customerTotalULIMS,
        customerTotalAIOS,
        customerTotalPJOIS,
      ];
      // customerExist.value.data.data.forEach((element) => {
      //   let attrObj = element.attributes;
      //   attrSystem.value.push({
      //     label: element.attributes.system,
      //   });
      // });
      // console.log("attrSystem.value", attrSystem.value);
      // console.log("customerExist", customerExist)
      // console.log("count oneshop", customerExist.data.data.)
    }

    async function getCustomerAIOS(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {},
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };
      if (chartData.value.labels) {
        // console.log("query2",query)
        query.filters.system = {
          $eq: chartData.value.labels[2],
        };
      }

      if (startDate.value && endDate.value) {
        query.filters.dateCreated = {
          $gte: moment(startDate.value).format(),
          $lte: moment(endDate.value).format(),
        };
      }

      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalAIOS.value = customerExist.data.meta.pagination.total;
      // customerExist.value.data.data.forEach((element) => {
      //   let attrObj = element.attributes;
      //   attrSystem.value.push({
      //     label: element.attributes.system,
      //   });
      // });
      // console.log("attrSystem.value", attrSystem.value);
      // console.log("customerExist", customerExist)
      // console.log("count oneshop", customerExist.data.data.)
    }

    async function getCustomerPJOIS(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {},
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };

      if (chartData.value.labels) {
        // console.log("query3",query)
        query.filters.system = {
          $eq: chartData.value.labels[3],
        };
      }

      if (startDate.value && endDate.value) {
        query.filters.dateCreated = {
          $gte: moment(startDate.value).format(),
          $lte: moment(endDate.value).format(),
        };
      }

      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalPJOIS.value = customerExist.data.meta.pagination.total;
      // customerExist.value.data.data.forEach((element) => {
      //   let attrObj = element.attributes;
      //   attrSystem.value.push({
      //     label: element.attributes.system,
      //   });
      // });
      // console.log("attrSystem.value", attrSystem.value);
      // console.log("customerExist", customerExist)
      // console.log("count oneshop", customerExist.data.data.)
    }

    async function getCustomerULIMS(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {},
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };
      if (chartData.value.labels) {
        // console.log("query1",query)
        query.filters.system = {
          $eq: chartData.value.labels[1],
        };
      }

      if (startDate.value && endDate.value) {
        query.filters.dateCreated = {
          $gte: moment(startDate.value).format(),
          $lte: moment(endDate.value).format(),
        };
      }

      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalULIMS.value = customerExist.data.meta.pagination.total;
      // customerExist.value.data.data.forEach((element) => {
      //   let attrObj = element.attributes;
      //   attrSystem.value.push({
      //     label: element.attributes.system,
      //   });
      // });
      // console.log("attrSystem.value", attrSystem.value);
      // console.log("customerExist", customerExist)
      // console.log("count oneshop", customerExist.data.data.)
    }

    async function loadAlldata() {
      await nextTick();
      getCustomerOneShop({
        // pagination: pagination.value,
        filter: undefined,
      });
      getCustomerAIOS({
        // pagination: pagination.value,
        filter: undefined,
      });
      getCustomerPJOIS({
        // pagination: pagination.value,
        filter: undefined,
      });
      getCustomerULIMS({
        // pagination: pagination.value,
        filter: undefined,
      });
      // console.log("accountTypeModel", accountTypeModel.value);
    }

    onMounted(() => {
      getCustomerOneShop();
      getCustomerAIOS();
      getCustomerPJOIS();
      getCustomerULIMS();
      loadAlldata();
    });
    return {
      loadAlldata,
      attrSystem,
      customerExist,
      chartData,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      model,
      getCustomerOneShop,
      getCustomerAIOS,
      getCustomerPJOIS,
      getCustomerULIMS,

      customerTotalOneShop,
      customerTotalAIOS,
      customerTotalPJOIS,
      customerTotalULIMS,
      startDate,
      endDate,
    };
  },
};
</script>
