import { BASE_URL_API } from "../constants/index";

const URL: string = `${BASE_URL_API}/user`;
//const URL = '/api/back-whatsapp-qr-app/user';


export const login = async (username: string, password: string) => {
    const loginData = {
        username: username,
        password: password,
        loginMode: "GGP_LOGIN",
    };

    try {
        const response = await fetch(`${URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const data = await response.json();
            return data; 
        } else {
            throw new Error('Error en la autenticación');
        }
    } catch (error) {
        console.error('Error al hacer login:', error);
        return null;
    }
};
