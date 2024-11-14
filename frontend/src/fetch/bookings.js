const API_URL = "http://localhost:8000/api";

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
