<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="clickleftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          v-if="$q.screen.lt.md"
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
          <q-btn round flat color="grey-8" icon="account_circle">
            <q-tooltip>Log out</q-tooltip>
            <q-menu transition-show="flip-right" transition-hide="flip-left">
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>Manage Account</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="logout">
                  <q-item-section>Log out</q-item-section>
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
      content-class="bg-grey-2"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item class="my-card bg-primary text-white">
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
              <q-icon color="primary" name="home" />
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
              <q-icon color="primary" name="group" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Customer Infomation</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-expansion>
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
                  <q-item-label>Analytics</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-expansion>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view class="q-pa-md" />

      <div class="my-card text-black q-pa-md">
        <!-- <h6>Description of the System</h6> -->
        <p hidden>{{ background }}</p>
      </div>
      <div
        hidden
        class="my-card text-white q-pa-md"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
      >
        <h6>Introducton</h6>
        <p>{{ introduction }}</p>
      </div>

      <div class="q-pa-md" hidden>
        <div class="bg-primary text-white">
          <q-toolbar>
            <q-btn flat round dense icon="assignment_ind" />

            <q-toolbar-title>CCD</q-toolbar-title>

            <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
            <q-btn flat round dense icon="gamepad" />
          </q-toolbar>
          <q-toolbar inset>
            <q-breadcrumbs active-color="white" style="font-size: 16px">
              <q-breadcrumbs-el label="Home" icon="home" />
              <q-breadcrumbs-el label="Customer" icon="widgets" />
              <q-breadcrumbs-el label="Policy" />
            </q-breadcrumbs>
          </q-toolbar>
        </div>
      </div>
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

    const store = useStore();
    // userprofile getter
    const userLoggedin = computed(() => store.getters["auth/getUserProfile"]);
    console.log(userLoggedin.value);
    userid.value = userLoggedin.value.username;
    displayName.value = userLoggedin.value.displayName;
    const loginStatus = computed(() => store.getters["auth/getLoginApiStatus"]);

    async function logout() {
      await store.dispatch("auth/logout");
      router.push("/Login");
    }

    return {
      userid,
      logout,
      userLoggedin,
      displayName,
      loginStatus,
      leftDrawerOpen: false,
      background:
        "The Centralized Customer Database is a web-based and access-controlled information system that supports automated tasks, data reusability, data sharing, and a more productive workflow without disruption not only for MIRDC but also to the customers as well.",
      introduction:
        "The Management Information System (MIS) unit of the Planning and Management Division (PMD) has been actively engaged in designing and maintaining information systems that are valuable to the Center. Indeed, MIS monitors the Center's Information Systems Strategic Plan (ISSP), whose primary purpose is to improve the Center's operational excellence through acquiring ICT infrastructure and to enhance the existing system or application.Centralized Customer Database (CCD) is a database that is located, stored, and maintained in a single location, thus it is easier to access and coordinate data and will help the team (PMD) to spend less time cleaning up or preparing the data and more time focusing on its essential growth and success.",
    };
  },
  methods: {
    clickleftDrawerOpen() {
      console.log("test");
      this.leftDrawerOpen = true;
    },
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
