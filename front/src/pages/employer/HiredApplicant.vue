<template>
  <div v-if="this.selectedResume.user_id && this.displayFullResume == true" >
    <div style="display: flex; padding: 3px; justify-content: space-between">

      <q-btn class="q-ml-md q-mt-md" color="primary" icon="chevron_left" label="back" @click="BackFunction()" />
      <q-btn v-if="currentTab == 'hired'"  class="q-mr-md q-mt-md" color="green" disable="" icon="check" label="Succesfully Hired!"  />
      <q-btn v-if="currentTab == 'pending'"  class="q-mr-md q-mt-md" color="amber" disable="" icon="hourglass_top" label="Pending"  />
      <q-btn v-if="currentTab == 'rejected'"  class="q-mr-md q-mt-md" color="red" disable="" icon="cancel" label="Rejected!"  />
    </div>

    <UserProfile  :number="this.selectedResume.user_id"  />
  </div>

  <q-page padding v-else>
    <div style="border-radius: 5px; overflow: hidden;">
      <div class="q-gutter-md q-mb-sm" style=" display: flex; justify-content: flex-end;">
        <q-btn 
          @click="fetchApplicants('hired')" 
          label="Hired" 
          :color="currentTab === 'hired' ? 'primary' : 'green'" 
        />
        <q-btn 
          @click="fetchApplicants('pending')" 
          label="Pending" 
          :color="currentTab === 'pending' ? 'primary' : 'amber'" 
        />
        <q-btn 
          @click="fetchApplicants('rejected')" 
          label="Rejected" 
          :color="currentTab === 'rejected' ? 'primary' : 'red'" 
        />
      </div>
      <q-card-section class="header-format-w">
        <div class="text-h6">Manage Applicants</div>
      </q-card-section>

      <!-- Display 'No Data' message if there are no applicants -->
      <div v-if="ListOfApplicants.length === 0" class="q-mt-md q-text-center">
        <p>No applicants available.</p>
      </div>

      <q-card v-for="entry in ListOfApplicants" :key="entry.id" class="my-card cursor-pointer">
        <q-card-section  >
          <div class="q-gutter-md" style="display: flex; justify-content: space-between;">
            <div>
              <q-icon @click="toggleApplicantDetails(entry)" v-if="entry.approval_of_admin == 1"  name="account_circle" size="50px"/>
              <q-icon v-else  name="account_circle" size="50px"/>
              <q-btn flat @click="toggleApplicantDetails(entry)" v-if="entry.approval_of_admin == 1">
                {{ entry.applicant.first_name }} {{ entry.applicant.last_name }}
              </q-btn>
              <q-btn flat v-else>
                {{ entry.applicant.first_name }} {{ entry.applicant.last_name }}
              </q-btn>
            </div>

            <div style="display: flex; align-items: center;">{{ entry.applicant.resume.profession}}</div> 
            <div>
              <q-icon 
              v-if="entry.approval_of_admin == 1"
                name="keyboard_arrow_up"
                :class="{ 'rotate-180': entry.showDetails }"
                size="40px"
                @click="toggleApplicantDetails(entry)"
              />

           

              <q-btn v-else icon="play_circle"  text-color="primary" @click="showDialog(entry)" label="Watch Video" color="white" class="q-mr-sm"/>
            </div>
          </div>
          <q-slide-transition>
            <div v-if="entry.showDetails" class="q-mt-sm">
              <q-table
                :rows="[entry.applicant.resume]"
                :columns="resumeColumns"
                row-key="id"
                hide-pagination
              >
              </q-table>
              <div class="q-mt-sm">
                <q-btn  @click="showDialog(entry)" label="Resume" color="secondary" class="q-mr-sm"/>
                <q-btn v-if="currentTab === 'hired'" @click="confirmUnlink(entry)" label="Unlink Permanently" color="negative"/>
              </div>
            </div>
          </q-slide-transition>
        </q-card-section>
      </q-card>

      <!-- Applicant Resume Dialog -->
      <q-dialog v-model="dialog" persistent>
        <q-card>
          <q-card-section >
            <div v-if="!hideResumeContent">
              <div style="display: flex; align-items: center; justify-content: center;">
                <!-- <q-icon   name="account_circle" size="90px"/> -->
                <q-avatar size="90px">
                  <img src="https://pbs.twimg.com/media/F4xcqSTaUAExkuh.jpg:large">
                </q-avatar>
              </div>
              
              <h5>{{ selectedResume.full_name }}</h5>
              <p><strong>Address:</strong> {{ selectedResume.address }}</p>
              <p><strong>Birth Address:</strong> {{ selectedResume.birth_address }}</p>
              <p><strong>Height:</strong> {{ selectedResume.height }}</p>
              <p><strong>Weight:</strong> {{ selectedResume.weight }}</p>
              <p><strong>Objectives:</strong> {{ selectedResume.objectives }}</p>
              <p><strong>Civil Status:</strong> {{ selectedResume.civil_status }}</p>
              <p><strong>Religion:</strong> {{ selectedResume.religion }}</p>
              <p><strong>Nationality:</strong> {{ selectedResume.nationality }}</p>
              <p><strong>Contact No:</strong> {{ selectedResume.contact_no }}</p>
              <p><strong>Profession:</strong> {{ selectedResume.profession }}</p>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn @click="dialog = false" label="Close" color="primary"/>
            <q-btn @click="displayFullResume = true" label="Full Resume & Videos" color="green"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Unlink Confirmation Dialog -->
      <q-dialog v-model="confirmDialog" persistent>
        <q-card>
          <q-card-section class="header-format-w">
            <div>
              <div class="text-h6">Confirm Delete</div>
              <p>Are you sure you want to unlink {{ selectedResume.full_name }}?</p>
              <i>You cannot undo this process!</i>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="No" color="primary" @click="confirmDialog = false"/>
            <q-btn flat label="Yes" color="negative" @click="unlinkConfirmed"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import UserProfile from '../../components/UserProfile.vue';


export default {
  name: 'ApplicantManager',
  components: { UserProfile
 
},
  data() {
    return {
      ListOfApplicants: [],
      dialog: false,
      confirmDialog: false,
      displayFullResume:false,
      selectedResume: {},
      hideResumeContent:false,
      currentTab: 'hired', // Default to the 'hired' tab
      resumeColumns: [
        { name: 'full_name', label: 'Full Name', align: 'left', field: 'full_name' },
        { name: 'profession', label: 'Profession', align: 'left', field: 'profession' },
        { name: 'address', label: 'Address', align: 'left', field: 'address' },
      ],
    };
  },
  methods: {
    BackFunction(){
      this.displayFullResume = false;
      this.dialog = false;
    },
    async fetchApplicants(status) {
      try {
        this.currentTab = status; // Set current tab based on button clicked
        const token = localStorage.getItem('access_token_employer');
        let response;

        switch (status) {
          case 'hired':
            response = await axios.get(`${apiBaseUrl}/display-hired-applicant`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            break;
          case 'pending':
            response = await axios.get(`${apiBaseUrl}/display-pending-applicant`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            break;
          case 'rejected':
            response = await axios.get(`${apiBaseUrl}/display-rejected-applicant`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            break;
          default:
            return; // No action for unknown status
        }

        if (Array.isArray(response.data.data)) {
          this.ListOfApplicants = response.data.data.map(entry => ({
            ...entry,
            showDetails: false,
          }));
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      }
    },
    async unlinkApplicant(id) {
      try {
        const token = localStorage.getItem('access_token_employer');
        await axios.delete(`${apiBaseUrl}/hire/${id.applicant_id}/unlink-permanently`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchApplicants(this.currentTab); // Refresh the list after unlinking
      } catch (error) {
        console.error('Error unlinking applicant:', error);
      }
    },
    toggleApplicantDetails(entry) {
      entry.showDetails = !entry.showDetails;
    },
    showDialog(resume) {
      if(resume.approval_of_admin == 0){
        this.hideResumeContent = true;
        this.displayFullResume = true;
      }
      else{
        this.hideResumeContent = false;
      }
      this.selectedResume = resume.applicant.resume;
      this.dialog = true;
    },
    confirmUnlink(resume) {
      this.selectedResume = resume.applicant.resume;
      this.confirmDialog = true;
    },
    unlinkConfirmed() {
      this.unlinkApplicant(this.ListOfApplicants.find(applicant => applicant.applicant.id === this.selectedResume.user_id));
      this.confirmDialog = false; // Close the confirmation dialog
    },
  },
  mounted() {
    this.fetchApplicants(this.currentTab); // Fetch hired applicants by default
  },
};
</script>

<style scoped>
.my-card {
  border-bottom: 3px solid rgb(255, 187, 0);
  margin-bottom: 5px;
  box-shadow: none !important;
}

.rotate-180 {
  transition: transform 0.3s ease;
  transform: rotate(180deg);
}
</style>
