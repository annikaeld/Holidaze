# Holidaze

Holidaze is a responsive accommodation booking application built for the Noroff Project Exam 2. The goal is to help travellers discover places to stay, search for accommodation and view details about individual venues.

The application uses the Noroff Holidaze API.

**Project status:** Work in progress.

## Description

The project aims to provide an intuitive experience for browsing and booking accommodation. The completed application is intended to support both travellers and registered venue managers.

### Currently implemented

- Browse accommodation listings.
- Search venues by destination.
- Choose check-in and check-out dates and the number of guests.
- Filter results by guest capacity and overlapping bookings.
- Open individual venue pages.
- View venue images in a responsive gallery.
- Open an image modal with keyboard navigation.
- View formatted descriptions, amenities and host information.

### Under development

- Pagination across all venue results.
- Location information and interactive maps.
- Price and guest capacity on venue details pages.
- Booking functionality.
- User authentication.
- Venue management functionality.

## Features

- Responsive design for mobile and desktop.
- Destination search.
- Date-range selection.
- Guest count selection.
- Accommodation cards and detail pages.
- Responsive image galleries using Swiper.
- Expandable venue descriptions.
- Conditional amenity and host information.
- Loading and error handling.

## Tech Stack & Tools

- **React 19** – Component-based user interface.
- **TypeScript** – Static typing for components and API data.
- **Vite** – Development server and production build tool.
- **Tailwind CSS 4** – Utility-first CSS framework.
- **React Router** – Client-side navigation and URL search parameters.
- **TanStack Query** – Data fetching, caching and server-state management.
- **React DayPicker** – Date-range selection.
- **Swiper** – Responsive image galleries and modal navigation.
- **Lucide React** – Interface icons.
- **Leaflet** – Interactive map library.
- **React Leaflet** – React components for Leaflet maps.
- **OpenStreetMap** – Planned map tile provider.
- **ESLint** – Code-quality checks.
- **Git & GitHub** – Version control and project management.
- **Figma** – Interface design and planning.
- **Vercel** – Deployment and hosting.

**Note:** Leaflet and React Leaflet have been installed, but the map functionality is still under development.

## Setup

Clone the repository:

```bash
git clone https://github.com/annikaeld/Holidaze.git
```

Navigate to the project directory:

```bash
cd Holidaze
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Styling

The project uses Tailwind CSS 4 with the Vite plugin.

Global styles, design tokens, typography and reusable button styles are defined in:

`src/index.css`

The project uses semantic CSS variables to maintain consistent styling across components.

## Environment Variables & API

The application uses the public Noroff Holidaze API:

[Holidaze API](https://v2.api.noroff.dev/holidaze/venues)

Public venue browsing does not currently require an API key.

Authenticated functionality may require additional credentials when implemented.

If environment variables are introduced, client-facing variables must use the `VITE_` prefix.

**Never commit private credentials or secrets to the repository.**

## Usage

### Available npm scripts

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the development server                        |
| `npm run build`   | Run TypeScript checks and create a production build |
| `npm run preview` | Preview the production build                        |
| `npm run lint`    | Run ESLint                                          |

### ESLint

Check the project for linting issues:

```bash
npm run lint
```

### Dependency security

Check installed dependencies for known vulnerabilities:

```bash
npm audit
```

## Development

The project follows a feature-based folder structure.

Venue-related components, pages, API services, types and utilities are organised under:

`src/features/venues/`

### Routing

React Router handles navigation between:

- `/` – Home page.
- `/venues` – Accommodation listings and search results.
- `/venues/:id` – Individual venue details.

Search criteria are stored in URL query parameters.

### Data fetching

TanStack Query manages API requests, caching and loading/error states.

### Image galleries

Swiper provides responsive image navigation.

The gallery includes:

- Mobile image carousel.
- Desktop image grid.
- Modal for viewing images.
- Keyboard navigation.
- Image fallbacks.

### Venue descriptions

Descriptions are formatted to handle HTML content and line breaks returned by the API.

Long descriptions can be expanded or collapsed using **Show more / Show less**.

### Location data

The Holidaze API may return incomplete location information, including `null` coordinates.

The application must handle missing location data and avoid displaying misleading map positions.

## Current
