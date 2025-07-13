// Login.tsx
import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  paper: {
    padding: '2rem',
    width: '300px',
    textAlign: 'center',
    elevation: 3,
  },
  inputField: {
    marginBottom: '1rem',
  },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/riders/login`, { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);  // Save token for future requests
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography>
          {error && <p className="error">{error}</p>}
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
            className={classes.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            className={classes.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '2rem' }} >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
