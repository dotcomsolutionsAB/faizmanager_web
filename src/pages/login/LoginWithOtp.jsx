import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import AppTheme from '../../styles/AppTheme';
// import fmbLogo1 from '../../assets/fmbLogo1.png';
import bg1 from '../../assets/bg1.jpg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import Dashboard from '../dashboard/index';
import { useUser } from '../../UserContext';
import { useTheme } from '@mui/material/styles';
import { yellow } from '../../styles/ThemePrimitives';
import fmb52 from '../../assets/fmb52.png';
import CircularProgress from '@mui/material/CircularProgress';



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
  fontFamily: theme.typography.fontFamily,
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

export default function LogInWithOtp(props) {
  const theme = useTheme();
  const { updateUser } = useUser();
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill('')); // Array to store OTP digits
  const [resendTimer, setResendTimer] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false); // Loading state for OTP

  const inputRefs = useRef([]); // Ref array for OTP input fields
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.userName) {
      setUserName(location.state.userName);
    }
  }, [location.state?.userName]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [resendTimer]);

  const handlePasswordClick = () => {
    navigate('/', { state: { userName } });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) { // Only allow numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        // You can add an error state if needed for invalid input
        setSnackbarMessage('Please enter numeric values only.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
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
    setLoading(true);
    try {
      const response = await fetch('https://api.fmb52.com/api/get_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.message === 'User has not registered!') {
        setUserNameError(true);
        setUserNameErrorMessage('Invalid username');
        setSnackbarMessage('Invalid username');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setShowOtpInput(false); // Do not show OTP input
      } else if (data.message === 'Otp send successfully!' || response.status === 200) {
        setShowOtpInput(true);
        setSnackbarMessage(data.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setResendTimer(30);
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleResendOtp = () => {
    if (resendTimer === 0) {
      handleSendOtp();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpCode = otp.join('');
      const response = await fetch(`https://api.fmb52.com/api/login/${otpCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });

      const data = await response.json();
      if (data.success) {
        const { token, photo, currency, jamiat_id,  role,
            permissions,
            hof_count, ...userDetails } = data.data;

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
          // console.log('Token saved in localStorage:', localStorage.getItem('token'));

        // Update UserContext with the token and user details
        updateUser(
            {
              ...userDetails,
              photo: photo || '/static/images/avatar-placeholder.png', // Default placeholder if null
              jamiat_id, 
              role,
              permissions,
              hof_count,
            },
            token,
            currency,
            jamiat_id,
            role,
            permissions,
            hof_count 
            // Include currency in the UserContext
          );
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
            src={fmb52}
            alt="Logo"
            sx={{
              width: 'auto',
              height: 130,
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
              fontFamily: theme.typography.fontFamily,
            }}
          >

            <Typography variant="h5" sx={{ color: 'brown', textAlign: 'center' }}>
              FAIZ-UL-MAWAID-IL-BURHANIYAH
            </Typography>
            <FormControl>
              <TextField
                error={userNameError}
                helperText={userNameErrorMessage}
                id="userName-basic"
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
            {showOtpInput && (
              <>
                <FormControl>
                  <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                    The OTP has been sent!
                  </Typography>
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
                <Button fullWidth variant="contained" onClick={handleVerifyOtp} sx={{
                  fontSize: '0.9rem',
                  backgroundColor: yellow[400], // Access primary color from theme
                  '&:hover': {
                    backgroundColor: yellow[100], // Hover color from theme
                    color: '#000',
                  },
                }}>
                  Verify OTP
                </Button>
                <Button
                  fullWidth
                  variant={resendTimer === 0 ? "contained" : "outlined"}
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  sx={{
                    fontSize: '0.9rem',
                    backgroundColor: resendTimer === 0 ? yellow[400] : yellow[200], // Change color based on timer
                    '&:hover': {
                      backgroundColor: resendTimer === 0 ? yellow[100] : yellow[200], color: "#000", // No hover effect when disabled
                    },
                  }}>
                  <span style={{ color: resendTimer > 0 ? 'brown' : 'inherit' }}>
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </span>
                </Button>
                <Button fullWidth variant="contained" onClick={handleResendOtp} sx={{
                  fontSize: '0.9rem',
                  backgroundColor: yellow[400], // Access primary color from theme
                  '&:hover': {
                    backgroundColor: yellow[100], // Hover color from theme
                    color: '#000',
                  },
                }}>
                  Change Username
                </Button>
              </>
            )}
            {!showOtpInput && (
              <Button
                type="submit"
                fullWidth
                variant={!loading ? "contained" : "outlined"}
                disabled={loading} // Disable the button when loading
                onClick={() => validateInputs() && handleSendOtp()}
                sx={{
                  fontSize: '0.9rem',
                  backgroundColor: loading ? yellow[100] : yellow[200], // Dim color when loading
                  '&:hover': {
                    backgroundColor: loading ? yellow[100] : yellow[200], color: "#000", // No hover effect when loading
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={20} sx={{ color: yellow[400], marginRight: 1 }} /> Sending...
                  </Box>
                ) : (
                  'Send OTP'
                )}
              </Button>

            )}
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handlePasswordClick}
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
              Back to sign in with password
            </Button>
          </Box>
        </Card>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </SignInContainer>
    </AppTheme>
  );
}
