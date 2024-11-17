// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Typography, TextField, Button, Grid, Snackbar, Alert, Checkbox, FormControlLabel, Divider } from '@mui/material';
// import fmbLogo from '../assets/fmbLogo.png';
// import bg from '../assets/bg.png';

// const LogInWithOtp = () => {
//   const [userName, setuserName] = useState('');
//   const [otp, setOtp] = useState(new Array(4).fill(''));
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSnackbar, setShowSnackbar] = useState({ open: false, message: '', severity: 'info' });
//   const otpInputRefs = useRef([]);

//   useEffect(() => {
//     if (isOtpSent && otpInputRefs.current[0]) {
//       otpInputRefs.current[0].focus();
//     }
//   }, [isOtpSent]);

//   const handleOtpChange = (e, index) => {
//     const { value } = e.target;
//     const newOtp = [...otp];

//     if (/^\d?$/.test(value)) {
//       newOtp[index] = value.slice(-1);
//       setOtp(newOtp);

//       if (value && index < otp.length - 1) {
//         otpInputRefs.current[index + 1].focus();
//       }
//     }

//     if (!value && e.nativeEvent.inputType === 'deleteContentBackward' && index > 0) {
//       otpInputRefs.current[index - 1].focus();
//     }
//   };

//   const handleSendOtp = () => {
//     if (!/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(userName)) {
//       setShowSnackbar({ open: true, message: 'Please enter a valid user name', severity: 'error' });
//       return;
//     }
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsOtpSent(true);
//       setIsLoading(false);
//       setShowSnackbar({ open: true, message: 'OTP sent successfully', severity: 'success' });
//     }, 1000);
//   };

//   const handleVerifyOtp = () => {
//     if (otp.join('').length !== 4) {
//       setShowSnackbar({ open: true, message: 'Please enter the 4-digit OTP', severity: 'error' });
//       return;
//     }

//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       setShowSnackbar({ open: true, message: 'Successfully logged in!', severity: 'success' });
//       setOtp(new Array(4).fill(''));
//     }, 1000);
//   };

//   const handleCloseSnackbar = () => {
//     setShowSnackbar({ ...showSnackbar, open: false });
//   };

//   return (
//     <Box
//       minHeight="100vh"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       sx={{
//         backgroundColor: '#f0f0f0',
//         p: 2,
//       }}
//     >
//       <Box
//         sx={{
//           width: { xs: '90%', sm: '70%', md: '60%' },
//           maxWidth: '450px',
//           height: { xs: 'auto', md: '80vh' },
//           backgroundImage: `url(${bg})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           borderRadius: '20px',
//           boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           position: 'relative',
//           padding: 4,
//           overflow: 'hidden',
//         }}
//       >
//         <Box
//           sx={{
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             borderRadius: '16px',
//             p: 3,
//             boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//           }}
//         >
//           {/* Logo */}
//           <Box display="flex" justifyContent="center" mb={2}>
//             <img src={fmbLogo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
//           </Box>

//           {/* Header */}
//           <Typography
//             variant="h5"
//             gutterBottom
//             fontWeight="bold"
//             color="primary"
//             align="center"
//             sx={{ fontSize: { xs: '1rem', md: '1.5 rem' } }}
//           >
//             Log In
//           </Typography>

//           {/* User name Input */}
//           <TextField
//             label="Username"
//             variant="outlined"
//             fullWidth
//             value={userName}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (/^\d{0,10}$/.test(value)) {
//                 setuserName(value);
//               }
//             }}
//             disabled={isOtpSent}
//             error={!/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(userName) && userName !== ''}
//             helperText={
//               !/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(userName) && userName !== ''
//                 ? 'Enter a valid 10-digit user name'
//                 : ''
//             }
//             inputProps={{
//               maxLength: 10,
//             }}
//             sx={{ mb: 3 }}
//           />

//           {/* Remember Me Checkbox */}
//           <FormControlLabel
//             control={<Checkbox />}
//             label="Remember me"
//             sx={{ mb: 2 }}
//           />

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             onClick={handleSendOtp}
//             disabled={isLoading || isOtpSent}
//             sx={{ mb: 2 }}
//           >
//             {isLoading ? 'Sending...' : 'Send OTP'}
//           </Button>

//           {/* OTP Input Fields */}
//           {isOtpSent && (
//             <>
//               <Typography
//                 variant="body2"
//                 color="textSecondary"
//                 mb={1}
//                 align="center"
//                 sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
//               >
//                 Enter OTP
//               </Typography>
//               <Grid container spacing={1} justifyContent="center" sx={{ mb: 3 }}>
//                 {otp.map((data, index) => (
//                   <Grid item key={index}>
//                     <TextField
//                       type="text"
//                       value={data}
//                       onChange={(e) => handleOtpChange(e, index)}
//                       inputProps={{
//                         maxLength: 1,
//                         style: { textAlign: 'center', fontSize: '1.5rem' },
//                       }}
//                       inputRef={(el) => (otpInputRefs.current[index] = el)}
//                       sx={{
//                         width: { xs: '35px', md: '50px' },
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: '8px',
//                           bgcolor: 'white',
//                         },
//                       }}
//                     />
//                   </Grid>
//                 ))}
//               </Grid>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 onClick={handleVerifyOtp}
//                 disabled={isLoading}
//                 sx={{ mb: 2 }}
//               >
//                 {isLoading ? 'Verifying...' : 'Verify & Sign In'}
//               </Button>
//             </>
//           )}

//           {/* Horizontal Line */}
//           <Divider sx={{ mb: 2 }} />

//           {/* Footer Links */}
//           <Box display="flex" justifyContent="space-between">
//             {isOtpSent && (
//               <Button
//                 variant="text"
//                 style={{
//                   cursor: 'pointer',
//                   color: '#3366FF',
//                   fontSize: '14px',
//                   fontWeight: 'normal',
//                   textTransform: 'none',
//                 }}
//                 onClick={handleSendOtp}
//               >
//                 Resend OTP
//               </Button>
//             )}
//             <Button
//               variant="text"
//               style={{
//                 cursor: 'pointer',
//                 color: '#3366FF',
//                 fontSize: '14px',
//                 fontWeight: 'normal',
//                 textTransform: 'none',
//               }}
//             >
//               Change Number
//             </Button>
//             <Button
//               variant="text"
//               style={{
//                 cursor: 'pointer',
//                 color: '#3366FF',
//                 fontSize: '14px',
//                 fontWeight: 'normal',
//                 textTransform: 'none',
//               }}
//             >
//               Forgot Password
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* Snackbar for Notifications */}
//       <Snackbar
//         open={showSnackbar.open}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={showSnackbar.severity} sx={{ width: '100%' }}>
//           {showSnackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default LogInWithOtp;

// import React from 'react';
// import {
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   FormControlLabel,
//   TextField,
//   Typography,
//   Link,
//   Paper
// } from '@mui/material';

// function Login() {
//   return (
//     <Container component="main" maxWidth="xs">
//       <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', mt: 5 }}>
//         <Box sx={{ mb: 2 }}>
//           <img
//             src="../assets/fmbLogo.png"
//             alt="Logo"
//             style={{ width: '100px', marginBottom: '10px' }}
//           />
//           <Typography variant="h5" fontWeight="bold">
//             Faiz Ul Mawaid Il Burhaniyah <br /> Kolkata
//           </Typography>
//         </Box>

//         <Typography variant="h6" sx={{ mb: 2 }}>
//           Login
//         </Typography>

//         <TextField
//           variant="outlined"
//           margin="normal"
//           required
//           fullWidth
//           id="mobileNumber"
//           label="Mobile Number"
//           name="mobileNumber"
//           type="tel"
//           placeholder="+911234567890"
//           sx={{ mb: 2 }}
//         />

//         <TextField
//           variant="outlined"
//           margin="normal"
//           required
//           fullWidth
//           name="password"
//           label="Password"
//           type="password"
//           id="password"
//           sx={{ mb: 2 }}
//         />

//         <FormControlLabel
//           control={<Checkbox value="remember" color="primary" />}
//           label="Remember me"
//         />

//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           Login →
//         </Button>

//         <Box display="flex" justifyContent="space-between">
//           <Link href="#" variant="body2">
//             Forgot Password
//           </Link>
//           <Link href="#" variant="body2">
//             Sign Up
//           </Link>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }

// export default Login;


import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
// import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import AppTheme from '../../components/login/AppTheme';
import fmbLogo1 from '../../assets/fmbLogo1.png';
import bg1 from '../../assets/bg1.jpg';
import { useNavigate } from 'react-router-dom';

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
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
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
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function LogInWithPassword(props) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleOtpClick = () => {
    navigate('/login-with-otp', { state: { userName } });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      console.log({
        userName: data.get('userName'),
        password: data.get('password'),
      });
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!userName || !/\S+@\S+\.\S+/.test(userName)) {
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
            <FormControl variant='outlined'>
              <TextField
                error={userNameError}
                helperText={userNameErrorMessage}
                id="userName-basic"
                type="text"
                name="userName"
                // placeholder="Username"
                autoComplete="userName"
                autoFocus
                required
                fullWidth
                label="Username"
                variant="outlined"
                color={userNameError ? 'error' : 'primary'}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                InputProps={{
                  sx: {
                    // Set a fixed height for the input box
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                // placeholder="••••••"
                type="password"
                id="password"
                label="Password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
                InputProps={{
                  sx: {
                    // Set a fixed height for the input box
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              />
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                sx={{ flexGrow: 1, m: 0, fontSize: { xs: '0.8rem', sm: '1rem' }, }}
              />
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'center', mt: 0, fontSize: { xs: '0.8rem', sm: '1rem' },}}
              >
                Forgot your password?
              </Link>
            </Box>
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx = {{fontSize: { xs: '0.8rem', sm: '1rem' }}}
            >
              Sign in
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color='primary'
              onClick={handleOtpClick}
              sx = {{fontSize: { xs: '0.8rem', sm: '1rem' }}}
            >
              Sign in with OTP
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
