import axios from 'axios'

const baseUrl = '/account'

const sendAccountActivationRequest = (token, username) => {
    return axios.patch(`${baseUrl}/verifyAccount/${token}`, {username: username});
}

const requestResetPasswordEmail = (email) => {
    return axios.post(`${baseUrl}/reset`, {email: email});
}

const sendResetPasswordRequest = (token, password) => {
    return axios.patch(`${baseUrl}/resetPassword/${token}`, {password: password})
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
    createAccount,
    requestResetPasswordEmail,
    sendResetPasswordRequest
}