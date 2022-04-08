<template>
  <div>
    <q-btn
      color="grey"
      v-for="size in ['xs']"
      :key="size"
      :size="size"
      icon="edit"
      @click="editCustomer(customer)"
      flat
      dense
      class="q-pa-md"
    />
    <q-btn
      color="grey"
      v-for="size in ['xs']"
      :key="size"
      :size="size"
      icon="remove_red_eye"
      flat
      class="q-pa-md"
      @click="viewCustomer(customer)"
      dense
    />
    <q-btn
      v-for="size in ['xs']"
      :key="size"
      :size="size"
      color="grey"
      icon="delete"
      class="q-pa-md"
      @click="deleteCustomer(customer)"
      flat
      dense
    />
    <q-dialog v-model="viewCustomerModal"
      ><q-card style="width: 500px">
        <q-card-section class="bg-secondary text-white">
          <h4 class="text-uppercase q-pa-sm">
            {{ customer.attributes.contactPerson }}
          </h4>
          <label align="right">
            <b>Account Type:</b>
            {{ customer.attributes.type.data.attributes.label }}</label
          >
        </q-card-section>

        <q-item>
          <label class="text-subtitle2 q-pa-sm"
            ><b>CMDS Id:</b>{{ "00000" + customer.id }}</label
          >
        </q-item>
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Company Name:</b> {{ customer.attributes.displayName }}
          </div></q-item
        >
        <!-- <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Industry: </b> {{ customer.industry.attributes.label }}
          </div></q-item
        > -->
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Email:</b> {{ customer.attributes.email }}
          </div></q-item
        >
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Contact Number:</b> {{ customer.attributes.contactNo }}
          </div></q-item
        >
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Address:</b>{{ customer.attributes.address }}
          </div></q-item
        >
        <q-card-section> </q-card-section>

        <q-card-actions align="right" class="bg-white text-black row">
          <q-btn
            color="blue-grey-6"
            label="Close"
            type="reset"
            v-close-popup
            class="col"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editCustomerModal">
      <div v-if="editCustomerModal">
        <!-- {{ rowsCustomer }} -->
        <q-form
          ref="customerForm"
          @submit="onSubmitUpdateCustomer"
          @reset="onReset"
        >
          <q-card style="width: 500px">
            <q-card-section class="bg-secondary text-white">
              <div class="text-h6">Add New Customer</div>
            </q-card-section>
            <q-card-section padding>
              <q-input
                color="black"
                v-model="fullname"
                label="Name"
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
                v-model="address"
                label="Address"
                outlined
                dense
                square
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type Address',
                ]"
              />
              <q-input
                color="black"
                v-model="tel_mobile"
                label="Contact Number"
                outlined
                dense
                square
              />

              <br />

              <q-input
                color="black"
                v-model="email"
                label="Email"
                outlined
                dense
                type="email"
                square
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
                option-label="label"
                :rules="[(val) => !!val || 'Please enter industry']"
              />
              <br />
              <q-select
                label="Account Type"
                outlined
                dense
                square
                option-label="label"
                transition-show="flip-up"
                transition-hide="flip-down"
                v-model="type"
                :options="type_options"
                emit-value
                map-options
                lazy-rules
                :rules="[(val) => !!val || 'Please enter account type']"
              />
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-black row">
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

    <q-dialog v-model="deleteCustomerModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete {{ customer.contactPerson }}?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="blue-grey-6" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="confirmed"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import {
  getAllType,
  getIndutries,
  populateAllIndutries,
  deleteCustomerData,
  editCustomerData,
} from "src/provider.js";
import { useQuasar } from "quasar";

export default {
  props: ["customer"],
  setup() {
    const editCustomerModal = ref(false);
    const viewCustomerModal = ref(false);
    const deleteCustomerModal = ref(false);
    const customerInfo = ref([]);

    // types
    const types = ref([]);
    const type_options = ref([]);

    // industry
    const sectors = ref([]);
    const industry_options = ref([]);

    // edit Data
    const editId = ref(null);
    const customerForm = ref(null);
    const fullname = ref("");
    const company_name = ref("");
    const address = ref("");
    const tel_mobile = ref("");
    const email = ref("");

    // industries
    const industry = ref(null);

    // types
    const type = ref(null);

    const $q = useQuasar();

    // delete Data
    const deleteId = ref(null);

    async function onSubmit() {
      console.log("edit");
      editCustomerModal.value = false;
    }

    function editCustomer(props) {
      company_name.value = props.attributes.displayName;
      fullname.value = props.attributes.contactPerson;
      address.value = props.attributes.address;
      tel_mobile.value = props.attributes.contactNo;
      email.value = props.attributes.email;
      industry.value = {
        id: props.attributes.industry.data.id,
        label: props.attributes.industry.data.attributes.label,
      };
      type.value = {
        id: props.attributes.type.data.id,
        label: props.attributes.type.data.attributes.label,
      };
      console.log("INDUSTRY", props.attributes.type.data.id);
      console.log("INDUSTRY", props.attributes.type.data.attributes.label);

      editCustomerModal.value = true;
      editId.value = props.id;
    }

    async function onSubmitUpdateCustomer() {
      const data = {
        data: {
          displayName: "",
          contactPerson: "",
          email: "",
          contactNo: "",
          region: "",
          address: "",
          type: {},
          industry: {},
        },
      };
      customerForm.value.validate().then((success) => {
        if (success) {
          data.data.displayName = company_name.value;
          data.data.contactPerson = fullname.value;
          data.data.email = email.value;
          data.data.contactNo = tel_mobile.value;
          data.data.address = address.value;
          data.data.type = type.value;
          data.data.industry = industry.value;
          editCustomerData(editId.value, data);
          editCustomerModal.value = false;
          onReset();
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Customer Data updated",
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

    function deleteCustomer(props) {
      deleteId.value = props.id;
      deleteCustomerModal.value = true;
      console.log(props);
    }
    function confirmed() {
      deleteCustomerData(deleteId.value);
      $q.notify({
        color: "negative",
        textColor: "white",
        icon: "delete",
        message: "You have successfully deleted the customer data",
      });
    }

    function viewCustomer() {
      console.log("view");
      viewCustomerModal.value = true;
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
    async function onReset() {
      editCustomerModal.value = false;
    }

    onMounted(() => {
      getTypes();
      getSectors();
      // populateIndustries();
    });

    return {
      viewCustomer,
      onReset,
      deleteCustomer,
      onSubmitUpdateCustomer,
      editCustomer,
      onSubmit,
      confirmed,
      customerForm,
      types,
      type_options,
      industry_options,
      customerInfo,
      viewCustomerModal,
      fullname,
      company_name,
      type,
      tel_mobile,
      email,
      industry,
      address,
      editCustomerModal,
      deleteCustomerModal,
      editId,
    };
  },
};
</script>
