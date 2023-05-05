<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header
      elevated
      class="bg-white text-secondary q-py-xs bg-white"
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
          color="primary"
        />

        <!-- <img
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
        /> -->
        <img
          src="~assets/logo.png"
          width="100"
          @click="link = 'home' && $router.push('/MainLayout/Home')"
          style="cursor: pointer"
        />
        <div>
          <span class="text-black text-h5"
            >Customer Database Management System</span
          >
        </div>

        <q-space />
        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <pre>{{ physmetCustomer }}</pre> -->
          <q-btn
            flat
            round
            color="primary"
            icon="notifications"
            @click="showNotif"
          >
            <q-badge
              v-if="
                // physmetCustomer +
                physmetTotal.length +
                oneShopCustomer.total +
                aiosUser.total -
                segregateDupli
              "
              floating
              color="red"
              rounded
              >{{
                // physmetCustomer +
                physmetTotal.length +
                oneShopCustomer.total +
                aiosUser.total -
                segregateDupli
              }}</q-badge
            >
          </q-btn>
          <q-btn round flat>
            <q-avatar color="primary" text-color="white">{{
              firstname.charAt(0) + lastname.charAt(0)
            }}</q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu>
              <q-card
                class="flat no-shadow"
                style="width: 360px; height: 325px"
              >
                <div class="row justify-center q-mt-md">
                  <q-avatar size="80px" color="primary" text-color="white">{{
                    firstname.charAt(0) + lastname.charAt(0)
                  }}</q-avatar>
                </div>

                <q-card-section class="text-center q-pt-none q-mt-sm">
                  <div class="text-h6">{{ displayName }}</div>
                  <div class="text-grey">
                    <span class="text-weight-medium">Employee ID:</span>
                    {{ userid }}
                  </div>
                </q-card-section>

                <q-card-section class="text-center q-gutter-sm q-mb-sm">
                  <q-btn
                    @click="manageAccount"
                    label="Manage your account"
                    icon="settings"
                    :color="$q.dark.isActive ? 'white' : 'dark'"
                    no-caps
                    rounded
                    outline
                  /><br />
                </q-card-section>

                <q-separator />

                <q-card-actions @click="logout" class="justify-center q-pa-md">
                  <q-btn icon="exit_to_app" no-caps> Sign out </q-btn>
                </q-card-actions>
                <q-separator class="q-mb-xl" />
              </q-card>
            </q-menu>
          </q-btn>
          <!-- <q-btn round flat color="primary" size="1.4em">
            <q-avatar color="primary" text-color="white">{{
              firstname.charAt(0) + lastname.charAt(0)
            }}</q-avatar>
            <q-tooltip>Log out</q-tooltip>
            <q-menu
              transition-show="flip-right"
              transition-hide="flip-left"
              class="bg-grey-2"
            >
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">{{
                      firstname.charAt(0) + lastname.charAt(0)
                    }}</q-avatar>
                  </q-item-section>
                  <q-item-section class="text-black"
                    >{{ firstname }} {{ lastname }}</q-item-section
                  >
                </q-item>
                <q-separator />
                <q-item clickable @click="logout" class="bg-primary">
                  <q-item-section class="text-white">LOG OUT</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      bordered
      content-class="bg-primary"
      :width="240"
      class="bg-grey-2"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item
            class="my-card text-white"
            clickable
            active-class="my-menu-link"
            exact
          >
            <q-tooltip>Account</q-tooltip>

            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">{{
                firstname.charAt(0) + lastname.charAt(0)
              }}</q-avatar>
            </q-item-section>

            <q-item-section>
              <div class="text-subtitle2 text-black">
                {{ displayName }}
              </div>
            </q-item-section>
          </q-item>

          <q-item
            @click="link = 'home' && $router.push('/MainLayout/Home')"
            v-ripple
            clickable
            :to="'/MainLayout/Home'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            @click="$router.push('/MainLayout/Dashboard')"
            v-ripple
            clickable
            :to="'/MainLayout/Dashboard'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            @click="$router.push('/MainLayout/crudCustomer')"
            v-ripple
            clickable
            :to="'/MainLayout/crudCustomer'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Customers </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            @click="$router.push('/MainLayout/Transaction')"
            v-ripple
            clickable
            :to="'/MainLayout/Transaction'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="sort" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Transactions</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            @click="$router.push('/MainLayout/DownloadableFiles')"
            v-ripple
            clickable
            :to="'/MainLayout/DownloadableFiles'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="print" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Downloadable File</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            @click="$router.push('/MainLayout/GenerateReport')"
            v-ripple
            clickable
            :to="'/MainLayout/GenerateReport'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="summarize" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Generate Report</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-separator />
          <q-expansion-item
            expand-separator
            icon="library_books"
            label="Others" -->
          <!-- > -->
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

          <!-- <q-item
              @click="$router.push('/MainLayout/GenerateReport')"
              v-ripple
              clickable
              :to="'/MainLayout/GenerateReport'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="summarize" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Generate Report</q-item-label>
              </q-item-section>
            </q-item> -->

          <!-- <q-item
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
            </q-item> -->
          <!-- </q-expansion-item> -->
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
  pjoisTotalFilters,
} from "src/provider.js";
import axios from "axios";

export default {
  setup() {
    const $q = useQuasar();
    const qs = require("qs");
    const router = useRouter();
    const displayName = ref("");
    const firstname = ref("");
    const lastname = ref("");
    const userid = ref("");
    const leftDrawerOpen = ref(false);

    const oneShopCustomer = ref([]);
    const allCustomer = ref([]);
    const oneShopCustomerTotal = ref(0);
    const segregateDupli = ref([]);
    const aiosUser = ref([]);

    const physmetTotal = ref(0);

    const miniState = ref(true);

    // const startDate = ref("2022/02/01");
    // const endDate = ref("2019/02/01");

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
    firstname.value = userLoggedin.value.firstname;
    lastname.value = userLoggedin.value.lastname;

    const loginStatus = computed(() => store.getters["auth/getLoginApiStatus"]);
    const loginStatusAIOS = computed(
      () => store.getters["aiosauth/getLoginApiStatus"]
    );

    const link = ref("home");

    async function logout() {
      await store.dispatch("auth/logout");
      await store.dispatch("aiosauth/logout");

      router.push("/Login");
    }

    async function getAllCustomerOneShop() {
      oneShopCustomer.value = await getAllCustomerDataOneShop();
      // console.log("oneShopCustomer.value", oneShopCustomer.value.total);
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
      // console.log("allCustomer", segregateDupli.value);
      // console.log("allCustomer.value", allCustomer.value.data.data);
    }

    async function postTransaction() {
      axios
        .request({
          method: "post",
          baseURL: "http://10.10.120.19:1336/api/postTransaction",
        })
        .then((response) => {
          const postedData = response.data;
          console.log("postedData", postedData)
        });
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

    async function filterPhysmetTotal() {
      physmetTotal.value = await pjoisTotalFilters();
      // console.log("physmetTotal.value", physmetTotal.value.length);
      // return physmetTotal.value
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
      filterPhysmetTotal();
      postTransaction();
    });

    return {
      postTransaction,
      filterPhysmetTotal,
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
      // startDate,
      // endDate,
      physmetTotal,

      link,
      miniState,
      firstname,
      lastname,

      // getStartEndDate,

      showNotif() {
        // console.log(
        //   "All Customer",
        //   allCustomer.value.data.meta.pagination.total
        // );
        if (
          physmetTotal.value.length +
          oneShopCustomer.value.total +
          aiosUser.value.total -
          segregateDupli.value

          // physmetCustomer.value
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
      manageAccount() {
        // router.push("/MainLayout/resetPassword", "", "width=1000,height=600");
      },
      // axios
      //     .post("http://10.10.120.19:1336/api/auth/local", {
      //       identifier: "3489",
      //       password: "123456",
      //     })
      //     .then((response) => {
      //       // Handle success.
      //       console.log("Well done!");
      //       console.log("User profile", response.data.user);
      //       console.log("User token", response.data.jwt);
      //     })
      //     .catch((error) => {
      //       // Handle error.
      //       console.log("An error occurred:", error.response);
      //     });

      background:
        "The Customer Database Management System is a web-based and access-controlled information system that supports automated tasks, data reusability, data sharing, and a more productive workflow without disruption not only for MIRDC but also to the customers as well.",
      introduction:
        "The Management Information System (MIS) unit of the Planning and Management Division (PMD) has been actively engaged in designing and maintaining information systems that are valuable to the Center. Indeed, MIS monitors the Center's Information Systems Strategic Plan (ISSP), whose primary purpose is to improve the Center's operational excellence through acquiring ICT infrastructure and to enhance the existing system or application. Customer Database Management System (CDMS) is a database that is located, stored, and maintained in a single location, thus it is easier to access and coordinate data and will help the team (PMD) to spend less time cleaning up or preparing the data and more time focusing on its essential growth and success.",
    };
  },
};
</script>

<style>
.tab-active {
  background-color: #26a69a;
  color: #000;
}
/* .YL
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

      .my-menu-link
  color: white
  background: #F2C037 */
.my-menu-link {
  color: white;
  background: #1976d2;
  /* background: #26A69A; */
}
</style>
