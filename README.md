# Holidaze

Holidaze is a responsive accommodation discovery and booking application developed for Noroff Project Exam 2.

The application allows travellers to search for accommodation, explore venues, check availability and create bookings using the Noroff Holidaze API.

**Project status:** Work in progress. The traveller booking flow is implemented and deployed. Booking management and venue management functionality are still under development.

## Description

Holidaze aims to provide an intuitive accommodation booking experience for travellers and registered venue managers.

The application focuses on responsive design, clear navigation and an accessible user experience across mobile and desktop devices.

### Currently Implemented

- Browse accommodation listings.
- Search venues by destination or name.
- Filter venues by region, price range, amenities, guest capacity and availability.
- Sort venues by newest, price or rating.
- Navigate through venue results using pagination.
- Select check-in and check-out dates.
- Select the number of guests.
- View individual venue pages with descriptions, images, amenities and host information.
- View pricing, ratings and guest capacity.
- Explore responsive image galleries with modal viewing and keyboard navigation.
- View venue locations on interactive maps when valid coordinates are available.
- Register, log in and log out.
- Preserve booking details when redirected to login.
- Review and edit booking information before confirmation.
- Create authenticated bookings through the Noroff Holidaze API.
- Prevent overlapping bookings while allowing adjacent stays and single-night bookings.
- Display a booking confirmation page with venue details, dates, guests and total price.
- Handle booking errors using toast notifications.
- Switch between light and dark themes.

### Under Development

- My Bookings page for viewing upcoming and previous bookings.
- Venue management functionality for registered venue managers.
- Viewing bookings associated with managed venues.
- Further accessibility improvements, testing and production polish.

## Features

- Responsive design for mobile and desktop.
- Destination and accommodation search.
- Advanced filtering and sorting.
- Pagination.
- Date-range selection with availability validation.
- Guest count selection.
- Accommodation cards and detailed venue pages.
- Responsive image galleries using Swiper.
- Interactive maps using Leaflet.
- Expandable venue descriptions.
- Conditional amenity and host information.
- User registration and authentication.
- Authenticated booking creation.
- Editable booking summary.
- Booking confirmation page.
- Loading states and error handling.
- Prevention of duplicate submissions during booking requests.
- Theme-aware success and error notifications.
- Light and dark mode.

## Tech Stack & Tools

- **React 19** – Component-based user interface.
- **TypeScript** – Static typing for components and API data.
- **Vite** – Development server and production build tool.
- **Tailwind CSS 4** – Utility-first CSS framework.
- **React Router** – Client-side navigation and URL search parameters.
- **TanStack Query** – Data fetching, caching and server-state management.
- **React DayPicker** – Date-range selection.
- **date-fns** – Date formatting and booking date calculations.
- **Swiper** – Responsive image galleries and modal navigation.
- **Lucide React** – Interface icons.
- **Leaflet** – Interactive map functionality.
- **React Leaflet** – React components for Leaflet maps.
- **OpenStreetMap** – Map tile provider.
- **Sonner** – Toast notifications for user feedback.
- **ESLint** – Code-quality checks.
- **Git & GitHub** – Version control and project management.
- **Figma** – Interface design and planning.
- **Vercel** – Deployment and hosting.

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

Create a `.env.local` file in the project root and add the API key required for authenticated requests:

```env
VITE_API_KEY=your_noroff_api_key
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

## Environment Variables & API

The application uses the public Noroff Holidaze API:

[Holidaze API](https://v2.api.noroff.dev/holidaze/venues)

Public venue browsing does not require authentication.

Authenticated booking requests use:

- The authenticated user's access token.
- A Noroff API key configured through `VITE_API_KEY`.

Vite exposes environment variables prefixed with `VITE_` to client-side code.

**Never store confidential server-side secrets in client-side environment variables or commit credentials to the repository.**

For production deployments, configure the required environment variables in Vercel.

## Usage

### Test Accounts

The following accounts are provided for examiners and testers to explore the application's functionality without registering new users.

#### Customer Account

- **Email:** norofftest_8@stud.noroff.no
- **Password:** norofftest_8
- **Role:** Customer

This account can be used to sign in and create bookings.

The My Bookings page is planned but has not yet been implemented.

#### Venue Manager Account

- **Email:** test_manager8@stud.noroff.no
- **Password:** test_manager8
- **Role:** Venue Manager

This account is intended for testing venue management functionality as it becomes available.

**Note for testers:** These accounts are intended for testing purposes only. Please avoid changing passwords or deleting existing test data.

### Available npm Scripts

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

### Dependency Security

Check installed dependencies for known vulnerabilities:

```bash
npm audit
```

## Styling

The project uses Tailwind CSS 4 with the Vite plugin.

Global styles, design tokens, typography and reusable component styles are defined in:

`src/index.css`

The application uses semantic CSS variables to maintain consistent styling across components.

### Light and Dark Mode

Holidaze supports light and dark themes.

Theme-specific colors are defined using CSS variables, allowing components to adapt without duplicating styling logic.

The design system includes semantic colors for:

- Backgrounds and surfaces.
- Text and headings.
- Borders and interactive states.
- Buttons and form controls.
- Calendar selections.
- Success and error feedback.

## Development

The project follows a feature-based folder structure.

Venue-related components, pages, API services, types and utilities are organised under:

`src/features/venues/`

Authentication-related functionality is organised under:

`src/features/auth/`

### Routing

React Router handles navigation between:

| Route              | Description                               |
| ------------------ | ----------------------------------------- |
| `/`                | Home page                                 |
| `/venues`          | Accommodation listings and search results |
| `/venues/:id`      | Individual venue details                  |
| `/register`        | User registration                         |
| `/login`           | User login                                |
| `/booking/summary` | Booking summary and confirmation          |
| `/booking/success` | Successful booking confirmation           |

Search criteria and booking details are passed between pages using URL search parameters.

The booking confirmation page receives the completed booking through React Router navigation state. Refreshing the page without this state currently redirects to the home page.

Additional routes for booking history and venue management are planned.

### Data Fetching

TanStack Query manages API requests, caching and loading/error states.

The application uses queries for retrieving venue data and mutations for creating bookings.

### Searching and Filtering

Travellers can search for accommodation using destinations or venue names.

Available filters include:

- Region.
- Check-in and check-out dates.
- Guest capacity.
- Minimum and maximum price.
- Wi-Fi.
- Parking.
- Breakfast.
- Pets allowed.

Results can be sorted by price, rating or creation date.

Pagination allows users to navigate large result sets.

Search and filter selections are maintained using URL search parameters.

### Booking Functionality

The booking process includes:

1. Selecting a venue.
2. Choosing available check-in and check-out dates.
3. Selecting the number of guests within the venue's capacity.
4. Logging in when authentication is required.
5. Reviewing the selected booking details.
6. Editing dates or guests if needed.
7. Confirming the booking.
8. Viewing the booking confirmation page.

Bookings are created through an authenticated `POST` request to the Holidaze API.

The request includes:

- `dateFrom`
- `dateTo`
- `guests`
- `venueId`

The booking submission button is disabled while the request is processing to prevent duplicate submissions.

### Booking Availability

The date picker prevents users from selecting unavailable nights.

Booking dates follow a check-in-inclusive and check-out-exclusive model.

This allows:

- Single-night stays.
- Checking out on another guest's check-in date.
- Bookings between existing reservations.
- Rejection of overlapping booking ranges.

Booking availability is validated before submission.

### Booking Confirmation and Error Handling

After a successful booking, the user is redirected to a dedicated confirmation page.

The page displays:

- Confirmation message.
- Venue name and image.
- Check-in and check-out dates.
- Number of guests.
- Number of nights.
- Total price.
- Navigation back to the home page.

Failed booking requests display an error notification using Sonner.

Notifications follow the application's light and dark color themes.

### Image Galleries

Swiper provides responsive image navigation.

The gallery includes:

- Mobile image carousel.
- Desktop image grid.
- Modal image viewing.
- Keyboard navigation.
- Image fallbacks.

### Venue Descriptions

Descriptions are formatted to handle HTML content and line breaks returned by the API.

Long descriptions can be expanded or collapsed using **Show more / Show less**.

### Location Data

Venue locations are displayed using Leaflet and OpenStreetMap.

The Holidaze API may return incomplete location information, including `null` coordinates.

The application handles missing location data and avoids displaying misleading map positions.

## AI Usage

ChatGPT has been used as an external, chat-based assistant for technical guidance, concept clarification, code review, debugging and implementation discussions.

No AI coding assistants or AI extensions have been integrated into VS Code.

For further information, see [AI Usage Documentation](./AI_USAGE.md).
