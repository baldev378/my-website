const button = document.getElementById("myBtn");
const output = document.getElementById("output");

button.addEventListener("click", function() {
  output.textContent = "You clicked the button!";
});

const supabaseUrl = "https://sahgjtudozvxcwonqvwc.supabase.co";
const supabaseKey = "sb_publishable_lqur-pU4RfgFR2k-Zj07Og_Y0G69ecV";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const authStatus = document.getElementById("authStatus");
const loggedInView = document.getElementById("loggedInView");
const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");
const authForms = document.getElementById("authForms");

signupBtn.addEventListener("click", async function() {
    const { data, error } = await supabaseClient.auth.signUp({
        email: authEmail.value,
        password: authPassword.value
    });

    if (error) {
        authStatus.textContent = "Error: " + error.message;
    } else {
        authStatus.textContent = "Signed up! Check your email to confirm.";
        showLoggedIn(authEmail.value);
    }
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

const taskList = document.getElementById("taskList");

function loadTasks() {
    fetch("https://my-backend-nqso.onrender.com/api/tasks")
        .then(function(response) {
            return response.json();
        })
        .then(function(tasks) {
            taskList.innerHTML = "";
            tasks.forEach(function(taskItem) {
                const li = document.createElement("li");
                li.textContent = taskItem.task;
                taskList.appendChild(li);
            });
        });
}

loadTasks();

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


const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

addTaskBtn.addEventListener("click", function() {
    fetch("https://my-backend-nqso.onrender.com/api/tasks", {
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
    loadTasks();
});
});

const { animate, inView } = Motion;

inView(".card", function (element) {
    animate(element, { opacity: [0, 1], y: [30, 0] }, { duration: 0.6 });
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(document.getElementById("threeContainer").clientWidth, 300);
document.getElementById("threeContainer").appendChild(renderer.domElement);

const geometry = new THREE.IcosahedronGeometry(1.2, 0 );
const material = new THREE.MeshStandardMaterial({ color: 0xc2185b, metalness: 0.6, roughness: 0.3});
const gem = new THREE.Mesh(geometry, material);
scene.add(gem);

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

camera.position.z = 4;


 let gemVisible = false;

const observer = new IntersectionObserver(function(entries) {
    gemVisible = entries[0].isIntersecting;
});
observer.observe(document.getElementById("threeContainer"));

function animateGem() {
    requestAnimationFrame(animateGem);
    if (gemVisible) {
        gem.rotation.x += 0.005;
        gem.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
}
animateGem();

loginBtn.addEventListener("click", async function() {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: authEmail.value,
        password: authPassword.value
    });

    if (error) {
        authStatus.textContent = "Error: " + error.message;
    } else {
        authStatus.textContent = "Logged in as " + data.user.email;
        showLoggedIn(data.user.email);
    }
});

function showLoggedIn(email) {
    (document.getElementById("authForms")).style.display = "none";
    loggedInView.style.display = "block";
    welcomeMessage.textContent = "Welcome, " + email;
}
function showLoggedOut() {
    (document.getElementById("authForms")).style.display = "block";
    loggedInView.style.display = "none";
}

async function checkSession() {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
        showLoggedIn(data.session.user.email);
    } else {
        showLoggedOut();
    }
}
checkSession();

logoutBtn.addEventListener("click", async function() {
    await supabaseClient.auth.signOut();
    showLoggedOut();
    authStatus.textContent = "Logged out.";
});