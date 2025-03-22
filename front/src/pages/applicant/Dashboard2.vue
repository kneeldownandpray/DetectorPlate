<template>
  <q-page class="q-pa-md">
    <q-btn label="View Records" @click="openControllerDataDialog" />
    <div class="" style="justify-content: space-between; display: flex;">
      <!-- Camera Linker Section -->
      <div class="col-8 flex">
        <q-card-section>
          <CameraLinker
            @new-detection="handleNewDetection"
            style="width: 70%;"
            class="q-mt-sm"
          />
        </q-card-section>
      </div>

      <!-- Decision Maker and Plates Section -->
      <q-card class="col-4 flex">
        <q-card-section>
          <DecisioMaker
            :plates="detectedPlates"
            :send-for-analysis="sendForAnalysis"
            @analyze-completed="handleAnalyzeCompleted"
            @clear-plates="resetData"
          />
        </q-card-section>
        <q-card-section v-if="detectedPlates.length">
          <h2>Reading</h2>
            <span v-for="(plate, index) in detectedPlates" :key="index">
             .
            </span>
      
        </q-card-section>
      </q-card>
    </div>

    <!-- Button to Open ControllerData Dialog -->
   

    <!-- ControllerData Dialog -->
    <q-dialog v-model="showControllerDataDialog" :persistent="true" :maximized="true" :style="{ zIndex: '11111' }">
      <q-card>
        
        <q-card-section>
          <q-btn color="red"  label="Close" @click="closeControllerDataDialog" />
          <ControllerData />
        </q-card-section>
        <q-card-actions>
       
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import CameraLinker from "../../components/CameraLinker.vue";
import DecisioMaker from "../../components/TextExtractor.vue";
import ControllerData from "../../components/ControllerData.vue";

export default {
  components: {
    CameraLinker,
    DecisioMaker,
    ControllerData,
  },
  data() {
    return {
      detectedPlates: [], // Collected data
      sendForAnalysis: false, // Trigger analysis
      permanentRecords: [], // Store successful plates
      detectionTimer: null, // Timer for detection tracking
      showControllerDataDialog: false, // Controls dialog visibility
    };
  },
  mounted() {
    // Load permanent records from local storage on mount
    this.jorellestorage();
    
  },
  methods: {
    jorellestorage() {
      const storedRecords = localStorage.getItem("permanentPlates");
      if (storedRecords) {
        console.log(storedRecords);
        this.permanentRecords = JSON.parse(storedRecords);
      }
    },
    handleNewDetection(plates) {
      this.detectedPlates = plates;

      // Clear previous timer if it exists
      if (this.detectionTimer) {
        clearTimeout(this.detectionTimer);
      }

      // Start a new timer
      this.detectionTimer = setTimeout(() => {
        if (this.detectedPlates.length) {
          console.log("No new detection for 5 seconds, sending for analysis...");
          this.sendToDecisionMaker();
        }
      }, 2500); // 5 seconds
    },
    sendToDecisionMaker() {
      this.sendForAnalysis = true; // Trigger analysis in DecisionMaker
      console.log("Sending plates for analysis:", this.detectedPlates);
    },
    handleAnalyzeCompleted(result) {
      console.log("Analysis completed:", result);
      // Save successful plates to permanent records
      this.permanentRecords.push(...result); // Add analyzed plates to the record
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      // Save permanent records to local storage
      localStorage.setItem("permanentPlates", JSON.stringify(this.permanentRecords));
    },
    resetData() {
      // Reset detected plates and analysis state
      this.detectedPlates = [];
      this.sendForAnalysis = false;
      console.log("Data reset successfully.");
      this.jorellestorage();
      localStorage.setItem("resetTriggernessCameraArray", JSON.stringify(true));
      console.log(this.detectedPlates);
    },
    // Open the ControllerData dialog
    openControllerDataDialog() {
      this.showControllerDataDialog = true;
    },
    // Close the ControllerData dialog
    closeControllerDataDialog() {
      this.showControllerDataDialog = false;
    },
  },
};
</script>
