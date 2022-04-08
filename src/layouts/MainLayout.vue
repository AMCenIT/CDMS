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
        />
        <img
          src="~assets/cdms-logo.png"
          width="100"
          v-if="$q.screen.lt.md"
          clickable
          @click="$router.push('/MainLayout/Home')"
        />
        <img src="~assets/logo.png" width="190" />
        <q-space />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
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
              <q-icon color="secondary" name="dashboard" />
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
              <q-icon color="secondary" name="info" />
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

          <q-separator />
          <q-expansion-item
            expand-separator
            icon="library_books"
            label="Others"
          >
            <q-item
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
            </q-item>

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
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view class="q-pa-md" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const displayName = ref("");
    const userid = ref("");
    const leftDrawerOpen = ref(false);

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

    return {
      userid,
      logout,
      userLoggedin,
      userLoggedinAIOS,
      displayName,
      loginStatus,
      leftDrawerOpen,
      loginStatusAIOS,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
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
