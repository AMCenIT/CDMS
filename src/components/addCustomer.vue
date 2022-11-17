<template>
  <div>
    <q-btn
      label="New Item"
      @click="opened"
      icon="add"
      color="secondary"
      unelevated
    />
    <q-dialog v-model="addCustomerModal">
      <div v-if="addCustomerModal">
        <!-- {{ rowsCustomer }} -->
        <q-form ref="customerForm" @submit="onSubmit" @reset="onReset">
          <q-card style="width: 500px">
            <q-card-section class="bg-secondary text-white">
              <div class="text-h6">Add New Customer</div>
            </q-card-section>
            <q-card-section padding>
              <q-input
                color="black"
                v-model="first_name"
                label="First Name"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please input first name',
                ]"
              />
              <q-input
                color="black"
                v-model="last_name"
                label="Last Name"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please input last name',
                ]"
              />
              <q-input
                color="black"
                v-model="company_name"
                label="Company"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please input company name',
                ]"
              />

              <q-input
                color="black"
                v-model="street"
                label="Street"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please input street',
                ]"
              />
              <q-input
                color="black"
                v-model="barangay"
                label="Barangay"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please input barangay',
                ]"
              />
              <q-input
                color="black"
                v-model="city_municipality"
                label="City/Municipality"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Please input barangay City/Municipality',
                ]"
              />
              <q-input
                color="black"
                v-model="province"
                label="Province"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please input province',
                ]"
              />
              <q-input
                color="black"
                v-model="region"
                label="Region"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type region',
                ]"
              />
              <q-input
                color="black"
                v-model="tel_mobile"
                label="Tel/Mobile"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please enter contact number',
                ]"
              />
              <q-input
                color="black"
                v-model="email"
                label="Email"
                outlined
                dense
                square
                lazy-rules
              />

              <br />

              <q-select
                label="Industry"
                transition-show="flip-up"
                transition-hide="flip-down"
                outlined
                dense
                square
                v-model="industry"
                :options="industry_options"
                lazy-rules
                :rules="[(val) => !!val || 'Please enter industry']"
              />
              <q-select
                outlined
                dense
                square
                v-model="type"
                :options="type_options"
                option-label="label"
                label="Acoount Type"
                emit-value
                map-options
                lazy-rules
                :rules="[(val) => !!val || 'Please enter account type']"
              />
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-black">
              <q-btn
                color="blue-grey-6"
                label="Cancel"
                type="reset"
                v-close-popup
                class="col"
                unelevated
              />
              <q-btn
                unelevated
                color="secondary"
                type="submit"
                label="Save"
                class="col"
              />
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </q-dialog>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { getAllType, getIndutries, postCustomerData } from "src/provider.js";
import { useQuasar, uid } from "quasar";
import {
  getAllCustomerData,
  validateEmails,
  postCustomerDataaiosApi,
} from "src/provider.js";

export default {
  props: {
    rowsCustomer: {
      type: Array,
    },
  },
  setup(props) {
    const addCustomerModal = ref(false);
    const customerForm = ref(null);

    // types
    const types = ref([]);
    const type_options = ref([]);

    // industry
    const sectors = ref([]);
    const industry_options = ref([]);

    // customer Data
    const first_name = ref("");
    const last_name = ref("");
    const company_name = ref("");
    const type = ref(null);
    const region = ref("");
    const province = ref("");
    const city_municipality = ref("");
    const street = ref("");
    const barangay = ref("");
    const tel_mobile = ref("");
    const email = ref("");
    const industry = ref(null);

    const $q = useQuasar();

    const existCompany = ref("");
    const customerExist = ref([]);

    function opened() {
      addCustomerModal.value = true;
    }

    async function getTypes() {
      types.value = await getAllType();
      types.value.map(function (type) {
        let attrObj = type.attributes;
        type_options.value.push({
          id: type.id,
          label: attrObj.label,
        });
        return type_options.value;
      });
    }

    async function getSectors() {
      sectors.value = await getIndutries();
      sectors.value.map(function (industry) {
        let attrObj = industry.attributes;
        industry_options.value.push({
          label: attrObj.label,
          id: industry.id,
        });
        return industry_options.value;
      });
    }

    async function getCustomer() {
      customerExist.value = await getAllCustomerData();
      customerExist.value.data.data.forEach((element) => {
        let attrObj = element.attributes.email;
      });
    }

    async function onSubmit() {
      const data = ref({
        data: {
          displayName: "",
          contactPerson: "",
          email: "",
          contactNo: "",
          region: "",
          province: "",
          municipality: "",
          address: "",
          types: {
            id: " ",
            label: " ",
          },
          industries: {
            id: " ",
            label: " ",
          },
        },
      });

      const AiosData = {
        company_name: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        state_province: "",
        house_bldg_st: "",
        city_municipality: "",
        brgy_district: "",
        address: "",
        account_type: "",
        sector: "",
        email_confirmed: false,
        system_user_type: "Customer",
        password: "",
      };

      const qs = require("qs");
      const query = qs.stringify(
        {
          $eq: company_name.value,
        },
        {
          encodeValuesOnly: true,
        }
      );
      const response = await validateEmails(query);
      response.forEach((element) => {
        let attrObj = element.attributes;
        existCompany.value = attrObj.displayName;
        console.log("existCompany", attrObj.displayName);
      });

      customerForm.value.validate().then((success) => {
        if (success && company_name.value != existCompany.value) {
          data.value.data.displayName = company_name.value;
          data.value.data.contactPerson =
            first_name.value + " " + last_name.value;
          data.value.data.email = email.value;
          data.value.data.contactNo = tel_mobile.value;
          data.value.data.region = region.value;
          data.value.data.province = province.value;
          data.value.data.municipality = city_municipality.value;
          data.value.data.address =
            street.value +
            " " +
            barangay.value +
            " " +
            city_municipality.value +
            " " +
            region.value +
            " " +
            province.value;
          data.value.data.types.id = type.value.id;
          data.value.data.types.label = type.value.label;
          data.value.data.industries.id = industry.value.id;
          data.value.data.industries.label = industry.value.label;
          postCustomerData(data.value);

          // company_name: "",
          //     first_name: "",
          //     last_name: "",
          //     email: "",
          //     mobile: "",
          //     state_province: "",
          //     house_bldg_st: "",
          //     city_municipality: "",
          //     brgy_district: "",
          //     address: "",
          //     account_type: "",
          //     sector: "",
          //     email_confirmed: false,
          //     system_user_type: "Customer",
          //     password: "aios2022",
          // AiosData.company_name = company_name.value;
          // AiosData.first_name = first_name.value;
          // AiosData.last_name = last_name.value;
          // AiosData.email = email.value;
          // AiosData.mobile = tel_mobile.value;
          // AiosData.state_province = province.value;
          // AiosData.house_bldg_st = street.value;
          // AiosData.brgy_district = barangay.value;
          // AiosData.city_municipality = city_municipality.value;
          // AiosData.address =
          //   street.value +
          //   " " +
          //   barangay.value +
          //   " " +
          //   city_municipality.value +
          //   " " +
          //   region.value +
          //   " " +
          //   province.value;
          // AiosData.account_type = industry.value.label;
          // AiosData.sector = industry.value.label;
          // AiosData.password = first_name.value + "AIOS" + "2022";

          // postCustomerDataaiosApi(AiosData);

          // // close the modal
          // console.log("AIOS DATA", AiosData);
          addCustomerModal.value = false;

          onReset();
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "You have successfully inserted the customer data",
          });
        } else {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "The Customer is already exist!",
          });
        }
      });
    }
    async function onReset() {
      company_name.value = "";
      first_name.value = "";
      last_name.value = "";
      email.value = "";
      tel_mobile.value = "";
      street.value = "";
      barangay.value = "";
      region.value = "";
      province.value = "";
      city_municipality.value = "";
      type.value = "";
      industry.value = "";
    }
    onMounted(() => {
      getTypes();
      getSectors();
      getCustomer();
    });

    return {
      addCustomerModal,
      opened,
      onSubmit,
      customerForm,
      // array types
      types,
      type_options,
      // array industry
      sectors,
      industry_options,
      // customer Data Post
      first_name,
      last_name,
      company_name,
      type,
      city_municipality,
      street,
      barangay,
      tel_mobile,
      email,
      industry,
      region,
      province,
      onReset,
      existCompany,
      customerExist,
    };
  },
};
</script>
