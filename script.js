// Get the button, text, and times elements
const btn = document.getElementById("btn");
const text = document.getElementById("text");
const times = document.getElementById("times");

// Function to calculate the elapsed time between two dates
function calculateElapsedTime(start, end) {
  if (start.getTime() === end.getTime()) {
    return "0 seconds";
  }
  const elapsed = end.getTime() - start.getTime();
  if (elapsed < 1000) {
    return "less than 1 second";
  }
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days} days, ${hours % 24} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
  }
  if (hours > 0) {
    return `${hours} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
  }
  if (minutes > 0) {
    return `${minutes} minutes, ${seconds % 60} seconds`;
  }
  return `${seconds} seconds`;
}

// Load the stored data
const storedData = JSON.parse(localStorage.getItem("timesData")) || [];

// Add the stored data to the table
storedData.forEach((data, index) => {
  const row = document.createElement("tr");
  const dateCell = document.createElement("td");
  dateCell.textContent = data.date;
  row.appendChild(dateCell);
  const timeCell = document.createElement("td");
  timeCell.textContent = data.time;
  row.appendChild(timeCell);
  const textCell = document.createElement("td");
  textCell.textContent = data.text;
  row.appendChild(textCell);
  times.querySelector("tbody").appendChild(row);

  // Calculate the elapsed time between the current and previous items
  if (index > 0) {
    const prevData = storedData[index - 1];
    const prevTime = new Date(prevData.dateTime);
    const currTime = new Date(data.dateTime);
    const elapsed = calculateElapsedTime(prevTime, currTime);
    const elapsedCell = document.createElement("td");
    elapsedCell.textContent = elapsed;
    row.appendChild(elapsedCell);
  }
});

// Add a click event listener to the "Show Current Time" button
btn.addEventListener("click", () => {
  // Get the current time and entered text
  const now = new Date();
  const dateTime = now.toISOString();
  const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
  const date = now.toLocaleDateString('en-US',options);
  const timeString = now.toLocaleTimeString();
  const enteredText = text.value;

  // Create a new row element for the current time and entered text
  const row = document.createElement("tr");
  const dateCell = document.createElement("td");
  dateCell.textContent = date;
  row.appendChild(dateCell);
  const timeCell = document.createElement("td");
  timeCell.textContent = timeString;
  row.appendChild(timeCell);
  const textCell = document.createElement("td");
  textCell.textContent = enteredText;
  row.appendChild(textCell);
  times.querySelector("tbody").appendChild(row);

  // Reset the text box
  text.value = "";

  // Save the data to localStorage
  const data = { date: date, dateTime: dateTime, time: timeString, text: enteredText };
  storedData.push(data);
  localStorage.setItem("timesData", JSON.stringify(storedData));

  // Calculate the elapsed time between the current and previous items
  const index = storedData.length - 1;
  if (index > 0) {
    const prevData = storedData[index - 1];
    const prevTime = new Date(prevData.dateTime);
    const currTime = new Date(data.dateTime);
    const elapsed = calculateElapsedTime(prevTime, currTime);
    const elapsedCell = document.createElement("td");
    elapsedCell.textContent = elapsed;
    row.appendChild(elapsedCell);
  }
});

// Add a click event listener to the "Reset Data" button
const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("timesData");
  times.querySelector("tbody").innerHTML = "";
  storedData.length = 0;
});



// Function to convert table data to CSV string
function convertTableToCSV(table) {
  const rows = table.querySelectorAll("tr");
  const csv = [];
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td, th");
    const row = [];
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j].textContent.trim();
      row.push(`"${cell.replace(/"/g, '""')}"`);
    }
    csv.push(row.join(","));
  }
  return csv.join("\n");
}

// Get the export button and table element
const exportCSVBtn = document.getElementById("exportCSV");

// Add a click event listener to the export button
exportCSVBtn.addEventListener("click", () => {
  // Convert the table data to a CSV string
  const csv = convertTableToCSV(times);

  // Create a Blob object from the CSV string
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Create a download link for the CSV file
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "timers.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});