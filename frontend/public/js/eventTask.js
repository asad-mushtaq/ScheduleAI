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

    let events = [];
    let selectedEvent = null;

    function getSession() {
        return localStorage.getItem("userId");
    }

    if (typeof FullCalendar === "undefined") {
        console.error("FullCalendar failed to load.");
        alert("Error: FullCalendar is missing.");
        return;
    }

    const calendarEl = document.getElementById("calendar");
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
    calendar.render();

    async function loadEvents() {
        const userId = getSession();
        try {
            const response = await fetch(`http://localhost:8080/db_manager/v1/users/${userId}/events`, {
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
                const taskResponse = await fetch(`http://localhost:8080/db_manager/v1/events/${event.id}/tasks`, {
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
                    start: event.startDate,
                    extendedProps: { tasks: tasks }
                });
            };
        } catch (error) {
            console.error("Error loading events:", error.message);
            alert("Failed to load events from the server.");
        }
    }


    loadEvents();

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

        await fetch('http://localhost:8080/db_manager/v1/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
            body: JSON.stringify({ userId, name, description, startDate, length })
        }).then(async function (response) {
            console.log(response.status);
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                alert(json.errors[0].message);
            } else {
                calendar.addEvent({
                    id: json.id.toString(),
                    title: json.name,
                    start: json.startDate,
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

        await fetch('http://localhost:8080/db_manager/v1/tasks', {
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

    function renderTasksForEvent(event) {
        taskList.innerHTML = "";
        if (event.tasks.length === 0) {
            taskList.innerHTML = "<li>No tasks for this event</li>";
        } else {
            event.tasks.forEach(task => {
                const li = document.createElement("li");
                li.innerHTML = `<input type="checkbox" id="${task.id}-checkbox" name="${task.id}-checkbox" class="task-checkbox" value="Bike">
                <label for="${task.id}-checkbox"> ${task.name}, ${task.description || ""}</label><br>`;
                taskList.appendChild(li);
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
    
        await fetch('http://localhost:8080/query', {
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

    createEventBtn.addEventListener("click", createEvent);
    addTaskBtn.addEventListener("click", addTaskToEvent);
    viewEventDetailsBtn.addEventListener("click", openTaskDetailsPage);
    getFeedbackBtn.addEventListener("click", getFeedback);
});
