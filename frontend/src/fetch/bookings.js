const API_URL = "http://localhost:3000/api";

export const postBooking = async (bookingData) => {
  try {
    const response = await fetch(API_URL + "/bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create booking");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkAvailability = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error("Failed to check availability");
  }

  const data = await response.json();
  return data.available;
};
