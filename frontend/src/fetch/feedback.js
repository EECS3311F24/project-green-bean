import axios from "axios";
const API_URL = "http://localhost:3000/api";

const fetchAllFeedback = async () =>{
    try {
        const response = await axios.get(`${API_URL}/feedback`); // fetch comments and raitings
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
        const response = await axios.get(`${API_URL}/feedback/${areanId}`); // fetch comments and raitings
        // const data = await response.json();
        const data = response.data;
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};

const postFeedback = async (feedbackData) => {
    try {
    //   const response = await axios.post(API_URL + "/feedback/", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(feedbackData),
    //   });
  
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || "Failed to create booking");
    //   }
  
    //   return await response.json();
    const response = await axios.post(`${API_URL}/feedback`, feedbackData); // Send feedback data
    return response.data; // Axios automatically parses JSON response
    } catch (error) {
      throw new Error(error.message);
    }
  };

export {fetchAllFeedback, fetchFeedback, postFeedback}