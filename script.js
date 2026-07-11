const button = document.getElementById("myBtn");
const output = document.getElementById("output");

button.addEventListener("click", function() {
  output.textContent = "You clicked the button!";
});

let count = 0;
const countDisplay = document.getElementById("count");
const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");

increaseBtn.addEventListener("click", function() {
    if (count < 10) {
    count = count + 1;
    countDisplay.textContent = count;
    }
    if (count === 10) {
    countDisplay.style.color = "red";
} else { 
    countDisplay.style.color = "black";
}
    });

decreaseBtn.addEventListener("click", function() {
    if (count > 0) {
        count = count - 1;
        countDisplay.textContent = count;
    }
});

const tasks = ["Learn HTML", "Learn CSS", "Learn Java"];
const tasklist = document.getElementById("taskList");

tasks.forEach(function(task) {
    const li = document.createElement("li");
    li.textContent = task;
    tasklist.appendChild(li);
});

const dogImage = document.getElementById("dogImage");
const fetchDogBtn = document.getElementById("fetchDogBtn");

fetchDogBtn.addEventListener("click", function() {
    fetch("https://api.thecatapi.com/v1/images/search")
    .then(function(responce) {
        return responce.json();
    })
    .then(function(data) {
        dogImage.src = data[0].url;
    });
});

    fetch("http://localhost:3000/api/tasks")
.then (function(responce) {
    return responce.json();
})
.then(function(data) {
    console.log(data);
});

const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

addTaskBtn.addEventListener("click", function() {
    fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task: newTaskInput.value })
})
.then(function(responce) {
    return responce.json();
})
.then(function(tasks) {
    console.log(tasks);
    newTaskInput.value = "";
});
});