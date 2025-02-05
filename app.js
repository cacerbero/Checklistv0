// Importing Firebase SDK modules
import { initializeApp } from "firebase/app";
import {doc, getDocs, addDoc, updateDoc, getFirestore, collection} from "firebase/firestore";

// Service Worker Registration
const sw = new URL("service-worker.js", import.meta.url);

if ("serviceWorker" in navigator) {
  const s = navigator.serviceWorker;
  s.register(sw.href, {
    scope: "/Checklistv0/",
  })
    .then((_) => console.log("Service Worker Registered for scope:", sw.href,"with", import.meta.url))
    .catch((err) => console.error("Service Worker Error:", err));
}

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
console.log("Firebase App initialized", app);

// Initialize Firestore
const db = getFirestore(app);
console.log("Firestored initialized", db);

//DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

window.addEventListener('load', () => {
  renderTasks();
});

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
    let taskId = await addTaskToFirestore(taskText);
    taskInput.value = "";

    createLiTask(taskId, taskText);
  } else {
    alert("Please enter a task!");
  }
});

// Remove Task
taskList.addEventListener('click', async (e) => {
  if (e.target.tagName === 'LI') {
    await updateDoc(doc(db, "todos", e.target.id), {
      completed: true
    });  
    e.target.remove();
  }
});

//Rendering taks to Firebase
async function renderTasks() {
  var tasks = await getTasksFromFirestore();
  taskList.innerHTML = "";

  let taskArr = [];

  tasks.forEach(task => {
    taskArr.push({
      "id" : task.id,
      "text": task.data().text,
      "completed": task.data().completed
    })
  });

  taskArr.sort(function(a,b){
    return new Date(b.timeCreated) - new Date(a.timeCreated);
  });

  taskArr.forEach(task => {
    if(!task.completed){
      createLiTask(task.id, task.text);
    }
  });
}


// Function to add a task to Firestore
  async function addTaskToFirestore(taskText) {
    let task = await addDoc(collection(db, "todos"), {
      text: taskText, 
      completed: false
    });  
    return task.id;
  }


  async function getTasksFromFirestore() {
    return await getDocs(collection(db, "todos"));
  }

  function createLiTask(id, text) {
    let taskItem = document.createElement("li");
    taskItem.id = id;
    taskItem.textContent = text;
    taskItem.tabIndex = 0;
    taskList.appendChild(taskItem);
  }

  //Allow task addition on enter key while in task input
  taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      addTaskBtn.click();
    }
  });

  //Allow tasks to be completed on enter
  taskList.addEventListener("keypress", async function(e) {
    if (e.target.tagName === 'LI' && e.key === "Enter") {
      await updateDoc(doc(db, "todos", e.target.id), {
        completed: true
      });  
    }
    renderTasks();
  });

window.addEventListener('error', function (event) {
    console.error('Error occurred: ', event.message);
});