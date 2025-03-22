<template>
  <div padding>
    <div v-if="error" class="text-negative">{{ error }}</div>
    
    <q-btn v-if="!cameras.length" @click="detectCameras" color="primary" label="Detect Cameras" />
    
    <div v-if="cameras.length">
      <q-btn 
        @click="startCameras" 
        v-if="!startCamera3" 
        :disable="streams.length > 0" 
        color="primary" 
        label="Start Cameras" 
      />
      
      <!-- Cameras side by side -->
      <q-gutter-sm class="q-mt-md">
        <div style="position:fixed !important; display: flex; width:70%; " >
          <q-col v-for="(camera, index) in cameras" style="" :key="index" cols="6">
            <q-card >
              <q-card-section>
                <p style="font-size:30px;">Camera {{ index + 1 }}</p>
                <video
                  :ref="setVideoRef(index)"
                  autoplay
                  playsinline
                  muted
                  class="fit"
                  style="border: 1px solid #ddd; width: 100%; max-width: 640px; opacity: 0; height: 1px !important; width: 1px !important;"
                ></video>
                <canvas :ref="setCanvasRef(index)" style="border: 1px solid #ddd; width: 100%;"></canvas>
                <q-btn
                  @click="setButtonState(index)"
                  :color="buttonStates[index] ? 'red' : 'green'"
                  :icon="buttonStates[index] ? 'stop' : 'check_circle_outline'"
                  :label="buttonStates[index] ? 'Out' : 'In'"
                  style="padding: 8px; min-width: 80px;"
                />
              </q-card-section>
            </q-card>
          </q-col>
        
        </div>
      </q-gutter-sm>
    </div>

    <!-- Detected Results -->
    <div v-if="detections.length" style="display: none;" class="q-mt-lg">
      <h2>Detected Plates</h2>
      <q-list >
        <q-item v-for="(detection, index) in detections" :key="index" clickable @click="showImage(detection.image)">
          <q-item-section avatar>
            <q-img :src="detection.image" style="max-width: 50px; border: 1px solid #ddd;" />
          </q-item-section>
          <q-item-section>
            <div>
              <strong>Plate {{ index + 1 }}:</strong> {{ detection.text }}
            </div>
            <div><strong>Color:</strong> {{ detection.color }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Full-Size Image Modal -->
    <q-dialog v-model="imageDialog">
      <q-card>
        <q-card-section>
          <q-img :src="selectedImage" style="max-width: 100%;" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="imageDialog = false" />
        </q-card-actions>
        <q-btn v-if="selectedImage" @click="convertImageToText" color="secondary" label="Image to Text" />
        <div v-if="extractedText">
          <h4>Extracted Text:</h4>
          <p>{{ extractedText }}</p>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { ref, onMounted, watch } from "vue";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import Tesseract from "tesseract.js";

export default {
  setup(props, { emit }) {
    const cameras = ref([]); // List of cameras
    const streams = ref([]); // Camera streams
    const videoRefs = ref([]); // Video elements
    const canvasRefs = ref([]); // Canvas elements for processing
    const error = ref(""); // Error messages
    const detections = ref([]); // Detected plates
    const buttontoggle33 = ref(false); // Image modal visibility
    const imageDialog = ref(false); // Image modal visibility
    const selectedImage = ref(""); // Currently selected full-size image
    const extractedText = ref(""); // Extracted text from image
    let detectionModel = null; // TensorFlow detection model
    const startCamera3 = false; // Extracted text from image
    const setVideoRef = (index) => (el) => (videoRefs.value[index] = el);
    const setCanvasRef = (index) => (el) => (canvasRefs.value[index] = el);


    const buttonStates = ref(new Array(cameras.length).fill(false)); // Initialize with all false

const toggleCameraState = (index) => {
  buttonStates.value[index] = !buttonStates.value[index];
  console.log(`Camera ${index} state changed to: ${buttonStates.value[index]}`);

  console.log(buttonStates.value);
};

const setButtonState = (index) => {
  toggleCameraState(index);
};

    const setCanvasRef2 = (index) => (el) => {
      console.log("helloworld");
      buttonStates.value[index] = !buttonStates.value[index];
      setButtonState(index, buttonStates.value[index]);
    };
    const detectCameras = async () => {
      cameras.value = [];
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        error.value = "Your browser does not support camera detection.";
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        cameras.value = devices.filter((device) => device.kind === "videoinput");
      } catch (err) {
        error.value = "Error detecting cameras.";
      }
    };

    const startCameras = async () => {
      try {

        detectionModel = await cocoSsd.load();
        for (const [index, camera] of cameras.value.entries()) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: camera.deviceId } },
          });
          
          streams.value.push(stream);

          const video = videoRefs.value[index];
          if (video) {
            video.srcObject = stream;
            video.onloadedmetadata = () => processStream(index);
          }
        }
      } catch (err) {
        error.value = "Error accessing cameras or loading detection model.";
      }
    };

    const processStream = async (index) => {
  const video = videoRefs.value[index];
  const canvas = canvasRefs.value[index];
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const detectFrame = async () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const predictions = await detectionModel.detect(video);

    // Clear previous detections
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    for (const prediction of predictions) {
      if (["car", "truck", "motor", "motorcycle"].includes(prediction.class)) {
        const [x, y, width, height] = prediction.bbox;

        // Draw bounding box
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Add label
        ctx.fillStyle = "red";
        ctx.font = "16px Arial";
        ctx.fillText(prediction.class, x, y > 10 ? y - 5 : y + 15);

        // Extract plate region
        const croppedPlate = ctx.getImageData(x, y, width, height);

        // Convert extracted plate region to Base64
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.putImageData(croppedPlate, 0, 0);
        const plateImageBase64 = tempCanvas.toDataURL("image/png");
        const color = getColor(ctx, x, y, width, height);
        const plateText = await recognizePlate(croppedPlate);

        const resetTriggernessCameraArray = JSON.parse(
          localStorage.getItem("resetTriggernessCameraArray")
        );
        console.log(resetTriggernessCameraArray);

        if (plateText) {
          if (resetTriggernessCameraArray === false || resetTriggernessCameraArray === null) {
            detections.value.push({
              cameraType: buttonStates.value[index] !== undefined ? buttonStates.value[index] : false,
              text: plateText,
              color: color,
              image: plateImageBase64, // Include the Base64 image
              vehicleType: prediction.class, // Include the vehicle type
              
            });
          } else if (resetTriggernessCameraArray === true) {
            detections.value = [];
            localStorage.setItem(
              "resetTriggernessCameraArray",
              JSON.stringify(false)
            );
            console.log(
              "Resetting detections due to resetTriggernessCameraArray being true."
            );
          }

          // Emit the new plate detection to the parent component
          emit("new-detection", detections.value);
          console.log(detections.value);
        }
      }
    }
    requestAnimationFrame(detectFrame);
  };
  detectFrame();
};


const getColor = (ctx, x, y, width, height) => {
  const imageData = ctx.getImageData(x, y, width, height);
  const pixels = imageData.data;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let pixelCount = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Ignore red bounding box color (rgb(250, 0, 0))
    if (r === 250 && g === 0 && b === 0) {
      continue;
    }

    rSum += r;
    gSum += g;
    bSum += b;
    pixelCount++;
  }

  // If no valid pixels were found, return a default color (e.g., black)
  if (pixelCount === 0) return "rgb(0, 0, 0)";

  // Calculate the average color of the non-ignored pixels
  const avgR = Math.floor(rSum / pixelCount);
  const avgG = Math.floor(gSum / pixelCount);
  const avgB = Math.floor(bSum / pixelCount);

  return `rgb(${avgR}, ${avgG}, ${avgB})`;
};

    const recognizePlate = async (imageData) => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = imageData.width;
      tempCanvas.height = imageData.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.putImageData(imageData, 0, 0);

      const { data } = await Tesseract.recognize(tempCanvas.toDataURL(), "eng");
      return data.text.trim();
    };

    const showImage = (image) => {
      selectedImage.value = image;
      imageDialog.value = true;
    };

    const convertImageToText = async () => {
      if (!selectedImage.value) return;

      const { data } = await Tesseract.recognize(selectedImage.value, "eng");
      extractedText.value = data.text.trim();
    };

    onMounted(detectCameras);

    return {
      cameras,
      streams,
      videoRefs,
      canvasRefs,
      error,
      detections,
      imageDialog,
      selectedImage,
      extractedText,
      buttonStates, // Add this to the returned object
      detectCameras,
      startCameras,
      setVideoRef,
      setCanvasRef,
      showImage,
      convertImageToText,
      setButtonState,
      };
    },
  };
  </script>
