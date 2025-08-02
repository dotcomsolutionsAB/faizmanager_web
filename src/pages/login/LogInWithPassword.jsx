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
import { useUser } from '../../UserContext';
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

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  // Load credentials from localStorage if "Remember Me" was checked
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
    // Dynamically validate the username
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: userName, password }),
        });

        const data = await response.json();

        if (data.success) {
          const { token, photo, currency, jamiat_id,  role,
            permissions,
            hof_count, access_role_id, ...userDetails } = data.data;

            console.log("Login", hof_count);
            
            console.log("Login", role)

          // Save the token and user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.data));
          localStorage.setItem('token', token); // Save the Bearer token separately
          localStorage.setItem('currency', JSON.stringify(currency)); // Save currency in localStorage
          localStorage.setItem('jamiat_id', jamiat_id);
          localStorage.setItem('role', role); // Save role
          localStorage.setItem('permissions', JSON.stringify(permissions)); // Save permissions
          localStorage.setItem('hof_count', hof_count); // Save hof_count
          localStorage.setItem('access_role_id', access_role_id);
          // console.log('Token saved in localStorage:', localStorage.getItem('token'));

           // Remember Me logic
           if (rememberMe) {
            localStorage.setItem('rememberedUserName', userName);
            localStorage.setItem('rememberedPassword', password);
          } else {
            localStorage.removeItem('rememberedUserName');
            localStorage.removeItem('rememberedPassword');
          }

          // Update UserContext with the token and user details
          updateUser(
            {
              ...userDetails,
              photo: photo || '/static/images/avatar-placeholder.png', // Default placeholder if null
              jamiat_id, 
              role,
              permissions,
              hof_count,
              access_role_id
            },
            token,
            currency,
            jamiat_id,
            role,
            permissions,
            hof_count ,
            access_role_id,
            // Include currency in the UserContext
          );
        

          setSnackbarMessage(data.message);
          setSnackbarSeverity(data.sucess);
          setSnackbarOpen(true);

          // Navigate to dashboard or another page
          navigate('/dashboard', { state: { username: data.data.name, snackbarMessage: data.message,
    snackbarSeverity: 'success', } });
        } else {
          throw new Error(data.message || 'Login failed');
        }
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
                            <Typography variant="h5" sx={{color: 'brown', textAlign: 'center'}}>
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
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
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
                          padding: 0, // Removes padding
                          border: 'none', // Removes border
                          background: 'none', // Removes background
                          color: yellow[200], // Set the color based on the theme
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
                control={<Checkbox checked={rememberMe}
                onChange={handleRememberMeChange} value="remember" color="primary" sx={{
                  transform: 'scale(0.8)',  // Scale down the checkbox size
                  [theme.breakpoints.down('sm')]: {
                    transform: 'scale(0.65)',  // Further scale down the checkbox on small screens
                  },
                }} />}
                label="Remember me"
                sx={{
                  flexGrow: 1,
                  m: 0,
                  fontSize: '0.9rem',  // Default font size
                  [theme.breakpoints.down('sm')]: {  // For small screens (mobile)
                    '& .MuiTypography-root': {  // Target Typography component for label
                      fontSize: '0.7rem ',  // Smaller font size with !important for small screens
                    },
                  },

                }}
              />
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/forgotpassword')}
                variant="body2"
                sx={{
                  alignSelf: 'center',
                  mt: 0,
                  fontSize: '0.9rem', // Default font size for larger screens
                  [theme.breakpoints.down('sm')]: {  // For small screens (mobile)
                    fontSize: '0.7rem', // Smaller font size for smaller screens
                  },
                  color: yellow[300], // Use yellow color from theme
                  '&:hover': {
                    color: yellow[400], // Hover color from theme
                  },
                }}
              >
                Forgot your password?
              </Link>
            </Box>
            {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx={{
                fontSize: '0.9rem',
                backgroundColor: yellow[400], // Apply yellow theme color
                '&:hover': {
                  backgroundColor: yellow[100], // Hover effect color
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
                color: yellow[300], // Access primary color from theme
                borderColor: yellow[300], // Access primary color from theme
                '&:hover': {
                  backgroundColor: yellow[200], // Hover color from theme
                  borderColor: '#e0d4b0', // Border color from theme
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
                  color: yellow[300], // Apply yellow color from theme
                  '&:hover': {
                    color: yellow[400], // Hover effect for yellow
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
           {/* Add the links section */}
  <Typography
    sx={{
      textAlign: 'center',
      color: theme.palette.text.secondary,
      fontSize: '0.5rem',
      mt: 2, // Add spacing from above content
      lineHeight: 1.5,
    }}
  >
    <Link href="/privacy-policy" sx={{ color: 'inherit', textDecoration: 'none' }}>
      Privacy Policy
    </Link>{' '}
    |{' '}
    <Link href="/cookies-policy" sx={{ color: 'inherit', textDecoration: 'none' }}>
      Cookies Policy
    </Link>{' '}
    |{' '}
    <Link href="/sms-in-out-policy" sx={{ color: 'inherit', textDecoration: 'none' }}>
      SMS In/Out Policy
    </Link>{' '}
    |{' '}
    <Link href="/mobile-license-agreement" sx={{ color: 'inherit', textDecoration: 'none' }}>
      Mobile License Agreement
    </Link>{' '}
    |{' '}
    <Link href="/terms-and-conditions" sx={{ color: 'inherit', textDecoration: 'none' }}>
      Terms & Conditions
    </Link>
  </Typography>
        </Card>
      </SignInContainer>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <Alert
    onClose={handleSnackbarClose}
    severity={snackbarSeverity}
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
    </AppTheme>
  );
}
