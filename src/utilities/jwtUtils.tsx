import { jwtDecode } from "jwt-decode";


// Function to check if the token is valid
export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false; // No token, so it's invalid

    try {
        // Decode the token to get the expiration time
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp) {
        const currentTime = Date.now() / 1000; // Current time in seconds
        return decodedToken.exp > currentTime; // Token is valid if it hasn't expired
        } else {
        return false; // If no expiration time is found, assume invalid
        }
    } catch (error) {
        console.error("Token decoding failed:", error);
        return false; // If there's an error in decoding, assume invalid
    }
};
