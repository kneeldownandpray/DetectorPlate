<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Daily Vehicle Report</div>
      </q-card-section>

      <!-- Dropdown for Selecting Days -->
      <q-card-section class="q-gutter-md">
        <q-select
          v-model="selectedDays"
          :options="dayOptions"
          label="Select Days"
          outlined
          dense
          @update:model-value="fetchDailyReport"
        />
        <q-btn @click="exportToWord()" label="Export to word" class="q-mr-md" color="primary" />
      </q-card-section>

      <!-- Table Displaying Report -->
      <q-card-section>
        <q-table
          flat bordered
          :rows="reversedReportData"
          :columns="columns"
          row-key="date"
          :loading="loading"
        >
          <!-- Custom Row Styling -->
          <template v-slot:body="props">
            <q-tr :props="props" :style="props.rowIndex === 0 ? 'background-color: lightblue;' : ''">
              <q-td v-for="col in columns" :key="col.name" >
                {{ props.row[col.field] }}
              </q-td>
              <q-td>
                <q-btn
                  label="View"
                  color="primary"
                  dense
                  @click="openControllerData(props.row.date)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Maximized ControllerData Dialog -->
    <q-dialog v-model="showControllerDataDialog" :persistent="true" :maximized="true" :style="{ zIndex: '11111' }">
      <q-card>
        <q-card-section>
          <q-btn color="red" label="Close" @click="closeControllerDataDialog" />
        </q-card-section>
        <q-card-section>
          <ControllerData :date2="this.selectedDate" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import ControllerData from "../../components/ControllerData.vue";
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater  from 'docxtemplater';

export default {
  components: { ControllerData },
  data() {
    return {
      selectedDays: 100, // Default to 100 days
      dayOptions: [7, 14, 30, 60, 100, 500, 700, 1000], // Dropdown options
      reportData: [],
      loading: false,
      showControllerDataDialog: false, // Control dialog visibility
      selectedDate: null, // Store selected date
    };
  },
  mounted() {
    this.fetchDailyReport(); // Fetch default 100-day report on load
  },
  computed: {
    reversedReportData() {
      return [...this.reportData].reverse(); // Baliktarin ang array
    },
    columns() {
      return [
        { name: "date", label: "Date", align: "left", field: "date" },
        { name: "inCount", label: "IN", align: "left", field: "inCount" },
        { name: "outCount", label: "OUT", align: "left", field: "outCount" },
        { name: "visitor", label: "Visitor", align: "left", field: "visitor" },
        { name: "park", label: "Park", align: "left", field: "park" },
        { name: "unknown", label: "Unknown", align: "left", field: "unknown" },
       
      ];
    },
  },
  methods: {
    async exportToWord() {
  try {
    const response = await fetch('/template3.docx'); // dapat nasa /public
    const content = await response.arrayBuffer();

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    const rows = this.reportData.map(item => ({
      date: item.date,
      inCount: item.inCount,
      outCount: item.outCount,
      visitor: item.visitor,
      park: item.park,
      unknown: item.unknown,
    }));

    doc.setData({ rows });

    doc.render(); // Apply data to the template

    const blob = doc.getZip().generate({ type: 'blob' });
    saveAs(blob, `daily-vehicle-report-${this.selectedDays}-days.docx`);
  } catch (error) {
    console.error("Error exporting to Word:", error);
  }
},

    async fetchDailyReport() {
  this.loading = true;
  try {
    const token = localStorage.getItem("access_token_employer");
    const userData = localStorage.getItem("user");

    if (!userData) {
      console.error("User data is missing from localStorage.");
      return;
    }

    const user = JSON.parse(userData);
    const userId = user.id;

    // ✅ TAMA: Route parameter ang ginagamit
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/vehicle-records/report/daily/${userId}?days=${this.selectedDays}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    this.reportData = response.data.report;
  } catch (error) {
    console.error("Error fetching report:", error);
  } finally {
    this.loading = false;
  }
},

    openControllerData(date) {
      this.selectedDate = date; // Set selected date
      this.showControllerDataDialog = true; // Open dialog
    },
    closeControllerDataDialog() {
      this.showControllerDataDialog = false; // Close dialog
    },
  },
};
</script>
