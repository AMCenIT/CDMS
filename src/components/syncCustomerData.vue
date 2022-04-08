<script setup>
import { onMounted, ref } from "vue";
import {
  getCustomerDataAllaios,
  getAllCustomerDataOneShop,
  postCustomerData,
  getAllType,
  getIndutries,
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
  console.log("erjelrln");
  $q.loading.show({
    spinner: QSpinnerGears,
    spinnerColor: "primary",
    messageColor: "black",
    message: "Checking Credentials",
  });

  if (oneShopCustomer.value == null) {
    console.log("null");
    $q.notify({
      color: "red",
      textColor: "white",
      icon: "cloud_done",
      message: "No Data",
    });
  } else {
    type_options.value.map((type) => {
      typelabel.value = type.label;
      typeid.value = type.id;

      sector_options.value.map((sector) => {
        sectorlabel.value = sector.label;
        sectorid.value = sector.id;

        oneShopCustomer.value.data.map((oscustomer) => {
          account_type.value = oscustomer.intExt;
          osindustry.value = Array.isArray(oscustomer.sector)
            ? oscustomer.sector[0]
            : oscustomer.sector;
          company_name.value = oscustomer.company;
          displayName.value = oscustomer.contact;
          contactNo.value = oscustomer.telno;
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
                label: " ",
                id: "",
              },
              industry: {
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
            data.data.type.id = typeid.value;
            data.data.type.label = typelabel.value;
            data.data.industry.id = sectorid.value;
            data.data.industry.label = sectorlabel.value;

            postCustomerData(data);

            console.log(
              "Data",
              count.value++,
              data.data.displayName,
              data.data.type.label
            );
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
