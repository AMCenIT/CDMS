<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-grey-2"
    style="min-height: 0px !important"
  >
    <q-page-container>
      <router-view class="q-pa-md" />
      <div class="bg-grey-2">
        <q-breadcrumbs class="q-mb-lg">
          <q-breadcrumbs-el
            label="Homepage"
            icon="home"
            to="/MainLayout/Home"
          />
        </q-breadcrumbs>
        <q-card class="light-shadow no-shadow q-pa-md">
          <div class="row">
            <div style="margin: 0 auto">
              <q-item-section>
                <q-item-label class="text-weight-bolder">
                  <h3 class="text-weight-light">
                    Welcome to Customer Database Management System (CDMS)
                  </h3></q-item-label
                >
              </q-item-section>
            </div>
            <div class="my-card text-black">
              <h5 class="text-weight-light">I. Introducton</h5>
              <p class="text-weight-light" style="line-height: 1.6">
                {{ introduction }}
              </p>
            </div>
            <div class="my-card text-black">
              <h5 class="text-weight-light">II. Description of the System</h5>
              <p class="text-weight-light" style="line-height: 1.6">
                {{ background }}
              </p>
            </div>
          </div>

          <div class="row justify-center q-mt-lg q-mb-lg">
            <q-btn
              color="primary"
              icon="touch_app"
              label="Get started"
              v-ripple
              clickable
              class="q-mr-md"
              @click="$router.push('/MainLayout/Dashboard')"
            />
            <q-btn
              color="white"
              text-color="primary"
              icon="cloud_download"
              label="Reference Manual"
              v-ripple
              clickable
              class="q-ml-md"
              @click="$router.push('/MainLayout/DownloadableFiles')"
            />

            <!-- <div style="margin: 0 auto">
          <q-item-section>
            <div class="q-pa-md q-gutter-sm">
              <q-btn
                color="primary"
                icon="touch_app"
                label="Get started"
                v-ripple
                clickable
                @click="$router.push('/MainLayout/Customer')"
              />
              <q-btn
                color="secondary"
                icon="cloud_download"
                label="Download User Manual"
              />
              <q-btn
                color="grey"
                icon="file_download"
                label="Download Policy Manual"
              />
            </div>
          </q-item-section>
        </div> -->
          </div>
        </q-card>
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

    const store = useStore();
    // userprofile getter
    const userLoggedin = computed(() => store.getters["auth/getUserProfile"]);
    displayName.value = userLoggedin.value.displayName;
    const loginStatus = computed(() => store.getters["auth/getLoginApiStatus"]);

    async function logout() {
      await store.dispatch("auth/logout");
      router.push("/Login");
    }

    return {
      logout,
      userLoggedin,
      displayName,
      loginStatus,
      leftDrawerOpen: false,
      background:
        "The Customer Database Management System is a web-based and access-controlled information system that supports automated tasks, data reusability, data sharing, and a more productive workflow without disruption not only for MIRDC but also to the customers as well.",
      introduction:
        "The Management Information System (MIS) unit of the Planning and Management Division (PMD) has been actively engaged in designing and maintaining information systems that are valuable to the Center. Indeed, MIS monitors the Center's Information Systems Strategic Plan (ISSP), whose primary purpose is to improve the Center's operational excellence through acquiring ICT infrastructure and to enhance the existing system or application. Customer Database Management System (CDMS) is a database that is located, stored, and maintained in a single location, thus it is easier to access and coordinate data and will help the team (PMD) to spend less time cleaning up or preparing the data and more time focusing on its essential growth and success.",
    };
  },
  methods: {
    clickleftDrawerOpen() {
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
