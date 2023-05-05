<template>
  <Doughnut
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
import { Doughnut } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { onMounted, ref } from "vue";
import { getAllCustomerData } from "src/provider.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "DoughnutChart",
  components: {
    Doughnut,
  },
  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
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
    const chartData = ref({
      labels: ["Internal", "External", "Student"],
      datasets: [
        {
          backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
          data: [0, 0, 0],
        },
      ],
    });
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
    });

    const qs = require("qs");

    const customerExist = ref([]);
    const customerTotalInternal = ref(0);
    const customerTotalExternal = ref(0);
    const customerTotalStudent = ref(0);

    async function getInternalCustomer(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {
          types: {},
        },
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };
      if (chartData.value.labels) {
        // console.log("query", query)
        query.filters.types = {
          label: {
            $eq: chartData.value.labels[0],
          },
        };
      }

      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalInternal.value = customerExist.data.meta.pagination.total;
      chartData.value.datasets[0].data = [
        customerTotalInternal,
        customerTotalExternal,
        customerTotalStudent,
      ];
    }

    async function getExternallCustomer(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {
          types: {},
        },
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };
      if (chartData.value.labels) {
        // console.log("query", query)
        query.filters.types = {
          label: {
            $eq: chartData.value.labels[1],
          },
        };
      }

      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalExternal.value = customerExist.data.meta.pagination.total;
    }

    async function getStudentCustomer(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      const query = {
        filters: {
          types: {},
        },
        populate: ["industry", "type"],
        pagination: {
          start: startRow,
          limit: count,
        },
      };
      if (chartData.value.labels) {
        // console.log("query", query)
        query.filters.types = {
          label: {
            $eq: chartData.value.labels[2],
          },
        };
      }

      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalStudent.value = customerExist.data.meta.pagination.total;
    }

    onMounted(() => {
      getInternalCustomer();
      getExternallCustomer();
      getStudentCustomer();
    });

    return {
      chartData,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      customerExist,
      customerTotalInternal,
      customerTotalExternal,
      customerTotalStudent,
      getInternalCustomer,
      getExternallCustomer,
      getStudentCustomer,
    };
  },
};
</script>
