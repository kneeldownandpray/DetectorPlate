<template>
  <q-page padding>
    <q-card class="no-shadow" bordered>
      <q-card-section class="header-format-w">
        <div class="text-h6 ">Pending Users</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-none">
        <q-table
          square
          class="no-shadow"
          title="Users"
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :pagination="pagination"
          hide-pagination
        >
          <template v-slot:top-right>
            <q-input
              v-if="show_filter"
              filled
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              class="q-ml-sm"
              icon="filter_list"
              @click="toggleFilter"
              flat
            />
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="q-pa-md q-gutter-sm">
              <q-btn
                label="Accept"
                @click="confirmAccept(props.row)"
                color="secondary"
              />
              <q-btn
                label="Reject"
                @click="confirmDelete(props.row)"
                color="negative"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-account_type="props">
            <q-td :props="props">
              {{ getAccountTypeName(props.row.account_type) }}
            </q-td>
          </template> 
        </q-table>

        <!-- Custom Pagination Controls -->
        <div style="display: flex; justify-content: space-between; padding: 10px;">
          <q-pagination
            v-model="pagination.page"
            :max="totalPages"
            boundary-numbers
            class="q-mt-md"
            @update:model-value="fetchUsers"
          />
          <q-select
            filled
            v-model="pagination.rowsPerPage"
            :options="rowsPerPageOptions"
            label="Rows per page"
            class="q-ml-sm"
            dense
            style="width: 200px;"
            @update:model-value="fetchUsers"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="header-format-w">
          <div class="text-h6">Confirm Delete</div>
          <p>Are you sure you want to delete this user?</p>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="Delete"
            color="negative"
            @click="deleteUser"
          />
          <q-btn
            label="Cancel"
            class="q-ml-sm"
            @click="closeDeleteDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Accept Confirmation Dialog -->
    <q-dialog v-model="acceptDialog">
      <q-card>
        <q-card-section class="header-format-w">
          <div class="text-h6">Confirm Accept</div>
          <p>Are you sure you want to accept {{ userToAccept.first_name }} {{ userToAccept.middle_name }} {{ userToAccept.last_name }}?</p>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="Accept"
            color="secondary"
            @click="acceptConfirmedUser"
          />
          <q-btn
            label="Cancel"
            class="q-ml-sm"
            @click="closeAcceptDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import axios from 'axios';
// import { io } from 'socket.io-client';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default defineComponent({
  name: 'TableBasic',
  data() {
    return {
      filter: '',
      show_filter: false,
      users: [],
      loading: false,
      deleteDialog: false,
      acceptDialog: false,
      userToAccept: null,
      userToDelete: null,
      rowsPerPageOptions: [5, 10],
      pagination: {
        rowsPerPage: 10,
        page: 1,
      },
      totalPages: 0,
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
        { name: 'first_name', label: 'School Name', align: 'left', field: 'first_name', sortable: true }, 
        { name: 'middle_name', label: 'School Number', align: 'left', field: 'middle_name', sortable: true },
        { name: 'last_name', label: 'Assigned Personnel Full Name', align: 'left', field: 'last_name', sortable: true },
        { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
        { name: 'account_type', label: 'Account Type', align: 'left', field: 'account_type', sortable: true },
        { name: 'action', label: 'Actions', align: 'center', field: 'action' }
      ],
      accountTypeOptions: [
        { label: 'Developer', value: 1 },
        { label: 'Admin', value: 2 },
        { label: 'Admin Workers', value: 3 },
        { label: 'School', value: 4 },
        { label: 'School', value: 5 },
        { label: 'School', value: 6 }
      ]
    };
  },
  created() {
//     const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
//     this.socket = io(socketBaseUrl); 
//     this.socket.on('receiverTriggerness', (action, id) => {

//     if(action == "WeHaveANewSignUpAccount"){
//       this.fetchUsers();
//     }

// });
      
  },
  computed: {
    filteredUsers() {
      if (this.filter) {
        return this.users.filter(user =>
          user.first_name.toLowerCase().includes(this.filter.toLowerCase()) ||
          user.last_name.toLowerCase().includes(this.filter.toLowerCase()) ||
          user.email.toLowerCase().includes(this.filter.toLowerCase())
        );
      }
      return this.users;
    }
  },
  methods: {
    getAccountTypeName(accountType) {
      const mappings = {
        1: 'Developer',
        5: 'School',
        6: 'School',
      };
      return mappings[accountType] || 'Unknown';
    },
    async fetchUsers() {
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${apiBaseUrl}/notValidUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: this.filter,
            per_page: this.pagination.rowsPerPage,
            page: this.pagination.page
          }
        });
        this.users = response.data.data;
        this.totalPages = response.data.last_page; // Get total pages from API response
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    toggleFilter() {
      this.show_filter = !this.show_filter;
    },
    async openEditModal(user) {
      this.editForm = { ...user };
      this.editDialog = true;
    },

    async confirmDelete(user) {
      this.userToDelete = user;
      this.deleteDialog = true;
    },

    async deleteUser() {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`${apiBaseUrl}/validUsers/${this.userToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.deleteDialog = false;
        this.fetchUsers();
        this.triggerSocketToAdmin("WeHaveANewSignUpAccount");
      } catch (error) {
        console.error(error);
      }
    },
    triggerSocketToAdmin(actionTriggerness) {
      // Emit the message to the server
        const testff = this.socket.emit('senderTriggerness', actionTriggerness, 552);
    },
    async confirmAccept(user) {
      this.userToAccept = user;
      this.acceptDialog = true;
    },

    async acceptConfirmedUser() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${apiBaseUrl}/acceptAccount`, {
          id: this.userToAccept.id
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.status === 200) {
          this.fetchUsers(); // Refresh the user list
          this.triggerSocketToAdmin("WeHaveANewSignUpAccount");
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.acceptDialog = false;
      }
    },

    closeAcceptDialog() {
      this.acceptDialog = false;
    },

    closeDeleteDialog() {
      this.deleteDialog = false;
    }
  },
  mounted() {
    this.fetchUsers();
  }
});
</script>
