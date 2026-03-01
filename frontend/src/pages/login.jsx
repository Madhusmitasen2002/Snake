import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import api from '../api/axios';

import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  GitHub,
} from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('auth/login.php', {
        email: formData.email,
        password: formData.password,
      }); 
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        login(response.data.user);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              🐍 SnakeBite Manager
            </Typography>
            <Typography variant="h5" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
              <Link
                to="/forgot-password"
                style={{ textDecoration: 'none', color: '#667eea' }}
              >
                <Typography variant="body2">Forgot Password?</Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #5568d3 0%, #6a4293 100%)',
                },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
              >
                GitHub
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: '#667eea',
                  fontWeight: 600,
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}