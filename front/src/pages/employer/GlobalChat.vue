<template>
  <q-layout  view="hHh Lpr fFf" class="bg-grey-2">
    <!-- <q-header elevated class="bg-blue-800 text-white">
      <q-toolbar>
        <q-toolbar-title style="font-size: 30px; font-weight: 600;" class="q-pa-lg">JEJEMONS!</q-toolbar-title>
        <q-btn flat icon="nights_stay" @click="toggleNightVision" class="q-ml-md" />
      </q-toolbar>
    </q-header> -->

    <q-page-container  :class="{ 'night-version2': nightVision }">
      <q-page padding class="chat-container" :class="{ 'night-vision': nightVision }">
        <!-- <q-dialog v-model="dialog" persistent>
          <q-card>
            <q-card-section>
              <q-input
                v-model="username"
                label="Enter your name"
                autofocus
                filled
                @keyup.enter="joinChat"
              />
            </q-card-section>
            <q-card-actions>
              <q-btn label="Join" color="primary" @click="joinChat" />
            </q-card-actions>
          </q-card>
        </q-dialog> -->

        <div class="messages-container"
        :class="      {'messages-container-night': nightVision} "
        ref="messageContainer"
        >
          <div bordered class="message-list" style="display: flex; flex-direction: column; ">
            <div style="width: 100%; display: flex; position: relative;"
              v-for="(message, index) in messages"
              :key="index"
              :class="{
                    sent2: message.username === username,
                    received2: message.username !== username,
                }"
            >
            <div v-if="message.username !== username" class="triangle-up-receiver" :class="{ 'night-vision22': nightVision }"></div>
            <div v-else class="triangle-up-sender" :class="{ 'night-vision23': nightVision }"></div>

              <div style="width: max-content; "               :class="{
                sent: message.username === username,
                received: message.username !== username,
                'received-night': nightVision
              }">
              
                <div style="max-width: 80vw;">
                  <strong v-if="message.username == `System`" style="color: darkgrey;">{{ message.username }}</strong>
                  <strong v-else >{{ message.username }}</strong>
                  <br />
                  {{ message.text }} 
                  <span v-if="message.file" style="color: gray; font-size: 15px; font-weight: 600;"><br><br>view</span><br> 
                  <a v-if="message.file" :href="this.socketrls +`/`+ message.file" target="_blank" download>
                    
                    <q-btn  color="primary" @click="sendMessage" :label="message.file" />
                  </a><br v-if="message.file">
                  <a v-if="message.file" :href="this.socketrls +`/`+ message.file" target="_blank" download>
                  <img
                  target="_blank"
                    v-if="isImage(message.file)"
                    :src="this.socketrls +`/`+ message.file"
                    alt="Uploaded image"
                    style="max-width: 100%;  margin-top: 5px; height: 300px;"
                    :href="this.socketrls +`/`+ message.file"
                  />
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form @submit.prevent="handleUpload" style="display: none;">
    <input  type="file" ref="fileInput" @change="onFileChange" />
    <button type="submit" :disabled="uploading" class="btn btn-primary">
      {{ uploading ? 'Uploading...' : 'Upload File' }}
    </button>
  </form>

  <!-- Progress indicator -->
  <div v-if="uploadProgress > 0" class="progress-indicator">
    <div class="progress">
      <div class="progress-bar" role="progressbar" :style="{ width: `${uploadProgress}%` }" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        {{ uploadProgress }}%
      </div>
    </div>
  </div>

        <!-- Fixed input area -->
        <!-- <q-file color="teal" filled  label="Label">
        <template v-slot:prepend>
          <q-icon @change="onFileChange"  name="cloud_upload"></q-icon>
        </template>
      </q-file> -->
<!-- 
      <input type="file" @change="onFileChange" /> -->
 
      <div class="file-input-wrapper">
  <input type="file" id="fileInput" @change="onFileChange" />

</div>
      <div class="input-area" :class="{ 'bg3-night': nightVision }">
          <!-- <input type="file" @change="onFileChange" /> -->
     
          <q-input
            v-model="messageInput"
            label="Type your message..."
            filled
            @keyup.enter="sendMessage"
            @keyup="notifyTyping"
            class="message-input"
            style="width: 70%; background-color: #e2e2e2; border-radius: 5px;"
            required
          />
          <!-- <q-btn style="width: 20%;" icon="attachment" color="primary" @click="sendMessage" class=" q-pa-md q-ml-sm" /> -->
          <label class="label2" for="fileInput" :class="{ 'bg4-night-btn': nightVision }">
          <q-icon for="fileInput" v-if="this.selectedFile" name="check" size="30px"></q-icon> 
          <q-icon  for="fileInput" v-else name="attachment" flat size="30px"></q-icon> 
          </label>
          <q-btn 
            flat 
            icon="nights_stay" 
            @click="toggleNightVision" 
            class="q-ml-md" 
            :color="nightVision ? 'white' : 'primary'"
          />
          <q-btn style="width: 20%;" icon="send" color="primary" @click="sendMessage" class=" q-pa-md q-ml-sm" />
        </div>
      </q-page>
      <div ref="container33"></div>
    </q-page-container>
  </q-layout>
</template>


<script>
import { defineComponent } from 'vue';
//import { io } from 'socket.io-client';
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const SocketBaseUrl = import.meta.env.VITE_SOCKET_BASE_URL;

export default defineComponent({
  name: 'DefaultPage',
  data() {
    return {
      socket: null,
      messages: [],
      messageInput: '',
      username: '',
      dialog: true,
      room: 'group_chat',
      nightVision: false,
      selectedFile: null,
      uploading: false,
      uploadProgress: 0,
      socketurls:null,
    };
  },
  created() {
    this.initializeSocket();

  },
  mounted() {

    this.getimageslink();
    this.fetchUserData();
  },
  methods: {
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
          this.last_name = this.user.last_name;
          this.username =  `${this.first_name} ${this.user.last_name}`;
          this.joinChat();
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        this.isLoading = false; // Set loading to false after data is fetched
// Correctly parse the night vision state as boolean
    const storedNightVision = localStorage.getItem('nightvisionTem');
    this.nightVision = storedNightVision === 'true'; // Convert to boolean
      }
    },
    getimageslink(){
      this.socketrls = SocketBaseUrl;
    },

    initializeSocket() {
    this.socket = io(SocketBaseUrl);
          // When receiving a new message
      this.socket.on('recieverkoto', (message) => {
        this.messages.push(message);

          if(this.username != message.username){
            this.playNotificationSound(); 
          }
       
        // Play sound on new message
      });

      // When someone is typing
      this.socket.on('typing', () => { });
        // Handle typing notification

    // Retrieve the user object from localStorage and parse it
    const user = JSON.parse(localStorage.getItem('user'));

    // Retrieve the user ID from the parsed user object
    const userid = user ? user.id : null;

    // Retrieve the token based on the user's account type
    const token = user && user.account_type === 5 
      ? localStorage.getItem('access_token_employer') 
      : localStorage.getItem('access_token_applicant');

    this.socket.on('connect', () => {
        if (token && userid) {
            // Emit the user ID and token to the server
            this.socket.emit('sendToken', userid, token);
            console.log('Token sent:', token);
        }
    });



    // Listen for token validation response
    this.socket.on('tokenValidated', (isValid) => {
        if (isValid) {
            console.log('Token is valid. Proceeding...');
            // Proceed with further actions
        } else {
            console.error('Invalid token. Cannot proceed.');
            // Handle invalid token (e.g., show error message or redirect)
        }
    });
},

    joinChat() {
      if (this.username.trim()) {
        this.socket.emit('joinRoom', this.room, this.username);
        this.messages.push({ username: 'System', text: `${this.username} has joined the chat conversation.` });
        this.dialog = false;
      }
    },
    async sendMessage() {
      this.handleUpload();
      if (this.socket && this.messageInput.trim()) {
        const msgObj = { username: this.username, text: this.messageInput.trim() };

        // Send file if exists
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          
          try {
            const response = await axios.post(`${SocketBaseUrl}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            msgObj.file = response.data.file; // Get the file URL from the response
            this.selectedFile = null; // Reset the selected file
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }

        this.socket.emit('message', { room: this.room, msg: msgObj });
        this.messageInput = '';
      }
    },
    async handleUpload() {
      if (this.selectedFile) {
        this.uploading = true;
        this.uploadProgress = 0;

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'json',
            onUploadProgress: progressEvent => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              this.uploadProgress = percentCompleted;
            }
          };
          
          const response = await axios.post(`${SocketBaseUrl}/upload`, formData, config);

          console.log('File uploaded successfully:', response.data);
          console.log(this.uploadProgress);
          // Handle successful upload (e.g., reset form, show success message)
          this.uploading = false;
          this.selectedFile = null;
          this.uploadProgress = 0;

        } catch (error) {
          console.error('Error uploading file:', error);
          // Handle error (e.g., show error message)
          this.uploading = false;
          this.selectedFile = null;
          this.uploadProgress = 0;
        }
      }
    },
    notifyTyping() {
      if (this.socket && this.messageInput) {
        this.socket.emit('typing', { room: this.room });
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0]; // Get the selected file
    },
    isImage(file) {
      return file && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif'));
    },
    playNotificationSound() {
       const audio = new Audio('/src/assets/ringtone.mp3'); // Replace with your sound file path
      audio.play().catch((error) => console.error('Error playing sound:', error));
    },
    toggleNightVision() {
      this.nightVision = !this.nightVision;
      localStorage.setItem('nightvisionTem', this.nightVision.toString()); // Store as string
    }
  },
});
</script>



<style scoped>.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 5px; /* To ensure messages don't get covered by input */
}

.messages-container-night {
  background-color: #161616;
  border-radius: 20px;
  border: 1px solid #161616 !important;
}

.night-vision .messages-container {
  background-color: #161616;
  color: #fff;
}

.message-list {
  margin: 0;
}

.sent,
.received,
.received-night {
  word-wrap: break-word;
  padding: 1rem;
  border-radius: 20px;
  margin-top: 10px;
  margin: 10px;
}

.sent2 {
  justify-content: flex-end;
}

.received2 {
  justify-content: flex-start;

}

.sent {
  background-color: #eff0f0;
  animation: scale-in 0.5s ease-out;
}

.received {
  background-color: #eff0f0;
  animation: scale-in 0.5s ease-out;
}

.received-night {
  background-color: #3a3a3a !important;
}


/* Fixed input at the bottom */
.input-area {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.file-input-wrapper {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
.progress-indicator {
  margin-top: 20px;
  text-align: center;
}

.progress {
  display: inline-block;
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  background-color: #007bff;
  width: 0%;
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}
.night-version2{
  background-color: #3a3a3a !important;
}
.bg3-night {
  background-color: #3a3a3a !important;
}
.bg4-night-btn {
  background-color: #3a3a3a !important;
  color: #fff;
}
.bg4-night-btn:hover {
  background-color: #636363 !important;
}

.label2 {
  display: inline-block;
  padding: 14px 10px;
  background-color: #fff;
  color: primary;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 7px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
}

.label2:hover {
  background-color: #e0e0e0;
}
.triangle-up-receiver {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 20px solid #eff0f0;
  position: absolute;
  margin-bottom: 20px;
  bottom: 0;
  animation: scale-in 2s ease-out;
 /* Positions it at the bottom of the parent div */
}
.night-vision22{
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 20px solid #3a3a3a;
  position: absolute;
  margin-bottom: 20px;
  bottom: 0;
  animation: scale-in 2s ease-out;
}
.night-vision23{
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 20px solid #3a3a3a !important;
  position: absolute;
  margin-bottom: 20px;
  bottom: 0;
  animation: scale-in 2s ease-out;
}
.triangle-up-sender {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 20px solid #eff0f0;
  position: absolute;
  margin-bottom: 20px;
  bottom: 0;
  animation: scale-in 2s ease-out;
 /* Positions it at the bottom of the parent div #eff0f0 */
}

@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

</style>
