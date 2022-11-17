<script>
import { onMounted, ref } from "vue";
import {
  getCustomerDataAllaios,
  getAllCustomerDataOneShop,
  postCustomerData,
  getAllType,
  getIndutries,
  validateEmails,
  getAllCustomerData,
} from "src/provider.js";
import { useQuasar, QSpinnerGears } from "quasar";
import { oneshop } from "src/boot/axios";

// customer Data
export default {
  setup() {
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
    const typeid = ref("");
    const type_options = ref([]);
    const types = ref([]);

    const sector_options = ref([]);
    const industries = ref([]);
    const sectorlabel = ref("");
    const sectorid = ref("");
    // oneshopdata
    const osindustry = ref("");
    const ostype = ref("");

    const existCompany = ref([]);
    const customerExist = ref([]);

    async function getTypes() {
      types.value = await getAllType();
      // console.log("types.value", types.value);
      types.value.map(function (type) {
        let attrObj = type.attributes;
        type_options.value.push({
          id: type.id,
          label: attrObj.label,
        });
        // return type_options.value;
      });
    }

    async function getSectors() {
      industries.value = await getIndutries();
      // console.log("industries.value", industries.value);
      industries.value.map(function (sector) {
        let attrObj = sector.attributes;
        sector_options.value.push({
          id: sector.id,
          label: attrObj.label,
        });
        // return sector_options.value;
      });
    }

    async function getAiosUser() {
      aiosUser.value = await getCustomerDataAllaios();
    }

    async function getAllCustomerOneShop() {
      oneShopCustomer.value = await getAllCustomerDataOneShop();
      console.log("oneShopCustomer.value", oneShopCustomer.value);
    }
    async function getCustomer() {
      customerExist.value = await getAllCustomerData();
      customerExist.value.data.data.forEach((element) => {
        let attrObj = element.attributes.email;
      });
    }
    async function syncDataBase() {
      if (oneShopCustomer.value == null) {
        $q.loading.hide();
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

        // console.log("type_options", type_options.value);

        // type_options.value.map((type) => {
        //   typelabel.value = type.label;
        //   typeid.value = type.id;
        // });
        sector_options.value.map((sector) => {
          sectorlabel.value = sector.label;
          sectorid.value = sector.id;
          // console.log("test", sectorlabel.value);
        });
        // console.log("oneShopCustomer.value", oneShopCustomer.value);

        oneShopCustomer.value.data.map(async (oscustomer) => {
          // console.log("oscustomeroscustomer", oscustomer);
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
          await Promise.all(
            response.map(async (element) => {
              let attrObj = element.attributes;
              existCompany.value = attrObj.displayName;
              // console.log("existCompany", existCompany.value);
            })
          );

          let intExt = null;
          if (oscustomer.intExt === "External") {
            intExt = 1;
          } else if (oscustomer.intExt === "Internal") {
            intExt = 2;
          } else {
            intExt = 3;
          }

          let sector = null;

          if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "A. Agriculture, forestry and fishing"
          ) {
            sector = 22;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "B. Mining and Quarrying"
          ) {
            sector = 23;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
          ) {
            sector = 24;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "C1. (Mftg) Food Products and Beverages"
          ) {
            sector = 25;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
          ) {
            sector = 26;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
          ) {
            sector = 27;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "C2. (Mftg) Nonmetallic Mineral Products"
          ) {
            sector = 28;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
          ) {
            sector = 29;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C4. (Mftg) Basic Precious / Nonferrous Metals"
          ) {
            sector = 30;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
          ) {
            sector = 31;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C6a. (Mftg - Fabricated Metal Products) Forging"
          ) {
            sector = 32;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C6b. (Mftg - Fabricated Metal Products) Machining"
          ) {
            sector = 33;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
          ) {
            sector = 34;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "C7. (Mftg) Metal Working"
          ) {
            sector = 35;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C8. (Mftg) Electronics (Computer, electronic and optical products)"
          ) {
            sector = 36;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
          ) {
            sector = 37;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "D. Electricity, gas, steam and air-conditioning supply"
          ) {
            sector = 38;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "E. Water supply, sewerage, waste management and remediation activities"
          ) {
            sector = 39;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "F. Construction"
          ) {
            sector = 40;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
          ) {
            sector = 41;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "H. Transportation and Storage"
          ) {
            sector = 42;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "I. Accommodation and food service activities"
          ) {
            sector = 43;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "J. Information and Communication"
          ) {
            sector = 44;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "K. Financial and insurance activities"
          ) {
            sector = 45;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "L. Real estate activities"
          ) {
            sector = 46;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "M. Professional, scientific and technical services"
          ) {
            sector = 47;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "N. Administrative and support service activities / Government"
          ) {
            sector = 48;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "O. Public administrative and defense; compulsory social security"
          ) {
            sector = 49;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "P. Education"
          ) {
            sector = 50;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "Q. Human health and social work activities"
          ) {
            sector = 51;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "R. Arts, entertainment and recreation"
          ) {
            sector = 52;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector === "S. Other service activities"
          ) {
            sector = 53;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0]
              : oscustomer.sector ===
                "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
          ) {
            sector = 54;
          } else {
            sector = 55;
          }

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
              types: [intExt],
              industries: [sector],
            },
          });

          if (existCompany.value != oscustomer.company) {
            data.value.data.displayName = oscustomer.company;
            data.value.data.contactPerson = oscustomer.contact;
            data.value.data.email = oscustomer.email;
            data.value.data.contactNo = oscustomer.telno;
            data.value.data.region = oscustomer.region;
            data.value.data.province = oscustomer.province;
            data.value.data.municipality = oscustomer.citymun;
            data.value.data.address =
              oscustomer.street +
              " " +
              oscustomer.brgy +
              " " +
              oscustomer.citymun +
              " " +
              oscustomer.province;
            // data.value.data.types.id = typeid.value;
            // data.value.data.types.label = typelabel.value;
            // data.value.data.industries.id = sectorid.value;
            // data.value.data.industries.label = sectorlabel.value;
            console.log("data", data.value.data.industries);
            postCustomerData(data.value);
            // console.log("Data", count.value++, sectorlabel.value);
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "You have successfully inserted the customer data",
            });
            $q.loading.hide();
          } else {
            // console.log(
            //   "error",
            //   count.value++,
            //   existCompany.value,
            //   "already exists"
            // );
            console.log(existCompany.value, "already exists");
            $q.notify({
              color: "red-4",
              textColor: "white",
              icon: "cloud_done",
              message: "error",
            });
            $q.loading.hide();
          }
        });
      }
    }

    onMounted(() => {
      getAiosUser();
      getTypes();
      getSectors();
      getAllCustomerOneShop();
      getCustomer();
      // syncDataBase();
    });
    return {
      typelabel,
      count,
      aiosUser,
      oneShopCustomer,
      displayName,
      company_name,
      email,
      contactNo,
      address,
      region,
      province,
      municipality,
      account_type,
      typeid,
      type_options,
      types,
      sector_options,
      industries,
      sectorlabel,
      sectorid,
      osindustry,
      ostype,
      existCompany,
      customerExist,
      getTypes,
      getAiosUser,
      getSectors,
      getAllCustomerOneShop,
      getCustomer,
      syncDataBase,
    };
  },
};
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
