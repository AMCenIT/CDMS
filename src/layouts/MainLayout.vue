<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-9">
    <q-header
      elevated
      class="bg-white text-secondary q-py-xs bg-blue-grey-7"
      height-hint="58"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          size="1.4em"
        />

        <img
          src="~assets/cdms-logo.png"
          width="200"
          v-if="!$q.screen.lt.md"
          clickable
          @click="$router.push('/MainLayout/Home')"
          style="cursor: pointer"
        />
        <img
          src="~assets/cdms-logo.png"
          width="100"
          v-if="$q.screen.lt.md"
          clickable
          @click="$router.push('/MainLayout/Home')"
          style="cursor: pointer"
        />
        <img src="~assets/logo.png" width="190" />
        <q-space />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn flat round icon="notifications" @click="showNotif">
            <q-badge
              v-if="
                physmetCustomer +
                oneShopCustomerTotal +
                aiosUser.total -
                segregateDupli
              "
              floating
              color="red"
              rounded
              >{{
                physmetCustomer +
                oneShopCustomerTotal +
                aiosUser.total -
                segregateDupli +
                24
              }}</q-badge
            >
          </q-btn>
          <q-btn
            round
            flat
            color="secondary"
            size="1.4em"
            icon="account_circle"
          >
            <q-tooltip>Log out</q-tooltip>
            <q-menu
              transition-show="flip-right"
              transition-hide="flip-left"
              class="bg-blue-grey-7"
            >
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-secondary"
                    >Profile</q-item-section
                  >
                </q-item>
                <q-separator />
                <q-item clickable @click="logout" class="bg-secondary">
                  <q-item-section class="text-white">LOG OUT</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-secondary"
      :width="240"
      class="bg-blue-grey-7"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item class="my-card bg-secondary text-white">
            <q-tooltip>Account</q-tooltip>

            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <div class="text-subtitle2">
                User: {{ displayName }}
                <br />
                Employee Id: {{ userid }}
              </div>
            </q-item-section>
          </q-item>

          <q-item @click="$router.push('/MainLayout/Home')" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="secondary" name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            @click="$router.push('/MainLayout/Customer')"
            v-ripple
            clickable
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Customer Infomation</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            @click="$router.push('/MainLayout/crudCustomer')"
            v-ripple
            clickable
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label>CRUD Customer </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            @click="$router.push('/MainLayout/Transaction')"
            v-ripple
            clickable
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="work" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Customer per System</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-expansion-item
            expand-separator
            icon="library_books"
            label="Others"
          >
            <!-- <q-item
              v-ripple
              clickable
              @click="$router.push('/MainLayout/Home')"
            >
              <q-item-section avatar>
                <q-icon color="grey" name="history" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Transaction History</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              @click="$router.push('/MainLayout/Home')"
            >
              <q-item-section avatar>
                <q-icon color="grey" name="analytics" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Analytics</q-item-label>
              </q-item-section>
            </q-item> -->

            <q-item
              v-ripple
              clickable
              @click="$router.push('/MainLayout/Home')"
            >
              <q-item-section avatar>
                <q-icon color="grey" name="summarize" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Report</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              @click="$router.push('/MainLayout/Home')"
            >
              <q-item-section avatar>
                <q-icon color="grey" name="notebook" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Logs</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- <q-btn @click="getStartEndDate()" label="filter"></q-btn>
    <q-input filled v-model="startDate" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="startDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input filled v-model="endDate" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="endDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input> -->
      <router-view class="q-pa-md" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import {
  getAllCustomerDataOneShop,
  getAllCustomerData,
  getCustomerDataAllaios,
  getALLOneShopRequestDataOneShop,
} from "src/provider.js";
import axios from "axios";

export default {
  setup() {
    const $q = useQuasar();
    const qs = require("qs");
    const router = useRouter();
    const displayName = ref("");
    const userid = ref("");
    const leftDrawerOpen = ref(false);

    const oneShopCustomer = ref([]);
    const allCustomer = ref([]);
    const oneShopCustomerTotal = ref(0);
    const segregateDupli = ref([]);
    const aiosUser = ref([]);

    const startDate = ref("2022/02/01");
    const endDate = ref("2019/02/01");

    const physmetCustomer = ref("");

    const store = useStore();
    // userprofile getter
    const userLoggedin = computed(() => store.getters["auth/getUserProfile"]);

    // AIOS USERGETter
    const userLoggedinAIOS = computed(
      () => store.getters["aiosauth/getUserProfile"]
    );

    userid.value = userLoggedin.value.username;
    displayName.value = userLoggedin.value.displayName;

    const loginStatus = computed(() => store.getters["auth/getLoginApiStatus"]);
    const loginStatusAIOS = computed(
      () => store.getters["aiosauth/getLoginApiStatus"]
    );

    async function logout() {
      await store.dispatch("auth/logout");
      await store.dispatch("aiosauth/logout");

      router.push("/Login");
    }

    async function getAllCustomerOneShop() {
      oneShopCustomer.value = await getAllCustomerDataOneShop();
      // console.log("oneShopCustomer.value", oneShopCustomer.value);
      oneShopCustomerTotal.value = oneShopCustomer.value.data
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
        .filter((d) => d.isTrue === false).length;

      // console.log("oneShopCustomerTotal.value", oneShopCustomerTotal.value);
    }

    async function getAiosUser(startRow, count) {
      const query = qs.stringify(
        {
          $skip: startRow,
          $limit: count,
        },

        {
          encodeValuesOnly: true,
        }
      );

      aiosUser.value = await getCustomerDataAllaios(query);
      // console.log("AIOS CUSTOMER RESPONSE", aiosUser.value.total);
      return aiosUser.value;
    }

    async function getAllCustomerSynced() {
      allCustomer.value = await getAllCustomerData();
      segregateDupli.value = allCustomer.value.data.meta.pagination.total;
      console.log("allCustomer", segregateDupli.value);
      // console.log("allCustomer.value", allCustomer.value.data.data);
    }

    async function getPhysmetCustomerSynced() {
      axios
        .request({
          method: "get",
          baseURL: "http://10.10.120.32:1337/api/job-orders",
          headers: {
            Authorization:
              "Bearer" +
              "1a951bf72526c8dcf2abb2143458e612442d4814f1ddd9d6d2c58af3ead67d769c5115c63da7a633a1d8d6cfaaaa9fe4adfb62dafda09fc5cc083bea930035197c24f013c905ae5ca0884376fc0153cc419565f4209f27ae7c983fd340a6d963a371f5a1236f517ec038c633d0cad60754cefbb62247fe98b1d6bb1b40fc5f8a",
          },
        })
        .then((response) => {
          physmetCustomer.value = response.data.meta.pagination.total;
          // console.log('erick response data', physmetCustomer.value)
        });
    }

    // async function getStartEndDate() {
    //   const query = qs.stringify(
    //     {
    //       // $skip: startRow,
    //       // $limit: count,
    //       created_at: {
    //         $lte: endDate.value,
    //         $gte: startDate.value,
    //       },
    //       // "customer.intExt": "External"
    //       // created_at['$lte']: 1479664146607,
    //       // created_at['$gte']: 1479664146607
    //     },

    //     {
    //       encodeValuesOnly: true,
    //     }
    //   );
    //   console.log("query",query)
    //   const response = await getALLOneShopRequestDataOneShop(query);
    //   console.log("response", response)
    // }

    onMounted(async () => {
      getAllCustomerOneShop();
      getAllCustomerSynced();
      getAiosUser();
      getPhysmetCustomerSynced();
    });

    return {
      physmetCustomer,
      getPhysmetCustomerSynced,
      userid,
      logout,
      userLoggedin,
      userLoggedinAIOS,
      displayName,
      loginStatus,
      leftDrawerOpen,
      loginStatusAIOS,
      oneShopCustomer,
      allCustomer,
      oneShopCustomerTotal,
      segregateDupli,
      getAiosUser,
      aiosUser,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      startDate,
      endDate,

      // getStartEndDate,

      showNotif() {
        console.log("oneShopCustomerTotal.value", oneShopCustomerTotal.value);
        if (
          oneShopCustomerTotal.value +
          aiosUser.value.total -
          segregateDupli.value +
          physmetCustomer.value
        ) {
          $q.notify({
            message:
              "There's a new customer! Please sync the customer in Customer Page.",
            icon: "announcement",
            classes: "test",
          });
        } else {
          $q.notify({
            message: "No new customer as of now.",
            icon: "announcement",
            classes: "test",
          });
        }
      },
      background:
        "The Centralized Customer Database is a web-based and access-controlled information system that supports automated tasks, data reusability, data sharing, and a more productive workflow without disruption not only for MIRDC but also to the customers as well.",
      introduction:
        "The Management Information System (MIS) unit of the Planning and Management Division (PMD) has been actively engaged in designing and maintaining information systems that are valuable to the Center. Indeed, MIS monitors the Center's Information Systems Strategic Plan (ISSP), whose primary purpose is to improve the Center's operational excellence through acquiring ICT infrastructure and to enhance the existing system or application.Centralized Customer Database (CCD) is a database that is located, stored, and maintained in a single location, thus it is easier to access and coordinate data and will help the team (PMD) to spend less time cleaning up or preparing the data and more time focusing on its essential growth and success.",
    };
  },
};
</script>

<style lang="sass">
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
