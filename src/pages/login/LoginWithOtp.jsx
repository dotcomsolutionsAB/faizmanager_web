import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import AppTheme from '../../components/login/AppTheme';
import fmbLogo1 from '../../assets/fmbLogo1.png';
import bg1 from '../../assets/bg1.jpg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import Dashboard from '../dashboard/index';
import { useUser } from '../../UserContext';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
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
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  backgroundImage: `url(${bg1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LogInWithPassword(props) {
  const { updateUser } = useUser();
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(Array(4).fill('')); // Array to store OTP digits
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const inputRefs = useRef([]); // Ref array for OTP input fields
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.userName) {
      setUserName(location.state.userName);
    }
  }, [location.state?.userName]);

  const handlePasswordClick = () => {
    navigate('/', { state: { userName } });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) { // Only allow numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };


  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInputs()) {
      handleSendOtp();
    }
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   if (validateInputs()) {
  //     setShowOtpInput(true);
  //     setSnackbarMessage('OTP sent successfully');
  //     setSnackbarSeverity('success');
  //     setSnackbarOpen(true);

  //     // Focus on the first OTP input field
  //     setTimeout(() => {
  //       if (inputRefs.current[0]) {
  //         inputRefs.current[0].focus();
  //       }
  //     }, 0);
  //   }
  // };

  const handleSendOtp = async () => {
    try {
      const response = await fetch('https://faiz.dotcombusiness.in/api/get_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });
      const data = await response.json();
      if (data.message === 'User has not registered!') {
        setUserNameError(true);
        setUserNameErrorMessage('Invalid username');
        setSnackbarMessage('Invalid username');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setShowOtpInput(false); // Do not show OTP input
      } else if (data.message === 'Otp send successfully!') {
        setShowOtpInput(true);
        setSnackbarMessage(data.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleResendOtp = () => {
    setSnackbarMessage('OTP resent successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleVerifyOtp = async () => {
    try {
      const otpCode = otp.join('');
      const response = await fetch(`https://faiz.dotcombusiness.in/api/login/${otpCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });
  
      const data = await response.json();
      if (data.success) {
        const token = data.data.token; // Extract the Bearer token from the response
  
        // Save the token and user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.data));
        localStorage.setItem('token', token); // Save the Bearer token separately
        console.log(token)
        console.log('Token saved in localStorage:', localStorage.getItem('token'));
        // Update UserContext with the token and user details
        updateUser({ ...data.data, token });
        // window.location.reload();
  
        setSnackbarMessage(data.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
  
        // Navigate to dashboard or another page
        navigate('/dashboard', { state: { username: data.data.name } });
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  


  const validateInputs = () => {
    if (!userName) {
      setUserNameError(true);
      setUserNameErrorMessage('Please enter a valid username.');
      return false;
    }
    setUserNameError(false);
    setUserNameErrorMessage('');
    return true;
  };

  
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box
            component="img"
            src={fmbLogo1}
            alt="Logo"
            sx={{
              width: 190,
              height: 80,
              margin: '0 auto',
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
            <FormControl>
              <TextField
                error={userNameError}
                helperText={userNameErrorMessage}
                id="userName"
                type="text"
                name="userName"
                label="Username"
                autoComplete="userName"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={userNameError ? 'error' : 'primary'}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                InputProps={{
                  sx: {
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              />
            </FormControl>
            {showOtpInput && (
              <>
                <FormControl>
                  <FormLabel htmlFor="otp">Enter OTP</FormLabel>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        value={digit}

                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        inputProps={{
                          maxLength: 1,
                          inputMode: 'numeric', // Show numeric keyboard on mobile
                          pattern: '[0-9]*', 
                          sx: {
                            width: '3rem',
                            textAlign: 'center',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </FormControl>
                <Button fullWidth variant="contained" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>
                <Button fullWidth variant="outlined" onClick={handleResendOtp}>
                  Resend OTP
                </Button>
                <Button fullWidth variant="outlined" onClick={handleResendOtp}>
                  Change Username
                </Button>
              </>
            )}
            {!showOtpInput && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={() => validateInputs()}
              >
                Send OTP
              </Button>
            )}
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handlePasswordClick}
            >
              Back to sign in with password
            </Button>
          </Box>
        </Card>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </SignInContainer>
    </AppTheme>
  );
}
