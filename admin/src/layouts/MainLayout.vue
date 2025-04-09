<template>
  <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="header-format-w">
          <div class="text-h6">Socket.io</div>
          <p>Connected and Working Successfully</p>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="ok"
            @click="deleteDialog = false"
            color="primary"
          />

        </q-card-section>
      </q-card>
    </q-dialog>
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
          {{this.first_name}}
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
  <q-btn
    round
    dense
    flat
    color="white"
    :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
    @click="$q.fullscreen.toggle()"
    v-if="$q.screen.gt.sm"
  >
  </q-btn>
  <q-btn round dense flat color="white" to="/RequestAccounts" >
    <q-icon name="person" />
    <q-badge v-if="account_request" color="red" text-color="white" floating>{{ account_request }}</q-badge>
  </q-btn>
 

  <q-btn round flat>
    <q-avatar size="26px">
      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
    </q-avatar>
  </q-btn>

  <!-- New Logout Button -->
  <q-btn
    round
    dense
    flat
    color="white"
    icon="logout"
    @click="handleLogout"
  >
  </q-btn>
</div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>

        <div style=" padding: 15px; background-color: #fff;">
          <q-img src="../assets/SSS.png"/>
        </div>
        <!-- <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Dashboard2" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>CRM Dashboard</q-item-label>
          </q-item-section>
        </q-item> -->
        <!-- <q-expansion-item
          icon="pages"
          label="Pages"
        >
          <q-list class="q-pl-lg">
            <q-item to="/Login-1" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="email"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Login-1</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Lock" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="lock"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Lock Screen</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Lock-2" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="lock"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Lock Screen - 2</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Pricing" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="list"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Pricing</q-item-label>
              </q-item-section>
            </q-item>
            <q-item-label header class="text-weight-bolder text-white">Generic</q-item-label>
            <q-item to="/Profile" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="person"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>User Profile</q-item-label>
              </q-item-section>
            </q-item>
            <q-item to="/Maintenance" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="settings"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Maintenance</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item> -->
       

        <q-expansion-item
  icon="account_circle"
  label="Accounts"
>
  <q-list class="q-pl-lg">

    <!-- <q-item to="/RequestAccounts" active-class="q-item-no-link-highlighting">
      <q-item-section avatar>
        <q-icon name="person_add"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Account Request</q-item-label>
      </q-item-section>
    </q-item> -->

    <q-item to="/AllAccounts" active-class="q-item-no-link-highlighting">
      <q-item-section avatar>
        <q-icon name="list"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>All Accounts</q-item-label>
      </q-item-section>
    </q-item>
    <!-- <q-item to="/SuperAdmin" active-class="q-item-no-link-highlighting">
      <q-item-section avatar>
        <q-icon name="supervisor_account"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Head Admin</q-item-label>
      </q-item-section>
    </q-item> -->
    <!-- <q-item to="/LendingAccounts" active-class="q-item-no-link-highlighting">
      <q-item-section avatar>
        <q-icon name="account_balance_wallet"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Lending Accounts</q-item-label>
      </q-item-section>
    </q-item> -->
    <!-- <q-item to="/FocusAdminWorkerAccounts" active-class="q-item-no-link-highlighting">
      <q-item-section avatar>
        <q-icon name="work"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Worker Accounts</q-item-label>
      </q-item-section>
    </q-item>
    <q-item to="/EmployerAccounts" active-class="q-item-no-link-highlighting">
      <q-item-section avatar>
        <q-icon name="business"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Accounts</q-item-label>
      </q-item-section>
    </q-item> -->
    <q-item to="/SchoolAccounts" active-class="q-item-no-link-highlighting">
      <q-item-section avatar>
        <q-icon name="person"/>
      </q-item-section>
      <q-item-section>
        <q-item-label>Schools Accounts</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</q-expansion-item>


        <!-- <q-item to="/HiringApproval" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="group"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Employer & Applicant Approval</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/EmployerApplicants" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="card_giftcard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Hired Applicants</q-item-label>
          </q-item-section>
        </q-item> -->

        <!-- <q-item to="/TreeTable" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="list"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>TreeTable</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Charts" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="insert_chart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Charts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Footer" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="info"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Footer</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/CardHeader" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="card_giftcard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Card Header</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Cards" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="card_giftcard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Cards</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Tables" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="table_chart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Tables</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Contact" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Contact</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Checkout" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="check_circle_outline"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Checkout</q-item-label>
          </q-item-section>
        </q-item> -->

        <!--        not completed-->
        <!-- <q-item to="/Calendar" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="date_range"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendar</q-item-label>
          </q-item-section>
        </q-item> -->

        <!--        not completed-->
        <!--        <q-item to="/Taskboard" active-class="q-item-no-link-highlighting">-->
        <!--          <q-item-section avatar>-->
        <!--            <q-icon name="done"/>-->
        <!--          </q-item-section>-->
        <!--          <q-item-section>-->
        <!--            <q-item-label>Taskboard</q-item-label>-->
        <!--          </q-item-section>-->
        <!--        </q-item>-->

        <!-- <q-item to="/Pagination" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="date_range"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Pagination</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/Ecommerce" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="shopping_cart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Product Catalogues</q-item-label>
          </q-item-section>
        </q-item>
        <q-expansion-item
          icon="menu_open"
          label="Menu Levels"
        >
          <q-item class="q-ml-xl" active-class="q-item-no-link-highlighting">
            <q-item-section>
              <q-item-label>Level 1</q-item-label>
            </q-item-section>
          </q-item>
          <q-expansion-item
            :header-inset-level="0.85"
            label="Level 2"
          >
            <q-item class="q-ml-xl" style="margin-left: 55px  !important;" active-class="q-item-no-link-highlighting">
              <q-item-section>
                <q-item-label>Level 2.1</q-item-label>
              </q-item-section>
            </q-item>
            <q-expansion-item
              :header-inset-level="1"
              label="Level 2.2"
            >
              <q-item style="margin-left: 65px  !important;" active-class="q-item-no-link-highlighting">
                <q-item-section>
                  <q-item-label>Level 2.2.1</q-item-label>
                </q-item-section>
              </q-item>
              <q-item style="margin-left: 65px  !important;" active-class="q-item-no-link-highlighting">
                <q-item-section>
                  <q-item-label>Level 2.2.2</q-item-label>
                </q-item-section>
              </q-item> -->
            <!--   -->
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>



<script>
import EssentialLink from 'components/EssentialLink.vue'
import Messages from "./Messages.vue";
import axios from 'axios'; // Ensure you have axios or a similar HTTP client
// import { io } from 'socket.io-client';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    Messages
  },
  created(){
    // const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    // this.socket = io(socketBaseUrl);
    // this.socket.on('receiverTriggerness', (action, id) => {

    //   if(action == "OpenDialog"){
    //     this.deleteDialog = true;
    //   }
    //   if(action == "CloseDialog"){
    //     this.deleteDialog = false;
    //   }
    //   if(action == "AutomaticLogout"){
    //     this.handleLogout();
    //   }
    //   if(action == "WeHaveANewSignUpAccount"){
    //     this.fetchUserData();
    //   }
      
    // });
  },
  data() {
    return {
      leftDrawerOpen: false,
      first_name:"",
      account_request:null,
      user: null, // To store the user data
      pollingInterval: null, // To hold the interval ID
      deleteDialog:false,
    }
  },

  computed: {
    drawerStatus() {
      return this.leftDrawerOpen ? 'Open' : 'Closed'
    }
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },

    handleLogout() {
      // Clear user session data
      localStorage.removeItem('access_token'); // Assuming you store the token in localStorage
      localStorage.removeItem('user_data'); // Remove any other user-related data

      // Redirect to the login page
      this.$router.push('/login');
    },

    async fetchUserData() {

  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${apiBaseUrl}/shortpolling`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
// /counter/status-one
    this.user = response.data;
    this.first_name = this.user.first_name;

  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }

  this.displayCountAccept();
},

async displayCountAccept() {

try {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${apiBaseUrl}/counter/status-one`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  this.account_request = response.data;
} catch (error) {
  console.error('Failed to fetch user data:', error);
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
  },

  watch: {
    // leftDrawerOpen(newVal, oldVal) {
    //   console.log(`Drawer status changed from ${oldVal} to ${newVal}`);
    // }
  }
}
</script>


<style>

/* FONT AWESOME GENERIC BEAT */
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.25);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1);
  }
  55% {
    transform: scale(1.25);
  }
  70% {
    transform: scale(1);
  }
}

</style>
