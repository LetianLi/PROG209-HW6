let tasks = [];

let Task = function(taskName, taskType, taskPriority) {
    this.name = taskName;
    this.type = taskType;
    this.priority = taskPriority;
    this.done = false;
    this.timeAdded = Date.now();

    if (this.priority === "High") this.priorityNumber = 1;
    else if (this.priority === "Medium") this.priorityNumber = 2;
    else this.priorityNumber = 3;
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
        
        //push to task array
        let task = new Task(taskName, taskType, taskPriority);
        tasks.push(task);

        /*displays task added successfully so I know it actually
        ran the function and added to the array properly.*/
        let successMessage = document.getElementById("successMessage");
        successMessage.innerHTML = "Task added successfully!";
        //timeout for sucess message (2.0 seconds)
        setTimeout(() => {
            successMessage.innerHTML = '';  
        }, 2000);

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
        if (typeof propA === "string") {
            sortValue = propA.localeCompare(propB);
        } else if (typeof propA === "number") {
            sortValue = propA - propB;
        }

        if (sortAscending) {
            return sortValue;
        } else {
            return -sortValue;
        }
    });

    return sortedTasks;
}

function createTaskTable(processedTaskList) {
    let table = document.getElementById("table");

    //Start by clearing the table
    table.innerHTML = "";

    //For creating the header rows
    let headerRow = document.createElement("tr"); //table row

    //for header of name col
    let nameHeader = document.createElement("th"); //table header
    nameHeader.innerHTML = "Name";
    headerRow.appendChild(nameHeader);

    //for header of type col
    let typeHeader = document.createElement("th");
    typeHeader.innerHTML = "Type";
    headerRow.appendChild(typeHeader);

    //for header of priority col
    let priorityHeader = document.createElement("th");
    priorityHeader.innerHTML = "Priority";
    headerRow.appendChild(priorityHeader);

    //for header of done col
    let doneHeader = document.createElement("th");
    doneHeader.innerHTML = "Done";
    headerRow.appendChild(doneHeader);

    table.appendChild(headerRow);

    //setting up rows for each task item in array
    processedTaskList.forEach(task => {
        let row = document.createElement("tr");

        //for name col
        let nameCell = document.createElement("td");
        nameCell.innerHTML = task.name;
        row.appendChild(nameCell);

        //for type col
        let typeCell = document.createElement("td");
        typeCell.innerHTML = task.type;
        row.appendChild(typeCell);

        //for priority col
        let priorityCell = document.createElement("td");
        priorityCell.innerHTML = task.priority;
        row.appendChild(priorityCell);

        //for done col
        let doneCell = document.createElement("td"); 
        let doneCheckbox = document.createElement("input");
        doneCheckbox.type = "checkbox";
        doneCheckbox.checked = task.done;
        doneCheckbox.addEventListener("change", function(){
            task.done = this.checked;
        });

        doneCell.appendChild(doneCheckbox);
        row.appendChild(doneCell);

        table.appendChild(row);
    });
}