import axios from "axios";

const baseUrl = '/logout'


const logout = () => {
    return axios.post(baseUrl);
}

export default {
    logout
}
