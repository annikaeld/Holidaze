# Holidaze

Holidaze is a responsive accommodation discovery and booking application developed for **Noroff Project Exam 2**.

The application allows travellers to discover accommodation, check availability and manage bookings. Registered venue managers can create, update and delete venues, as well as view upcoming guest bookings.

**Project status:** All core booking and venue management functionality has been implemented. Final testing, accessibility improvements and production polish are ongoing.

## Description

Holidaze aims to provide an intuitive accommodation booking experience for travellers and registered venue managers.

The application focuses on responsive design, clear navigation, reusable components and an accessible user experience across mobile and desktop devices.

### Implemented Functionality

**Accommodation discovery**

- Browse accommodation listings.
- Search venues by destination or name.
- Filter venues by region, price, amenities, guest capacity and availability.
- Sort venues by newest, price or rating.
- Navigate results using pagination.
- View venue details, images, amenities, ratings and host information.
- View venue locations on interactive maps when valid coordinates are available.

**Bookings**

- Select check-in and check-out dates.
- Select the number of guests.
- Validate booking availability and prevent overlapping reservations.
- Register, log in and log out.
- Preserve booking details when redirected to login.
- Review and edit booking information before confirmation.
- Create authenticated bookings through the Noroff Holidaze API.
- View booking confirmation details.
- View upcoming bookings in My Bookings.
- Cancel bookings with confirmation.
- Receive success and error notifications.

**Venue management**

- Upgrade an existing account to venue manager.
- View all venues owned by the logged-in manager.
- Create venues with images, descriptions, prices, amenities and location information.
- Preview venues before creating or updating them.
- Edit existing venues using a shared form.
- Delete owned venues with confirmation.
- View upcoming guest bookings across all managed venues.
- View customer names and avatars associated with bookings.
- Restrict venue management actions to authorised users.

**User experience**

- Responsive layouts for mobile and desktop.
- Light and dark mode.
- Loading and error states.
- Image fallbacks.
- Reusable booking and venue overview cards.
- Reusable confirmation dialogs.
- Theme-aware toast notifications.

## Tech Stack & Tools

- **React 19** – Component-based user interface.
- **TypeScript** – Static typing for components and API data.
- **Vite** – Development server and production build tool.
- **Tailwind CSS 4** – Utility-first CSS framework.
- **React Router** – Client-side navigation and URL search parameters.
- **TanStack Query** – Data fetching, caching and server-state management.
- **React Hook Form** – Form handling.
- **Zod** – Schema validation.
- **React DayPicker** – Date-range selection.
- **date-fns** – Date formatting and booking date calculations.
- **Swiper** – Responsive image galleries and modal navigation.
- **Lucide React** – Interface icons.
- **Leaflet** – Interactive maps.
- **React Leaflet** – React components for Leaflet.
- **OpenStreetMap** – Map tile provider.
- **Sonner** – Toast notifications.
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

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

The template sets `VITE_API_BASE` to `https://v2.api.noroff.dev`. Replace the `VITE_API_KEY` placeholder in `.env` with your Noroff API key.

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

The application uses the Noroff Holidaze API:

[Holidaze API](https://v2.api.noroff.dev/holidaze/venues)

Public venue browsing does not require authentication.

Authenticated requests use:

- The authenticated user's access token.
- A Noroff API key configured through `VITE_API_KEY`.

Authenticated operations include creating and cancelling bookings, updating user profiles, activating venue manager privileges and managing venues.

Vite exposes environment variables prefixed with `VITE_` to client-side code. These variables must not contain confidential server-side secrets.

For production deployments, configure the required environment variables in Vercel.

## Usage

### Test Accounts

The following accounts are provided for examiners and testers to explore the application without registering new users.

#### Customer Account

- **Email:** norofftest_8@stud.noroff.no
- **Password:** norofftest_8
- **Role:** Customer

This account can be used to:

- Browse and search venues.
- Create bookings.
- View upcoming bookings.
- Cancel bookings.
- Update profile information.
- Upgrade to venue manager.

#### Venue Manager Account

- **Email:** test_manager8@stud.noroff.no
- **Password:** test_manager8
- **Role:** Venue Manager

This account can be used to:

- Access My Venues.
- Create, edit and delete owned venues.
- Preview venues before saving.
- View upcoming guest bookings.
- Manage personal bookings as a customer.

**Note for testers:** These accounts are intended for testing purposes only. Please avoid changing passwords or deleting existing test data unless necessary for testing.

### Available npm Scripts

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the development server                        |
| `npm run build`   | Run TypeScript checks and create a production build |
| `npm run preview` | Preview the production build                        |
| `npm run lint`    | Run ESLint                                          |

### Code Quality

Check the project for linting issues:

```bash
npm run lint
```

Check installed dependencies for known vulnerabilities:

```bash
npm audit
```

## Project Structure

The project follows a feature-based folder structure.

Venue-related components, pages, API services, schemas, types and utilities are organised under:

`src/features/venues/`

Authentication-related functionality is organised under:

`src/features/auth/`

Shared components and reusable functionality are organised under:

`src/shared/`

### Reusable Components

Several components are reused across different parts of the application:

- **`OverviewCard`** – Displays venue and booking information in a consistent layout.
- **`VenueForm`** – Shared form for creating and editing venues.
- **`VenuePreviewDialog`** – Allows users to preview venue information before saving.
- **`ConfirmDialog`** – Shared confirmation dialog for cancelling bookings and deleting venues.
- **`PageMessage`** – Shared component for page-level loading, error and access messages.
- **`VenueImagePreview`** – Displays image previews when entering venue media URLs.
- **`Pagination`** – Shared page controls for Venues, My Venues, My Bookings and Guest Bookings. My Venues and both booking pages use `usePagination` to display up to five cards per page.

The goal is to reuse existing functionality where appropriate while keeping the code understandable and maintainable.

## Routing

React Router handles navigation between the application's pages.

| Route                 | Description                                |
| --------------------- | ------------------------------------------ |
| `/`                   | Home page                                  |
| `/venues`             | Accommodation listings and search results  |
| `/venues/:id`         | Individual venue details                   |
| `/register`           | User registration                          |
| `/login`              | User login                                 |
| `/booking/summary`    | Booking summary                            |
| `/booking/success`    | Successful booking confirmation            |
| `/my-bookings`        | Customer's upcoming bookings               |
| `/profile`            | User profile                               |
| `/list-venue`         | Become a venue manager                     |
| `/my-venues`          | Manager's venues                           |
| `/my-venues/create`   | Create a venue                             |
| `/my-venues/:id/edit` | Edit an owned venue                        |
| `/my-venues/bookings` | Upcoming guest bookings for managed venues |

Search criteria and booking information are passed between pages using URL search parameters where appropriate.

The booking confirmation page receives the completed booking through React Router navigation state. Refreshing the page without this state currently redirects to the home page.

### Authentication and Access Control

Users can register, log in and log out.

Authenticated users can access their personal booking information and update their profile, including their avatar.

Existing users can activate venue manager privileges without registering a separate account.

Venue management pages check authentication and manager privileges.

Editing a venue also checks that the logged-in manager owns the venue.

The Holidaze API provides server-side authorisation for protected operations.

## Accommodation Discovery

Travellers can browse and search for accommodation using destinations or venue names.

### Searching and Filtering

Search from the home page or refine your search directly on the Venues page. Search matches venue names, descriptions, cities, countries and continents.

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

### Venue Details

Individual venue pages display:

- Venue name and description.
- Image gallery.
- Price per night.
- Rating.
- Maximum guest capacity.
- Available amenities.
- Host information.
- Location information.
- Available booking dates.

Descriptions are formatted to handle HTML content and line breaks returned by the API.

Long descriptions can be expanded or collapsed using **Show more / Show less**.

### Image Galleries

Swiper provides responsive image navigation.

The gallery includes:

- Mobile image carousel.
- Desktop image grid.
- Modal image viewing.
- Keyboard navigation.
- Image fallbacks.

### Location Data

Venue locations are displayed using Leaflet and OpenStreetMap when valid coordinates are available.

The Holidaze API may return incomplete location information, including `null` coordinates.

The application handles missing location data and avoids displaying misleading map positions.

## Customer Bookings

### Creating a Booking

The booking process includes:

1. Selecting a venue.
2. Choosing available check-in and check-out dates.
3. Selecting the number of guests.
4. Logging in when authentication is required.
5. Reviewing the booking details.
6. Editing dates or guests if needed.
7. Confirming the booking.
8. Viewing the booking confirmation page.

Bookings are created through an authenticated `POST` request to the Holidaze API.

The request includes:

- `dateFrom`
- `dateTo`
- `guests`
- `venueId`

The submission button is disabled while the request is processing to prevent duplicate submissions.

### Booking Availability

The date picker prevents users from selecting unavailable nights.

Booking dates follow a check-in-inclusive and check-out-exclusive model.

This allows:

- Single-night stays.
- Checking out on another guest's check-in date.
- Bookings between existing reservations.
- Rejection of overlapping booking ranges.

Booking availability is validated before submission.

### Booking Confirmation

After a successful booking, the user is redirected to a confirmation page displaying:

- Confirmation message.
- Venue name and image.
- Check-in and check-out dates.
- Number of guests.
- Number of nights.
- Total price.

Failed requests display an error notification using Sonner.

### My Bookings

Authenticated users can view their upcoming bookings on the **My Bookings** page.

Bookings are displayed using reusable `OverviewCard` components.

Each booking card includes:

- Venue name and image.
- Check-in and check-out dates.
- Number of guests.
- Number of nights.
- Link to the venue.
- Option to cancel the booking.

Users must confirm cancellation through the shared `ConfirmDialog` component.

After successful cancellation, the booking list is refreshed automatically using TanStack Query.

## Venue Management

Registered venue managers can manage accommodation listings through **My Venues**.

### Become a Venue Manager

An authenticated user can activate venue manager privileges through the **Become a venue manager** page.

The existing account is updated through the Holidaze API.

After successful activation, the user can access venue management features without creating another account.

### My Venues

The My Venues page displays all venues owned by the logged-in manager.

Each venue is displayed using `OverviewCard` and includes:

- Venue name and image.
- Price per night.
- Maximum guest capacity.
- Link to view the public venue page.
- Link to edit the venue.
- Option to delete the venue.

The page includes a **Create venue** action and a link to **Guest bookings**.

When no venues exist, an empty state encourages the user to create their first listing.

Venue data is retrieved across multiple API pages when necessary.

### Create Venue

Venue managers can create accommodation listings through a validated form.

The form includes:

- Venue name.
- Description.
- Rating.
- Price per night.
- Maximum number of guests.
- Amenities: Wi-Fi, parking, breakfast and pets.
- Location: country, optional city or area, and optional street address.
- At least one image URL, with alt text for each image.

React Hook Form and Zod handle form state and validation.

Users can add, replace and remove image entries and view image previews.

A venue can be previewed before submission without creating a listing in the API.

After successful creation, the user is redirected to the new venue.

### Edit Venue

Venue managers can edit venues they own.

The Edit Venue page retrieves the existing venue information and pre-fills the shared `VenueForm`.

The same form fields, validation and preview functionality are used for both creation and editing.

Users can:

- Update venue information.
- Modify amenities and location details.
- Add, replace or remove images.
- Preview changes before saving.
- Cancel editing without saving.

Changes are saved through an authenticated `PUT` request.

After a successful update, TanStack Query refreshes the relevant venue data.

### Delete Venue

Venue managers can delete venues they own.

The Delete venue action is separated visually from View and Edit to reduce accidental selection.

Before deletion, users must confirm the action through the shared `ConfirmDialog`.

The application:

- Sends an authenticated `DELETE` request.
- Disables deletion actions while a request is pending.
- Displays success or error feedback using Sonner.
- Updates My Venues after successful deletion without requiring a manual refresh.

### Guest Bookings

Venue managers can access **Guest bookings** from My Venues.

This page is separate from My Bookings:

- **My Bookings** displays reservations made by the logged-in user as a guest.
- **Guest bookings** displays reservations made by customers at venues owned by the logged-in manager.

Guest bookings are retrieved through the manager's venues using `_bookings=true`.

This includes the associated booking and customer information without requiring separate customer API requests.

Bookings from all managed venues are combined into a single list.

Each booking card displays:

- Venue name and image.
- Check-in and check-out dates.
- Number of guests.
- Customer name and avatar.
- Link to the venue.

The same venue can appear multiple times when it has multiple bookings.

Only upcoming and ongoing bookings are displayed. Historical bookings are excluded.

Bookings are sorted by check-in date, with the earliest first.

An empty state is displayed when there are no upcoming guest bookings.

## Styling and Design

The project uses Tailwind CSS 4 with the Vite plugin.

Global styles, design tokens, typography and reusable component styles are defined in:

`src/index.css`

The application uses semantic CSS variables to maintain consistent styling across components.

### Light and Dark Mode

Holidaze supports light and dark themes.

Theme-specific colours are defined using CSS variables, allowing components to adapt without duplicating styling logic.

The design system includes semantic colours for:

- Backgrounds and surfaces.
- Text and headings.
- Borders and interactive states.
- Buttons and form controls.
- Calendar selections.
- Success and error feedback.

### Loading, Errors and Confirmation

TanStack Query manages API request states and caching.

The application uses:

- Loading states while data is being retrieved.
- Error messages when requests fail.
- Sonner notifications for successful and failed actions.
- Disabled submit buttons during pending mutations.
- Confirmation dialogs for destructive actions.

The shared `PageMessage` component provides consistent presentation for page-level loading and error messages where implemented.

## Development and Testing

Development follows an incremental approach, with features implemented and tested individually.

Testing includes:

- Form validation.
- Authentication and route protection.
- Booking availability.
- Venue creation and editing.
- Booking cancellation.
- Venue deletion and confirmation.
- API error handling.
- Empty states.
- Responsive layouts.
- Light and dark mode.
- Production builds.

Additional accessibility testing, UI consistency improvements and final production verification remain part of the finishing work.

## AI Usage

ChatGPT has been used as an external, chat-based assistant for technical guidance, concept clarification, code review, debugging and implementation discussions.

No AI coding assistants or AI extensions have been integrated into VS Code.

For further information, see [AI Usage Documentation](./AI_USAGE.md).
