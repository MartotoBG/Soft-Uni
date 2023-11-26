const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://us-central1-car-shop-6b1fb.cloudfunctions.net/api';

const login = async (values) => {
    const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(values)
    });
    const result = await response.json();
    return result;
}

const register = async (values) => {
    const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(values)
    });
    const result = await response.json();
    return result;
}

const getProfileInfo = async (id) => {
    const response = await fetch(`${baseUrl}/user/${id}`);
    const result = await response.json();
    return result
}
export { login, register, getProfileInfo };