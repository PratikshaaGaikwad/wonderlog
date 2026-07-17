const form = document.getElementById('trip-form');
const tripsContainer = document.getElementById('trips-container');
const startBtn = document.querySelector('.hero .cta');
const addTripSection = document.getElementById('add-trip');
const submitBtn = document.getElementById('submit-btn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const tripsHeading = document.getElementById('trips-heading');

let trips = JSON.parse(localStorage.getItem('trips')) || [];

// ---------- Hero "Start Your Journey" button (index.html only) ----------
if (startBtn && addTripSection) {
  startBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addTripSection.classList.add('visible');
    addTripSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- If arriving from an "Edit" click on destinations.html ----------
if (form) {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  if (editId) {
    const trip = trips.find(t => t.id === Number(editId));
    if (trip) {
      document.getElementById('title').value = trip.title;
      document.getElementById('destination').value = trip.destination;
      document.getElementById('date').value = trip.date;
      document.getElementById('notes').value = trip.notes;
      document.getElementById('coverImage').value = trip.coverImage;
      form.dataset.editingId = trip.id;
      if (submitBtn) submitBtn.textContent = 'Update Trip';
      addTripSection.classList.add('visible');
    }
  }
}

// ---------- Form submit: create or update (index.html only) ----------
if (form) {
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
      const trip = trips.find(t => t.id === Number(editingId));
      trip.title = title;
      trip.destination = destination;
      trip.date = date;
      trip.notes = notes;
      trip.coverImage = coverImage;
      delete form.dataset.editingId;
      showToast('✏️ Trip updated.');
    } else {
      trips.push({ id: Date.now(), title, destination, date, notes, coverImage });
      showToast('✅ Trip added successfully!');
    }

    if (submitBtn) submitBtn.textContent = 'Add Trip';
    saveTrips();
    renderTrips();
    form.reset();

    if (window.location.search.includes('edit=')) {
      window.history.replaceState({}, '', 'index.html'); // clean the URL
    }
  });
}

function saveTrips() {
  localStorage.setItem('trips', JSON.stringify(trips));
}

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
}

// ---------- Search + Sort logic (destinations.html only, but safe everywhere) ----------
function getVisibleTrips() {
  let result = [...trips]; // copy, so we don't mess up the original order

  if (searchInput && searchInput.value.trim()) {
    const query = searchInput.value.trim().toLowerCase();
    result = result.filter(trip =>
      trip.title.toLowerCase().includes(query) ||
      trip.destination.toLowerCase().includes(query)
    );
  }

  if (sortSelect) {
    const sortBy = sortSelect.value;
    if (sortBy === 'date-desc') result.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'date-asc') result.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'title-asc') result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'title-desc') result.sort((a, b) => b.title.localeCompare(a.title));
  }

  return result;
}

// ---------- Render trips (only runs if a trips-container exists on this page) ----------
function renderTrips() {
  if (!tripsContainer) return;

  if (tripsHeading) {
    tripsHeading.textContent = `Journey Log ✈️ (${trips.length})`;
  }

  const visibleTrips = getVisibleTrips();
  tripsContainer.innerHTML = '';

  if (trips.length === 0) {
    tripsContainer.innerHTML = '<p class="empty-state">🗺️ Your journal is empty — add your first trip to get started!</p>';
    return;
  }

  if (visibleTrips.length === 0) {
    tripsContainer.innerHTML = '<p class="empty-state">🔍 No trips match your search.</p>';
    return;
  }

  visibleTrips.forEach(trip => {
    const card = document.createElement('div');
    card.classList.add('trip-card');
    card.innerHTML = `
      ${trip.coverImage ? `<img src="${trip.coverImage}" alt="${trip.title}" />` : ''}
      <h3>${trip.title}</h3>
      <p class="trip-destination">📍 ${trip.destination}</p>
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

if (searchInput) searchInput.addEventListener('input', renderTrips);
if (sortSelect) sortSelect.addEventListener('change', renderTrips);

// ---------- Edit / Delete (event delegation, works on whichever page has the grid) ----------
if (tripsContainer) {
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
      if (form) {
        // We're already on the page with the form — edit in place
        const trip = trips.find(t => t.id === id);
        document.getElementById('title').value = trip.title;
        document.getElementById('destination').value = trip.destination;
        document.getElementById('date').value = trip.date;
        document.getElementById('notes').value = trip.notes;
        document.getElementById('coverImage').value = trip.coverImage;
        form.dataset.editingId = id;
        if (submitBtn) submitBtn.textContent = 'Update Trip';
        addTripSection.classList.add('visible');
        addTripSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // No form on this page (destinations.html) — send to index.html to edit
        window.location.href = `index.html?edit=${id}`;
      }
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

initScrollAnimations();
renderTrips();
renderTrips();