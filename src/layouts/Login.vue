<template>
  <q-layout class="bg-grey-2">
    <q-footer bordered>
      <q-toolbar class="toolbar">
        <q-toolbar-title class="text-body1 text-center">
          © 2022 CDMS, MIRDC-PMD
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <q-page class="flex flex-center">
        <q-card bordered class="my-login no-shadow q-pa-lg">
          <q-form @submit="onSubmit" class="q-gutter-md" ref="loginRefForm">
            <q-item class="q-mt-md">
              <q-item-section avatar>
                <img src="~assets/logo.png" width="190" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h5">Sign in</q-item-label>
                <q-item-label class="text-body1"> CDMS </q-item-label>
              </q-item-section>
            </q-item>

            <q-card-section class="q-mt-sm">
              <q-input
                ref="username"
                class="q-mb-sm"
                v-model="usernameModel"
                label="Username"
                :rules="[(val) => !!val || 'Username is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                ref="password"
                class="q-mb-sm"
                :type="isPwd ? 'password' : 'text'"
                v-model="passwordModel"
                label="Password"
                :rules="[(val) => !!val || 'Password is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template
                  v-slot:append
                  v-if="passwordModel && passwordModel.length > 0"
                >
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>

            <q-card-actions class="justify">
              <!-- <q-btn color="primary" @click="manageAccount" no-caps flat>Manage Account</q-btn> -->
              <q-btn class="full-width" @click="onSubmit" color="primary"
                >Login</q-btn
              >
            </q-card-actions>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { loginAios } from "src/provider.js";
import { useQuasar, QSpinnerGears } from "quasar";
export default defineComponent({
  name: "Login",

  setup() {
    const usernameModel = ref("");
    const passwordModel = ref("");

    const aiosEmail = ref("it.amcen@gmail.com");
    const aiospass = ref("123456");
    const aiosStrategy = ref("local");
    const isPwd = ref(true);
    const loginRefForm = ref(null);

    const store = useStore();
    const $q = useQuasar();
    const router = useRouter();

    const keymap = computed(() => {
      return {
        enter: {
          keydown: this.login,
        },
      };
    });

    // async function logintoAISO() {
    //   loginAios();
    // }

    const getLoginApiStatus = computed(
      () => store.getters["auth/getLoginApiStatus"]
    );

    const getLoginApiStatusaios = computed(
      () => store.getters["aiosauth/getLoginApiStatus"]
    );

    async function setterAuth(payload) {
      await store.dispatch("auth/loginApi", payload);
    }

    async function setterAuthaios(credential) {
      await store.dispatch("aiosauth/loginApiAIOS", credential);
    }

    function onSubmit() {
      loginRefForm.value.validate().then((success) => {
        if (success) {
          loginToSSOClient();
        }
      });
    }

    async function loginToSSOClient() {
      $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: "primary",
        messageColor: "black",
        message: "Checking Credentials",
      });

      const payload = {
        identifier: usernameModel.value,
        password: passwordModel.value,
      };

      const credential = {
        email: aiosEmail.value,
        password: aiospass.value,
        strategy: aiosStrategy.value,
      };
      await setterAuth(payload);
      await setterAuthaios(credential);

      if (
        getLoginApiStatus.value == "success" &&
        getLoginApiStatusaios.value == "success"
      ) {
        $q.loading.hide();
        router.push("/MainLayout/Home");
      } else if (
        getLoginApiStatus.value == "failed" &&
        getLoginApiStatusaios.value == "failed"
      ) {
        $q.loading.hide();
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message:
            "User does not have access to CDMS system.  Please contact the developer.",
        });
      } else {
        $q.loading.hide();
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Username and Password does not match.",
        });
      }
    }

    return {
      aiosStrategy,
      aiosEmail,
      aiospass,
      usernameModel,
      passwordModel,
      isPwd,
      onSubmit,
      loginRefForm,
    };
  },
});
</script>

<style lang="sass" scoped></style>
