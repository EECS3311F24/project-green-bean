const API_URL = "http://localhost:8000/api";

const fetchArenas = async () => {
  try {
    const response = await fetch(`${API_URL}/arenas/available`); // fetch only the available arenas and not the booked ones
    if (!response.ok) {
      throw new Error("Failed to fetch arenas");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { fetchArenas };
