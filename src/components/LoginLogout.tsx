import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { isTokenValid } from '../utilities/jwtUtils';

interface LoginStatusProps {
  onLogin: () => void;
  onLogout: () => void;
  background?: 'light' | 'dark'; // Optional prop to determine the background
}

const LoginStatus: React.FC<LoginStatusProps> = ({ onLogin, onLogout, background = 'light' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);

      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      setExpirationTime(new Date(payload.exp * 1000));
    } else {
      setIsAuthenticated(false);
      setExpirationTime(null);
    }
  };

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      onLogout();
    } else {
      onLogin();
    }
  };

  useEffect(() => {
    checkToken();

    // Check token expiration every minute
    const interval = setInterval(() => {
      checkToken();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const textColor = background === 'dark' ? 'white' : 'black';

  return (
    <Tooltip
      title={
        isAuthenticated && expirationTime
          ? `Login valid until ${expirationTime.toLocaleString()}`
          : 'You are not logged in'
      }
      onMouseEnter={checkToken} // Refresh the tooltip on hover
    >
      <Button
        onClick={handleLoginLogout}
        sx={{
          color: textColor,
          fontSize: '1rem',
        }}
      >
        {isAuthenticated ? 'Log out' : 'Login'}
      </Button>
    </Tooltip>
  );
};

export default LoginStatus;
