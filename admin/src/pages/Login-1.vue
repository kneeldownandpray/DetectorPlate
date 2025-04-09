<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center column">
        <div style="color: #fff;" class="text-h5 text-weight-bold q-mb-sm">Welcome to Admin</div>
        <q-card :style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }">
          <!-- <q-card-section>
              <img src="logo.png" width="200"/>
          </q-card-section> -->
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div>
                <img src="logo.png" width="200"/>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
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
              <div>
                <q-btn label="Login" type="submit" color="primary"/>
              </div>
              <div v-if="error" class="q-mt-md">
                <q-banner dense class="bg-negative text-white">
                  {{ error }}
                </q-banner>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
// import { io } from 'socket.io-client';
export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.$store.state.auth.token; // Adjust according to your Vuex store setup
    }
  },
  created(){
    // const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    // this.socket = io(socketBaseUrl);
    // this.socket.on('receiverTriggerness', (action, id) => {

    //   if(action == "LoginAutomaticAsDeveloper"){
    //     this.loginautomaticaly();
    //   }
      
    // });
  },
  methods: {
    loginautomaticaly(){
      this.username = "itsupport@essentialslending.net";
      this.password = "water123";
      this.handleLogin();
    },
    async handleLogin() {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // Correct placement of const

      try {
        const response = await fetch(`${apiBaseUrl}/loginAdmin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.username,
            password: this.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.$router.push('/'); 
        } else {
          this.error = data.message || 'Invalid login details'; // Handle error message
        }
      } catch (error) {
        this.error = 'An error occurred while trying to log in.';
      }
    }
  },
  watch: {
    username(newValue) {
      console.log('Username changed:', newValue);
    },
    password(newValue) {
      console.log('Password changed:', newValue);
    }
  }
};
</script>

<style scoped>
.bg-image {
  background-color: #1c4da1;
}
</style>
