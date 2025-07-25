import axios from 'axios'

const baseUrl = '/account'

const sendAccountActivationRequest = (token, username) => {
    return axios.patch(`${baseUrl}/verifyAccount/${token}`, {username: username});
}

const createAccount = (username, password, name, email) => {
    const newAccount = {
        username: username,
        password: password,
        name: name,
        email: email
    }
    return axios.post(baseUrl, newAccount);
}


export default {
    sendAccountActivationRequest,
    createAccount
}