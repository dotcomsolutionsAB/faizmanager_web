import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';
import AppTheme from '../../styles/AppTheme';
import bg1 from '../../assets/bg1.jpg';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { yellow } from '../../styles/ThemePrimitives';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import Visibility icons
import { InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import { useUser } from '../../contexts/UserContext';
import fmb52 from '../../assets/fmb52.png';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(1),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  [theme.breakpoints.down('sm')]: {
    alignSelf: 'flex-start',
    margin: '0',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  backgroundColor: yellow[50],
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  backgroundImage: `url(${bg1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  fontFamily: theme.typography.fontFamily, // Applying Poppins font
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function LogInWithPassword(props) {
  const theme = useTheme();
  const { updateUser } = useUser(); // To update UserContext
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();



  React.useEffect(() => {
    const savedUserName = localStorage.getItem('rememberedUserName');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedUserName && savedPassword) {
      setUserName(savedUserName);
      setPassword(savedPassword);
      setRememberMe(true); // Automatically check Remember Me
    }
  }, []);

  const handleOtpClick = () => {
    navigate('/login-with-otp', { state: { userName } });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSignUpClick = () => {
    navigate('/sign-up');
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value.trim();
    setUserName(value);
    if (!value) {
      setUserNameError(true);
      setUserNameErrorMessage('Please enter a valid username.');
    } else {
      setUserNameError(false);
      setUserNameErrorMessage('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value.trim();
    setPassword(value);

    // Dynamically validate the password
    if (!value || value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the password visibility
  };

  const validateInputs = () => {
    let isValid = true;

    if (!userName) {
      setUserNameError(true);
      setUserNameErrorMessage('Please enter a valid username.');
      isValid = false;
    } else {
      setUserNameError(false);
      setUserNameErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (validateInputs()) {
    try {
      const response = await fetch('https://api.fmb52.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.success) throw new Error(data.message || 'Login failed');

      const {
        token,
        photo,
        currency,
        jamiat_id,
        role,           // string like "mumeneen"
        permissions,    // top-level permissions (fallback)
        hof_count,
        access_role_id, // top-level access role id (ignore for default selection)
        roles,          // array of role objects
        ...userDetails
      } = data.data;

      // --- ✅ Use access_role_id from the roles array (not id) ---
      const selectedRole = Array.isArray(roles) && roles.length > 0 ? roles[0] : null;
      const selectedAccessRoleId = selectedRole?.access_role_id ?? null; // <— use access_role_id
      const effectivePermissions = selectedRole?.permissions ?? permissions ?? [];
      const effectiveAccessRoleId = selectedAccessRoleId; // clearer alias

      console.log("Selected access_role_id:", effectiveAccessRoleId);
      console.log("Top-level access_role_id (ignored for default):", access_role_id);

      // Persist base auth/user data
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('token', token);
      localStorage.setItem('currency', JSON.stringify(currency));
      localStorage.setItem('jamiat_id', jamiat_id);
      localStorage.setItem('role', role);
      localStorage.setItem('permissions', JSON.stringify(effectivePermissions));
      localStorage.setItem('hof_count', hof_count);

      // --- ✅ Persist the selected access_role_id from the chosen role ---
      if (effectiveAccessRoleId !== null && effectiveAccessRoleId !== undefined) {
        localStorage.setItem('access_role_id', effectiveAccessRoleId);
      } else {
        localStorage.removeItem('access_role_id');
      }

      // Remember Me
      if (rememberMe) {
        localStorage.setItem('rememberedUserName', userName);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedUserName');
        localStorage.removeItem('rememberedPassword');
      }

      // ---- Update UserContext ----
      updateUser(
        {
          ...userDetails,
          photo: photo || '/static/images/avatar-placeholder.png',
          jamiat_id,
          role, // keep the readable role string from API
          permissions: effectivePermissions,
          hof_count,
          access_role_id: effectiveAccessRoleId, // 👈 store access role id in user object too (optional)
          roles, // full roles array
        },
        token,                   // newToken
        currency,                // newCurrency
        jamiat_id,               // newJamiatId
        role,                    // newRole (string label)
        effectivePermissions,    // newPermissions
        hof_count,               // newHofCount
        effectiveAccessRoleId,   // newAccessRoleId  👈 IMPORTANT
        roles                    // newRoles
      );

      setSnackbarMessage(data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      navigate('/dashboard', {
        state: { username: data.data.name, snackbarMessage: data.message, snackbarSeverity: 'success' }
      });
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }
};



  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box
            component="img"
            src={fmb52}
            alt="Logo"
            sx={{
              width: 'auto',
              height: 130,
              margin: '0 auto'
            }}
          />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: 'brown', textAlign: 'center' }}>
              FAIZ-UL-MAWAID-IL-BURHANIYAH
            </Typography>
            <FormControl variant="outlined">
              <TextField
                error={userNameError}
                helperText={userNameErrorMessage}
                id="userName-basic"
                type="text"
                name="userName"
                autoComplete="userName"
                autoFocus
                required
                fullWidth
                label="Username"
                variant="outlined"
                color={userNameError ? 'error' : 'primary'}
                value={userName}
                onChange={handleUserNameChange}
                InputProps={{
                  sx: {
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                label="Password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                  sx: {
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        sx={{
                          padding: 0,
                          border: 'none',
                          background: 'none',
                          color: yellow[200],
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={handleRememberMeChange} value="remember" color="primary" />}
                label="Remember me"
              />
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/forgotpassword')}
                variant="body2"
                sx={{
                  alignSelf: 'center',
                  fontSize: '0.9rem',
                  color: yellow[300],
                  '&:hover': {
                    color: yellow[400],
                  },
                }}
              >
                Forgot your password?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx={{
                fontSize: '0.9rem',
                backgroundColor: yellow[400],
                '&:hover': {
                  backgroundColor: yellow[100],
                  color: '#000',
                },
              }}
            >
              Sign in
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleOtpClick}
              sx={{
                fontSize: '0.9rem',
                color: yellow[300],
                borderColor: yellow[300],
                '&:hover': {
                  backgroundColor: yellow[200],
                  borderColor: '#e0d4b0',
                  color: '#000',
                },
              }}
            >
              Sign in with OTP
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                component="button"
                onClick={handleSignUpClick}
                variant="body2"
                sx={{
                  alignSelf: 'center',
                  color: yellow[300],
                  '&:hover': {
                    color: yellow[400],
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
