document.addEventListener("DOMContentLoaded", async function () {
    const eventNameEl = document.getElementById("event-name");
    const eventDescription = document.getElementById("event-description");
    const taskList = document.getElementById("task-list");
    const taskName = document.getElementById("task-name");
    const addTaskBtn = document.getElementById("add-task");
    const taskDescription = document.getElementById("task-description");

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");

    async function getEvent() {
        let event = null;

        const response = await fetch(`http://localhost:3000/v1/events/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }
    
        const data = await response.json();
        event = data; 
    
        const taskResponse = await fetch(`http://localhost:3000/v1/events/${eventId}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
        if (!taskResponse.ok) {
            throw new Error(`Failed to fetch tasks for ${event.name} event.`);
        }
    
        const tasks = await taskResponse.json();
        console.log(tasks);
        event.tasks = tasks;
        eventNameEl.textContent = event.name;
        eventDescription.textContent = event.description;
        return event;
    }

    const event = await getEvent();

    renderTasksForEvent(event);

    async function addTaskToEvent() {
        if (!event) {
            alert("No event selected.");
            return;
        }

        const eventId = event.id;
        const completed = false;
        const description = taskDescription.value;
        const name = taskName.value;

        await fetch('http://localhost:3000/v1/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, description, completed, eventId })
        }).then(async function (response) {
            console.log(response.status);
            const json = await response.json();
            console.log(json);
            if (!response.ok) {
                alert(json.errors[0].message);
            } else {
                event.tasks.push(json);
        
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
                li.innerHTML = `<input type="checkbox" id="${task.id}-checkbox" name="${task.id}-checkbox" class="task-checkbox" value="Bike">
                <label for="${task.id}-checkbox"> ${task.name}, ${task.description || ""}</label><br>`;
                taskList.appendChild(li);
            });
        }
    }

    addTaskBtn.addEventListener("click", addTaskToEvent);
});
