<template>
  <LineChartGenerator
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
import { Line as LineChartGenerator } from "vue-chartjs";
import { onMounted, ref, getCurrentInstance } from "vue";
import {
  getAllCustomerData,
  getALLOneShopRequestDataOneShop,
  getTransactionDataAllaios,
  getJobOrderPhysmet,
} from "src/provider.js";
import axios from "axios";
import moment from "moment";
import { api, aiosapi, oneshop } from "boot/axios";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
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
    const app = getCurrentInstance().appContext.config.globalProperties;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 10;
    console.log("currentmonth", currentMonth);
    const yearsAgo = ref([]);
    for (let i = 3; i >= 0; i--) {
      yearsAgo.value.push(currentYear - i * 1);
    }
    const qs = require("qs");
    const janTotal = ref(0);
    const febTotal = ref(0);
    const chartData = ref({
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: `${yearsAgo.value[3]}`,
          backgroundColor: "#41B883",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: `${yearsAgo.value[2]}`,
          backgroundColor: "#E46651",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: `${yearsAgo.value[1]}`,
          backgroundColor: "#00D8FF",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: `${yearsAgo.value[0]}`,
          backgroundColor: "#DD1B16",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    });
    console.log("Linechart", chartData.value.datasets);
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
    });

    const oneShopReq = ref([]);
    const osReq = ref([]);
    const currentYearTransaction = ref(0);

    const queries = ref([]);
    const tsrTotal = ref([]);
    const tsrTotalTwo = ref([]);
    const tsrTotalThree = ref([]);
    const tsrTotalFour = ref([]);
    const elementTotal = ref([]);

    const physmetJobTot = ref([]);
    // const osaxios = ref([]);

    async function getTransactionOneShop(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      for (let month = 1; month <= currentMonth; month++) {
        if (yearsAgo.value[3]) {
          const startOfMonth = new Date(
            yearsAgo.value[3],
            month - 1,
            1
          ).getTime();
          const endOfMonth = new Date(yearsAgo.value[3], month, 0).getTime();
          const query = {
            created_at: {
              $gte: moment(startOfMonth).format(),
              $lte: moment(endOfMonth).format(),
            },
          };

          // if (query === 1675180800000 && query === 1675094400000) {
          //   chartData.value.datasets[0].data = [janTotal.value, febTotal.value];
          //   console.log("janTotal.value", janTotal.value);
          // }
          // console.log("startOfMonth", startOfMonth);
          // console.log("endOfMonth", endOfMonth);
          // console.log("query", query);
          const tsrExist = await getALLOneShopRequestDataOneShop(
            qs.stringify(query)
          );
          queries.value.push(query);
          tsrTotal.value.push(tsrExist.total);
          // console.log("tsrTotal.total", tsrTotal.value);
          // console.log("queries.value", queries.value);
          // console.log("tsrTotal.value", tsrTotal.value);
          // chartData.value.datasets[0].data = [tsrTotal.value[0].total];
          // console.log(
          //   "chartData.value.datasets[0]",
          //   chartData.value.datasets[0]
          // );
          chartData.value.datasets[0].data[0] =
            tsrTotal.value[0] + physmetJobTot.value[0];
          chartData.value.datasets[0].data[1] =
            tsrTotal.value[1] + physmetJobTot.value[1];
          chartData.value.datasets[0].data[2] =
            tsrTotal.value[2] + physmetJobTot.value[2];
          chartData.value.datasets[0].data[3] = tsrTotal.value[3];
          chartData.value.datasets[0].data[4] = tsrTotal.value[4];
          chartData.value.datasets[0].data[5] = tsrTotal.value[5];
          chartData.value.datasets[0].data[6] = tsrTotal.value[6];
          chartData.value.datasets[0].data[7] = tsrTotal.value[7];
          chartData.value.datasets[0].data[8] = tsrTotal.value[8];
          chartData.value.datasets[0].data[9] = tsrTotal.value[9];
          chartData.value.datasets[0].data[10] = tsrTotal.value[10];
          chartData.value.datasets[0].data[11] = tsrTotal.value[11];
        }
        // chartData.value.datasets.map((dataset) => {
        //   dataset.data[0] = tsrTotal.value[0] + physmetJobTot.value[0];
        //   dataset.data[1] = tsrTotal.value[1] + physmetJobTot.value[1];
        //   dataset.data[2] = tsrTotal.value[2];
        //   dataset.data[3] = tsrTotal.value[3];
        //   dataset.data[4] = tsrTotal.value[4];
        //   dataset.data[5] = tsrTotal.value[5];
        //   dataset.data[6] = tsrTotal.value[6];
        //   dataset.data[7] = tsrTotal.value[7];
        //   dataset.data[8] = tsrTotal.value[8];
        //   dataset.data[9] = tsrTotal.value[9];
        //   dataset.data[10] = tsrTotal.value[10];
        //   dataset.data[11] = tsrTotal.value[11];
        // });
        // tsrTotal.value((tsrTot) => {
        //   console.log("tsrTot", tsrTot);
        // });
        // chartData.value.datasets[0].data = [tsrTotal.value[0].total];
      }
    }

    async function getTransactionOneShopYearAgo(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      for (let month = 1; month <= currentMonth; month++) {
        if (yearsAgo.value[2]) {
          const startOfMonth = new Date(
            yearsAgo.value[2],
            month - 1,
            1
          ).getTime();
          const endOfMonth = new Date(yearsAgo.value[2], month, 0).getTime();
          const query = {
            // created_at: {
            //   $gte: moment(startOfMonth).format("YYYY-MM-DD"),
            //   $lte: moment(endOfMonth).format("YYYY-MM-DD"),
            // },
            $or: [
              {
                created_at: {
                  $gte: moment(startOfMonth).format(),
                  $lte: moment(endOfMonth).format(),
                },
              },
              {
                dateFormatted: {
                  $gte: moment(startOfMonth).format(),
                  $lte: moment(endOfMonth).format(),
                },
              },
            ],
          };
          // console.log(
          //   "adasdasasdqweqweqww",
          //   moment(startOfMonth).format("YYYY-MM-DD")
          // );

          const tsrExist = await getALLOneShopRequestDataOneShop(
            qs.stringify(query)
          );
          // console.log("tsrExist", tsrExist);
          queries.value.push(query);
          tsrTotalTwo.value.push(tsrExist.total);
          chartData.value.datasets[1].data[0] = tsrTotalTwo.value[0];
          chartData.value.datasets[1].data[1] = tsrTotalTwo.value[1];
          chartData.value.datasets[1].data[2] = tsrTotalTwo.value[2];
          chartData.value.datasets[1].data[3] = tsrTotalTwo.value[3];
          chartData.value.datasets[1].data[4] = tsrTotalTwo.value[4];
          chartData.value.datasets[1].data[5] = tsrTotalTwo.value[5];
          chartData.value.datasets[1].data[6] = tsrTotalTwo.value[6];
          chartData.value.datasets[1].data[7] = tsrTotalTwo.value[7];
          chartData.value.datasets[1].data[8] = tsrTotalTwo.value[8];
          chartData.value.datasets[1].data[9] = tsrTotalTwo.value[9];
          chartData.value.datasets[1].data[10] = tsrTotalTwo.value[10];
          chartData.value.datasets[1].data[11] = tsrTotalTwo.value[11];

          // console.log(
          //   "chartData.value.datasets[1]",
          //   chartData.value.datasets[1]
          // );
        }
      }
    }

    async function getTransactionOneShopTwoYearAgo(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      for (let month = 1; month <= currentMonth; month++) {
        if (yearsAgo.value[1]) {
          const startOfMonth = new Date(
            yearsAgo.value[1],
            month - 1,
            1
          ).getTime();
          const endOfMonth = new Date(yearsAgo.value[1], month, 0).getTime();
          const query = {
            dateFormatted: {
              $gte: moment(startOfMonth).format(),
              $lte: moment(endOfMonth).format(),
            },
          };
          // console.log("startOfMonth", startOfMonth);

          const tsrExist = await getALLOneShopRequestDataOneShop(
            qs.stringify(query)
          );
          queries.value.push(query);
          tsrTotalThree.value.push(tsrExist.total);
          chartData.value.datasets[2].data[0] = tsrTotalThree.value[0];
          chartData.value.datasets[2].data[1] = tsrTotalThree.value[1];
          chartData.value.datasets[2].data[2] = tsrTotalThree.value[2];
          chartData.value.datasets[2].data[3] = tsrTotalThree.value[3];
          chartData.value.datasets[2].data[4] = tsrTotalThree.value[4];
          chartData.value.datasets[2].data[5] = tsrTotalThree.value[5];
          chartData.value.datasets[2].data[6] = tsrTotalThree.value[6];
          chartData.value.datasets[2].data[7] = tsrTotalThree.value[7];
          chartData.value.datasets[2].data[8] = tsrTotalThree.value[8];
          chartData.value.datasets[2].data[9] = tsrTotalThree.value[9];
          chartData.value.datasets[2].data[10] = tsrTotalThree.value[10];
          chartData.value.datasets[2].data[11] = tsrTotalThree.value[11];
          // console.log(
          //   "chartData.value.datasets[2]",
          //   chartData.value.datasets[2]
          // );
        }
      }
    }

    async function getTransactionOneShopThreeYearAgo(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      for (let month = 1; month <= currentMonth; month++) {
        if (yearsAgo.value[0]) {
          const startOfMonth = new Date(
            yearsAgo.value[0],
            month - 1,
            1
          ).getTime();
          const endOfMonth = new Date(yearsAgo.value[0], month, 0).getTime();
          const query = {
            dateFormatted: {
              $gte: moment(startOfMonth).format(),
              $lte: moment(endOfMonth).format(),
            },
          };
          const tsrExist = await getALLOneShopRequestDataOneShop(
            qs.stringify(query)
          );
          queries.value.push(query);
          tsrTotalFour.value.push(tsrExist.total);
          chartData.value.datasets[3].data[0] = tsrTotalFour.value[0];
          chartData.value.datasets[3].data[1] = tsrTotalFour.value[1];
          chartData.value.datasets[3].data[2] = tsrTotalFour.value[2];
          chartData.value.datasets[3].data[3] = tsrTotalFour.value[3];
          chartData.value.datasets[3].data[4] = tsrTotalFour.value[4];
          chartData.value.datasets[3].data[5] = tsrTotalFour.value[5];
          chartData.value.datasets[3].data[6] = tsrTotalFour.value[6];
          chartData.value.datasets[3].data[7] = tsrTotalFour.value[7];
          chartData.value.datasets[3].data[8] = tsrTotalFour.value[8];
          chartData.value.datasets[3].data[9] = tsrTotalFour.value[9];
          chartData.value.datasets[3].data[10] = tsrTotalFour.value[10];
          chartData.value.datasets[3].data[11] = tsrTotalFour.value[11];
          // console.log(
          //   "chartData.value.datasets[3]",
          //   chartData.value.datasets[3]
          // );
        }
      }
    }

    // async function getTransactionAmcen(
    //   startRow,
    //   count,
    //   filter,
    //   sortBy,
    //   descending
    // ) {
    //   for (let month = 1; month <= currentMonth; month++) {
    //     const startOfMonth = new Date(currentYear, month - 1, 1).getTime();
    //     const endOfMonth = new Date(currentYear, month, 0).getTime();
    //     const query = {
    //       "history.date": {
    //         $gte: moment(startOfMonth).format(),
    //         $lte: moment(endOfMonth).format(),
    //       },
    //     };

    //     // if (query === 1675180800000 && query === 1675094400000) {
    //     //   chartData.value.datasets[0].data = [janTotal.value, febTotal.value];
    //     //   console.log("janTotal.value", janTotal.value);
    //     // }
    //     console.log("startOfMonthdadasd", startOfMonth);
    //     console.log("endOfMonthdasds", endOfMonth);
    //     console.log("querasdasdasdasdy", query);
    //     const tsrExist = await getTransactionDataAllaios(qs.stringify(query));
    //     console.log("tsrExisasdasdadasdas", tsrExist);
    //     // queries.value.push(query);
    //     tsrTotal.value.push(tsrExist.total);
    //     console.log("queries.valueasdasdasddas", queries.value);
    //     console.log("tsrTotal.value", tsrTotal.value);
    //     // chartData.value.datasets[0].data = [tsrTotal.value[0].total];
    //     // tsrTotal.value((tsrTot) => {
    //     //   console.log("tsrTot", tsrTot);
    //     // });
    //     // chartData.value.datasets[0].data = [tsrTotal.value[0].total];
    //   }
    // }

    async function getTransactionPhysmet(
      startRow,
      count,
      filter,
      sortBy,
      descending
    ) {
      for (let month = 1; month <= currentMonth; month++) {
        const startOfMonth = new Date(
          `${currentYear}-${month.toString().padStart(2, "0")}-01T00:00:00.000Z`
        );
        const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);

        const startISOString = startOfMonth.toISOString();
        const endISOString = endOfMonth.toISOString();

        const config = {
          method: "get",
          url: "",
          headers: {
            Authorization:
              "Bearer " +
              "1a951bf72526c8dcf2abb2143458e612442d4814f1ddd9d6d2c58af3ead67d769c5115c63da7a633a1d8d6cfaaaa9fe4adfb62dafda09fc5cc083bea930035197c24f013c905ae5ca0884376fc0153cc419565f4209f27ae7c983fd340a6d963a371f5a1236f517ec038c633d0cad60754cefbb62247fe98b1d6bb1b40fc5f8a",
          },
        };
        config.url = `http://10.10.120.32:1337/api/job-orders?filters[createdAt][$gte]=${startISOString}&filters[createdAt][$lte]=${endISOString}&populate=*`;

        // console.log("config.url", config.url);
        queries.value.push(config.url);

        const response = await app.$axios(config);
        console.log("tsrTotal.value[0]", tsrTotal.value[0]);
        physmetJobTot.value.push(response.data.data.length);
        chartData.value.datasets.map((dataset) => {
          dataset.data[0] = physmetJobTot.value[0] + tsrTotal.value[0];
          dataset.data[1] = physmetJobTot.value[1] + tsrTotal.value[1];
          dataset.data[2] = physmetJobTot.value[2] + tsrTotal.value[2];
          dataset.data[3] = physmetJobTot.value[3] + tsrTotal.value[3];
          dataset.data[4] = physmetJobTot.value[4] + tsrTotal.value[4];
          dataset.data[5] = physmetJobTot.value[5] + tsrTotal.value[5];
          dataset.data[6] = physmetJobTot.value[6] + tsrTotal.value[6];
          dataset.data[7] = physmetJobTot.value[7] + tsrTotal.value[7];
          dataset.data[8] = physmetJobTot.value[8] + tsrTotal.value[8];
          dataset.data[9] = physmetJobTot.value[9] + tsrTotal.value[9];
          dataset.data[10] = physmetJobTot.value[10] + tsrTotal.value[10];
          dataset.data[11] = physmetJobTot.value[11] + tsrTotal.value[11];
        });
        // console.log("response", response.data.data);
        // console.log("startISOString", startISOString);
        // console.log("responsesdasds", response.data);
        // console.log(moment(startOfMonth).toISOString());
        // console.log(moment(endOfMonth).toISOString());
        // console.log("config", config.url);
        // physmetJanTot.value = response.data.data.length;
        // console.log("queries", queries.value);
      }
    }

    onMounted(() => {
      getTransactionOneShopThreeYearAgo();
      getTransactionOneShopTwoYearAgo();
      getTransactionOneShop();
      getTransactionOneShopYearAgo();
      // getTransactionAmcen();
      getTransactionPhysmet();
    });

    return {
      getTransactionOneShopThreeYearAgo,
      tsrTotalFour,
      getTransactionOneShopTwoYearAgo,
      tsrTotalThree,
      tsrTotalTwo,
      getTransactionOneShopYearAgo,
      yearsAgo,
      chartData,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      getTransactionOneShop,
      // getTransactionAmcen,
      getTransactionPhysmet,
      oneShopReq,
      osReq,
      currentYearTransaction,
      janTotal,
      febTotal,
      queries,
      tsrTotal,
      elementTotal,
      physmetJobTot,
      // osaxios,
    };
  },
};
</script>
