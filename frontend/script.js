const API_URL = "http://localhost:5000/sensors";

// Fetch All Sensor Data
function fetchData() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      renderTable(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Search Sensor by Device ID
function fetchSensorByDeviceId() {
  const deviceId = document.getElementById("searchDeviceId").value.trim();

  if (!deviceId) {
    alert("Please enter a Device ID.");
    return;
  }

  fetch(`http://localhost:5000/sensors/device/${deviceId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        alert("No sensor data found for this Device ID.");
        return;
      }
      renderTable(data);
    })
    .catch((error) => console.error("Error fetching sensor data:", error));
}

// Add Sensor Data
function addSensorData() {
  const device_id = document.getElementById("device_id").value.trim();
  const temperature = document.getElementById("temperature").value.trim();
  const humidity = document.getElementById("humidity").value.trim();

  if (!device_id || temperature === "" || humidity === "") {
    alert("Please fill in all fields.");
    return;
  }

  fetch("http://localhost:5000/sensors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_id,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      closeCreateModal();
      fetchData();
      document.getElementById("device_id").value = "";
      document.getElementById("temperature").value = "";
      document.getElementById("humidity").value = "";
    })
    .catch((error) => console.error("Error adding data:", error));
}

// Render Sensor Data in Table
function renderTable(data) {
  let table = document.getElementById("sensor-table");
  table.innerHTML = "";
  data.forEach((sensor) => {
    let row = `<tr class="border-b">
            <td class="p-2 border">${sensor.device_id}</td>
            <td class="p-2 border">${sensor.temperature}°C</td>
            <td class="p-2 border">${sensor.humidity}%</td>
            <td class="p-2 border">
                <button onclick="openEditModal('${sensor.device_id}', ${sensor.temperature}, ${sensor.humidity})" 
                    class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-700">Edit</button>
            </td>
        </tr>`;
    table.innerHTML += row;
  });
}

// Open Edit Modal
function openEditModal(device_id, temperature, humidity) {
  document.getElementById("edit_device_id").value = device_id;
  document.getElementById("edit_temperature").value = temperature;
  document.getElementById("edit_humidity").value = humidity;
  document.getElementById("editModal").classList.remove("hidden");
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

// Update Sensor Data
function updateSensorData() {
  const device_id = document.getElementById("edit_device_id").value;
  const temperature = document.getElementById("edit_temperature").value;
  const humidity = document.getElementById("edit_humidity").value;

  fetch(`${API_URL}/${device_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temperature, humidity }),
  })
    .then((response) => response.json())
    .then((data) => {
      closeEditModal();
      fetchData();
    })
    .catch((error) => console.error("Error updating data:", error));
}
function openCreateModal() {
  document.getElementById("createModal").classList.remove("hidden");
}

function closeCreateModal() {
  document.getElementById("createModal").classList.add("hidden");
}

// Load data when the page opens
fetchData();
