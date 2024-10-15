import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number; // JWT expiration timestamp (in seconds)
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token to get its payload
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if token has expired
        if (decoded.exp && decoded.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token'); // Remove expired token
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error decoding token', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
