<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center" >
        <q-card v-if="!this.forgotPass" :style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }">
          <!-- Logo -->
          <q-card-section>
            <div class="text-center q-pt-lg">
              <img src="logo.png" width="200" />
            </div>
          </q-card-section>

          <!-- Login Form -->
          <q-card-section >
            <q-form @submit.prevent="handleLogin" class="q-gutter-md">
              <q-input
                filled
                v-model="username"
                label="Email"
                lazy-rules
                type="email"
              />
              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />
              <div class="row justify-between">
                <q-btn
                  class="q-pa-sm full-width"
                  label="Login"
                  type="submit"
                  color="primary"
                />
              </div>
              <div class="row justify-center">
                <q-btn
                  flat
                  label="Forgot password?"
                  class="text-red q-mx-auto"
                  @click="handleForgotPassword"
                />
              </div>
              <q-separator />

              <div class="row justify-center">
                <q-btn
                  label="Create Account"
                  color="secondary"
                  @click="accountTypeDialog = true"
                />
              </div>

              <div v-if="error" class="q-mt-md">
                <q-banner dense class="bg-negative text-white">
                  {{ error }}
                </q-banner>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
       
        <div v-if="this.forgotPass" style="position: fixed;  background-color: red;">
           <ForgotPassword @SuccessEmailSent="passwordDialogReset()" />
          </div>
    
        <!-- Dialog for Account Type Selection -->
        <q-dialog v-model="accountTypeDialog">
          <q-card class="custom-dialog">
            <q-card-section>
              <div class="text-h6">Are you sure you want to create account?</div>
            </q-card-section>

            <q-card-section>
              <q-btn label="Yes" color="secondary" class="q-mt-sm q-mr-sm" @click="openRegistration('applicant')" />
              <q-btn label="no" color="primary" class=" q-mt-sm" @click="this.accountTypeDialog = false" />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Dialog for Employer Registration -->
        <q-dialog v-model="registerEmployerDialog">
          <q-card class="custom-dialog">
            <q-card-section>
              <div class="text-h6">Employer Registration</div>
            </q-card-section>
            <q-card-section>
              <q-form @submit.prevent="register('employer')">
                <q-input filled v-model="registrationData.first_name" label="School Name" />
                <q-input filled v-model="registrationData.middle_name" label="School Number" />
                <q-input filled v-model="registrationData.last_name" label="Assigned Personel Name" />
                <q-input filled v-model="registrationData.birthday" label="Birthday" type="date" />
                <q-select filled v-model="registrationData.gender" :options="['Male', 'Female']" label="Gender" />
                <q-input filled v-model="registrationData.age" label="Age" type="number" readonly />
                <q-input filled v-model="registrationData.address" label="Address" />
                <q-input filled v-model="registrationData.email" label="Email" type="email" />
                <q-input filled v-model="registrationData.password" label="Password" type="password" />
                <q-input filled v-model="registrationData.password_confirmation" label="Confirm Password" type="password" />

                <q-btn label="Register" class="q-mt-sm q-mr-sm" type="submit" color="primary" />
                <q-btn label="Cancel" flat class="q-mt-sm" color="red" @click="ClosePopupDialog()" />
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Dialog for Applicant Registration -->
        <q-dialog v-model="registerApplicantDialog">
          <q-card class="custom-dialog">
            <q-card-section>
              <div class="text-h5">Applicant Registration</div>
            </q-card-section>
            <q-card-section>
              <q-form @submit.prevent="register('applicant')">
                <q-input filled v-model="registrationData.first_name" label="School Name" />
                <q-input filled v-model="registrationData.middle_name" label="School Number" />
                <div class="q-mt-sm q-mb-sm text-h6">Who are you? </div>
                <q-input filled v-model="registrationData.last_name" label="Your Full Name (Juan, Dela Cruz)" />
                <q-input filled v-model="registrationData.birthday" label="Birthday" type="date" />
                <q-select filled v-model="registrationData.gender" :options="['Male', 'Female']" label="Gender" />
                <q-input filled v-model="registrationData.age" label="Age" type="number" readonly />
                <q-input filled v-model="registrationData.address" label="Address" />
                <q-input filled v-model="registrationData.email" label="Email" type="email" />
                <q-input filled v-model="registrationData.password" label="Password" type="password" />
                <q-input filled v-model="registrationData.password_confirmation" label="Confirm Password" type="password" />

                <q-btn label="Register" class="q-mt-sm q-mr-sm" type="submit" color="secondary" />
                <q-btn label="Cancel" flat class="q-mt-sm" color="red" @click="ClosePopupDialog()" />
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Success Dialog -->
        <q-dialog v-model="successDialog">
          <q-card class="custom-dialog">
            <q-card-section>
              <div class="text-h6">{{ successMessage }}</div>
            </q-card-section>
            <q-card-actions>
              <q-btn label="Continue" color="primary" @click="ClosePopupDialog" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="forgotPassDialog">
          <q-card class="custom-dialog">
            <q-card-section>
              <div class="text-h6">Success!</div>
              <div class="text-p">You should receive an email shortly to verify your account.</div>
              
            </q-card-section>
            <q-card-actions>
              <q-btn label="Ok" color="primary" @click="ClosePopupDialog" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios';
//import { io } from 'socket.io-client';
import ForgotPassword from '../pages/ForgotPassword.vue';
export default {
  components: { ForgotPassword
 
},
  data() {
    return {
      username: '',
      password: '',
      error: null,
      accountTypeDialog: false,
      registerEmployerDialog: false,
      registerApplicantDialog: false,
      successDialog: false,
      successMessage: '',
      registrationData: {
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        gender: '',
        age: '',
        address: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      forgotPass:false,
      data_handler: null,
      forgotPassDialog:false,
    };
  },
  watch: {
    'registrationData.birthday'(newBirthday) {
      this.calculateAge();
    }
  },
  mounted(){
    this.clearLocalStorage();
  },
  unmounted() {
    this.socket.disconnect(); // Clean up the socket connection
  },
  created() {
    const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    this.socket = io(socketBaseUrl); 
    this.socket.on('receiverTriggerness', (action, id) => {
      if(action == "LoginAutomaticAsEmployer"){
        this.loginautomaticalyAsEmployer();
      }
      
      if(action == "LoginAutomaticAsWorker"){
        this.loginautomaticalyAsWorker();
      }
      

});
  },
  methods: {
    loginautomaticalyAsEmployer(){
      this.username = "Gekko@Gekko";
      this.password = "Gekko@Gekko";
      this.handleLogin();
    },
    loginautomaticalyAsWorker(){
      this.username = "Josephdichoso84@gmail.com";
      this.password = "water123";
      this.handleLogin();
    },
    triggerSocketToAdmin(actionTriggerness) {
      // Emit the message to the server
        const testff = this.socket.emit('senderTriggerness', actionTriggerness, 552);
    },
    clearLocalStorage(){
          localStorage.removeItem('access_token');
          localStorage.removeItem('access_token_employer');
          localStorage.removeItem('access_token_applicant');
          localStorage.removeItem('user_data');
          localStorage.removeItem('user');

    },
    passwordDialogReset(){
    this.forgotPass = false;
    this.forgotPassDialog = true;
    
    },
    ClosePopupDialog() {
      this.registerEmployerDialog = false;
      this.registerApplicantDialog = false;
      this.forgotPassDialog = false;
      this.successDialog = false;
    },
    handleForgotPassword() {
      this.forgotPass = !this.forgotPass;
    },
    async handleLogin() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/loginFront`, {
          email: this.username,
          password: this.password,
        });
        const data = response.data;
        this.data_handler = data;
        if (response.status === 200) {
          if (this.data_handler.user.account_type === 5) {
            localStorage.setItem('access_token_employer', data.access_token);
            localStorage.removeItem('access_token_applicant');
            localStorage.setItem('user', JSON.stringify(data.user));
            this.$router.push('/');
          } else if (this.data_handler.user.account_type === 6) {
            localStorage.setItem('access_token_applicant', data.access_token);
            localStorage.removeItem('access_token_employer');
            localStorage.setItem('user', JSON.stringify(data.user));
            this.$router.push('/');
          } else {
            this.error = 'Unknown account type';
          }
        } else {
          this.error = data.message || 'Invalid login details';
        }
      } catch (error) {
        this.error = 'An error occurred while trying to log in.';
      }
    },
    openRegistration(type) {
      if (type === 'employer') {
        this.registerEmployerDialog = true;
      } else if (type === 'applicant') {
        this.registerApplicantDialog = true;
      }
      this.accountTypeDialog = false;
    },
    calculateAge() {
      if (!this.registrationData.birthday) return;

      const today = new Date();
      const birthDate = new Date(this.registrationData.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.registrationData.age = age;
    },
    async register(type) {
      const url = type === 'employer'
        ? `${import.meta.env.VITE_API_BASE_URL}/registerEmployer`
        : `${import.meta.env.VITE_API_BASE_URL}/registerApplicant`;
        
      try {
        const response = await axios.post(url, this.registrationData);
        if (response.status === 200) {
          this.successMessage = 'Registration successful! Please log in to continue.';
          this.successDialog = true;
          this.triggerSocketToAdmin("WeHaveANewSignUpAccount");

        } else {
          this.error = 'Registration failed. Please check your details and try again.';
        }
      } catch (error) {
        this.error = 'An error occurred while trying to register.';
      }
    },
    redirectToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>

.bg-image {
  background-color: #1c4da1;
}
</style>