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
                type="email"
                square
                lazy-rules
                :rules="[
                  (val) => !!val || 'Please enter a valid email address',
                ]"
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
import { useQuasar } from "quasar";

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

    async function onSubmit() {
      const data = {
        data: {
          displayName: "",
          contactPerson: "",
          email: "",
          contactNo: "",
          region: "",
          province: "",
          municipality: "",
          address: "",
          type: {
            id: " ",
            label: " ",
          },
          industry: {
            id: " ",
            label: " ",
          },
        },
      };
      customerForm.value.validate().then((success) => {
        if (success) {
          data.data.displayName = company_name.value;
          data.data.contactPerson = first_name.value + " " + last_name.value;
          data.data.email = email.value;
          data.data.contactNo = tel_mobile.value;
          data.data.region = region.value;
          data.data.province = province.value;
          data.data.municipality = city_municipality.value;
          data.data.address =
            street.value +
            " " +
            barangay.value +
            " " +
            city_municipality.value +
            " " +
            region.value +
            " " +
            province.value;
          data.data.type.id = type.value.id;
          data.data.type.label = type.value.label;
          data.data.industry.id = industry.value.id;
          data.data.industry.label = industry.value.label;
          postCustomerData(data);
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
            message: "Please check the fields.",
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
    };
  },
};
</script>
