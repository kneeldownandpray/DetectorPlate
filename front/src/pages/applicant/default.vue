<template>
  <div>
    <div>
      <h3>Emergency Remote</h3>
      <div class="q-ma-sm">
        <div class="q-ma-md" :class="`shadow-3`" style=" border-radius: 4px; ">
          <span class="q-ma-md " style="font-size: 20px; opacity: 0.6;"><b>Test Connection</b></span><br>
          <q-btn class="q-ma-sm" color="green" @click="sendMessage(`OpenDialog`)">Open Dialog</q-btn>
        <q-btn class="q-ma-sm" color="red" @click="sendMessage(`CloseDialog`)">Close Dialog</q-btn>
        <q-btn class="q-ma-sm q-mb-lg" color="primary" @click="sendMessage(`TriggerHiredApprovalPolling`)">Update the hiring approval</q-btn> <br>
        </div>

        <div class="q-ma-md" :class="`shadow-3`" style=" border-radius: 4px; ">
          <span class="q-ma-md " style="font-size: 20px; opacity: 0.6;"><b>As Developer</b></span><br>
          <q-btn  class="q-ma-sm" color="green" @click="sendMessage(`LoginAutomaticAsDeveloper`)"> <q-icon name="login" class="q-mr-sm" /> Login </q-btn>
          <q-btn  class="q-ma-sm" color="primary" @click="sendMessage(`AutomaticLogout`)"> <q-icon name="logout" class="q-mr-sm" /> Logout</q-btn>
        </div>

        <div class="q-ma-md "  :class="`shadow-3`" style=" border-radius: 4px; ">
          <span class="q-ma-md " style="font-size: 20px; opacity: 0.6;"><b>As Employer</b></span><br>
          <q-btn  class="q-ma-sm" color="green" @click="sendMessage(`LoginAutomaticAsEmployer`)"> <q-icon name="login" class="q-mr-sm" /> Login </q-btn>
          <q-btn  class="q-ma-sm" color="primary" @click="sendMessage(`AutomaticLogoutWorkerApplicant`)"> <q-icon name="logout" class="q-mr-sm" /> Logout</q-btn>
        </div>

        <div class="q-ma-md "  :class="`shadow-3`" style=" border-radius: 4px; ">
          <span class="q-ma-md " style="font-size: 20px; opacity: 0.6;"><b>As School Account</b></span><br>
          <q-btn  class="q-ma-sm" color="green" @click="sendMessage(`LoginAutomaticAsWorker`)"> <q-icon name="login" class="q-mr-sm" /> Login </q-btn>
          <q-btn  class="q-ma-sm" color="primary" @click="sendMessage(`AutomaticLogoutWorkerApplicant`)"> <q-icon name="logout" class="q-mr-sm" /> Logout</q-btn>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
//import { io } from 'socket.io-client';

export default defineComponent({
  name: 'SocketComponent',

  data() {
    return {
      tesst: [],
      socket: null,
    };
  },

  created() {
    const socketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;
    this.socket = io(socketBaseUrl);

    // Listen for incoming messages
    this.socket.on('receiverTriggerness', (action, id) => {
      // console.log(action, id);
      // alert("trigger this action",action)

    });
  },

  methods: {
    sendMessage(actionTriggerness) {
      // Emit the message to the server
 
        const testff = this.socket.emit('senderTriggerness', actionTriggerness, 552);
        if(testff){
          console.log("Trigernes");
        }
        else{
          alert("error");
        }


    },
  },

  unmounted() {
    this.socket.disconnect(); // Clean up the socket connection
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>
