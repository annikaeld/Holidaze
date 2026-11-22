import { expect, test } from "@playwright/test";

test.use({ timezoneId: "UTC" });

test("confirms a booking with the selected dates and guests", async ({ page }) => {
  const api = "https://v2.api.noroff.dev/holidaze";
  const venueId = "00000000-0000-4000-8000-000000000001";
  const venue = {
    id: venueId,
    name: "Test cabin",
    description: "A cabin for the booking test.",
    price: 500,
    maxGuests: 4,
    rating: 0,
    media: [],
    bookings: [],
    meta: { wifi: true, parking: false, breakfast: false, pets: false },
    location: { city: "Bergen", country: "Norway", lat: null, lng: null },
  };

  await page.addInitScript(() => {
    localStorage.setItem(
      "holidaze-auth",
      JSON.stringify({
        name: "testguest",
        email: "testguest@example.com",
        accessToken: "test-token",
        venueManager: false,
      }),
    );
  });

  await page.route(`${api}/venues/${venueId}*`, (route) =>
    route.fulfill({ json: { data: venue } }),
  );

  await page.route(`${api}/bookings`, async (route) => {
    await route.fulfill({
      status: 201,
      json: {
        data: {
          id: "test-booking",
          dateFrom: "2035-06-10T00:00:00.000Z",
          dateTo: "2035-06-12T00:00:00.000Z",
          guests: 2,
        },
      },
    });
  });

  await page.goto(
    `/venues/${venueId}?checkIn=2035-06-10&checkOut=2035-06-12&guests=2`,
  );

  await page.getByRole("button", { name: "Reserve", exact: true }).click();

  await expect(page).toHaveURL(/\/booking\/summary\?/);
  await expect(page.getByText("2 nights × NOK 500")).toBeVisible();
  await expect(page.getByText("NOK 1,000", { exact: true })).toBeVisible();

  const bookingRequest = page.waitForRequest(
    (request) => request.url() === `${api}/bookings` && request.method() === "POST",
  );

  await page.getByRole("button", { name: "Confirm booking" }).click();

  expect((await bookingRequest).postDataJSON()).toEqual({
    venueId,
    dateFrom: "2035-06-10T00:00:00.000Z",
    dateTo: "2035-06-12T00:00:00.000Z",
    guests: 2,
  });

  await expect(
    page.getByRole("heading", { name: "Booking Successful" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Booking details" }),
  ).toContainText("Test cabin");
});