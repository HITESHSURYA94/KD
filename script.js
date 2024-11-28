// Login Logic
const loginForm = document.getElementById('loginForm');
const appContent = document.getElementById('appContent');
const logoutBtn = document.getElementById('logoutBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');

const validUsername = "admin";
const validPassword = "password";

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === validUsername && password === validPassword) {
    loginMessage.textContent = "";
    appContent.style.display = "block";
    loginForm.style.display = "none";
  } else {
    loginMessage.textContent = "Invalid username or password.";
    loginMessage.style.color = "red";
  }
});

logoutBtn.addEventListener('click', function () {
  appContent.style.display = "none";
  loginForm.style.display = "block";
  loginForm.reset();
});

// Event Planning Logic
const addEventForm = document.getElementById('addEventForm');
const eventList = document.getElementById('eventList');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpDropdown = document.getElementById('rsvpEvent');
const rsvpMessage = document.getElementById('rsvpMessage');

const rsvpCounts = {};

function createEventCard(name, date, time, location, description) {
  const eventCard = document.createElement('div');
  eventCard.className = 'event-card';
  eventCard.id = `event-${name}`;

  eventCard.innerHTML = `
    <h3>${name}</h3>
    <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Location:</strong> ${location}</p>
    <p><strong>Description:</strong> ${description}</p>
    <p class="rsvp-count" id="count-${name}">RSVP Count: 0</p>
    <button class="delete-btn" data-event="${name}">Delete Event</button>
  `;

  return eventCard;
}

function deleteEvent(eventName) {
  const eventCard = document.getElementById(`event-${eventName}`);
  if (eventCard) eventCard.remove();

  delete rsvpCounts[eventName];

  for (let i = 0; i < rsvpDropdown.options.length; i++) {
    if (rsvpDropdown.options[i].value === eventName) {
      rsvpDropdown.remove(i);
      break;
    }
  }

  if (!eventList.querySelector('.event-card')) {
    eventList.innerHTML = '<p>No events available. Add one above!</p>';
  }
}

addEventForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value;
  const location = document.getElementById('eventLocation').value.trim();
  const description = document.getElementById('eventDescription').value.trim();

  if (!name || !date || !time || !location || !description) {
    alert("Please fill in all fields to add an event.");
    return;
  }

  if (rsvpCounts[name] !== undefined) {
    alert("An event with this name already exists. Please choose a unique name.");
    return;
  }

  rsvpCounts[name] = 0;

  const eventCard = createEventCard(name, date, time, location, description);

  if (eventList.children[0].tagName === 'P') {
    eventList.innerHTML = '';
  }
  eventList.appendChild(eventCard);

  const eventOption = document.createElement('option');
  eventOption.value = name;
  eventOption.textContent = name;
  rsvpDropdown.appendChild(eventOption);

  addEventForm.reset();
});

rsvpForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const selectedEvent = document.getElementById('rsvpEvent').value;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const attending = document.getElementById('attending').value;

  if (!selectedEvent || !name || !email || !attending) {
    rsvpMessage.textContent = "Please fill in all fields.";
    rsvpMessage.style.color = "red";
    return;
  }

  if (attending === "yes") {
    rsvpCounts[selectedEvent]++;
    document.getElementById(`count-${selectedEvent}`).textContent = `RSVP Count: ${rsvpCounts[selectedEvent]}`;
  }

  rsvpMessage.textContent = `Thank you, ${name}! Your RSVP for "${selectedEvent}" has been received. You are ${attending === "yes" ? "" : "not "}attending.`;
  rsvpMessage.style.color = "green";

  rsvpForm.reset();
});

eventList.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const eventName = e.target.getAttribute('data-event');
    if (confirm(`Are you sure you want to delete the event "${eventName}"?`)) {
      deleteEvent(eventName);
    }
  }
});
