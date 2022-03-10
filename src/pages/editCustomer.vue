<template>
  <div>
    <q-btn
      label="Edit Customer"
      @click="opened = true"
      icon="add"
      color="secondary"
      unelevated
    />
    <q-dialog
      v-model="opened"
      persistent
      transition-show="scale"
      transition-hide="scale"
      square
    >
      <q-card style="width: 500px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">Add New Customer</div>
        </q-card-section>
        <q-card-section>
          <!-- <q-input
            color="black"
            v-model="modifiedData.name"
            label="Branch Name"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="modifiedData.description"
            label="First Name"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <div>
            Select categories
            <div v-for="category in allCategories" :key="category.id">
              <label>{{ category.name }}</label>
              <label>test</label>
              <q-input
                type="checkbox"
                :value="category.id"
                v-model="modifiedData.categories"
                name="categories"
                :id="category.id"
              />
            </div>
          </div> -->

          <q-input
            color="black"
            v-model="first_name"
            label="First Name"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="last_name"
            label="Last Name"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="company_name"
            label="Company"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="account_type"
            label="Account Type"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="province"
            label="Province"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="city_municipality"
            label="City/Municipality"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="street"
            label="Street"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="barangay"
            label="Barangay"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="tel_mobile"
            label="Tel/Mobile"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="fax"
            label="Fax"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="email"
            label="Email"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <q-input
            color="black"
            v-model="sector"
            label="Sector"
            class="q-pa-sm"
            outlined
            dense
            square
          />
          <div align="center">
            <img
              src="~assets/cdms-logo.png"
              width="200"
              v-if="!$q.screen.lt.md"
            />
            <img
              src="~assets/cdms-logo.png"
              width="100"
              v-if="$q.screen.lt.md"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-black">
          <q-btn flat color="grey" label="Cancel" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            @click="save"
            label="Save"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      opened: false,
      reviewuploadQuotation: false,
      company_name: "",
      first_name: "",
      last_name: "",
      account_type: "Customer",
      province: "",
      city_municipality: "",
      street: "",
      barangay: "",
      tel_mobile: "",
      fax: "",
      email: "",
      sector: "",
      allCategories: [],
      modifiedData: {
        name: "",
        description: "",
        // categories: [],
      },
    };
  },
  async mounted() {
    axios.get("http://localhost:1337/api/customers").then((response) => {
      // response.data.data.forEach((element) => {});zz
    });
    try {
      const response = await axios.get("http://localhost:1337/api/categories");
      this.allCategories = response.data;
      response.data.data.forEach((element) => {
        // console.log(element);
      });
    } catch (error) {
      this.error = error;
    }
  },
  methods: {
    save() {
      fetch("http://localhost:1337/api/restaurants/", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.parse(
          JSON.stringify({
            name: "ddddd",
            description: "sssdd",
          })
        ),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("Success:", data);
        })
        .catch((error) => {
          // console.error("Error:", error);
        });
    },
    handleSubmit: async function (e) {
      e.preventDefault();

      try {
        const response = await axios.post(
          "http://localhost:1337/api/restaurants",
          this.modifiedData
        );
        // console.log(response);
      } catch (error) {
        this.error = error;
      }
    },
  },
};
</script>
