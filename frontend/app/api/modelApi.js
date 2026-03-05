import axios from "axios";

export const askQuestion = (data) => {
    return axios.post("http://localhost:8000/ask", data);
};