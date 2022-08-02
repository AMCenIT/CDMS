<script setup>
import { onMounted, ref } from "vue";
import {
  getCustomerDataAllaios,
  getAllCustomerDataOneShop,
  postCustomerData,
  getAllType,
  getIndutries,
  validateEmails,
} from "src/provider.js";
import { useQuasar, QSpinnerGears } from "quasar";

// customer Data
const $q = useQuasar();
const count = ref(1);
const aiosUser = ref([]);
const oneShopCustomer = ref([]);
const displayName = ref("");
const company_name = ref("");
const email = ref("");
const contactNo = ref("");
const address = ref("");
const region = ref("");
const province = ref("");
const municipality = ref("");

const account_type = ref("");
const typelabel = ref("");
const typeid = ref(null);
const type_options = ref([]);
const types = ref([]);

const sector_options = ref([]);
const industries = ref([]);
const sectorlabel = ref("");
const sectorid = ref(null);
// oneshopdata
const osindustry = ref("");
const ostype = ref("");

const existCompName = ref("");

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
  industries.value = await getIndutries();
  industries.value.map(function (sector) {
    let attrObj = sector.attributes;
    sector_options.value.push({
      id: sector.id,
      label: attrObj.label,
    });
    return sector_options.value;
  });
}

async function getAiosUser() {
  aiosUser.value = await getCustomerDataAllaios();
}

async function getAllCustomerOneShop() {
  oneShopCustomer.value = await getAllCustomerDataOneShop();
}

async function syncDataBase() {
  if (oneShopCustomer.value == null) {
    $q.notify({
      color: "red",
      textColor: "white",
      icon: "cloud_done",
      message: "No Data",
    });
  } else {
    $q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: "secondary",
      messageColor: "black",
      message: "Syncing",
    });

    type_options.value.map((type) => {
      typelabel.value = type.label;
      typeid.value = type.id;

      sector_options.value.map((sector) => {
        sectorlabel.value = sector.label;
        sectorid.value = sector.id;

        // const qs = require("qs");
        // const query = qs.stringify(
        //   {
        //     $eq: company_name.value,
        //   },
        //   {
        //     encodeValuesOnly: true,
        //   }
        // );
        // const response = await validateEmails(query);
        // console.log("displayname response", response);

        // response.forEach((element) => {
        //   let attrObj = element.attributes;
        //   existCompName.value = attrObj.displayName;
        //   console.log("existCompName", existCompName.value);
        //   return existCompName.value;
        // });

        oneShopCustomer.value.data.map((oscustomer) => {
          account_type.value = oscustomer.intExt;
          osindustry.value = Array.isArray(oscustomer.sector)
            ? oscustomer.sector[0]
            : oscustomer.sector;
          company_name.value = oscustomer.company;
          displayName.value = oscustomer.contact;
          contactNo.value = oscustomer.telno;
          email.value = oscustomer.email;
          address.value =
            oscustomer.street +
            " " +
            oscustomer.brgy +
            " " +
            oscustomer.citymun +
            " " +
            oscustomer.province;
          region.value = oscustomer.region;
          province.value = oscustomer.province;
          municipality.value = oscustomer.citymun;

          // console.log(osindustry.value);

          // const qs = require("qs");
          // const query = qs.stringify(
          //   {
          //     $eq: company_name.value,
          //   },
          //   {
          //     encodeValuesOnly: true,
          //   }
          // );
          // const response = await validateEmails(query);
          // console.log("displayname response", response);

          // response.forEach((element) => {
          //   let attrObj = element.attributes;
          //   existCompName.value = attrObj.displayName;
          //   console.log("existCompName", existCompName.value);
          //   return existCompName.value;
          // });

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
              types: {
                label: " ",
                id: null,
              },
              industries: {
                label: " ",
                id: null,
              },
            },
          };

          if (
            account_type.value == typelabel.value &&
            sectorlabel.value == osindustry.value
          ) {
            data.data.displayName = company_name.value;
            data.data.contactPerson = displayName.value;
            data.data.email = email.value;
            data.data.contactNo = contactNo.value;
            data.data.region = region.value;
            data.data.province = province.value;
            data.data.municipality = municipality.value;
            data.data.address = address.value;
            data.data.types.id = typeid.value;
            data.data.types.label = typelabel.value;
            data.data.industries.id = sectorid.value;
            data.data.industries.label = sectorlabel.value;

            // postCustomerData(data);

            // console.log("Data", count.value++, data);
          }

          $q.loading.hide();
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "You have successfully inserted the customer data",
          });
        });
      });
    });
  }
}

onMounted(() => {
  getAiosUser();
  getTypes();
  getSectors();
  getAllCustomerOneShop();
  // syncDataBase();
});
</script>

<template>
  <div>
    <div v-if="(isSynced = true)">
      <q-btn
        label="Sync Data"
        @click="syncDataBase"
        icon="sync"
        color="secondary"
        unelevated
      />
    </div>
    <div v-if="(isSynced = false)"></div>
  </div>
</template>
