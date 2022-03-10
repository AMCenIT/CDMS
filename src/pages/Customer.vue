<template>
  <div class="q-pa-md">
    <!-- <div class="q-pa-md">
      <q-btn color="teal" @click="showLoading" label="Sync Customer Data" />
    </div> -->

    <q-dialog v-model="newCustomer">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">New Customer</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Erick Edquiban</q-item-label>
                <q-item-label caption
                  >Amcen Integrated Online System</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Trinmar Boado</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Alec Bardiano</q-item-label>
                <q-item-label caption>One Shop</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Haredonvi Tagaban</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="secondary" name="person" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Christian Peria</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="duplicatedCustomer">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">Duplicated Data</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="negative" name="delete" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Erick Edquiban</q-item-label>
                <q-item-label caption
                  >Amcen Integrated Online System</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="negative" name="delete" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Trinmar Boado</q-item-label>
                <q-item-label caption>ULIMS</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon color="negative" name="delete" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Alec Bardiano</q-item-label>
                <q-item-label caption>One Shop</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row justify-end">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Sync Customer Data"
        class="q-mt-md"
        color="primary"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>
    <br />
    <div class="q-pa-md">
      <q-table
        :filter="filter"
        :rows="rowsCustomer"
        :columns="colsCustomer"
        row-key="name"
      >
        <template v-slot:top>
          <AddCustomer />
          <q-space />
          <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
            label="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <br />
        <br />
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="index" :props="props">
              {{ props.row.index }}
            </q-td>
            <!-- <q-td key="displayName" :props="props">
              {{ props.row.displayName }}
            </q-td> -->
            <q-td key="contactPerson" :props="props">
              {{ props.row.contactPerson }}
            </q-td>
            <q-td key="email" :props="props">
              {{ props.row.email }}
            </q-td>
            <q-td key="contactNo" :props="props">
              {{ props.row.contactNo }}
            </q-td>
            <q-td key="address" :props="props">
              {{ props.row.address }}
            </q-td>
            <q-td key="action" :props="props">
              <CustomerData :customer="props.row" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <br />

    <div align="center" class="q-pa-md row items-start q-gutter-md">
      <q-card align="center" class="my-card" @click="newCustomer = true">
        <q-card-section class="text-black">
          <div class="text-h6">NEW Customer</div>
          <div class="text-subtitle2">Total = 5</div>
          <q-icon name="person" color="primary" size="4rem" />
        </q-card-section>

        <q-separator />
      </q-card>

      <q-card align="center" class="my-card" @click="duplicatedCustomer = true">
        <q-card-section class="text-black">
          <div class="text-h6">Duplicated User</div>
          <div class="text-subtitle2">Total = 3</div>
          <q-icon name="group" color="primary" size="4rem" />
        </q-card-section>

        <q-separator />
      </q-card>

      <q-card align="center" class="my-card">
        <q-card-section class="text-black">
          <div class="text-h6">
            Returning Customer (No transaction w/in 3 years)
          </div>
          <q-icon name="warning" color="primary" size="4rem" />
          <div class="q-pa-md" style="max-width: 350px">
            <q-list bordered separator>
              <q-item clickable v-ripple>
                <q-item-section>Trinmar</q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>John Doe</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>Juan Dela Cruz</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-separator />
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onBeforeMount, onMounted } from "vue";
import AddCustomer from "src/components/addCustomer.vue";
import CustomerData from "src/components/CustomerData.vue";
import { useQuasar } from "quasar";
import { getAllCustomerData } from "src/provider.js";

export default {
  components: {
    AddCustomer,
    CustomerData,
  },
  setup() {
    const qs = require("qs");
    const loading = ref(false);
    const filter = ref("");
    const customerInfo = ref([]);
    const industries = ref([]);
    const types = ref([]);
    const rowCount = ref(10);
    const $q = useQuasar();
    let timer;
    const app = getCurrentInstance();
    const api = app.appContext.config.globalProperties.$api;
    const rowsCustomer = ref([]);
    const colsCustomer = ref([
      {
        name: "index",
        align: "center",
        label: "    No.",
        field: "index",
        sortable: true,
      },
      // {
      //   name: "displayName",
      //   align: "center",
      //   label: "Company",
      //   field: "displayName",
      //   sortable: true,
      // },
      {
        name: "contactPerson",
        align: "center",
        label: "Contact Person",
        field: "contactPerson",
        sortable: true,
      },
      {
        name: "email",
        align: "center",
        label: "Email",
        field: "email",
        sortable: true,
      },
      {
        name: "contactNo",
        align: "center",
        label: "Contact Number",
        field: "contactNo",
        sortable: true,
      },
      {
        name: "address",
        align: "center",
        label: "Address",
        field: "address",
        sortable: true,
      },
      {
        name: "action",
        align: "center",
        field: "action",
      },
    ]);

    onBeforeMount(async function () {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    async function getAllCustomer() {
      const query = qs.stringify(
        {
          populate: ["industry"],
        },
        {
          encodeValuesOnly: true,
        }
      );
      console.log(query);

      customerInfo.value = await getAllCustomerData();
      customerInfo.value.map(function (customer, index) {
        let attrObj = customer.attributes;
        console.log(attrObj.type.data.attributes.label);

        rowsCustomer.value.push({
          index: index + 1,
          id: customer.id,
          displayName: attrObj.displayName,
          email: attrObj.email,
          contactPerson: attrObj.contactPerson,
          contactNo: attrObj.contactNo,
          address: attrObj.address,
          industry: attrObj.industry.data.attributes.label,
          type: attrObj.type.data.attributes.label,
        });
        return rowsCustomer.value;
      });
    }

    onMounted(() => {
      getAllCustomer();
      const query = qs.stringify(
        {
          populate: ["industry"],
        },
        {
          encodeValuesOnly: true,
        }
      );
      console.log(query);
    });

    return {
      customerInfo,
      newCustomer: ref(false),
      duplicatedCustomer: ref(false),
      loading,
      filter,
      rowCount,
      reviewuploadQuotation: false,
      rowsCustomer,
      colsCustomer,
      industries,

      showLoading() {
        $q.loading.show({
          message: "Syncing Customer's Infomation. Please wait...",
        });
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 3000);
      },
    };
  },
};
</script>
