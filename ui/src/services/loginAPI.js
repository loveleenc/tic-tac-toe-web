import axios from "axios";

const baseUrl = '/api/login'

const loginToGame = (username, password) => {
    const loginData = {
        username: username,
        password: password
    }
    return axios.post(baseUrl, loginData)
}

export default {
    loginToGame
}