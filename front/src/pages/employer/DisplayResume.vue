<template>
  <q-page padding>
    
    <div v-if="resume">
      <!-- CV or Resume -->
      <div class="text-h3 q-mb-md"><strong>CV or Resume</strong></div>
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <!-- Resume Details -->
          <div class="text-h6">{{ resume.full_name }}</div>
          <div><strong class="q-mr-sm">Profession:</strong> {{ resume.profession }}</div>
          <div><strong class="q-mr-sm">Current Address:</strong> {{ resume.address }}</div>
          <div><strong class="q-mr-sm">Email:</strong> {{ resume.user.email }}</div>
          <div><strong class="q-mr-sm">Contact Number:</strong> {{ resume.contact_no }}</div>

          <!-- User Details -->
        
          <div class="text-h6 q-mt-md "><b>User Details</b></div>
          <q-separator  class=" q-mb-sm " />
          <div><strong class="q-mr-sm">Civil Status:</strong>{{ resume.civil_status }}</div>
          <div><strong class="q-mr-sm">Religion:</strong>{{ resume.religion }}</div>
          <div><strong class="q-mr-sm">Nationality:</strong>{{ resume.nationality }}</div>
          <div><strong class="q-mr-sm">Birth Address:</strong>{{ resume.birth_address }}</div>
          <div><strong class="q-mr-sm">Height:</strong>{{ resume.height }} ft.</div>
          <div><strong class="q-mr-sm">Weight:</strong>{{ resume.weight }} kg.</div>
          <div><strong class="q-mr-sm">Gender:</strong> {{ resume.user.gender }}</div>
          <div><strong class="q-mr-sm">Birthday:</strong> {{ resume.user.birthday }}</div>
          <div><strong class="q-mr-sm">Age:</strong> {{ calculateAge(resume.user.birthday) }}</div>
        </q-card-section>
      </q-card>

      <!-- Educational Attainments -->
      <q-separator  />
      <div  class="text-h6 q-mb-md">Educational Attainments</div>
      <q-list bordered  class="q-mb-lg">
        <q-item v-for="education in resume.educational_attainments" :key="education.id">
          <q-item-section>
            <div><strong class="q-mr-sm">Level:</strong> {{ education.level }}</div>
            <div ><strong class="q-mr-sm">Institution:</strong> {{ education.institution }}</div>
            <div v-if="education.level !== 'Primary' && (education.level === 'Secondary' || education.level === 'Tertiary')">
              <strong class="q-mr-sm">Course:</strong> {{ education.course }}
            </div>
            <div v-if="education.level !== 'Primary' && (education.level === 'Secondary' || education.level === 'Tertiary')">
              <strong class="q-mr-sm">Major:</strong> {{ education.major }}
            </div>
            <div><strong class="q-mr-sm">Period:</strong> {{ education.period }}</div>
          </q-item-section>
        </q-item>
        <q-btn class="q-mt-sm q-mb-sm q-ml-sm" label="Educational Attainment" @click="openEducationDialog" color="primary" icon="add" />
      </q-list>

      <!-- Work Experiences -->
      <q-separator  />
      <div  class="text-h6 q-mb-md">Work Experiences</div>
      <q-list bordered >
        <q-item v-for="work in resume.work_experiences" :key="work.id">
          <q-item-section>
            <div><strong class="q-mr-sm">Company:</strong> {{ work.company_name }}</div>
            <div><strong class="q-mr-sm">Address:</strong> {{ work.company_address }}</div>
            <div><strong class="q-mr-sm">Position:</strong> {{ work.position }}</div>
            <div><strong class="q-mr-sm">Start Date:</strong> {{ work.start_date }}</div>
            <div><strong class="q-mr-sm">End Date:</strong> {{ work.end_date }}</div>
            <div><strong class="q-mr-sm">Description:</strong> {{ work.job_description }}</div>
          </q-item-section>
        </q-item>
        <q-btn class="q-mt-sm q-mb-sm q-ml-sm" label="Add Work Experience" @click="openWorkDialog" color="primary" icon="add" />
      </q-list>


      <!-- Education Dialog -->
      <q-dialog v-model="showEducationDialog" >
        <q-card class="custom-dialog" >
          <q-card-section>
            <div class="text-h6">Add Educational Attainment</div>
          </q-card-section>

          <q-card-section>
            <q-select
              v-model="education.level"
              label="Level"
              :options="['Primary', 'Secondary', 'Tertiary']"
            />

            <!-- Conditionally display Institution field -->
            <q-input
   
              v-model="education.institution"
              label="Institution"
            />

            <!-- Conditionally display Course and Major fields -->
            <q-input
              v-if="education.level === 'Tertiary' || education.level === 'Tertiary'"
              v-model="education.course"
              label="Course"
            />
            <q-input
              v-if="education.level === 'Secondary'"
              v-model="education.course"
              label="Strand (optional for k12)"
            />
            <q-input
              v-if="education.level === 'Secondary' || education.level === 'Tertiary'"
              v-model="education.major"
              label="Major (Optional)"
            />

            <!-- Period input with format hint -->
            <q-input
              v-model="education.period"
              label="Period"
              :rules="[periodRule]"
              hint="example, 2000 to 2009"
              lazy-rules
            />
            
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label="Save" color="primary" @click="addEducationalAttainment" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Work Dialog -->
      <q-dialog v-model="showWorkDialog">
        <q-card class="custom-dialog">
          <q-card-section>
            <div class="text-h6">Work Experience</div>
          </q-card-section>

          <q-card-section>
            <q-input v-model="work.company_name" label="Company Name" />
            <q-input v-model="work.company_address" label="Company Address" />
            <q-input v-model="work.position" label="Position" />
            <q-input v-model="work.start_date" label="Start Date" type="date" />
            <q-input v-model="work.end_date" label="End Date" type="date" />
            <q-input v-model="work.job_description" label="Job Description" type="textarea" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label="Save" color="primary" @click="addWorkExperience" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <create-resume @resume-saved="handleResumeSaved" v-else />
  </q-page>
</template>
<script>
import axios from 'axios';
import CreateResume from '../../components/CreateResume.vue'; // Import your CreateResume component
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  name: 'ResumePage',
  data() {
    return {
      resume: null,
      showWorkDialog: false,
      showEducationDialog: false,
      work: {
        company_name: '',
        company_address: '',
        position: '',
        start_date: '',
        end_date: '',
        job_description: '',
      },
      education: {
        level: '',
        institution: '',
        period: '',
        course: '',
        major: '',
      },
    };
  },
  components: {
    CreateResume // Register the CreateResume component
  },
  computed: {
    showEducationButton() {
      return this.resume && this.resume.educational_attainments.length > 0;
    },
    showWorkButton() {
      return this.resume && this.resume.work_experiences.length > 0;
    }
  },
  methods: {
   
    async fetchResume() {
      try {
        const token = localStorage.getItem('access_token_employer');
        const response = await axios.get(`${apiBaseUrl}/resume`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.resume = response.data;
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    },

    handleResumeSaved() {
      // this.$router.go(0);
      this.fetchResume();
    },
    calculateAge(birthday) {
      const today = new Date();
      const birthDate = new Date(birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    },
    openWorkDialog() {
      // Clear work data
      this.work = {
        company_name: '',
        company_address: '',
        position: '',
        start_date: '',
        end_date: '',
        job_description: '',
      };
      this.showWorkDialog = true;
    },

    openEducationDialog() {
      // Clear education data
      this.education = {
        level: '',
        institution: '',
        period: '',
        course: '',
        major: '',
      };
      this.showEducationDialog = true;
    },
    async addWorkExperience() {
      try {
        const token = localStorage.getItem('access_token_employer');
        const response = await axios.post(`${apiBaseUrl}/work-experiences`, {
          resume_id: this.resume.id,
          ...this.work
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.resume.work_experiences.push(response.data);
        this.showWorkDialog = false;
      } catch (error) {
        console.error('Error adding work experience:', error);
      }
    },

    async addEducationalAttainment() {
      try {
        const token = localStorage.getItem('access_token_employer');
        const response = await axios.post(`${apiBaseUrl}/educational-attainments`, {
          resume_id: this.resume.id,
          ...this.education
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.resume.educational_attainments.push(response.data);
        this.showEducationDialog = false;
      } catch (error) {
        console.error('Error adding educational attainment:', error);
      }
    },

    periodRule(value) {
      if (!value) return 'Period is required';
      const yearRangePattern = /^[0-9]{4}\s*to\s*[0-9]{4}$/;
      const monthDatePattern = /^(?:[A-Za-z]+ \d{4}|[A-Za-z]+ \d{1,2} \d{4})$/;
      return yearRangePattern.test(value) || monthDatePattern.test(value) ? true : 'Invalid period format';
    }
  },
  mounted() {
    this.fetchResume();
  }
};
</script>


<!-- <style scoped>
.q-page {
  max-width: 600px;
  margin: 0 auto;
}

.q-mb-lg {
  margin-bottom: 1.5rem;
}

.q-mb-md {
  margin-bottom: 1rem;
}

.q-mt-sm {
  margin-top: 0.5rem;
}

.q-mb-sm {
  margin-bottom: 0.5rem;
}

.q-ml-sm {
  margin-left: 0.5rem;
}
</style> -->
