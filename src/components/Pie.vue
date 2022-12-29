<template>
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

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

import { getAllCustomerData } from "src/provider.js";
import { onMounted, ref } from "vue";

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
    const customerExist = ref([]);
    const attrSystem = ref([]);
    async function getCustomer() {
      customerExist.value = await getAllCustomerData();
      // customerExist.value.data.data.forEach((element) => {
      //   let attrObj = element.attributes;
      //   attrSystem.value.push({
      //     label: element.attributes.system,
      //   });
      // });
      // console.log("attrSystem.value", attrSystem.value);
    }
    onMounted(() => {
      getCustomer();
    });
    return {
      attrSystem,
      customerExist,
      getCustomer,
      chartData: {
        labels: ["OneShop", "ULIMS", "AIOS", "PJOIS"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data: [40, 20, 80, 10],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>
