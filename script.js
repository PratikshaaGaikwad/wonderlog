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

  const editingId = form.dataset.editingId;

  if (editingId) {
    // UPDATE existing trip
    const trip = trips.find(t => t.id === Number(editingId));
    trip.title = title;
    trip.destination = destination;
    trip.date = date;
    trip.notes = notes;
    trip.coverImage = coverImage;

    delete form.dataset.editingId; // clear edit mode
    showToast('✏️ Trip updated.'); 
  } else {
    
    const newTrip = {
      id: Date.now(),
      title,
      destination,
      date,
      notes,
      coverImage
    };
    trips.push(newTrip);
    showToast('✅Trip added successfully!');
  }
  document.getElementById('submit-btn').textContent = 'Add Trip'; // Reset button text after editing

  saveTrips();
  renderTrips();
  form.reset();
});
 
function saveTrips() {
  localStorage.setItem('trips', JSON.stringify(trips));
}

function renderTrips() {
  tripsContainer.innerHTML = ''; // clear current cards before re-drawing
  
   const tripsHeading = document.getElementById('trips-heading');
  tripsHeading.textContent = `My Trips ✈️ (${trips.length}) `;

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
  <p class="trip-destination">📍${trip.destination}</p>
  <p class="trip-date">📅 ${formatDate(trip.date)}</p>
  <p class="trip-notes">${trip.notes}</p>
  <div class="card-actions">
    <button class="edit-btn" data-id="${trip.id}">Edit</button>
    <button class="delete-btn" data-id="${trip.id}">Delete</button>
  </div>
`;

    tripsContainer.appendChild(card);
  });
}
function formatDate(dateString) {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric"
  };

  return new Date(dateString).toLocaleDateString("en-GB", options);
}
tripsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.dataset.id);
    const confirmDelete = confirm('Delete this trip permanently? This action cannot be undone.');

    if (confirmDelete) {
      trips = trips.filter(trip => trip.id !== id);
      saveTrips();
      renderTrips();
      showToast('🗑 Trip removed.'); 
    }
  }

  if (e.target.classList.contains('edit-btn')) {
    const id = Number(e.target.dataset.id);
    const trip = trips.find(t => t.id === id);

    // Pre-fill the form with this trip's existing data
    document.getElementById('title').value = trip.title;
    document.getElementById('destination').value = trip.destination;
    document.getElementById('date').value = trip.date;
    document.getElementById('notes').value = trip.notes;
    document.getElementById('coverImage').value = trip.coverImage;

    // Remember which trip we're editing
    form.dataset.editingId = id;
    document.getElementById('submit-btn').textContent = 'Update Trip';

    // Show the form and scroll to it
    addTripSection.classList.add('visible');
    addTripSection.scrollIntoView({ behavior: 'smooth' });
  }
});
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}


renderTrips(); 