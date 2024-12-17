import axios from "axios";
const API_URL = "http://localhost:3000/api";

const fetchAllFeedback = async () =>{
    try {
        const response = await axios.get(`${API_URL}/feedback`); // fetch all comments and ratings
        if (!response.ok) {
          throw new Error("Failed to fetch arenas");
        }
        const data = response.data;
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};

const fetchFeedback = async (areanId) =>{
    try {
        const response = await axios.get(`${API_URL}/feedback/${areanId}`); // fetch comments and raitings based on arena id
        const data = response.data;
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};

const postFeedback = async (feedbackData) => {
    try {
    const response = await axios.post(`${API_URL}/feedback`, feedbackData); // Send feedback data to the URL for POST
    return response.data; // Axios automatically parses JSON response
    } catch (error) {
      throw new Error(error.message);
    }
  };

export {fetchAllFeedback, fetchFeedback, postFeedback}