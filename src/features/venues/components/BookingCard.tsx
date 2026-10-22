interface BookingCardProps {
  price: number;
  checkIn?: string;
  checkOut?: string;
}

export function BookingCard({ price, checkIn, checkOut }: BookingCardProps) {
  const nights =
    checkIn && checkOut
      ? (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      : 0;
  const totalPrice =
    Number.isFinite(nights) && nights > 0 ? price * nights : null;
  return (
    <aside className="booking-card">
      <p>
        <strong>
          {totalPrice !== null
            ? totalPrice.toLocaleString("en-GB")
            : price.toLocaleString("en-GB")}
        </strong>
        {totalPrice !== null ? ` for ${nights} nights` : " / night"}
      </p>
    </aside>
  );
}
