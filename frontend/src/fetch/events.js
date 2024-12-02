import axios from "axios";
const API_URL = "http://localhost:3000/api";

export const fetchEvents = async () =>{
    try {
        const response = await axios.get(`${API_URL}/events`); // fetch all comments and ratings
        
        const data = response.data;
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};

export const fetchTestEvents = async () =>{
    try {
        const response = await axios.get(`${API_URL}/testing`); // fetch all comments and ratings
        if (!response.ok) { 
          throw new Error("Failed to fetch events");
        }
        const data = response.data;
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};

export const postTestEvent = async (testData) =>{
    try {
        const response = await axios.post(`${API_URL}/events/testing`, testData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }); // Send feedback data to the URL for POST
        return response.data; // Axios automatically parses JSON response
    } catch (error) {
        throw new Error(error.message);
    }
};

export const postEvent = async (eventData) =>{
  try {
      const response = await axios.post(`${API_URL}/events/booking`, eventData,{
          headers: {
              "Content-Type": "multipart/form-data",
          },
      }); // Send feedback data to the URL for POST
      return response.data; // Axios automatically parses JSON response
  } catch (error) {
      throw new Error(error.message);
  }
};