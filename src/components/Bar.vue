<template>
  <!-- <div class="row justify-center items-center" v-if="loading">
    <div class="text-h6 q-mr-lg">PLEASE WAIT...</div>
    <q-spinner-cube color="primary" size="xl" />
  </div> -->
  <div>
    <Bar
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
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import axios from "axios";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { onMounted, ref, getCurrentInstance, watch } from "vue";
import { getAllCustomerData } from "src/provider.js";
import { createCompoundExpression } from "@vue/compiler-core";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "HorizontalBar",
  components: {
    Bar,
  },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
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
    const loading = ref(true);
    const customerCountPerSector = ref([]);
    const labelElement = ref([]);
    const labelSec = ref([]);
    const app = getCurrentInstance().appContext.config.globalProperties;
    const sectorCovOptions = ref([]);
    const sectorCovModel = ref(null);
    const noOfCustomerPerSector = ref([]);
    const labelSector = ref([]);
    const qs = require("qs");

    async function loadIndustries() {
      const config = {
        method: "get",
        url: "http://10.10.120.19:1336/api/industries?filters[customers][id][$notNull]=true&populate[customers][count]=true&pagination[page]=1&pagination[pageSize]=40",
        headers: {
          Authorization:
            "Bearer " +
            "881eadd7227fbec291e2f8bc157473e9c5f66b0a396a2c54edc60fff0f2a01c88c5ff46cef7757dd4da9a123c43b6dd2363fc2baf0405913e6e288eb547817d3d13cbfd41404385c811c28e3539677ce0fa5ad7ebd497ffd04e0618605f6602d25cd3230eb8dccd57cb308b96b6f1fa6f9063a4d7f09e56ee39b78a540418c01",
        },
      };

      const response = await app.$axios(config);
      // console.log("industries", response);
      sectorCovOptions.value = response.data.data.map((o) => ({
        id: o.id,
        ...o.attributes,
      }));
      labelElement.value = sectorCovOptions.value.map((o) => o.label);
      noOfCustomerPerSector.value = sectorCovOptions.value.map(
        (o) => o.customers.data.attributes.count
      );
      // console.log("noOfCustomer", noOfCustomerPerSector.value);
      // noOfCustomerPerSector.value = sectorCovOptions.value.map((o))

      // console.log("label", labelElement.value);
    }

    watch(labelElement, (newValue) => {
      // Update `chartData.labels` when `labelElement` changes
      chartData.value.labels = newValue;
    });
    watch(noOfCustomerPerSector, (newValue) => {
      // console.log("noOfCustomerPerSector changed:", newValue);
      chartData.value.datasets.forEach((data) => {
        data.data = newValue;
      });
      // console.log("chartData updated:", chartData.value);
    });
    const chartData = ref({
      labels: labelElement.value,
      datasets: [
        {
          label: "Transaction Availability",
          backgroundColor: "#3e95cd",
          data: noOfCustomerPerSector.value,
        },
      ],
    });
    // console.log("chartData", chartData.value);
    // async function getCustomerCountSector() {
    //   try {
    //     const response = await axios.get(
    //       "http://10.10.120.19:1336/api/industry",
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     // const data = response.data;
    //     customerCountPerSector.value = response.data.data.map((c) => c);
    //     // console.log("customerCount", customerCountPerSector.value);
    //     labelSector.value = customerCountPerSector.value.map(
    //       (element) => element.industry
    //     );

    //     noOfCustomerPerSector.value = customerCountPerSector.value.map(
    //       (element) =>
    //         element.number_of_customers
    //           ? element.number_of_customers
    //           : element.number_of_customer
    //       // .customers
    //       //   ? element.number_of_customers
    //       //   : element.Number_of_Customers
    //       // .number_of_customers
    //     );
    //     // console.log("noOfCustomerPerSector", noOfCustomerPerSector.value);
    //     // Do something with the data
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    onMounted(() => {
      loadIndustries();
      // getCustomerCountSector();
      setTimeout(() => {
        loading.value = false;
      }, 10000); // Wait 10 seconds before setting loading to false
    });
    return {
      loading,
      noOfCustomerPerSector,
      // getCustomerCountSector,
      loadIndustries,
      chartData,
      chartOptions: {
        scales: {
          x: {
            ticks: {
              beginAtZero: true,
            },
          },
        },
      },
      sectorCovOptions,
      sectorCovModel,
      labelSec,
      labelElement,
      customerCountPerSector,
      labelSector,
    };
  },
};
</script>
