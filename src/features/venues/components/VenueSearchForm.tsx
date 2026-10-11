export function VenueSearchForm() {
  return (
    <form action="/venues" method="get">
      <label htmlFor="destination">Where?</label>
      <input type="search" id="destination" name="destination" />
      <label htmlFor="check-in">Check-in</label>
      <input type="date" id="check-in" name="checkIn" />
      <label htmlFor="check-out">Check-out</label>
      <input type="date" id="check-out" name="checkOut" />
      <label htmlFor="guests">Guests</label>
      <input type="number" id="guests" name="guests" min={1} defaultValue={1} />
      <button type="submit">Search</button>
    </form>
  );
}
