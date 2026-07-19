const form = document.getElementById('trip-form');
const tripsContainer = document.getElementById('trips-container');
const startBtn = document.querySelector('.hero .cta');
const addTripSection = document.getElementById('add-trip');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const tripsHeading = document.getElementById('trips-heading');
const coverImageInput = document.getElementById('coverImage');
const imagePreview = document.getElementById('image-preview');
const tripModal = document.getElementById('trip-modal');
const modalClose = document.getElementById('modal-close');
let currentImageData = '';
let trips = JSON.parse(localStorage.getItem('trips')) || [];
// ---------- Modal logic (destinations.html only) ----------
function openTripModal(trip) {
  document.getElementById('modal-title').textContent = trip.title;
  document.getElementById('modal-destination').textContent = `📍 ${trip.destination}`;
  document.getElementById('modal-date').textContent = `📅 ${formatDate(trip.date)}`;
  document.getElementById('modal-notes').textContent = trip.notes || 'No notes added.';

  const modalImage = document.getElementById('modal-image');
  if (trip.coverImage) {
    modalImage.src = trip.coverImage;
    modalImage.style.display = 'block';
  } else {
    modalImage.style.display = 'none';
  }

  tripModal.classList.add('show');
}

if (modalClose) {
  modalClose.addEventListener('click', function () {
    tripModal.classList.remove('show');
  });
}

if (tripModal) {
  tripModal.addEventListener('click', function (e) {
    if (e.target === tripModal) {   // clicked the dark overlay, not the content box
      tripModal.classList.remove('show');
    }
  });
}
// ---------- Hero "Start Your Journey" button (index.html only) ----------
if (startBtn && addTripSection) {
  startBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addTripSection.classList.add('visible');
    addTripSection.scrollIntoView({ behavior: 'smooth' });
     if (cancelBtn) cancelBtn.style.display = 'inline-block';
  });
}
if (cancelBtn) {
  cancelBtn.addEventListener('click', function () {
    exitEditMode();
  });
}
function exitEditMode() {
  delete form.dataset.editingId;
  form.reset();
  currentImageData = '';
  imagePreview.style.display = 'none';
  submitBtn.textContent = 'Add Trip';
  cancelBtn.style.display = 'none';
  addTripSection.classList.remove('visible');   // NEW: hide the form section
  document.getElementById('hero') 
    ? document.getElementById('hero').scrollIntoView({ behavior: 'smooth' })
    : window.scrollTo({ top: 0, behavior: 'smooth' });   // NEW: go back to hero/top
}
//---------- Cover image preview (index.html only) ----------  
if (coverImageInput) {
  coverImageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      currentImageData = reader.result;
      imagePreview.src = currentImageData;
      imagePreview.style.display = 'block';
    };

    reader.readAsDataURL(file);
  });
}

// ---------- If arriving from an "Edit" click on destinations.html ----------
if (form) {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  const action = params.get('action');
  if (editId) {
    const trip = trips.find(t => t.id === Number(editId));
    if (trip) {
      document.getElementById('title').value = trip.title;
      document.getElementById('destination').value = trip.destination;
      document.getElementById('date').value = trip.date;
      document.getElementById('notes').value = trip.notes;
      if (trip.coverImage) {
  currentImageData = trip.coverImage;
  imagePreview.src = trip.coverImage;
  imagePreview.style.display = 'block';
}
      form.dataset.editingId = trip.id;
      if (submitBtn) submitBtn.textContent = 'Update Trip';
      if (cancelBtn) cancelBtn.style.display = 'inline-block';
      addTripSection.classList.add('visible');
      addTripSection.scrollIntoView({ behavior: 'smooth' });
    }
  }else if (action === 'add') {          
    addTripSection.classList.add('visible');
    addTripSection.scrollIntoView({ behavior: 'smooth' });
    if (cancelBtn) cancelBtn.style.display = 'inline-block';
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
    const coverImage = currentImageData;
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
    if (coverImage) {
      trip.coverImage = coverImage;
}
      delete form.dataset.editingId;
      showToast('✏️ Trip updated.');
    } else {
      trips.push({ id: Date.now(), title, destination, date, notes, coverImage });
      showToast('✅ Trip added successfully!');
    }

   saveTrips();
renderTrips();
exitEditMode();

  if (window.location.search.includes('edit=') || window.location.search.includes('action=')) {
  window.history.replaceState({}, '', 'index.html');
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

// ---------- Edit / Delete /click on trip(event delegation, works on whichever page has the grid) ----------
if (tripsContainer) {
  tripsContainer.addEventListener('click', function (e) {
    // NEW: open detail modal if the card itself was clicked (not a button)
  if (e.target.closest('.trip-card') && !e.target.closest('button')) {
    const card = e.target.closest('.trip-card');
    const id = Number(card.querySelector('.edit-btn').dataset.id);
    const trip = trips.find(t => t.id === id);
    if (trip) openTripModal(trip);
    return; 
  }
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
        if (trip.coverImage) {
  currentImageData = trip.coverImage;
  imagePreview.src = trip.coverImage;
  imagePreview.style.display = 'block';
}
        form.dataset.editingId = id;
        if (submitBtn) submitBtn.textContent = 'Update Trip';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
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
// ---------- Public Profile Page (profile.html only) ----------
const profileTripsContainer = document.getElementById('profile-trips-container');

if (profileTripsContainer) {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('user') || 'Traveler';

  document.getElementById('profile-name').textContent = username;
  document.getElementById('profile-trip-count').textContent = trips.length;

  if (trips.length === 0) {
    profileTripsContainer.innerHTML = '<p class="empty-state">🗺️ This traveler hasn\'t logged any trips yet.</p>';
  } else {
    trips.forEach(trip => {
      const card = document.createElement('div');
      card.classList.add('trip-card', 'fade-in');
      card.innerHTML = `
        ${trip.coverImage
          ? `<img src="${trip.coverImage}" alt="${trip.title}" onerror="this.style.display='none'" />`
          : ''}
        <h3>${trip.title}</h3>
        <p class="trip-destination">📍 ${trip.destination}</p>
        <p class="trip-date">📅 ${formatDate(trip.date)}</p>
        <p class="trip-notes">${trip.notes}</p>
      `;
      profileTripsContainer.appendChild(card);
    });
  }
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
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

initScrollAnimations();
renderTrips();