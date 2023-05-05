<template>
  <q-page>
    <q-form @submit.prevent="resetPassword">
      <q-input
        outlined
        v-model="currentPassword"
        type="password"
        label="Current Password"
        required
        :error="currentPasswordError"
        @keyup.enter="resetPassword"
      />

      <q-input
        outlined
        v-model="newPassword"
        type="password"
        label="New Password"
        required
        :error="newPasswordError"
        @keyup.enter="resetPassword"
      />

      <q-input
        outlined
        v-model="confirmNewPassword"
        type="password"
        label="Confirm New Password"
        required
        :error="confirmNewPasswordError"
        @keyup.enter="resetPassword"
      />

      <q-btn
        type="submit"
        label="Reset Password"
        color="primary"
        class="q-mt-md"
      />

      <div v-if="error" class="text-red q-mt-md">{{ error }}</div>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "ResetPassword",

  setup() {
    const currentPassword = ref("");
    const currentPasswordError = ref("");
    const newPassword = ref("");
    const newPasswordError = ref("");
    const confirmNewPassword = ref("");
    const confirmNewPasswordError = ref("");
    const error = ref("");
    const token = localStorage.getItem("accessToken");

    const resetPassword = async () => {
      if (!currentPassword.value) {
        currentPasswordError.value = "Current password is required.";
        return;
      } else {
        currentPasswordError.value = "";
      }

      if (!newPassword.value) {
        newPasswordError.value = "New password is required.";
        return;
      } else {
        newPasswordError.value = "";
      }

      if (!confirmNewPassword.value) {
        confirmNewPasswordError.value = "Please confirm your new password.";
        return;
      } else if (newPassword.value !== confirmNewPassword.value) {
        confirmNewPasswordError.value = "Passwords do not match.";
        return;
      } else {
        confirmNewPasswordError.value = "";
      }

      try {
        const response = await axios.post(
          `http://10.10.120.19:1336/auth/local`,
          {
            identifier: "3489",
            password: "123456",
            // passwordConfirmation: confirmNewPassword.value,
            // currentPassword: currentPassword.value,
          }
        );
        const token = localStorage.getItem("accessToken");
        console.log("token", token);
        return token; // or redirect to a success page
      } catch (err) {
        error.value = err.response.data.message;
      }
    };

    return {
      currentPassword,
      currentPasswordError,
      newPassword,
      newPasswordError,
      confirmNewPassword,
      confirmNewPasswordError,
      error,
      resetPassword,
    };
  },
};
</script>
