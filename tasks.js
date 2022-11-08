//  ======================== Don't delete this please 4 -7 =========================

// if(!localStorage.getItem('currentUser')){
//     alert('Please Login First');
//     location.href = 'index.html'
// }
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

document.querySelector('#currentUserName').textContent = currentUser.first_name + ' ' +currentUser.last_name;

let form = document.getElementById("tasks-form");
// let button = document.getElementById("delete-button");
const log = console.log;

// create an empty array to append all tasks to it... and append it (array) to local storage 
let allTasks = [];

let tableTasks=[];

// This must be to check if the array is empty or not and get the old way of calling items to the row/// items 
if (getDataFromLocal()) {

    allTasks = getDataFromLocal();
}


// ===================This constructor is for the login and signup form
function userTasks(title, description, priority,userID,taskID,status) {
    this.title = title
    this.description = description
    this.priority = priority
    this.userID=userID
    this.taskID=taskID
    this.status=status
} 

// ========================= This is the event listener 
form.addEventListener("submit", TaskCreator);



// ========================== This is the task creator function and save to local 
function TaskCreator(event) {
    event.preventDefault();

    // get new task info
    let taskTitle = event.target.title.value;
    let taskDescription = event.target.description.value;
    let taskPriority = event.target.priority.value;
    let userID = JSON.parse(localStorage.getItem("currentUser")).userID;
    let status= 'Incomplete';

    // create taskId
    let tasks=getDataFromLocal()
    let taskID = 1;
    if (tasks && tasks.length > 0) {
        taskID = tasks.sort()[tasks.length - 1].taskID + 1
    }
   
    // create new task
    let newTask = new userTasks(taskTitle, taskDescription, taskPriority, userID,taskID,status);

    // refresh localStorage
    allTasks.push(newTask);
    log(allTasks);
    saveToLocal();
    addRowNumer();

    // add task to table
    TableRow(event,taskID,status);
    form.reset(' ');
    /////////// TasksCard() creator for tasks card ///////

}

// ========================== getting the data from local 
function getDataFromLocal(){
    return JSON.parse(localStorage.getItem("Tasks"));
}


// ========================== saving the data to local 
function saveToLocal() {

    let tasksString = JSON.stringify(allTasks);

    localStorage.setItem("Tasks", tasksString);
}

////////  Calling the all the elemensts that required to append the table to the main section //////////////////

let divTable1 = document.getElementById("table-section");
let divTable2 = document.getElementById("backg");

divTable2.appendChild(divTable1);

let divTable3 = document.getElementById("div3");

divTable3.appendChild(divTable2);

let divTable4 = document.getElementById("div4");

divTable4.appendChild(divTable3);

let divTable5 = document.getElementById("div5")

divTable5.appendChild(divTable4);

let divTable6 = document.getElementById("div6");

divTable6.appendChild(divTable5);

let table1 = document.getElementById("tasks-table");

divTable1.appendChild(table1);

let tableBody = document.getElementById("table-body");

table1.appendChild(tableBody);


// counter to each row of the table 
let counter = 0;
function addRowNumer() {

    return counter = counter + 1;
}

// old way of calling items to the row///

// let rowsArray = [];

// ============================ this is the constructor for the table rows 
function TableRow(event,taskID,status) {
    
    // get task info to add it to table
    let rowTitle1 = event.target.title.value;
    let rowTitle2 = event.target.description.value;
    let rowTitle3 = event.target.priority.value;
    debugger

    // refresh table length
    tableTasks = getDataFromLocal().filter((task) => task.userID == JSON.parse(localStorage.getItem("currentUser")).userID)
    let indexNumber = tableTasks.length;

    // add new task to table
    createRow(rowTitle1, rowTitle2, rowTitle3, indexNumber,taskID,status);
}

// run when page loaded
function genrateRowData() {
    tableTasks = getDataFromLocal().filter((task) => task.userID == JSON.parse(localStorage.getItem("currentUser")).userID)
    if (tableTasks) {
        tableTasks.forEach((task, index) => {
            createRow(task.title, task.description, task.priority, index + 1, task.taskID, task.status);
        });
    }
}

// create the row
function createRow(rowTitle1, rowTitle2, rowTitle3, number, taskID,status) {
    // creating the new row 
    let newRow = document.createElement("tr");
    tableBody.appendChild(newRow);

    let tableHead = document.createElement("th");
    tableHead.textContent = number;
    newRow.appendChild(tableHead);


    let td1 = document.createElement("td");
    td1.textContent = rowTitle1;
    newRow.appendChild(td1);

    let td2 = document.createElement("td");
    td2.textContent = rowTitle2;
    newRow.appendChild(td2);

    let td3 = document.createElement("td");
    td3.textContent = rowTitle3;
    newRow.appendChild(td3);

    let td4 = document.createElement("td");
    newRow.appendChild(td4);

    let select1 = document.createElement("select");
    td4.setAttribute("id", 'mySelect'+taskID);
    td4.appendChild(select1);
    select1.style.borderRadius = "20";

    var option1 = document.createElement("option");
    option1.setAttribute("value", "Completed");
    var t1 = document.createTextNode("Completed");
    option1.appendChild(t1);
    select1.appendChild(option1);

    var option2 = document.createElement("option");
    option2.setAttribute("value", "Incomplete");
    var t2 = document.createTextNode("Incomplete");
    option2.appendChild(t2)
    select1.appendChild(option2);

    select1.value = status;

    select1.addEventListener('change',(e)=>{
        e.preventDefault();
        const newStatus = e.target.value;
        const taskId = td4.id.split('mySelect')[1];
        updateTaskStatus(taskId,newStatus);
    })

    let button = document.createElement("button");
    let td5 = document.createElement("td");
    td5.appendChild(button);
    button.textContent = "Delete";
    button.className = "btn btn-danger";
    button.type = "submit";
    button.value = taskID;
    button.addEventListener('click', (e) => {
        e.preventDefault();
        deleteTaskFromTable(button.value)
    })

    newRow.appendChild(td5);
}

genrateRowData();

let logout = document.getElementById("logout");
logout.addEventListener('click', (event) => {
    let logout = confirm("Are you sure?");
    if (logout) {
        localStorage.removeItem('currentUser')
        location.href = 'index.html'
    } else {
        location.href = 'tasks.html'
    }
})

function deleteTaskFromTable(taskId) {
    let tasks = getDataFromLocal();

    //delete task from tasks array
    tasks = tasks.filter((task)=> task.taskID != taskId)
    // const index = tasks.findIndex((task) => taskId == taskId);
    // tasks.slice(index,1);

    localStorage.removeItem('Tasks');
    localStorage.setItem('Tasks',JSON.stringify(tasks));

    window.location.reload();
}

function updateTaskStatus(taskId, newStatus) {
    let tasks = getDataFromLocal();
    let task = tasks.find((t)=>t.taskID == taskId);
    task.status = newStatus;
    // console.table(tasks);
    localStorage.removeItem('Tasks');
    localStorage.setItem('Tasks',JSON.stringify(tasks));
}

// clear Completed
document.querySelector('#clearCompleted').addEventListener('click', (e) => {
    e.preventDefault()
    let userId = JSON.parse(localStorage.getItem('currentUser')).userID;
    let tasks = getDataFromLocal();

    tasks = tasks.filter((t) => t.userID == userId && t.status != 'Completed' );

    localStorage.removeItem('Tasks');
    localStorage.setItem('Tasks',JSON.stringify(tasks));

    window.location.reload();
})

// filter table
document.querySelector('#changePriority').addEventListener('change', (e) => {
    e.preventDefault();

    while (tableBody.lastChild) {
        tableBody.removeChild(tableBody.lastChild);
    }

    let tableTasksFilter = [];
    if (e.target.value == 'All') {
        tableTasksFilter = tableTasks
    } else {
        tableTasksFilter = tableTasks.filter((t) => t.priority == e.target.value);
    }

    tableTasksFilter.forEach((task, index) => {
        createRow(task.title, task.description, task.priority, index + 1, task.taskID, task.status);
    });
})



// const changeThemeBtn = document.querySelector('#changeTheme');
// const currentTheme = JSON.parse(localStorage.getItem('theme')) || {};
// let body = document.querySelector('body');
// body.style.backgroundColor = currentTheme.backgroundColor || 'white';
// body.style.color = currentTheme.color || 'black';

// body.classList.add('bg-light','text-light')
// body.classList.remove('bg-light')

// let newtask=document.getElementById("newtask");
// newtask.style.backgroundColor = currentTheme.backgroundColor || 'white';
// newtask.style.color = currentTheme.color || 'black';

// let tasksTable=document.getElementById("tasks-table");
// tasksTable.classList.add('table-light')


// if (body.classList.contains('bg-light')) {
//     body.classList.add('bg-light', 'text-light')
//     tasksTable.classList.add('table-light')
// } else {
//     body.classList.add('bg-dark', 'text-dark')
//     tasksTable.classList.add('table-dark')
// }



// changeThemeBtn.textContent = currentTheme.btn || '🌚';

// changeThemeBtn.addEventListener("click", (e) => {
//     e.preventDefault()

//     let body = document.querySelector('body');
//     body.style.backgroundColor = body.style.backgroundColor != 'black' ? 'black' : 'white';
//     body.style.color = body.style.color != 'white' ? 'white' : 'black';
//     changeThemeBtn.textContent = changeThemeBtn.textContent != '🌞' ? '🌞' : '🌚';

//     let newtask = document.getElementById("newtask");
//     newtask.style.backgroundColor = currentTheme.backgroundColor || 'white';
//     newtask.style.color = currentTheme.color || 'black';

//     const theme = {
//         'backgroundColor': body.style.backgroundColor,
//         'color': body.style.color,
//         'btn': changeThemeBtn.textContent
//     }

//     localStorage.setItem('theme', JSON.stringify(theme));
// })
