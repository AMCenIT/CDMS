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

    <div class="row justify-end"></div>
    <syncCustomerData />
    <br />
    <div class="q-pa-md">
      <q-table
        title="Treats"
        :filter="filter"
        :rows="rowsCustomer"
        :columns="colsCustomer"
        row-key="name"
        v-model:pagination="pagination"
      >
        <template v-slot:top>
          <div>
            <label class="q-pa-md text-h4"> Customer Table </label><br />
            <label class="q-pa-md">{{ length + " " + "Entries found" }}</label>
          </div>
          <q-space />
          <div>
            <br />
            <AddCustomer :rowsCustomer="rowsCustomer" /><br />
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
          </div>
        </template>

        <br />
        <br />
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="index" :props="props">
              {{ props.row.index }}
            </q-td>

            <q-td key="contactPerson" :props="props">
              {{ props.row.contactPerson }}
            </q-td>

            <q-td key="contactNo" :props="props">
              {{ props.row.contactNo }}
            </q-td>

            <q-td key="action" :props="props">
              <CustomerData :customer="props.row" />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:pagination="scope">
          <q-btn
            v-if="scope.pagesNumber > 2"
            icon="first_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.firstPage"
          />

          <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.prevPage"
          />

          <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.nextPage"
          />

          <q-btn
            v-if="scope.pagesNumber > 2"
            icon="last_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.lastPage"
          />
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
import {
  ref,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  computed,
} from "vue";
import AddCustomer from "src/components/addCustomer.vue";
import CustomerData from "src/components/CustomerData.vue";
import syncCustomerData from "src/components/syncCustomerData.vue";

import { useQuasar } from "quasar";
import { getAllCustomerData } from "src/provider.js";

export default {
  components: {
    AddCustomer,
    CustomerData,
    syncCustomerData,
  },
  setup() {
    const qs = require("qs");
    const loading = ref(false);
    const filter = ref("");
    const length = ref("");
    const lengthaios = ref("");

    const paginationStart = ref("");
    const paginationLimit = ref("");

    const aiosUser = ref([]);
    const strapiApiCustomer = ref([]);

    const customerInfo = ref([]);
    const industries = ref([]);
    const rowCount = ref(10);
    const $q = useQuasar();
    let timer;
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 2,
      rowsPerPage: 5,
      // rowsNumber: xx if getting data from a server
    });
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
      // {
      //   name: "email",
      //   align: "center",
      //   label: "Email",
      //   field: "email",
      //   sortable: true,
      // },
      {
        name: "contactNo",
        align: "center",
        label: "Contact Number",
        field: "contactNo",
        sortable: true,
      },
      // {
      //   name: "address",
      //   align: "center",
      //   label: "Address",
      //   field: "address",
      //   sortable: true,
      // },
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
      const qs = require("qs");
      const query = qs.stringify(
        {
          populate: ["industry", "type"],
          pagination: {
            start: 0,
            limit: 1000,
          },
        },
        {
          encodeValuesOnly: true,
        }
      );

      const total = qs.stringify(
        {
          pagination: {
            start: 0,
            limit: 1000,
          },
        },
        {
          encodeValuesOnly: true,
        }
      );

      console.log(total);
      strapiApiCustomer.value = await getAllCustomerData(total);
      length.value = strapiApiCustomer.value.data.meta.pagination.total;
      // table
      customerInfo.value = await getAllCustomerData(query);
      console.log(customerInfo.value);
      customerInfo.value.data.data.map(function (customer, index) {
        let attrObj = customer.attributes;
        rowsCustomer.value.push({
          index: index + 1,
          id: customer.id,
          displayName: attrObj.displayName,
          email: attrObj.email,
          contactPerson: attrObj.contactPerson,
          contactNo: attrObj.contactNo,
          address: attrObj.address,
          industry: attrObj.industry.data,
          type: attrObj.type.data,
        });
        return rowsCustomer.value;
      });
    }

    // async function getAiosUser() {
    //   customerInfo.value = await getAllCustomerData();
    //   console.log(customerInfo.value);
    //   length.value = customerInfo.value.length;
    //   aiosUser.value = await getCustomerDataAllaios();
    //   lengthaios.value = aiosUser.value.length;
    //   aiosUser.value.data.map((customer, index) => {
    //     rowsCustomer.value.push({
    //       index: index + length.value + 1,
    //       id: customer._id,
    //       displayName: customer.company_name,
    //       email: customer.email,
    //       contactPerson: customer.first_name + customer.last_name,
    //       contactNo: customer.mobile,
    //       address: customer.house_bldg_st,
    //       industry: customer.sector,
    //       type: customer.account_type,
    //     });
    //     return rowsCustomer.value;
    //   });
    // }

    onMounted(() => {
      getAllCustomer();
    });

    return {
      metaObj: ref(""),
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
      length,
      lengthaios,
      aiosUser,
      pagination,

      pagesNumber: computed(() => {
        return Math.ceil(rows.length / pagination.value.rowsPerPage);
      }),
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
