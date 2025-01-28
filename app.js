// Importing Firebase SDK modules
import { initializeApp } from "firebase/app";
import {
  doc,
  getDocs,
  addDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore";

// Firebase configuration (replace these with your actual Firebase project credentials)
const firebaseConfig = {
  apiKey: "AIzaSyBd-5J7Nz5h7qYwvuitlPubTNzCmlL1xZI",
  authDomain: "checklist-3d13a.firebaseapp.com",
  projectId: "checklist-3d13a",
  storageBucket: "checklist-3d13a.firebasestorage.app",
  messagingSenderId: "537572989728",
  appId: "1:537572989728:web:a4e786dfbdd06772745545",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

//DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Function to sanitize user input to prevent harmful data
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}


// Add Task (Updated to save to Firestore)
addTaskBtn.addEventListener("click", async () => {
  const taskText = sanitizeInput(taskInput.value.trim());
  if (taskText) {
    // Save task to Firestore
    await addTaskToFirestore(taskText);

    // Render the tasks after adding a new one
    renderTasks();
    taskInput.value = ""; // Clear the input field
  }
});

// Function to add a task to Firestore
async function addTaskToFirestore(taskText) {
  await addDoc(collection(db, "todos"), {
    text: taskText,
    completed: false,
  });
}

// Fetch tasks from Firestore when the app loads
async function renderTasks() {
  // Fetch tasks from Firestore
  var tasks = await getTasksFromFirestore();

  // Clear the existing task list
  taskList.innerHTML = "";

  // Render only tasks that are not completed
  tasks.forEach((task) => {
    if (!task.data().completed) {
      const taskItem = document.createElement("li");
      taskItem.id = task.id;
      taskItem.textContent = task.data().text;
      taskList.appendChild(taskItem);
    }
  });
}

// Function to get tasks from Firestore
async function getTasksFromFirestore() {
  const data = await getDocs(collection(db, "todos"));
  let userData = [];
  data.forEach((doc) => {
    userData.push(doc);
  });
  return userData;
}

// Remove Task on Click
taskList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.remove();
  }
});

// Service Worker Registration
const sw = new URL("service-worker.js", import.meta.url);

if ("serviceWorker" in navigator) {
  const s = navigator.serviceWorker;
  s.register(sw.href, {
    scope: "/Checklistv0/",
  })
    .then((_) =>
      console.log(
        "Service Worker Registered for scope:",
        sw.href,
        "with",
        import.meta.url
      )
    )
    .catch((err) => console.error("Service Worker Error:", err));
}
