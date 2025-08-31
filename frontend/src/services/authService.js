import axios from 'axios';

const API_URL = 'http://localhost:5500/api/users/';

const signup = (username, email, password) => {
    return axios.post(API_URL + 'signup', {
        username,
        email,
        password,
    });
};

const login = (email, password) => {
    return axios.post(API_URL + 'login', {
        email,
        password,
    });
};

const getCurrentUser = (token) => {
    return axios.get(API_URL + 'current', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const verifyEmail = (token, code) => {
    return axios.get(`${API_URL}verify-email?token=${token}&code=${code}`);
};

const requestVerificationEmail = (email) => {
    return axios.post(API_URL + 'send-verification-email', {
        email,
    });
};


const authService = {
    signup,
    login,
    getCurrentUser,
    verifyEmail,
    requestVerificationEmail,
};

export default authService;
