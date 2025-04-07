document.addEventListener("DOMContentLoaded", async function () {
    const eventNameEl = document.getElementById("event-name");
    const eventDescription = document.getElementById("event-description");
    const taskList = document.getElementById("task-list");
    const taskName = document.getElementById("task-name");
    const addTaskBtn = document.getElementById("add-task");
    const taskDescription = document.getElementById("task-description");
    const eventStartDate = document.getElementById("event-start-date");
    const eventLength = document.getElementById("event-length");
    const deleteEventBtn = document.getElementById("delete-event-btn");
    const editEventBtn = document.getElementById("edit-event-btn");
    const urlParams = new URLSearchParams(window.location.search);
    const eventDescInput = document.getElementById("event-description-input");
    const eventStartDateInput = document.getElementById("event-start-date-input");
    const eventLengthInput = document.getElementById("event-length-input");
    const eventNameInput = document.getElementById("event-name-input");

    const dbManagerUrl = "http://localhost:8080/db_manager"
    const eventId = urlParams.get("eventId");

    let event = await getEvent();

    async function deleteEvent() {
    
        await fetch(`${dbManagerUrl}/v1/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
        }).then(async function (response) {
            console.log(response.status);
            const event = await response.json();
            console.log(event);
            if (!response.ok) {
                alert(event.errors[0].message);
            } else {
                window.location.replace("/home");
            }
        })
    }

    async function editEvent() {
        const name = eventNameInput.value;
        const description = eventDescInput.value;
        const startDate = eventStartDateInput.value;
        const length = eventLengthInput.value;
        const id = eventId;

        await fetch(`${dbManagerUrl}/v1/events`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
            body: JSON.stringify({ id, name, description, startDate, length })
        }).then(async function (response) {
            console.log(response.status);
            const newEvent = await response.json();
            console.log(newEvent);
            if (!response.ok) {
                alert(newEvent.errors[0].message);
            } else {
                event = newEvent;
                eventNameEl.textContent = "Event Name: " + event.name;
                eventDescription.textContent = "Event Description: " + event.description;
                const eventDate = new Date(event.startDate);
                eventStartDate.textContent = "Event Start Date: " + eventDate.toLocaleString("en-US");
                eventLength.textContent = "Event Length: " + event.length + " hours"
            }
        })
    }

    async function deleteTask(click) {
        const clickedElem = click.target;
        const arr = clickedElem.id.split("-");
        const taskId = arr[0];
        await fetch(`${dbManagerUrl}/v1/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
        }).then(async function (response) {
            if (!response.ok) {
                alert(event.errors[0].message);
            } else {
                const taskElem = clickedElem.parentElement;
                const taskList = taskElem.parentElement;
                taskElem.remove();
                let newTasks = [];
                for ( task of event.tasks ) {
                    if (task.id != taskId) {
                        newTasks.push(task);
                    }
                }
                event.tasks = newTasks;
                console.log(event)
                if (taskList.innerHTML === "") {
                    taskList.innerHTML = "<li>No tasks for this event</li>";
                } 
            }
        });
    }

    async function checkMarkTask(click) {
        const clickedElem = click.target;
        const arr = clickedElem.id.split("-");
        const taskId = arr[0];
        let selectedTask = undefined;
        console.log(taskId)
        for ( task of event.tasks ) {
            console.log(task)
            if (task.id == taskId) {
                selectedTask = task;
            }
        }
        if (selectedTask === undefined) {
            alert("selected task not found.");
            return;
        }
        const id = selectedTask.id;
        const name = selectedTask.name;
        const description = selectedTask.description;
        console.log(clickedElem);
        const completed = clickedElem.checked
        console.log(completed);
        await fetch(`${dbManagerUrl}/v1/tasks`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
            body: JSON.stringify({ id, name, description, completed })
        }).then(async function (response) {
            console.log(response.status);
            const newEvent = await response.json();
            console.log(newEvent);
            if (!response.ok) {
                alert(newEvent.errors[0].message);
            } else {

            }
        })
    }

    async function getEvent() {
        let newEvent = null;

        const response = await fetch(`${dbManagerUrl}/v1/events/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }
    
        const data = await response.json();
        newEvent = data; 
    
        const taskResponse = await fetch(`${dbManagerUrl}/v1/events/${eventId}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include'
        });
        if (!taskResponse.ok) {
            throw new Error(`Failed to fetch tasks for ${newEvent.name} event.`);
        }
    
        const tasks = await taskResponse.json();
        console.log(tasks);
        newEvent.tasks = tasks;
        console.log(newEvent);
        eventNameEl.textContent = "Event Name: " + newEvent.name;
        eventDescription.textContent = "Event Description: " + newEvent.description;
        const eventDate = new Date(newEvent.startDate);
        eventStartDate.textContent = "Event Start Date: " + eventDate.toLocaleString("en-US");
        eventLength.textContent = "Event Length: " + newEvent.length + " hours"
        return newEvent;
    }

    async function addTaskToEvent() {
        if (!event) {
            alert("No event selected.");
            return;
        }

        const eventId = event.id;
        const completed = false;
        const description = taskDescription.value;
        const name = taskName.value;

        await fetch(`${dbManagerUrl}/v1/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, description, completed, eventId }),
            credentials: 'include'
        }).then(async function (response) {
            console.log(response.status);
            const eventTask = await response.json();
            console.log(eventTask);
            if (!response.ok) {
                alert(eventTask.errors[0].message);
            } else {
                event.tasks.push(eventTask);
        
                renderTasksForEvent(event);
                taskName.value = "";
            }
        })
    }

    function renderTasksForEvent(event) {
        taskList.innerHTML = "";
        if (event.tasks.length === 0) {
            taskList.innerHTML = "<li>No tasks for this event</li>";
        } else {
            event.tasks.forEach(task => {
                const li = document.createElement("li");
                li.id = `${task.id}-task`
                li.innerHTML = `<input type="checkbox" id="${task.id}-task-checkbox" name="${task.id}-task-checkbox" class="task-checkbox">
                <label for="${task.id}-task-checkbox"> ${task.name}, ${task.description || ""} </label><button id="${task.id}-task-delete-btn" class="task-delete-btn">Delete</button>`;
                taskList.appendChild(li);
                const deleteBtn = document.getElementById(`${task.id}-task-delete-btn`);
                const checkbox = document.getElementById(`${task.id}-task-checkbox`);
                checkbox.checked = task.completed;
                deleteBtn.addEventListener("click", deleteTask);
                checkbox.addEventListener("click", checkMarkTask);
            });
        }
    }

    renderTasksForEvent(event);

    addTaskBtn.addEventListener("click", addTaskToEvent);
    deleteEventBtn.addEventListener("click", deleteEvent);
    editEventBtn.addEventListener("click", editEvent);
});
