let tasks = [];

let Task = function(taskName, taskType, taskPriority) {
    this.name = taskName;
    this.type = taskType;
    this.priority = taskPriority;
    this.done = false;
    this.timeAdded = Date.now();

    // priorityValue is used for sorting
    switch (this.priority) {
        case "High":
            this.priorityValue = 1;
            break;
        case "Medium":
            this.priorityValue = 2;
            break;
        default:
            this.priorityValue = 3;
            break;
    }
}

// prepush tasks
tasks.push(new Task("Apply for social security", "Life", "High"));
tasks.push(new Task("Buy groceries", "Life", "Low"));
tasks.push(new Task("Talk to coworker", "Work", "Low"));
tasks.push(new Task("Complain about pay", "Work", "Low"));
tasks.push(new Task("Check for response from support ticket", "Work", "High"));
tasks.push(new Task("Do Homework", "School", "Medium"));
tasks.push(new Task("Review class notes", "School", "Medium"));

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("getStartedBtn").addEventListener("click", goToAddPage);
    document.getElementById("getStartedBtn2").addEventListener("click", goToAddPage);
    document.getElementById("addTaskBtn").addEventListener("click", createArrayObj);
    document.getElementById("deleteDoneTasksBtn").addEventListener("click", deleteDoneTasks);

    // regenerate table whenever sort/filter settings change
    let regenDisplayElements = Array.from(document.getElementsByClassName("regenDisplay"));
    regenDisplayElements.forEach(element => element.addEventListener("change", displayTasks));
});

$(document).on("pagebeforeshow", "#DisplayPage", function (event) { 
    displayTasks();
});

function goToAddPage() {
    window.location = "#AddPage";
}

function createArrayObj() {
    let taskNameInput = document.getElementById("taskNameInput");

    let taskName = document.getElementById("taskNameInput").value;
    let taskType = document.getElementById("taskTypeInput").value;
    let taskPriority = document.getElementById("taskPriorityInput").value;

    if (taskName === ""){
        document.getElementById("alert_message").innerHTML = "Please enter a task name.";
        taskNameInput.focus();
        return;
    } else {
        document.getElementById("alert_message").innerHTML = "";
        
        // push to task array
        let task = new Task(taskName, taskType, taskPriority);
        tasks.push(task);

        // display success message
        let successMessage = document.getElementById("successMessage");
        successMessage.innerHTML = "Task added successfully!";
        // timeout sucess message (2.0 seconds)
        setTimeout(() => {
            successMessage.innerHTML = '';  
        }, 2000);

        // empty name box and put focus in name box
        taskNameInput.value = "";
        taskNameInput.focus();
    }
}

function deleteDoneTasks() {
    tasks = tasks.filter(task => !task.done);
    displayTasks();
}

function displayTasks() {
    if (tasks.length > 0) {
        // create table, hide get started button, show delete done task button
        let processedTaskList = processTaskList();
        createTaskTable(processedTaskList);
        document.getElementById("getStartedBtn2").style = "display: none";
        document.getElementById("deleteDoneTasksBtn").style = "display: block";
    } else {
        // replace table with empty message, show get started button, hide delete done task button
        document.getElementById("table").innerHTML = "Uh oh, you don't have anything in your task list yet. Try adding one";
        document.getElementById("getStartedBtn2").style = "display: block";
        document.getElementById("deleteDoneTasksBtn").style = "display: none";
    }
}

function processTaskList() {
    // Filter task list
    let allowedTypes = Array.from(document.getElementsByClassName("filterTypeSetting")).filter(checkbox => checkbox.checked).map(checkedBoxes => checkedBoxes.value);
    let allowedPriorities = Array.from(document.getElementsByClassName("filterPrioritySetting")).filter(checkbox => checkbox.checked).map(checkedBoxes => checkedBoxes.value);
    
    let filteredTasks = tasks.filter(task => {
        // pass checks if nothing in allowed or task is in allowed
        let passesTypeCheck = allowedTypes.length === 0 || allowedTypes.includes(task.type);
        let passesPriorityCheck = allowedPriorities.length === 0 || allowedPriorities.includes(task.priority);

        return passesTypeCheck && passesPriorityCheck;
    });

    // Sort task list
    let sortProperty = document.getElementById("sortSetting").value;
    let sortAscending = document.getElementById("sortAscendingCheckBox").checked;
    let sortedTasks = Array.from(filteredTasks);
    sortedTasks.sort((taskA, taskB) => {
        let propA = taskA[sortProperty];
        let propB = taskB[sortProperty];
        
        let sortValue;
        // compare differently for strings and numbers
        if (typeof propA === "string") {
            sortValue = propA.localeCompare(propB);
        } else if (typeof propA === "number") {
            sortValue = propA - propB;
        }

        return sortValue;
    });

    // Reverse array if descending
    if (!sortAscending) {
        sortedTasks.reverse();
    }

    return sortedTasks;
}

function createTaskTable(processedTaskList) {
    let table = document.getElementById("table");

    // clear table
    table.innerHTML = "";

    // create header row
    let headerRow = document.createElement("tr"); // tr = table row

    // name header col
    let nameHeader = document.createElement("th"); // th = table header
    nameHeader.innerHTML = "Name";
    headerRow.appendChild(nameHeader);

    // type header col
    let typeHeader = document.createElement("th");
    typeHeader.innerHTML = "Type";
    headerRow.appendChild(typeHeader);

    // priority header col
    let priorityHeader = document.createElement("th");
    priorityHeader.innerHTML = "Priority";
    headerRow.appendChild(priorityHeader);

    // done header col
    let doneHeader = document.createElement("th");
    doneHeader.innerHTML = "Done";
    headerRow.appendChild(doneHeader);

    // append header row into table
    table.appendChild(headerRow);


    // set up rows for every task
    processedTaskList.forEach(task => {
        // create task row
        let row = document.createElement("tr");

        // task name col
        let nameCell = document.createElement("td"); // td = table data
        nameCell.innerHTML = task.name;
        row.appendChild(nameCell);

        // task type col
        let typeCell = document.createElement("td");
        typeCell.innerHTML = task.type;
        row.appendChild(typeCell);

        // task priority col
        let priorityCell = document.createElement("td");
        priorityCell.innerHTML = task.priority;
        row.appendChild(priorityCell);

        // task done col and checkbox
        let doneCell = document.createElement("td"); 
        let doneCheckbox = document.createElement("input");
        doneCheckbox.type = "checkbox";
        doneCheckbox.checked = task.done;
        doneCheckbox.addEventListener("change", function(){
            task.done = this.checked;
        });
        doneCell.appendChild(doneCheckbox);
        row.appendChild(doneCell);

        // append task row into table
        table.appendChild(row);
    });
}