const form = document.getElementById('trip-form');
const tripsContainer = document.getElementById('trips-container');
const startBtn = document.querySelector('.hero .cta');
const addTripSection = document.getElementById('add-trip');

startBtn.addEventListener('click', function (e) {        // Smooth scroll to the add trip section when the "Start Your Journey" button is clicked 

  e.preventDefault();
  addTripSection.classList.add('visible');
  addTripSection.scrollIntoView({ behavior: 'smooth' });
}); 
// Load existing trips from localStorage, or start with an empty array
let trips = JSON.parse(localStorage.getItem('trips')) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const date = document.getElementById('date').value;
  const notes = document.getElementById('notes').value.trim();
  const coverImage = document.getElementById('coverImage').value.trim();

  if (!title || !destination || !date) {
    alert('Please fill in title, destination, and date.');
    return;
  }

  const newTrip = {
    id: Date.now(),
    title,
    destination,
    date,
    notes,
    coverImage
  };

  trips.push(newTrip);       // add new trip to the array
  saveTrips();                // save updated array to localStorage
  renderTrips();               // re-draw all trip cards on the page

  form.reset();
});

function saveTrips() {
  localStorage.setItem('trips', JSON.stringify(trips));
}

function renderTrips() {
  tripsContainer.innerHTML = ''; // clear current cards before re-drawing

  if (trips.length === 0) {
    tripsContainer.innerHTML = '<p class="empty-state">🗺️ Your journal is empty — add your first trip above to get started!</p>';
    return;
  }

  trips.forEach(trip => {
    const card = document.createElement('div');
    card.classList.add('trip-card');

    card.innerHTML = `
      ${trip.coverImage ? `<img src="${trip.coverImage}" alt="${trip.title}" />` : ''}
      <h3>${trip.title}</h3>
      <p class="trip-destination">${trip.destination}</p>
      <p class="trip-date">${trip.date}</p>
      <p class="trip-notes">${trip.notes}</p>
    `;

    tripsContainer.appendChild(card);
  });
}

renderTrips(); 