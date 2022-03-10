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
      @click="viewCustomer"
      dense
    />
    <q-btn
      v-for="size in ['xs']"
      :key="size"
      :size="size"
      color="grey"
      icon="delete"
      class="q-pa-md"
      @click="deleteCustomer"
      flat
      dense
    />
    <q-dialog v-model="viewCustomerModal"
      ><q-card style="width: 500px">
        <q-card-section class="bg-primary text-white">
          <h4 class="text-uppercase q-pa-sm">
            {{ customer.contactPerson }}
          </h4>
          <label align="right"> <b>Account Type:</b> {{ customer.type }}</label>
        </q-card-section>

        <q-item>
          <label class="text-subtitle2 q-pa-sm"
            ><b>CMDS Id:</b>{{ "00000" + customer.id }}</label
          >
        </q-item>
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Company Name:</b> {{ customer.displayName }}
          </div></q-item
        >
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Industry: </b> {{ customer.industry }}
          </div></q-item
        >
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Email:</b> {{ customer.email }}
          </div></q-item
        >
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Contact Number:</b> {{ customer.contactNo }}
          </div></q-item
        >
        <q-item>
          <div class="text-subtitle2 q-pa-sm">
            <b>Address:</b>{{ customer.address }}
          </div></q-item
        >
        <q-card-section> </q-card-section>

        <q-card-actions align="right" class="bg-white text-black row">
          <q-btn
            color="grey"
            label="Close"
            type="reset"
            v-close-popup
            class="col"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editCustomerModal" persistent>
      <q-card style="width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Edit Customer Information</div>
        </q-card-section>
        <q-card-section padding>
          <q-input
            color="black"
            v-model="fullname"
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
              (val) => (val && val.length > 0) || 'Please input company name',
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
            :rules="[(val) => (val && val.length > 0) || 'Please input street']"
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
                (val && val.length == 11) || 'Please enter 11 digits number',
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
            :rules="[(val) => !!val || 'Please enter a valid email address']"
          />

          <q-select
            label="Industry"
            transition-show="flip-up"
            transition-hide="flip-down"
            outlined
            dense
            square
            v-model="industry"
            :options="industry_options"
          />
          <br />
          <q-select
            outlined
            dense
            square
            transition-show="flip-up"
            transition-hide="flip-down"
            v-model="type"
            :options="type_options"
            option-label="label"
            label="Acoount Type"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-black row">
          <q-btn
            color="grey"
            label="Cancel"
            v-close-popup
            class="col"
            unelevated
          />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            class="col"
            @click="onSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteCustomerModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete this customer?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Delete" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { getAllType, getIndutries, postCustomerData } from "src/provider.js";
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
    const fullname = ref("");
    const company_name = ref("");
    const type = ref(null);
    const address = ref("");
    // const region = ref("");
    // const province = ref("");
    // const city_municipality = ref("");
    // const street = ref("");
    // const barangay = ref("");
    const tel_mobile = ref("");
    const email = ref("");
    const industry = ref(null);

    const $q = useQuasar();

    async function onSubmit() {
      console.log("edit");
    }

    function editCustomer(props) {
      company_name.value = props.displayName;
      fullname.value = props.contactPerson;
      address.value = props.address;
      tel_mobile.value = props.contactNo;
      email.value = props.email;
      industry.value = props.industry;
      type.value = props.type;
      editCustomerModal.value = true;
    }

    function viewCustomer() {
      console.log("view");
      viewCustomerModal.value = true;
    }

    function deleteCustomer() {
      console.log("delete");
      deleteCustomerModal.value = true;
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

    onMounted(() => {
      getTypes();
      getSectors();
    });

    return {
      types,
      type_options,
      industry_options,
      customerInfo,
      viewCustomer,
      viewCustomerModal,
      fullname,
      company_name,
      type,
      tel_mobile,
      email,
      industry,
      address,
      editCustomerModal,
      editCustomer,
      onSubmit,
      deleteCustomerModal,
      deleteCustomer,
    };
  },
};
</script>
