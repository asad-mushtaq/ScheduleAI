document.addEventListener("DOMContentLoaded", function () {
    const eventName = document.getElementById("event-name");
    const eventDescription = document.getElementById("event-description");
    const eventDate = document.getElementById("event-date");
    const eventLength = document.getElementById("event-length");
    const createEventBtn = document.getElementById("create-event");
    const taskInputSection = document.getElementById("task-input-section");
    const selectedEventName = document.getElementById("selected-event-name");
    const taskList = document.getElementById("task-list");
    const taskName = document.getElementById("task-name");
    const taskDescription = document.getElementById("task-description");
    const addTaskBtn = document.getElementById("add-task");
    const viewEventDetailsBtn = document.getElementById("view-event-details");
    const getFeedbackBtn = document.getElementById("get-feedback");
    const aiResponse = document.getElementById("ai-response");
    const userPrompt = document.getElementById("user-prompt");
    const calendarEl = document.getElementById("calendar");

    const dbManagerUrl = "http://localhost:8080/db_manager"
    const openAiApiUrl = "http://localhost:8080/query"

    let events = [];
    let selectedEvent = null;
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        selectable: true,
        events: [],
        eventClick: function (info) {
            selectedEvent = events.find(e => e.id.toString() === info.event.id);
            if (selectedEvent) {
                selectedEventName.textContent = selectedEvent.name;
                renderTasksForEvent(selectedEvent);
                taskInputSection.style.display = "block";
            }
        }
    });

    function getSession() {
        return localStorage.getItem("userId");
    }

    function removeSession() {
        localStorage.removeItem("userId");
        window.location.replace("/login");
    }

    async function loadEvents() {
        const userId = getSession();
        try {
            const response = await fetch(`${dbManagerUrl}/v1/users/${userId}/events`, {
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
            events = data;


            for (const event of events) {
                const taskResponse = await fetch(`${dbManagerUrl}/v1/events/${event.id}/tasks`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    credentials: 'include'
                });
                if (!taskResponse.ok) {
                    throw new Error(`Failed to fetch tasks for ${event.name} event.`);
                }

                const tasks = await taskResponse.json();
                event.tasks = tasks;
                calendar.addEvent({
                    id: event.id.toString(),
                    title: event.name,
                    start: new Date(event.startDate),
                    extendedProps: { tasks: tasks }
                });
            };
        } catch (error) {
            console.error("Error loading events:", error.message);
            removeSession();
            window.location.replace("/home");
        }
    }

    async function createEvent() {
        const name = eventName.value;
        const description = eventDescription.value;
        let startDate = eventDate.value;
        const length = eventLength.value;

        if (!name || !startDate) {
            alert("Please enter at least event name and date.");
            return;
        }

        const userId = getSession();

        await fetch(`${dbManagerUrl}/v1/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
            body: JSON.stringify({ userId, name, description, startDate, length })
        }).then(async function (response) {
            console.log(response.status);
            const event = await response.json();
            if (!response.ok) {
                alert(event.errors[0].message);
            } else {
                event.tasks = [];
                events.push(event);
                calendar.addEvent({
                    id: event.id.toString(),
                    title: event.name,
                    start: event.startDate,
                    extendedProps: { tasks: [] }
                });
            }
        })

        eventName.value = "";
        eventDate.value = "";
        eventDescription.value = "";
        eventLength.value = "";
    }

    async function addTaskToEvent() {
        if (!selectedEvent) {
            alert("No event selected.");
            return;
        }

        const eventId = selectedEvent.id;
        const completed = false;
        const description = taskDescription.value;
        const name = taskName.value;

        await fetch(`${dbManagerUrl}/v1/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
            body: JSON.stringify({ name, description, completed, eventId })
        }).then(async function (response) {
            console.log(response.status);
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                alert(json.errors[0].message);
            } else {
                selectedEvent.tasks.push(json);

                const calendarEvent = calendar.getEventById(selectedEvent.id.toString());
                if (calendarEvent) {
                    calendarEvent.setExtendedProp("tasks", selectedEvent.tasks);
                }

                renderTasksForEvent(selectedEvent);
                taskName.value = "";
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
                alert("task deletion failed!");
            } else {
                const taskElem = clickedElem.parentElement;
                const taskList = taskElem.parentElement;
                taskElem.remove();
                let newTasks = [];
                for ( task of selectedEvent.tasks ) {
                    if (task.id != taskId) {
                        newTasks.push(task);
                    }
                }
                selectedEvent.tasks = newTasks;
                let newEvents = []
                for ( userEvent of events ) {
                    if (userEvent.id === selectedEvent.id) {
                        newEvents.push(selectedEvent);
                    } else {
                        newEvents.push(userEvent);
                    }
                    events= newEvents;
                }
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
        for ( task of selectedEvent.tasks ) {
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
        selectedTask.completed = clickedElem.checked;
        const completed = selectedTask.completed;
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
                let newTasks = [];
                for ( task of selectedEvent.tasks ) {
                    if (task.id === taskId) {
                        newTasks.push(selectedTask);
                    }
                    newTasks.push(task);
                }
                selectedEvent.tasks = newTasks;
                for ( userEvent of events ) {
                    if (userEvent.id !== selectedEvent.id) {
                        userEvent = selectedEvent;
                    }
                }
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

    function openTaskDetailsPage() {
        if (!selectedEvent) {
            alert("No event selected.");
            return;
        }

        window.location.href = `event-details.html?eventId=${selectedEvent.id}`;
    }

    async function getFeedback() {
        const prompt = userPrompt.value;
        const loading = document.getElementById("ai-response-loading");
        aiResponse.innerHTML = ""
        aiResponse.style.display = 'none';
        
        if (!prompt) {
            alert("Please enter a prompt to get feedback.");
            return;
        }
        
        loading.style.display = 'block';  // To show the element

        const userId = getSession();
        // Creating the request body correctly
        const query = {
            prompt: prompt,  // the user input
            events: events    // the list of events
        };
        console.log(query)
    
        await fetch(`${openAiApiUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(query)
        }).then(async function (response) {
            console.log(response.status);
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                alert(json.error);
            } else {
                loading.style.display = 'none';   // To hide the element
                aiResponse.innerHTML = json.response.slice(7, -3)
                aiResponse.style.display = 'inline-block';
            }
        })
    }

    if (typeof FullCalendar === "undefined") {
        console.error("FullCalendar failed to load.");
        alert("Error: FullCalendar is missing.");
        return;
    }

    calendar.render();
    loadEvents();
    
    createEventBtn.addEventListener("click", createEvent);
    addTaskBtn.addEventListener("click", addTaskToEvent);
    viewEventDetailsBtn.addEventListener("click", openTaskDetailsPage);
    getFeedbackBtn.addEventListener("click", getFeedback);
});
