<template>
  
  <q-page padding>
    
    <q-card class="no-shadow" bordered>
      <q-card-section class="header-format-w header-mobile-res" style=" display: flex; justify-content: space-between;    ">
        <div class="text-h6 margin-mobile-rr3">
          <q-icon name="supervisor_account" size="25px" class="q-mr-sm" /> Hiring Approval
        </div>
        <div style=" display: flex; justify-content: flex-end;">

              <q-btn
                label="Pending Approvals "
                color="white"
                text-color="black"
                @click="toggleForRejectedAndApproved()"
                class="q-mr-sm"
              v-if="rejectedOrApproved"
              />
              <q-btn
                label="Pending Approvals "
                color="white"
                text-color="white"
                @click="toggleForRejectedAndApproved()"
                class="q-mr-sm"
                flat
              v-else
              />
              <q-btn
                label="Rejected Approvals"
                color="white"
                 @click="toggleForRejectedAndApproved()"
                flat
                v-if="rejectedOrApproved"
              />


              <q-btn
                label="Rejected Approvals"
                color="white"
                text-color="black"
                 @click="toggleForRejectedAndApproved()"
                 v-else
              />

        </div>
        
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-none" >
        <!-- Pending Approvals Table -->
        <q-table
          square
          class="no-shadow"
          title="Pending Approvals"
          :rows="approvalRows"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          hide-pagination
          :loading="loading"
          v-if="rejectedOrApproved"
        >
          <template v-slot:body-cell-full_name="props">
            <q-td :props="props">
              <span class="text-green-600 font-semibold">
                {{ formatFullName(props.row.employer) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-applicant_full_name="props">
            <q-td :props="props">
              <span class="text-blue-600 font-semibold">
                {{ formatFullName(props.row.applicant) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
      label="Approve"
      color="positive"
      @click="checkInterested(props.row, 'approve')"
      class="q-mr-sm"
    />
    <q-btn
      label="Reject"
      color="negative"
      @click="checkInterested(props.row.id, 'reject')"
    />
            </q-td>
          </template>
        </q-table>
        <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          Are you sure you want to {{ actionType }} this hiring request?
        </q-card-section>
        <q-card-actions>
          <q-btn label="Cancel" color="secondary" @click="dialogVisible = false" />
          <q-btn label="Yes" color="primary" @click="proceedWithAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- List of Interested Employers Dialog -->
    <q-dialog v-model="interestedDialogVisible">
  <q-card>
    <!-- Warning Header -->
    <q-card-section class="bg-red text-white">
      <div class="row items-center">
        <q-icon name="warning" size="md" class="q-mr-sm" />
        <div>
          <h4 class="q-mb-sm ">Warning</h4>
          <p>Note: Other employers are also interested. Would you like to reject them?</p>
        </div>
      </div>
    </q-card-section>

    <!-- Main Content -->
    <q-card-section>
      <div v-if="interestedEmployers.length">
        <div v-for="employer in interestedEmployers" :key="employer.id" class="q-mb-md">
          <p><b>{{ employer.employer_name }}</b> is also interested.</p>
        </div>
        <q-btn label="Proceed" color="primary" @click="showConfirmationDialog" />
      </div>
      <div v-else>
        <p>No other employers are interested in this worker.</p>
        <q-btn label="Proceed" color="primary" @click="showConfirmationDialog" />
      </div>
    </q-card-section>
  </q-card>
</q-dialog>


        <div style="display: flex; justify-content: space-between; padding: 10px;" v-if="rejectedOrApproved">
          <q-pagination
          v-model="pagination.page"
          :max="approvalMaxPages"
          @update:model-value="fetchApprovals"
          color="primary"
          boundary-numbers
          class="q-mt-md"
        />

          <q-select
            filled
            v-model="pagination.rowsPerPage"
            :options="rowsPerPageOptions"
            label="Rows per page"
            class="q-ml-sm"
            dense
            style="width: 200px;"
            @update:model-value="fetchApprovals"
          />
        </div>

        <!-- Hired Applicants Table -->
        <q-table
          square
          class="no-shadow q-mt-md"
          title="Rejected Approvals"
          :rows="hiredRows"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          hide-pagination
          :loading="loading"
        
          v-if="!rejectedOrApproved"
        >
          <template v-slot:body-cell-full_name="props">
            <q-td :props="props">
              <span class="text-green-600 font-semibold">
                {{ formatFullName(props.row.employer) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-applicant_full_name="props">
            <q-td :props="props">
              <span class="text-blue-600 font-semibold">
                {{ formatFullName(props.row.applicant) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <!-- <q-btn flat icon="lock" @click="openDetailsModal(props.row)" /> -->

            
              <q-btn
                label="restore"
                color="positive"
                @click="restoreHiring(props.row.id)"
                class="q-mr-sm"
              />
            </q-td>
          </template>
        </q-table>


        <div style="display: flex; justify-content: space-between; padding: 10px;" v-if="!rejectedOrApproved">

          <q-pagination
          v-model="pagination.page"
          :max="hiredMaxPages"
          @update:model-value="fetchHired"
          color="primary"
          boundary-numbers
          class="q-mt-md"
        />
          <q-select
            filled
            v-model="pagination.rowsPerPage"
            :options="rowsPerPageOptions"
            label="Rows per page"
            class="q-ml-sm"
            dense
            style="width: 200px;"
            @update:model-value="fetchHired"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal for details -->
    <q-dialog v-model="detailsDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Applicant Details</div>
        </q-card-section>
        <q-card-section>
          <!-- Render details here -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" @click="detailsDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
// import axios from 'axios';
// import { io } from 'socket.io-client';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
// const sockit = import.meta.env.VITE_SOCKET_BASE_URL;
export default defineComponent({
  name: 'AdminHiring',
  data() {
    return {
      dialogVisible: false, // For the confirmation dialog
      interestedDialogVisible: false, // For the list of interested employers dialog
      actionType: '', // Holds the action type (approve/reject)
      interestedEmployers: [], // Holds the list of interested employers
      approvalRows: [],
      hiredRows: [],
      socket: null,
      deleteDialog:false,
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
        {
          name: 'full_name',
          label: 'Employer Full Name',
          align: 'left',
          field: 'full_name',
          sortable: true
        },
        {
          name: 'applicant_full_name',
          label: 'Applicant Full Name',
          align: 'left',
          field: 'applicant_full_name',
          sortable: true
        },
        {
          name: 'profession',
          label: 'Profession',
          align: 'left',
          field: row => row.applicant.resume ? row.applicant.resume.profession : 'N/A',
          sortable: true
        },
        { name: 'action', label: 'Actions', align: 'center', field: 'action' }
      ],
      pagination: {
        rowsPerPage: 10,
        page: 1
      },
      rowsPerPageOptions: [5, 10],
      totalPages: 0,
      approvalMaxPages: 1,
      hiredMaxPages: 1,
      selectedTransactionId:null,
      loading: false,
      detailsDialog: false,
      rejectedOrApproved:true,
    };
  },
  methods: {
    toggleForRejectedAndApproved(){
this.rejectedOrApproved = !this.rejectedOrApproved;
    },
    async fetchApprovals() {
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const { data } = await axios.get(`${apiBaseUrl}/display-hiring-approval`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: this.pagination.page,
            perPage: this.pagination.rowsPerPage
          }
        });
        this.approvalRows = data.data;
        this.approvalMaxPages = data.last_page;
      } catch (error) {
        console.error('Error fetching approvals:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchHired() {
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const { data } = await axios.get(`${apiBaseUrl}/display-rejected`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: this.pagination.page,
            perPage: this.pagination.rowsPerPage
          }
        });
        this.hiredRows = data.data;
        this.hiredMaxPages = data.last_page;
      } catch (error) {
        console.error('Error fetching hired applicants:', error);
      } finally {
        this.loading = false;
      }
    },
    checkInterested(dataOfTransaction, actionType) {
  // console.log(dataOfTransaction.applicant.id);
  // console.log(dataOfTransaction.employer.id);

  // Get the selected employer ID from route params
  const selectedEmployerId = this.$route.params.employerId;

  // Get the token from localStorage
  const token = localStorage.getItem('access_token');

  // Make the API request with the correct headers
  axios
    .get(`${apiBaseUrl}/check-interested/${dataOfTransaction.applicant.id}/${dataOfTransaction.employer.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      if (response.data.status) {
        // No other employers interested, proceed with confirmation dialog
        this.actionType = actionType;
        this.dialogVisible = true;
       
        
      } else {
        // There are interested employers, show their list
        this.interestedEmployers = response.data.interested_employers;
        this.interestedDialogVisible = true;
      }
      this.selectedTransactionId = dataOfTransaction.id;
      // console.log(this.selectedTransactionId);
    })
    .catch((error) => {
      console.error('Error checking interested employers:', error);
    });
},


    // Show the confirmation dialog after listing interested employers
    showConfirmationDialog() {
      this.dialogVisible = true; // Show the confirmation dialog
      this.interestedDialogVisible = false; // Hide the interested employers dialog
    },

    // Proceed with either approve or reject action
    proceedWithAction() {
      // console.log(this.selectedTransactionId);
      // if (this.actionType === 'approve') {
        
      //   this.approveHiring(this.selectedTransactionId);
      // } else if (this.actionType === 'reject') {
      //   this.rejectHiring();
      // }
      this.approveHiring(this.selectedTransactionId);
      this.dialogVisible = false; // Close the confirmation dialog
    },


    async approveHiring(id) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.put(`${apiBaseUrl}/hire/${id}/approve`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchApprovals();
        this.fetchHired();
      } catch (error) {
        console.error('Error approving hire:', error);
      }
    },
    async restoreHiring(id) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.put(`${apiBaseUrl}/hire/${id}/restore`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchApprovals();
        this.fetchHired();
      } catch (error) {
        console.error('Error approving hire:', error);
      }
    },
    async rejectHiring(id) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.put(`${apiBaseUrl}/hire/${id}/rejected`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchApprovals();
        this.fetchHired();
      } catch (error) {
        console.error('Error rejecting hire:', error);
      }
    },
    formatFullName(person) {
      return `${person.first_name} ${person.middle_name} ${person.last_name}`.trim();
    },
    openDetailsModal(row) {
      // Logic to show applicant details
      this.detailsDialog = true;
    }
  },
  created(){
    // const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    // this.socket = io(socketBaseUrl);
    // this.socket.on('receiverTriggerness', (action, id) => {

    //   if(action == "TriggerHiredApprovalPolling"){
    //     this.fetchApprovals();
    //     this.fetchHired();
    //   }
      
    // });
  },
  mounted() {
       
    this.fetchApprovals();
    this.fetchHired();
  }
});
</script>

<style scoped>
.text-green-600 {
  color: green;
}
.text-blue-600 {
  color: blue;
}
.font-semibold {
  font-weight: 600;
}

@media (max-width: 600px) {
  .header-mobile-res{
    flex-direction: column; 
  }
  .margin-mobile-rr3{
    margin-bottom: 10px;
  }

}
</style>
