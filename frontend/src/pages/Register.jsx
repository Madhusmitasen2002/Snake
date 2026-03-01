import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2f3646",
    },
    secondary: {
      main: "#0e0d1d",
    },
    error: {
      main: "#ef4444",
    },
    background: {
      default: "#03070a",
      paper: "#3b3d3d",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      background: "linear-gradient(to right, #303a4f, #4f46e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "0.5rem",
    },
    body2: {
      color: "#3a5b88",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#d6d6d6",
            borderRadius: "0.5rem",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#d2d5d8",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& fieldset": {
                borderColor: "#40495c",
                borderWidth: 2,
              },
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderWidth: 2,
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "12px 4px",
            fontWeight: 500,
          },
          "& .MuiInputAdornment-positionStart": {
            marginRight: "8px",
            color: "#94a3b8",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          borderRadius: "0.5rem",
          padding: "12px 16px",
          transition: "all 0.2s",
        },
         contained: {
          background: "linear-gradient(to right, #25272c, #0c321e)",
          "&:hover": {
            background: "linear-gradient(to right, #3e4454, #184134)",
            boxShadow: "0 10px 25px rgba(10, 49, 38, 0.3)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
      },
    },
  },
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await api.post("auth/register.php", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.status === true) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #202423, #1c5142, #023e1d)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: 80,
            right: 80,
            width: 288,
            height: 288,
            background: "#c9febf",
            borderRadius: "50%",
            filter: "blur(96px)",
            opacity: 0.2,
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: 80,
            width: 288,
            height: 288,
            background: "#c7d2fe",
            borderRadius: "50%",
            filter: "blur(96px)",
            opacity: 0.2,
            animation: "pulse 4s ease-in-out infinite 2s",
          }}
        />

        {/* Form Container */}
        <Box sx={{ position: "relative", width: "100%", maxWidth: 400, zIndex: 10 }}>
          {/* Main Form */}
          <Box
            sx={{
              background: "rgba(168, 193, 184, 0.95)",
              backdropFilter: "blur(8px)",
              borderRadius: "1rem",
              boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)",
              padding: 4,
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h2">Create Account</Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                Join us today and get started
              </Typography>
            </Box>

            {/* Success Message */}
            {successMessage && (
              <Alert
                severity="success"
                icon={<CheckCircle2 size={20} />}
                sx={{
                  mb: 3,
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                  borderRadius: "0.5rem",
                  animation: "slideIn 0.3s ease-out",
                  "& .MuiAlert-message": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  },
                }}
              >
                {successMessage}
              </Alert>
            )}

            {/* Error Message */}
            {errorMessage && (
              <Alert
                severity="error"
                icon={<AlertCircle size={20} />}
                sx={{
                  mb: 3,
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  borderRadius: "0.5rem",
                  animation: "slideIn 0.3s ease-out",
                  "& .MuiAlert-message": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  },
                }}
              >
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Name Field */}
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={!!errors.name}
                helperText={errors.name}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} />
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                inputProps={{ minLength: 8 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        disabled={isLoading}
                        sx={{ color: "#64748b" }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                        disabled={isLoading}
                        sx={{ color: "#64748b" }}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Box>

            {/* Sign In Link */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none", color: "#2563eb", fontWeight: 500 }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Footer text */}
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: "center", mt: 3, color: "#94a3b8" }}
          >
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ThemeProvider>
  );
}