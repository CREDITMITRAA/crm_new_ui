import axios from "axios";
import { BASE_URL } from "../utilities/AppConstants";

const PublicAxios = axios.create({
    baseURL:BASE_URL,
    headers: {
        "Content-Type": "application/json",
      },
})

export default PublicAxios