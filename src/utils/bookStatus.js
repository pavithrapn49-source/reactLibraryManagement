export const getBookStatus = (book, borrowRecords = []) => {
  // If copies available → available
  if (book.availableCopies > 0) {
    return "available";
  }

  // Check if any reservation exists
  const hasReservation = borrowRecords.some(
    (b) => b.status === "reserved"
  );

  if (hasReservation) {
    return "reserved";
  }

  return "borrowed";
};