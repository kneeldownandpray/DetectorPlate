<template>
  <q-page class="q-pa-md">
    <div class="q-pa-md flex flex-center column">
    <h2 class="q-mb-md text-center">Recorded Data</h2>

    <div class="counter-container">
      <div class="counter in-counter ">In: {{ this.inCounter }}</div>
      <div class="counter out-counter">Out: {{ this.outCounter }}</div>
    </div>

    <!-- Filter Buttons -->
    <div class="q-mb-md q-mt-md">
      <q-btn @click="exportToWord()" label="Export to word" class="q-mr-md" color="primary" />
      <q-btn @click="filterByYesterday" label="Yesterday" icon="date_range" color="primary" class="q-mr-md" />
      <q-btn @click="filterByToday" label="Today" icon="today" class="q-mr-md" color="secondary" />
      <q-btn @click="isfillteredbycalendar = !isfillteredbycalendar" label="Filter by Calendar" icon="event" color="red" />
    </div>

    <!-- Calendar Filters -->
    <div class="q-mb-md" v-if="isfillteredbycalendar">
      <q-date v-model="startDate" mask="YYYY-MM-DD" label="Start Date" :min="minDate" :max="endDate" class="q-mr-md" />
      <q-date v-model="endDate" mask="YYYY-MM-DD" label="End Date" :min="startDate" class="q-mr-md" />
      <q-btn @click="filterByDateRange" label="Filter by Date Range" color="primary" icon="filter_list" />
    </div>
  </div>
    <!-- Vehicle Records Table -->
    
    <!-- props.row.vehicle_status gusto ko kapag 1 yan yon ay color light greed. pag zero light red -->

    <q-card v-if="savedData.length" class="q-mb-md">
      <q-card-section>
        <q-table
          :rows="filteredData"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          flat
        >
          <template v-slot:body="props">
            <q-tr :props="props"
             :style="{ backgroundColor: props.row.vehicle_status === 1 ? '#d4edda'  : '#f8d7da' }"
            >
              <q-td :props="props" key="pattern">
                <q-input
                  v-model="props.row.pattern"
                  label="Plate Pattern"
                  @blur="updateData(props.row)"
                  dense
                  filled
                  class="q-mb-none"
                />
              </q-td>
              <q-td :props="props" key="color">
                <div class="q-mb-xs">
                  <span :style="{ color: props.row.color }">{{ props.row.color }}
                   

                  </span>
                </div>
                <div :style="{ backgroundColor: props.row.color }" style="height: 20px; width: 20px; border-radius: 50%;"></div>
              </q-td>

              <q-td :props="props" key="vehicleType">
                {{ props.row.vehicle_type }}
              </q-td>
              <q-td :props="props" key="camera_detail">
                {{ props.row.camera_detail }}
              </q-td>
              <q-td :props="props" key="timestamp">
                {{ formatDate(props.row.created_at) }}
              </q-td>
              <q-td :props="props" key="image">
                <q-img
                  :src="props.row.image"
        
                  width="50px"
                  @click="showImage(props.row.image)"
                  class="thumbnail-image"
                />
              </q-td>
              <q-td :props="props" key="actions">
                <!-- <q-btn @click="alertMaintenance()" icon="person" color="black" flat size="sm" /> -->
                <q-btn @click="editData(props.row)" icon="edit" color="primary" flat size="sm" />
                <q-btn @click="deleteData(props.row)" icon="delete" color="negative" flat size="sm" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-card v-else>
      <q-card-section>No data saved yet.</q-card-section>
    </q-card>

    <!-- Image Viewer Modal -->
    <q-dialog v-model="imageDialogVisible" style="z-index: 1111111;">
      <q-card style="min-width: 70%;">
        <q-card-section>
          <q-img :src="selectedImage" alt="Full-size Plate Image" />
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Close" color="primary" @click="imageDialogVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { date } from 'quasar';
import axios from 'axios';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export default {
  data() {
    return {
      isfillteredbycalendar:false,
      savedData: [],
      filteredData: [], // Store filtered data
      pagination: {
        rowsPerPage: 5, // Limit rows per page
      },
      columns: [
        { name: 'pattern', label: 'Plate Pattern', align: 'left', field: 'pattern' },
        { name: 'color', label: 'Color', align: 'left', field: 'color' },
        { name: 'vehicleType', label: 'Vehicle Type', align: 'left', field: 'vehicle_type' },
        { name: 'camera_detail', label: 'Detail', align: 'left', field: 'vehicle_type' },
        { name: 'timestamp', label: 'Timestamp', align: 'left', field: 'created_at' },
        { name: 'image', label: 'Image', align: 'left', field: 'image' },
        { name: 'actions', label: 'Actions', align: 'center', field: 'actions' },
      ],
      inCounter:null,
      outCounter:null,
      imageDialogVisible: false, // To control the image modal visibility
      selectedImage: '', // To store the selected image URL
      userId: '', // User ID from localStorage
      startDate: '', // Start date for range filter
      endDate: '', // End date for range filter
    };
  },
  props: {
    date2: String, // Receive selected date from DailyReport.vue
  },
  mounted() {
    this.filterByToday();
    if (this.date2) {
    // Kung may laman ang date2, gamitin ito bilang startDate
    this.startDate = this.date2;
    
    // Compute endDate (next day)
    const startDateObj = new Date(this.date2);
    startDateObj.setDate(startDateObj.getDate() + 1);
    this.endDate = startDateObj.toISOString().split("T")[0];

    this.loadData(); // Tawagin ang loadData para mag-fetch gamit ang bagong dates
  } else {
    this.filterByToday(); // Default behavior kung walang date2
  }
  },
  methods: {
    async exportToWord() {
  const response = await fetch('/template2.docx'); // Ensure this is inside `public/`
  const content = await response.arrayBuffer();

  const zip = new PizZip(content);
  const doc = new Docxtemplater().loadZip(zip);

  // Extract and format your data for the template

  
  const rows = this.savedData.map(vehicle => ({
    plate: vehicle.pattern,
    color: vehicle.color,
    vehicle_type: vehicle.vehicle_type,
    camera_detail: vehicle.camera_detail,
    created_at: (() => {
  const date = new Date(vehicle.created_at);

  const datePart = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart} – ${timePart}`;
})(),
    status: vehicle.vehicle_status === 1 ? 'IN' : 'OUT', // Add status if needed
  }));

  doc.setData({ rows }); // Match this with {#rows} ... {/rows} in template

  try {
    doc.render();
    const blob = doc.getZip().generate({ type: 'blob' });
    saveAs(blob, 'exported-vehicles.docx');
  } catch (error) {
    console.error('Error rendering document:', error);
  }
},
    alertMaintenance() {
      alert("This function is under maintenance (purpose of this is to show profile of registered user)");
    },

    // Fetch data from the API
    async loadData() {
  this.userId = JSON.parse(localStorage.getItem('user')).id;

  if (this.userId) {
    try {
      const params = {
        start_date: this.startDate || null,
        end_date: this.endDate || null,
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/vehicle-records/${this.userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token_employer')}`,
            'Content-Type': 'application/json',
          },
          params: params,
        }
      );

      this.savedData = response.data.vehicleRecords.data;
      this.inCounter = response.data.dateCounts.inCount;
      this.outCounter = response.data.dateCounts.outCount;
      this.filteredData = this.savedData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    console.log("User ID not found in localStorage");
  }
},

// Function to format timestamp into readable format
formatDate(timestamp) {
  return date.formatDate(timestamp, 'MMMM D, YYYY (h:mm A)');
},

// 📅 Pag-filter ng "Today" (Hal. March 7 - March 8)
filterByToday() {
  const start = new Date();
  start.setDate(start.getDate()); // Ngayon

  const end = new Date();
  end.setDate(end.getDate() + 1); // Bukas

  this.startDate = start.toISOString().split("T")[0]; // YYYY-MM-DD
  this.endDate = end.toISOString().split("T")[0]; // YYYY-MM-DD

  this.loadData();
},

// 📅 Pag-filter ng "Yesterday" (Hal. March 6 - March 7)
filterByYesterday() {
  const start = new Date();
  start.setDate(start.getDate() - 1); // Kahapon

  const end = new Date();
  end.setDate(end.getDate()); // Ngayon

  this.startDate = start.toISOString().split("T")[0]; // YYYY-MM-DD
  this.endDate = end.toISOString().split("T")[0]; // YYYY-MM-DD

  this.loadData();
},

// 📅 Pag-filter ng Custom Date Range
filterByDateRange() {
  if (this.startDate && this.endDate) {
    this.loadData();
  }
},

    // Edit functionality
    editData(row) {
      console.log("Edit item:", row);
    },

    // Delete functionality
    deleteData(row) {
      if (confirm("Are you sure you want to delete this item?")) {
        axios.delete(`${import.meta.env.VITE_API_BASE_URL}/vehicle-records/${row.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token_employer')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          this.savedData = this.savedData.filter(item => item.id !== row.id);
          this.filteredData = this.filteredData.filter(item => item.id !== row.id);
        })
        .catch(error => {
          console.error("Error deleting record:", error);
        });
      }
    },

    // Function to show the larger image in a modal
    showImage(imageSrc) {
      this.selectedImage = imageSrc;
      this.imageDialogVisible = true;
    },
  },
};
</script>

<style scoped>
.thumbnail-image {
  cursor: pointer;
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-top: 5px;
  border-radius: 4px;
}
.counter-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.counter {
  padding: 15px 25px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  min-width: 120px;
  text-align: center;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.in-counter {
  background: #4caf50;
  color: white;
}

.out-counter {
  background: #f44336;
  color: white;
}

.counter:hover {
  transform: scale(1.1);
}
</style>