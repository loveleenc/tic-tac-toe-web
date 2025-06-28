import axios from 'axios';

const baseUrl = '/users/scores';

const getScores = () => {
    return axios.get(baseUrl);
}

export default {
    getScores
}