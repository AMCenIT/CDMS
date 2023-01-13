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
    const chartData = ref({
        labels: ["OneShop", "ULIMS", "AIOS", "PJOIS"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data: [0, 0, 0, 0],
          },
        ],
      })
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
          $eq: chartData.value.labels[0]
        }
      }
      
      const customerExist = await getAllCustomerData(qs.stringify(query));
     customerTotalOneShop.value = customerExist.data.meta.pagination.total
      chartData.value.datasets[0].data = [customerTotalOneShop, customerTotalULIMS, customerTotalAIOS, customerTotalPJOIS]
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
          $eq: chartData.value.labels[2]
        }
      }
      
      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalAIOS.value = customerExist.data.meta.pagination.total
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
          $eq: chartData.value.labels[3]
        }
      }
      
      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalPJOIS.value = customerExist.data.meta.pagination.total
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
          $eq: chartData.value.labels[1]
        }
      }
      
      const customerExist = await getAllCustomerData(qs.stringify(query));
      customerTotalULIMS.value = customerExist.data.meta.pagination.total
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
    onMounted(() => {
      getCustomerOneShop();
      getCustomerAIOS();
      getCustomerPJOIS();
      getCustomerULIMS();
    });
    return {
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
    };
  },
};
</script>
