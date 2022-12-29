<script>
import { onMounted, ref, defineProps } from "vue";
import {
  getCustomerDataAllaios,
  getAllCustomerDataOneShop,
  postCustomerData,
  getAllType,
  getIndutries,
  validateCompany,
  validateEmails,
  getAllCustomerData,
  postCustomerDataaiosApi,
  systemsFilter,
} from "src/provider.js";
import { useQuasar, QSpinnerGears } from "quasar";
import { oneshop } from "src/boot/axios";
import { computed } from "@vue/reactivity";

// customer Data
export default {
  props: ["customerCount"],
  setup(props) {
    // console.log("props", props);
    const oneShopCustomerTotal = ref(0);
    const counts = ref({});
    const qs = require("qs");
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
    const duplicatedCustomer = ref(null);

    const existEmail = ref([]);

    const systems = ref([]);

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
    async function getAiosUser(startRow, count) {
      const query = qs.stringify(
        {
          $skip: startRow,
          $limit: count,
        },

        {
          encodeValuesOnly: true,
        }
      );

      aiosUser.value = await getCustomerDataAllaios(query);
      console.log("AIOS CUSTOMER RESPONSE", aiosUser.value);
      return aiosUser.value;
    }

    async function getAllCustomerOneShop() {
      oneShopCustomer.value = await getAllCustomerDataOneShop();
      // console.log("oneShopCustomer.value", oneShopCustomer.value);
      oneShopCustomerTotal.value = oneShopCustomer.value.data
        .map(function (val, idx, arr) {
          for (var i = 0; i < idx; i++) {
            if (arr[i].company === val.company) {
              val.isTrue = true;
              return val;
            }
          }
          val.isTrue = false;
          return val;
        })
        .filter((d) => d.isTrue === false).length;

      console.log("oneShopCustomerTotal.value", oneShopCustomerTotal.value);

      // oneShopCustomerTotal.value.data
      //   .map((d) => d.isTrue)
      //   .filter((d) => d === false);

      // console.log("oneShopCustomer.value", oneShopCustomer.value);
    }
    async function getCustomer() {
      customerExist.value = await getAllCustomerData();
      // console.log("customerExist.value", customerExist.value);
      customerExist.value.data.data.forEach((element) => {
        let attrObj = element.attributes;
        // console.log("test", attrObj);
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

        // duplicatedCustomer.value = oneShopCustomer.value

        // duplicatedCustomer.value = oneShopCustomer.value.data
        //   .map(function (val, idx, arr) {
        //     for (var i = 0; i < idx; i++) {
        //       if (arr[i].company === val.company) {
        //         val.isTrue = true;
        //         return val;
        //       }
        //     }
        //     val.isTrue = false;
        //     return val;
        //   })
        //   .filter((d) => d.isTrue);

        // console.log("duplicatedCustomer", duplicatedCustomer.value);

        // console.log()

        // oneShopCustomer.value.data.forEach(function (x, idx, arr) {
        //   for (var i = 0; i < idx; i++) {
        //     if (arr[i].company === x.company) {
        //       counts.value[x.company] = (counts.value[x.company] || 0) + 1;
        //       x.isTrue = true;
        //       return x;
        //     }
        //   }
        //   x.isTrue = false;
        //   return x;
        // });
        // console.log(counts.value);

        // const counts = {};
        // oneShopCustomer.value.data.map(function (x) {
        //   counts[x.company] = (counts[x.company] || 0) + 1;
        //   // if (counts[x.company] !== 1) {
        //   duplicatedCustomer.value = counts;
        //   // console.log("attr", counts[x.company]);
        //   console.log("test", duplicatedCustomer.value);
        //   // }
        // });
        // console.log("test", duplicatedCustomer.value);

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

        aiosUser.value.data.map(async (aiosCustomer) => {
          account_type.value = aiosCustomer.account_type;
          osindustry.value = Array.isArray(aiosCustomer.sector)
            ? aiosCustomer.sector[0]
            : aiosCustomer.sector;
          company_name.value = aiosCustomer.company_name;
          displayName.value =
            aiosCustomer.first_name + " " + aiosCustomer.last_name;
          contactNo.value = aiosCustomer.mobile;
          email.value = aiosCustomer.email;
          address.value =
            aiosCustomer.house_bldg_st +
            " " +
            aiosCustomer.brgy_district +
            " " +
            aiosCustomer.city_municipality +
            " " +
            aiosCustomer.state_province;
          region.value = aiosCustomer.region;
          province.value = aiosCustomer.state_province;
          municipality.value = aiosCustomer.city_municipality;

          const qs = require("qs");
          const query = qs.stringify(
            {
              $eq: email.value,
            },
            {
              encodeValuesOnly: true,
            }
          );
          const response = await validateEmails(query);
          await Promise.all(
            response.map(async (element) => {
              // console.log("test", element);
              let attrObj = element.attributes;
              existEmail.value = attrObj.email;
              // console.log('attrObj', attrObj.displayName)
              // console.log("existCompany", existEmail.value);
            })
          );

          let intExt = null;
          if (aiosCustomer.account_type === "External") {
            intExt = 1;
          } else if (aiosCustomer.account_type === "Internal") {
            intExt = 2;
          } else {
            intExt = 3;
          }

          let sector = null;
          if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "A. Agriculture, forestry and fishing"
              : aiosCustomer.sector === "A. Agriculture, forestry and fishing"
          ) {
            sector = 22;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "B. Mining and Quarrying"
              : aiosCustomer.sector === "B. Mining and Quarrying"
          ) {
            sector = 23;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
              : aiosCustomer.sector ===
                "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
          ) {
            sector = 24;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C1. (Mftg) Food Products and Beverages"
              : aiosCustomer.sector === "C1. (Mftg) Food Products and Beverages"
          ) {
            sector = 25;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
              : aiosCustomer.sector ===
                "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
          ) {
            sector = 26;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
              : aiosCustomer.sector ===
                "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
          ) {
            sector = 27;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C2. (Mftg) Nonmetallic Mineral Products"
              : aiosCustomer.sector ===
                "C2. (Mftg) Nonmetallic Mineral Products"
          ) {
            sector = 28;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
              : aiosCustomer.sector ===
                "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
          ) {
            sector = 29;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C4. (Mftg) Basic Precious / Nonferrous Metals"
              : aiosCustomer.sector ===
                "C4. (Mftg) Basic Precious / Nonferrous Metals"
          ) {
            sector = 30;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
              : aiosCustomer.sector ===
                "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
          ) {
            sector = 31;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C6a. (Mftg - Fabricated Metal Products) Forging"
              : aiosCustomer.sector ===
                "C6a. (Mftg - Fabricated Metal Products) Forging"
          ) {
            sector = 32;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C6b. (Mftg - Fabricated Metal Products) Machining"
              : aiosCustomer.sector ===
                "C6b. (Mftg - Fabricated Metal Products) Machining"
          ) {
            sector = 33;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
              : aiosCustomer.sector ===
                "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
          ) {
            sector = 34;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "C7. (Mftg) Metal Working"
              : aiosCustomer.sector === "C7. (Mftg) Metal Working"
          ) {
            sector = 35;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C8. (Mftg) Electronics (Computer, electronic and optical products)"
              : aiosCustomer.sector ===
                "C8. (Mftg) Electronics (Computer, electronic and optical products)"
          ) {
            sector = 36;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
              : aiosCustomer.sector ===
                "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
          ) {
            sector = 37;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "D. Electricity, gas, steam and air-conditioning supply"
              : aiosCustomer.sector ===
                "D. Electricity, gas, steam and air-conditioning supply"
          ) {
            sector = 38;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "E. Water supply, sewerage, waste management and remediation activities"
              : aiosCustomer.sector ===
                "E. Water supply, sewerage, waste management and remediation activities"
          ) {
            sector = 39;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "F. Construction"
              : aiosCustomer.sector === "F. Construction"
          ) {
            sector = 40;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
              : aiosCustomer.sector ===
                "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
          ) {
            sector = 41;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "H. Transportation and Storage"
              : aiosCustomer.sector === "H. Transportation and Storage"
          ) {
            sector = 42;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "I. Accommodation and food service activities"
              : aiosCustomer.sector ===
                "I. Accommodation and food service activities"
          ) {
            sector = 43;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "J. Information and Communication"
              : aiosCustomer.sector === "J. Information and Communication"
          ) {
            sector = 44;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "K. Financial and insurance activities"
              : aiosCustomer.sector === "K. Financial and insurance activities"
          ) {
            sector = 45;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "L. Real estate activities"
              : aiosCustomer.sector === "L. Real estate activities"
          ) {
            sector = 46;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "M. Professional, scientific and technical services"
              : aiosCustomer.sector ===
                "M. Professional, scientific and technical services"
          ) {
            sector = 47;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "N. Administrative and support service activities / Government"
              : aiosCustomer.sector ===
                "N. Administrative and support service activities / Government"
          ) {
            sector = 48;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "O. Public administrative and defense; compulsory social security"
              : aiosCustomer.sector ===
                "O. Public administrative and defense; compulsory social security"
          ) {
            sector = 49;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "P. Education"
              : aiosCustomer.sector === "P. Education"
          ) {
            sector = 50;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "Q. Human health and social work activities"
              : aiosCustomer.sector ===
                "Q. Human health and social work activities"
          ) {
            sector = 51;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "R. Arts, entertainment and recreation"
              : aiosCustomer.sector === "R. Arts, entertainment and recreation"
          ) {
            sector = 52;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] === "S. Other service activities"
              : aiosCustomer.sector === "S. Other service activities"
          ) {
            sector = 53;
          } else if (
            Array.isArray(aiosCustomer.sector)
              ? aiosCustomer.sector[0] ===
                "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
              : aiosCustomer.sector ===
                "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
          ) {
            sector = 54;
          } else {
            sector = 55;
          }

          const aiosData = ref({
            data: {
              displayName: "",
              contactPerson: "",
              email: "",
              contactNo: "",
              region: "",
              province: "",
              municipality: "",
              address: "",
              system: "AIOS",
              types: [intExt],
              industries: [sector],
            },
          });

          // console.log("test", aiosCustomer.system_user_type);
          if (existEmail.value != aiosCustomer.email) {
            aiosData.value.data.displayName = aiosCustomer.company;
            aiosData.value.data.contactPerson =
              aiosCustomer.first_name + " " + aiosCustomer.last_name;
            aiosData.value.data.email = aiosCustomer.email;
            aiosData.value.data.contactNo = aiosCustomer.mobile;
            aiosData.value.data.region = aiosCustomer.region;
            aiosData.value.data.province = aiosCustomer.state_province;
            aiosData.value.data.municipality = aiosCustomer.city_municipality;
            aiosData.value.data.address =
              aiosCustomer.house_bldg_st +
              " " +
              aiosCustomer.brgy_district +
              " " +
              aiosCustomer.city_municipality +
              " " +
              aiosCustomer.state_province;
            console.log("aios success", aiosData.value);
            postCustomerData(aiosData.value);
          } else {
            console.log("error");
            $q.notify({
              color: "red-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Error insert for AIOS",
            });
            $q.loading.hide();
          }
        });

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
          const response = await validateCompany(query);
          await Promise.all(
            response.map(async (element) => {
              // console.log("test", element);
              let attrObj = element.attributes;
              existCompany.value = attrObj.displayName;
              // console.log('attrObj', attrObj.displayName)
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
              ? oscustomer.sector[0] === "A. Agriculture, forestry and fishing"
              : oscustomer.sector === "A. Agriculture, forestry and fishing"
          ) {
            sector = 22;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "B. Mining and Quarrying"
              : oscustomer.sector === "B. Mining and Quarrying"
          ) {
            sector = 23;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
              : oscustomer.sector ===
                "C.12 (Mftg) Others, Manufacturing (non M&E) (e.g. Plastic, Rubber, Leather, Textile, Chemicals)"
          ) {
            sector = 24;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C1. (Mftg) Food Products and Beverages"
              : oscustomer.sector === "C1. (Mftg) Food Products and Beverages"
          ) {
            sector = 25;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
              : oscustomer.sector ===
                "C10. (Mftg) Non-electrical Machinery (General Purpose and Special Purpose Machinery)"
          ) {
            sector = 26;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
              : oscustomer.sector ===
                "C11. Motor Vehicles / Transport (e.g. automotive, aerospace)"
          ) {
            sector = 27;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C2. (Mftg) Nonmetallic Mineral Products"
              : oscustomer.sector === "C2. (Mftg) Nonmetallic Mineral Products"
          ) {
            sector = 28;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
              : oscustomer.sector ===
                "C3. (Mftg) Iron & Steel (Basic Ferrous Metal)"
          ) {
            sector = 29;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C4. (Mftg) Basic Precious / Nonferrous Metals"
              : oscustomer.sector ===
                "C4. (Mftg) Basic Precious / Nonferrous Metals"
          ) {
            sector = 30;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
              : oscustomer.sector ===
                "C5. (Mftg) Metal Casting / Foundry / Metalcasting"
          ) {
            sector = 31;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C6a. (Mftg - Fabricated Metal Products) Forging"
              : oscustomer.sector ===
                "C6a. (Mftg - Fabricated Metal Products) Forging"
          ) {
            sector = 32;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C6b. (Mftg - Fabricated Metal Products) Machining"
              : oscustomer.sector ===
                "C6b. (Mftg - Fabricated Metal Products) Machining"
          ) {
            sector = 33;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
              : oscustomer.sector ===
                "C6c. (Mftg - Fabricated Metal Products) Treatment and coating of metals"
          ) {
            sector = 34;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "C7. (Mftg) Metal Working"
              : oscustomer.sector === "C7. (Mftg) Metal Working"
          ) {
            sector = 35;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C8. (Mftg) Electronics (Computer, electronic and optical products)"
              : oscustomer.sector ===
                "C8. (Mftg) Electronics (Computer, electronic and optical products)"
          ) {
            sector = 36;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
              : oscustomer.sector ===
                "C9. (Mftg) Electrical Machinery (e.g. household appliances, ligting, signaling equipment)"
          ) {
            sector = 37;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "D. Electricity, gas, steam and air-conditioning supply"
              : oscustomer.sector ===
                "D. Electricity, gas, steam and air-conditioning supply"
          ) {
            sector = 38;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "E. Water supply, sewerage, waste management and remediation activities"
              : oscustomer.sector ===
                "E. Water supply, sewerage, waste management and remediation activities"
          ) {
            sector = 39;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "F. Construction"
              : oscustomer.sector === "F. Construction"
          ) {
            sector = 40;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
              : oscustomer.sector ===
                "G. Wholesale and retail trade; repair of motor vehicles and motorcycles"
          ) {
            sector = 41;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "H. Transportation and Storage"
              : oscustomer.sector === "H. Transportation and Storage"
          ) {
            sector = 42;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "I. Accommodation and food service activities"
              : oscustomer.sector ===
                "I. Accommodation and food service activities"
          ) {
            sector = 43;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "J. Information and Communication"
              : oscustomer.sector === "J. Information and Communication"
          ) {
            sector = 44;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "K. Financial and insurance activities"
              : oscustomer.sector === "K. Financial and insurance activities"
          ) {
            sector = 45;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "L. Real estate activities"
              : oscustomer.sector === "L. Real estate activities"
          ) {
            sector = 46;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "M. Professional, scientific and technical services"
              : oscustomer.sector ===
                "M. Professional, scientific and technical services"
          ) {
            sector = 47;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "N. Administrative and support service activities / Government"
              : oscustomer.sector ===
                "N. Administrative and support service activities / Government"
          ) {
            sector = 48;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "O. Public administrative and defense; compulsory social security"
              : oscustomer.sector ===
                "O. Public administrative and defense; compulsory social security"
          ) {
            sector = 49;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "P. Education"
              : oscustomer.sector === "P. Education"
          ) {
            sector = 50;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "Q. Human health and social work activities"
              : oscustomer.sector ===
                "Q. Human health and social work activities"
          ) {
            sector = 51;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "R. Arts, entertainment and recreation"
              : oscustomer.sector === "R. Arts, entertainment and recreation"
          ) {
            sector = 52;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] === "S. Other service activities"
              : oscustomer.sector === "S. Other service activities"
          ) {
            sector = 53;
          } else if (
            Array.isArray(oscustomer.sector)
              ? oscustomer.sector[0] ===
                "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
              : oscustomer.sector ===
                "T. Activities of private households as employers and undifferentiated goods and services and producing activities of households for own use"
          ) {
            sector = 54;
          } else {
            sector = 55;
          }

          const oneShopData = ref({
            data: {
              displayName: "",
              contactPerson: "",
              email: "",
              contactNo: "",
              region: "",
              province: "",
              municipality: "",
              address: "",
              system: "OneShop",
              types: [intExt],
              industries: [sector],
            },
          });

          if (existCompany.value != oscustomer.company) {
            oneShopData.value.data.displayName = oscustomer.company;
            oneShopData.value.data.contactPerson = oscustomer.contact;
            oneShopData.value.data.email = oscustomer.email;
            oneShopData.value.data.contactNo = oscustomer.telno;
            oneShopData.value.data.region = oscustomer.region;
            oneShopData.value.data.province = oscustomer.province;
            oneShopData.value.data.municipality = oscustomer.citymun;
            oneShopData.value.data.address =
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
            // console.log("data", oneShopData.value.data.industries);
            postCustomerData(oneShopData.value);
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
            // console.log(sector, "already exists");
            $q.notify({
              color: "red-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Error insert for CDMS",
            });
            $q.loading.hide();
          }
        });
      }
    }

    onMounted(async () => {
      // const oneShopData = await getAllCustomerDataOneShop();
      // console.log("aaa", oneShopData);
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
      systems,
      existEmail,
      duplicatedCustomer,
      counts,
      oneShopCustomerTotal,
    };
  },
};
</script>

<template>
  <div>
    <!-- <pre>{{ oneShopCustomer.data }}</pre> -->
    <!-- <div v-for="(d, index) in counts" :key="index">{{ index }} : {{ d }}</div> -->
    <!-- <pre>{{ duplicatedCustomer.filter((d) => d === true) }}</pre> -->
    <div v-if="(isSynced = true)">
      <!-- {{ oneShopCustomerTotal }} -->
      <!-- {{ customerCount }} {{ oneShopCustomerTotal }} New data
      {{ customerCount - oneShopCustomerTotal }} -->
      <!-- New Costumer(s) {{ oneShopCustomer }}  {{customerCount }} -->
      <q-btn
        label="Sync Data"
        @click="syncDataBase"
        icon="sync"
        color="secondary"
        unelevated
      >
        <q-badge
          v-if="oneShopCustomerTotal + aiosUser.total - customerCount"
          color="red"
          floating
          >{{ oneShopCustomerTotal + aiosUser.total - customerCount }}</q-badge
        >
      </q-btn>
    </div>
    <div v-if="(isSynced = false)"></div>
  </div>
</template>
