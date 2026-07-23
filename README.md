# Wanderlog — A Personal Travel Journal

Wanderlog is a personal travel journal web app where you can log trips, attach photos, and revisit your travel memories — built as a 4-week frontend internship project for CodGen.

**Live demo:** [Add your deployed URL here once live]

![Homepage](web_images/homepage.png)

## Features

- **Add, edit, and delete trip entries** — title, destination, date, notes, and a cover photo
- **Photo uploads** with a live preview before saving, stored locally as Base64
- **Search and sort** your trips by date or title on the Destinations page
- **Trip detail view** — click any trip card to see the full entry in a modal
- **Public profile page** — a shareable, read-only view of a traveler's trips, reachable via a URL like `profile.html?user=yourname`
- **Editable profile** — set your name, bio, and profile photo
- **Fully responsive** — works across mobile, tablet, and desktop
- **Persistent data** — everything is saved in the browser's localStorage, so your trips are still there after a refresh

![Destinations page](web_images/destinations.png)

![Trip detail view](web_images/trip_modal.png)

![Profile page](web_images/profile.png)

## Tech Stack

- **HTML5** — semantic markup throughout
- **CSS3** — custom design system (CSS variables, Flexbox, Grid, responsive breakpoints)
- **Vanilla JavaScript** — no frameworks or libraries
- **Web APIs used:**
  - `FileReader` — for photo upload previews and Base64 conversion
  - `localStorage` — for persisting trips and profile data
  - `IntersectionObserver` — for scroll-triggered animations
  - `URLSearchParams` — for shareable profile links and edit/add routing

## Project Structure

```
wanderlog/
├── index.html          # Homepage — hero, about section, add trip form
├── destinations.html    # All trips — search, sort, detail view
├── profile.html         # Public/editable traveler profile
├── style.css            # All styling
├── script.js            # All app logic
└── web_images/          # README images
```

## Running It Locally

This is a static site with no build step or server required.

1. Clone the repo:
   ```bash
   git clone https://github.com/PratikshaaGaikwad/wonderlog.git
   ```
2. Open the folder in your code editor
3. Open `index.html` directly in your browser, **or** use a local server for the best experience (recommended, since some browsers restrict local file access for certain features):
   - In VS Code: install the "Live Server" extension, right-click `index.html`, select "Open with Live Server"

No dependencies to install — it's plain HTML, CSS, and JavaScript.

## What I Learned

This project was built across 4 weeks, going from a static HTML page to a full client-side app with CRUD functionality, file handling, and a deployed live site. Along the way I learned:

- Semantic HTML and building a consistent design system in CSS
- DOM manipulation and event delegation for dynamically rendered content
- Working with browser storage (localStorage) and its limitations
- Using FileReader and Base64 encoding to handle image uploads without a backend
- Debugging real issues like Git merge conflicts, CSS specificity, and cross-page state management
- Deploying a static site and writing documentation for other developers

## Author

Built by Pratiksha Gaikwad as part of the CodGen Frontend Internship program.
