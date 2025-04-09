<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          {{ first_name }}
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
          />
          
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="white"
            icon="logout"
            @click="handleLogout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list pointers>

   



<q-item clickable tag="a" href="/records" target="_blank" rel="noopener noreferrer">
  <q-item-section avatar>
    <q-icon name="table_chart" />
  </q-item-section>
  <q-item-section>
    <q-item-label>Records</q-item-label>
  </q-item-section>
</q-item>


<q-item  to="/" active-class="q-item-no-link-highlighting">
       <q-item-section avatar>
         <q-icon name="play_circle_filled" />
       </q-item-section>
       <q-item-section>
         <q-item-label>Video Cam</q-item-label>
       </q-item-section>
     </q-item>


      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import EssentialLink from 'components/EssentialLink.vue';
import Messages from './Messages.vue';
import axios from 'axios';
import router from 'src/router';
//import { io } from 'socket.io-client';


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    Messages
  },

  data() {
    return {
      leftDrawerOpen: false,
      first_name: '',
      user: null,
      pollingInterval: null,
      isLoading: true // Add a loading state
    };
  },

  computed: {
    drawerStatus() {
      return this.leftDrawerOpen ? 'Open' : 'Closed';
    }
  },
  created(){
    const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    this.socket = io(socketBaseUrl);
    this.socket.on('receiverTriggerness', (action, id) => {
      if(action == "AutomaticLogoutWorkerApplicant"){
        this.handleLogout();
      }
      
    });
  },

  methods: {
    refreshrouter() {
      this.$router.go(); // Refresh the current route
    },

    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    async handleLogout() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let token = null;

      // Determine the correct token based on the account type
      if (user && user.account_type === 5) {
        token = localStorage.getItem('access_token_employer');
      } else if (user && user.account_type === 6) {
        token = localStorage.getItem('access_token_applicant');
      }

      // If token exists, send the logout request
      if (token) {
        const response = await axios.post(`${apiBaseUrl}/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check if the response contains the success message
        if (response.data.message === "Successfully logged out") {
          // Remove tokens and user data from local storage
          localStorage.removeItem('access_token_employer');
          localStorage.removeItem('access_token_applicant');
          localStorage.removeItem('user_data');
          localStorage.removeItem('user');

          // Redirect to the login page
          this.$router.push('/login');
        } else {
          console.error('Unexpected logout response:', response.data);
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
    async fetchUserData() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let token = null;

        if (user && user.account_type === 5) {
          localStorage.removeItem('access_token_applicant');
          token = localStorage.getItem('access_token_employer');
        } else if (user && user.account_type === 6) {
          localStorage.removeItem('access_token_employer');
          token = localStorage.getItem('access_token_applicant');
        }

        if (token) {
          const response = await axios.get(`${apiBaseUrl}/shortpolling`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          this.user = response.data;
          this.first_name = this.user.first_name;
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        this.$router.push('/login');
      } finally {
        this.isLoading = false; // Set loading to false after data is fetched
      }
    }
  },

  mounted() {
    this.fetchUserData();
  },

  beforeUnmount() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
};
</script>
