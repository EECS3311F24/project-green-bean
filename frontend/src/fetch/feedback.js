const API_URL = "http://localhost:3000/api";

const fetchAllFeedback = async () =>{
    try {
        const response = await fetch(`${API_URL}/feedback`); // fetch comments and raitings
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

const fetchFeedback = async ( areanId) =>{
    try {
        const response = await fetch(`${API_URL}/feedback/${areanId}`); // fetch comments and raitings
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

const postFeedback = async (feedbackData) => {
    try {
      const response = await fetch(API_URL + "/feedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
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

export {fetchAllFeedback, fetchFeedback, postFeedback}