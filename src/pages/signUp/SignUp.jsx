// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   CssBaseline,
//   Divider,
//   TextField,
//   Typography,
//   Stack,
//   Card as MuiCard,
// useMediaQuery,
//   Snackbar,
//   Alert,
//   Select,
//   MenuItem,
//   InputAdornment,
//   FormControlLabel,
//   Checkbox,
// } from '@mui/material';
// import { styled, useTheme } from '@mui/material/styles';
// import AppTheme from '../../styles/AppTheme';
// import fmbLogo1 from '../../assets/fmbLogo1.png';
// import bg1 from '../../assets/bg1.jpg';
// import { useNavigate } from 'react-router-dom';
// import Link from '@mui/material/Link';
// import { yellow } from '../../styles/ThemePrimitives';
// import fmb52 from '../../assets/fmb52.png';

// const getFlagURL = (isoCode) =>
//   `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`;


// const Card = styled(MuiCard)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignSelf: 'center',
//   width: '100%',
//   padding: theme.spacing(4),
//   gap: theme.spacing(1),
//   margin: 'auto',
//   [theme.breakpoints.up('sm')]: {
//     maxWidth: '450px',
//   },
//   [theme.breakpoints.down('sm')]: {
//     alignSelf: 'flex-start',
//     margin: '0',
//   },
//   boxShadow:
//     'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
//   backgroundColor: yellow[50],
// }));

// const SignUpContainer = styled(Stack)(({ theme }) => ({
//   // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
//   minHeight: '100%',
//   padding: theme.spacing(2),
//   backgroundImage: `url(${bg1})`,
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
//   backgroundRepeat: 'no-repeat',

//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(4),
//   },
// }));

// const countries = [
//   { name: 'India', code: '+91', isoCode: 'IN', maxLength: 10 },
//   { name: 'United States', code: '+1', isoCode: 'US', maxLength: 10 },
//   { name: 'United Kingdom', code: '+44', isoCode: 'GB', maxLength: 10 },
//   { name: 'Australia', code: '+61', isoCode: 'AU', maxLength: 9 },
//   { name: 'United Arab Emirates', code: '+971', isoCode: 'AE', maxLength: 9 },
//   { name: 'Canada', code: '+1', isoCode: 'CA', maxLength: 10 },
//   { name: 'Germany', code: '+49', isoCode: 'DE', maxLength: 10 },
//   { name: 'France', code: '+33', isoCode: 'FR', maxLength: 9 },
//   { name: 'Singapore', code: '+65', isoCode: 'SG', maxLength: 8 },
//   { name: 'China', code: '+86', isoCode: 'CN', maxLength: 11 },
//   { name: 'Japan', code: '+81', isoCode: 'JP', maxLength: 10 },
//   { name: 'Russia', code: '+7', isoCode: 'RU', maxLength: 10 },
// ];


// export default function SignUp(props) {
//   const [selectedCountry, setSelectedCountry] = useState(countries[0]);
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [cityName, setCityName] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [otpFields, setOtpFields] = useState(['', '', '', '', '', '']);
//   const [otp, setOtp] = useState('');
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [showResendButton, setShowResendButton] = useState(false); // Track if Resend should be shown
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [isEmailValid, setIsEmailValid] = useState(false);

//    // Error state variables
//    const [cityError, setCityError] = useState(false);
//    const [cityErrorMessage, setCityErrorMessage] = useState('');
//    const [nameError, setNameError] = useState(false);
//    const [nameErrorMessage, setNameErrorMessage] = useState('');
//    const [mobileError, setMobileError] = useState(false);
//    const [mobileErrorMessage, setMobileErrorMessage] = useState('');
//    const [emailError, setEmailError] = useState(false);
//    const [emailErrorMessage, setEmailErrorMessage] = useState('');

//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//   const navigate = useNavigate();

//   const handleCountryChange = (event) => {
//     const [code, isoCode] = event.target.value.split('|'); // Split combined value
//     const country = countries.find((c) => c.code === code && c.isoCode === isoCode);
//     setSelectedCountry(country || selectedCountry); // Update selected country
//     setMobileNumber('');
//   };

//   const handleMobileNumberChange = (event) => {
//     const value = event.target.value.replace(/\D/g, '');
//     if (value.length <= selectedCountry.maxLength) {
//       setMobileNumber(value);
//     }
//   };

//   const validateInputs = () => {
//     let isValid = true;

//     if (!cityName.trim()) {
//       setCityError(true);
//       setCityErrorMessage('City name is required.');
//       isValid = false;
//     } else {
//       setCityError(false);
//       setCityErrorMessage('');
//     }

//     if (!fullName.trim()) {
//       setNameError(true);
//       setNameErrorMessage('Full name is required.');
//       isValid = false;
//     } else {
//       setNameError(false);
//       setNameErrorMessage('');
//     }

//     if (!mobileNumber.trim() || mobileNumber.length !== selectedCountry.maxLength) {
//       setMobileError(true);
//       setMobileErrorMessage(`Mobile number must be ${selectedCountry.maxLength} digits.`);
//       isValid = false;
//     } else {
//       setMobileError(false);
//       setMobileErrorMessage('');
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email.trim() || !emailRegex.test(email)) {
//       setEmailError(true);
//       setEmailErrorMessage('Invalid email address.');
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage('');
//     }

//     return isValid;
//   };

//   const handleSignUp = (event) => {
//     event.preventDefault();

//     if (validateInputs()) {
//       setSnackbarMessage('Sign up successful!');
//       setSnackbarOpen(true);
//       navigate('/dashboard');
//     } else {
//       setSnackbarMessage('Please fix the errors before submitting.');
//       setSnackbarOpen(true);
//     }
//   };

// // Email validation function
// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email.trim());
// };

// // Email change handler with validation
// const handleEmailChange = (event) => {
//   const emailValue = event.target.value;
//   setEmail(emailValue);
//   setIsEmailValid(validateEmail(emailValue)); // Update validity state
// };

//   const handleCityNameChange = (event) => {
//     setCityName(event.target.value);
//   };

//   const handleFullNameChange = (event) => {
//     setFullName(event.target.value);
//   };

//   const handleOtpChange = (index, value) => {
//     const numericValue = value.replace(/\D/g, ''); // Allow only numeric input
//     if (numericValue.length <= 1) {
//       const newOtpFields = [...otpFields];
//       newOtpFields[index] = numericValue;
//       setOtpFields(newOtpFields);

//       if (numericValue && index < otpFields.length - 1) {
//         document.getElementById(`otp-${index + 1}`).focus();
//       }

//       if (!numericValue && index > 0) {
//         document.getElementById(`otp-${index - 1}`).focus();
//       }
//     }
//   };

// const handleSignInClick = () => {
//   navigate('/'); // Update this path to match your routing setup
// };

//   const sendOtp = async () => {
//     try {
//       const response = await fetch(
//         `https://api.fmb52.com/api/verify_email?email=${email}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.ok) {
//         const responseData = await response.json();
//         const generatedOtp = responseData.code;
//         console.log('Generated OTP from server:', generatedOtp); // Debug log
//         setOtp(generatedOtp); // Store OTP

//         setSnackbarMessage('OTP sent successfully!');
//         setIsOtpSent(true);
//         setShowResendButton(false);
//       } else {
//         const errorResponse = await response.text();
//         console.error('Error Response:', errorResponse);
//         setSnackbarMessage('Failed to send OTP. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       setSnackbarMessage('Failed to send OTP. Please check your connection.');
//     } finally {
//       setSnackbarOpen(true);
//     }
//   };

//   const handleVerifyEmail = () => {
//     sendOtp();
//   };

//   const handleResendOtp = () => {
//     sendOtp();
//   };

//   const handleOtpVerification = () => {
//     const enteredOtp = otpFields.join('');
//     console.log('Entered OTP:', enteredOtp); // Debug log
//     console.log('Expected OTP:', otp); // Debug log

//     if (enteredOtp.toString() === otp.toString()) {
//       setSnackbarMessage('Email verified successfully!');
//       setIsEmailVerified(true);
//       setShowResendButton(false);
//     } else {
//       setSnackbarMessage('Invalid OTP. Please try again.');
//       setShowResendButton(true);
//     }
//     setSnackbarOpen(true);
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   useEffect(() => {
//     if (isOtpSent) {
//       const firstBox = document.getElementById('otp-0');
//       if (firstBox) {
//         firstBox.focus();
//       }
//     }
//   }, [isOtpSent]);

//   return (
//     <AppTheme {...props}>
//       <CssBaseline/>
//       <SignUpContainer direction="column" justifyContent="space-between">
//         <Card variant="outlined">
// <Box
//   component="img"
//   src={fmb52}
//   alt="Logo"
//   sx={{
//     width: 'auto',
//     height: isSmallScreen ? 60 : 130,
//     margin: '0 auto',
//   }}
// />
//                        <Typography variant="h5" sx={{color: 'brown', textAlign: 'center'}}>
//                     FAIZ-UL-MAWAID-IL-BURHANIYAH
//                   </Typography>
//           <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <TextField
//               fullWidth
//               label="City Name"
//               variant="outlined"
//               value={cityName}
//               onChange={handleCityNameChange}
//               error={cityError}
//               helperText={cityErrorMessage}
//               InputProps={{
//                 sx: {
//                   height: '56px',
//                   display: 'flex',
//                   alignItems: 'center',
//                 },
//               }}
//             />

//             <TextField
//               fullWidth
//               label="Full Name"
//               variant="outlined"
//               value={fullName}
//               onChange={handleFullNameChange}
//               error={nameError}
//               helperText={nameErrorMessage}
//               InputProps={{
//                 sx: {
//                   height: '56px',
//                   display: 'flex',
//                   alignItems: 'center',
//                 },
//               }}
//             />

// <TextField
//   fullWidth
//   label="Mobile Number"
//   value={mobileNumber}
//   onChange={handleMobileNumberChange}
//   variant="outlined"
//   error={mobileError}
//   helperText={mobileErrorMessage}
//   InputProps={{
//     sx: { height: '56px', display: 'flex', alignItems: 'center' },
//     startAdornment: (
//       <InputAdornment position="start">
//          <Select
//       value={selectedCountry?.code || ''}
//       onChange={handleCountryChange}
//       displayEmpty
//       renderValue={() =>
//         selectedCountry ? (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <img
//               src={getFlagURL(selectedCountry.isoCode)}
//               alt={`${selectedCountry.name} Flag`}
//               style={{ width: 24, height: 16 }}
//             />
//           </Box>
//         ) : (
//           <span>Select Country</span>
//         )
//       }
//       sx={{ minWidth: 60 }}
//     >
//       {countries.map((country) => (
//         <MenuItem  key={`${country.code}|${country.isoCode}`} value={`${country.code}|${country.isoCode}`}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <img
//               src={getFlagURL(country.isoCode)}
//               alt={`${country.name} Flag`}
//               style={{ width: 26, height: 16, }}
//             />
//             {`${country.name} (${country.code})`}
//           </Box>
//         </MenuItem>
//       ))}
//     </Select>
//       </InputAdornment>
//     ),
//   }}
// />
//              <TextField
//               fullWidth
//               label="Email"
//               variant="outlined"
//               value={email}
//               onChange={handleEmailChange}
//               error={emailError}
//               helperText={emailErrorMessage}
//               InputProps={{
//                 sx: {
//                   height: '56px',
//                   display: 'flex',
//                   alignItems: 'center',
//                 },
//                   endAdornment: (
//                     <Button
//                       onClick={showResendButton ? handleResendOtp : handleVerifyEmail}
//                       variant="contained"
//                       disabled={!isEmailValid} // Disable button if email is not valid
//                       sx={{
//                         backgroundColor: isEmailValid ? yellow[400] : yellow[200],
//                         color: isEmailValid ? '#000' : '#aaa',
//                         '&:hover': {
//                           backgroundColor: isEmailValid ? yellow[100] : yellow[200],
//                           color: isEmailValid ? '#000' : '#aaa',
//                         },
//                       }}
//                     >
//                       {showResendButton ? 'Resend' : 'Verify'}
//                     </Button>
//                   ),
//               }}
//             />
//             {isOtpSent && (
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 {otpFields.map((field, index) => (
//                   <TextField
//                     key={index}
//                     id={`otp-${index}`}
//                     value={field}
//                     onChange={(e) => handleOtpChange(index, e.target.value)}
//                     variant="outlined"
//                     inputProps={{
//                       maxLength: 1,
//                       style: { textAlign: 'center', width: '40px' },
//                       sx: {
//                         height: '56px',
//                         display: 'flex',
//                         alignItems: 'center',
//                       },
//                     }}
//                   />
//                 ))}
//               </Box>
//             )}
//             <Button
//               type="submit"
//               fullWidth
//               variant='contained'
//               onClick={handleSignUp}
//               sx={{
//                 fontSize: '0.9rem',

//                 backgroundColor: yellow[400],
//                 '&:hover': {
//                   backgroundColor: yellow[100],
//                   color: '#000',
//                 },
//               }}
//             >
//               Sign up
//             </Button>
//           </Box>
//           <Divider>or</Divider>
// <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
//   <Typography sx={{ textAlign: 'center' }}>
//     Already have an account?{' '}
//     <Link
//       component="button"
//       onClick={handleSignInClick}

//       variant="body2"
//       sx={{
//         color: yellow[300],
//         '&:hover': {
//           color: yellow[400],
//         },
//       }}
//     >
//       Sign In
//     </Link>
//   </Typography>
// </Box>
//         </Card>
//       </SignUpContainer>
//       <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
//         <Alert onClose={handleCloseSnackbar} severity="info">
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </AppTheme>
//   );
// }



import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  useMediaQuery,
  Stack

} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AppTheme from '../../styles/AppTheme';
import fmb52 from '../../assets/fmb52.png';
import { useNavigate } from 'react-router-dom';
import { yellow, brown } from '../../styles/ThemePrimitives';
import bg1 from '../../assets/bg1.jpg';
import Link from '@mui/material/Link';
import { useUser } from '../../UserContext';
import CircularProgress from '@mui/material/CircularProgress';



const Card = styled(Box)(({ theme }) => ({
  maxWidth: 800, // Adjusted for two fields per row
  padding: theme.spacing(4),
  backgroundColor: yellow[50],
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  margin: 'auto',
  [theme.breakpoints.down('sm')]: {
    alignSelf: 'flex-start',
    margin: '0',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  // minHeight: '100%',
  height: '100vh',
  padding: theme.spacing(2),
  backgroundImage: `url(${bg1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const getFlagURL = (isoCode) =>
  `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`;

const countries = [
  { name: 'India', code: '+91', isoCode: 'IN', maxLength: 10 },
  { name: 'United States', code: '+1', isoCode: 'US', maxLength: 10 },
  { name: 'United Kingdom', code: '+44', isoCode: 'GB', maxLength: 10 },
  { name: 'Australia', code: '+61', isoCode: 'AU', maxLength: 9 },
  { name: 'United Arab Emirates', code: '+971', isoCode: 'AE', maxLength: 9 },
  { name: 'Canada', code: '+1', isoCode: 'CA', maxLength: 10 },
  { name: 'Germany', code: '+49', isoCode: 'DE', maxLength: 10 },
  { name: 'France', code: '+33', isoCode: 'FR', maxLength: 9 },
  { name: 'Singapore', code: '+65', isoCode: 'SG', maxLength: 8 },
  { name: 'China', code: '+86', isoCode: 'CN', maxLength: 11 },
  { name: 'Japan', code: '+81', isoCode: 'JP', maxLength: 10 },
  { name: 'Russia', code: '+7', isoCode: 'RU', maxLength: 10 },
  { name: 'Kuwait', code: '+965', isoCode: 'KW', maxLength: 8 },
  { name: 'Bahrain', code: '+973', isoCode: 'BH', maxLength: 8 },
];


export default function SignUp(props) {
  const { token } = useUser();
  const [currencies, setCurrencies] = useState([]); // State for fetched currencies
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cityName, setCityName] = useState('');
  const [fullName, setFullName] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpFields, setOtpFields] = useState(['', '', '', '', '', '']);
  const [otp, setOtp] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [serverOtp, setServerOtp] = useState('');
  const [isRegistered, setIsRegistered] = useState(false); // Track if the user is successfully registered
  const [trialEndDate, setTrialEndDate] = useState(''); // Store the trial end date


  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  // Error states
  const [cityError, setCityError] = useState(false);
  const [fullNameError, setFullNameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [emailError, setEmailError] = useState(false);


  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const handleCountryChange = (event) => {
    const [code, isoCode] = event.target.value.split('|');
    const country = countries.find((c) => c.code === code && c.isoCode === isoCode);
    setSelectedCountry(country || selectedCountry);
    setMobileNumber('');
  };

  const handleMobileNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length <= selectedCountry.maxLength) {
      setMobileNumber(value);
      setMobileError(value.trim() === '' || value.length !== selectedCountry.maxLength); // Clear the error if the value is valid
    }
  };
  

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue); // Check if email is valid
    setEmailError(!isValid); // Clear the error if the email is valid
    setIsEmailValid(isValid);
  };
  

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only numeric input
    if (value.length <= 1) {
      const newOtpFields = [...otpFields];
      newOtpFields[index] = value;
      setOtpFields(newOtpFields);

      if (value && index < otpFields.length - 1) {
        otpRefs.current[index + 1]?.focus(); // Move to the next box
      }
    }
  };


  // Handle Backspace key to move focus back
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otpFields[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus(); // Move to the previous box
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.fmb52.com/api/verify_email?email=${email}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json(); // Parse the response
        if (data.status) {
          // Status is true
          setServerOtp(data.code);
          setIsOtpSent(true);
          setSnackbarMessage('OTP sent successfully!');
          setResendTimer(30); // Set the timer for 30 seconds
          setIsEmailVerified(false);
        }  else {
          // Status is false
          setSnackbarMessage(data.message);
        }
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      setSnackbarMessage(error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
    setSnackbarOpen(true);
  };


  // const handleVerifyOtp = () => {
  //   const enteredOtp = otpFields.join('');
  //   if (enteredOtp === '123456') { // Mock OTP verification
  //     setIsEmailVerified(true);
  //     setSnackbarMessage('Email verified successfully!');
  //     setSnackbarOpen(true);
  //   } else {
  //     setSnackbarMessage('Invalid OTP. Please try again.');
  //     setSnackbarOpen(true);
  //   }
  // };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [resendTimer]);


  // After sending OTP, focus on the first box
  useEffect(() => {
    if (isOtpSent) {
      otpRefs.current[0]?.focus();
    }
  }, [isOtpSent]);

  // Fetch currencies from API
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(`https://api.fmb52.com/api/currencies`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Ensure token is valid
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCurrencies(data.data); // Populate the dropdown options
          setSelectedCurrency(data.data[0]?.id || ''); // Set the default to the first currency's id
        } else {
          throw new Error(data.message || 'Failed to fetch currencies');
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };
    fetchCurrencies();
  }, []);


  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  // const handleSignUpClick = async () => {
  //   // Validate all fields
  //   const isCityValid = cityName.trim();
  //   const isFullNameValid = fullName.trim();
  //   const isMobileValid = mobileNumber.trim() && mobileNumber.length === selectedCountry.maxLength;
  //   const isEmailValid = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  //   setCityError(!isCityValid);
  //   setFullNameError(!isFullNameValid);
  //   setMobileError(!isMobileValid);
  //   setEmailError(!isEmailValid);


  //   if (isCityValid && isFullNameValid && isMobileValid && isEmailValid) {
  //     // Prepare data for the API
  //     const requestBody = {
  //       name: cityName,
  //       mobile: mobileNumber,
  //       email: email,
  //       currency_id: selectedCurrency, // Assuming `selectedCurrency` holds the ID
  //     };


  //     // Check if any field is invalid
  // if (!isCityValid || !isFullNameValid || !isMobileValid || !isEmailValid) {
  //   setSnackbarMessage('Please fill in all the required fields.');
  //   setSnackbarOpen(true);
  //   return; // Stop further execution
  // }



  // // Combine OTP fields and compare with server OTP
  // const enteredOtp = otpFields.join('').trim();
  // const serverOtpString = String(serverOtp).trim(); // Ensure serverOtp is a string and trimmed

  // console.log('Entered OTP:', enteredOtp);
  // console.log('Server OTP:', serverOtpString);

  // if (enteredOtp !== serverOtpString) {
  //   setSnackbarMessage('Invalid OTP. Please try again.');
  //   setSnackbarOpen(true);
  //   return;
  // }
  //     setIsEmailVerified(true);


  //     if (!isEmailVerified) {
  //       setSnackbarMessage('Please verify your email before signing up.');
  //       setSnackbarOpen(true);
  //       return;
  //     }
  //     try {
  //       // Make the API request
  //       const response = await fetch(`https://api.fmb52.com/api/register-jamaat`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`, // Include the token
  //         },
  //         body: JSON.stringify(requestBody), // Convert the request body to JSON
  //       });

  //       const data = await response.json();
  //       console.log("Data",data);

  //       if (response.ok) {
  //         // Success handling
  //         setSnackbarMessage(data.message || 'Jamaat registered successfully!');
  //         setSnackbarOpen(true);

  //         // Optionally, reset form fields or navigate
  //         setCityName('');
  //         setFullName('');
  //         setMobileNumber('');
  //         setEmail('');
  //         setSelectedCurrency('');
  //         setOtpFields(['', '', '', '', '', '']); // Reset OTP fields
  //     setIsOtpSent(false);
  //       } else {
  //         // Handle API error
  //         throw new Error(data.message || 'Failed to register Jamaat');
  //       }
  //     } catch (error) {
  //       // Handle fetch error
  //       console.log(error)
  //       setSnackbarMessage(error.message);
  //       setSnackbarOpen(true);
  //     }
  //   } else {
  //     // Show snackbar if validation fails
  //     setSnackbarMessage('Please fill in all the required fields.');
  //     setSnackbarOpen(true);
  //   }
  // };



  // const handleSignUpClick = async () => {
  //   console.log(selectedCurrency)
  //   const requestBody = {
  //     name: cityName,
  //     mobile: mobileNumber,
  //     email: email,
  //     currency_id: parseInt(selectedCurrency, 10),  // Assuming selectedCurrency holds the currency ID
  //   };
  //   try {
  //     const response = await fetch(`https://api.fmb52.com/api/register-jamaat`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json', // Explicitly request JSON
  //         // Authorization: `Bearer ${token}`, // Uncomment if required
  //       },
  //       body: JSON.stringify(requestBody),
  //     });

  //     const contentType = response.headers.get('content-type');
  //     console.log('Content-Type:', contentType);

  //     if (contentType && contentType.includes('application/json')) {
  //       const data = await response.json();
  //       console.log('Parsed JSON:', data);
  //       setSnackbarMessage(data.message || 'Jamaat registered successfully!');
  //     } else {
  //       const text = await response.text();
  //       console.error('Unexpected HTML Response:', text);
  //       throw new Error('Server returned an unexpected response.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setSnackbarMessage(error.message || 'Something went wrong');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityName(value);
    setCityError(value.trim() === ''); // Clear the error if the field is not empty
  };
  
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    setFullNameError(value.trim() === ''); // Clear the error if the field is not empty
  };
  

  const handleSignUpClick = async () => {
    // Validate input fields
    const isCityValid = cityName.trim();
    const isFullNameValid = fullName.trim();
    const isMobileValid = mobileNumber.trim() && mobileNumber.length === selectedCountry.maxLength;
    const isEmailValid = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setCityError(!isCityValid);
    setFullNameError(!isFullNameValid);
    setMobileError(!isMobileValid);
    setEmailError(!isEmailValid);

    // Stop execution if any field is invalid
    if (!isCityValid || !isFullNameValid || !isMobileValid || !isEmailValid || !selectedCurrency) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarOpen(true);
      return;
    }

    try {
      setIsLoading(true);

      // Validate OTP if not already verified
      if (!isEmailVerified) {
        const enteredOtp = otpFields.join('').trim();
        const serverOtpString = String(serverOtp).trim();

        if (enteredOtp !== serverOtpString) {
          setSnackbarMessage('Invalid OTP. Please try again.');
          setSnackbarOpen(true);
          setIsLoading(false);
          return;
        }

        // Mark email as verified
        setIsEmailVerified(true);
      }
      const mobileWithCountryCode = `${selectedCountry.code}${mobileNumber}`;

      // Proceed to signup after OTP verification
      const requestBody = {
        admin_name: fullName,
        name: cityName,
        mobile: mobileWithCountryCode,
        email: email,
        currency_id: parseInt(selectedCurrency, 10), // Ensure currency_id is an integer
      };

      console.log('Request Body:', requestBody);

      // Send the API request
      const response = await fetch(`https://api.fmb52.com/api/register-jamaat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token if required
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Calculate trial end date (30 days from today)
        const today = new Date();
        const trialEnd = new Date(today.setDate(today.getDate() + 30))
          .toISOString()
          .split('T')[0]; // Format: YYYY-MM-DD
        setTrialEndDate(trialEnd);

        // Mark as registered and show thank-you message
        setIsRegistered(true);
      } else {
        // Handle API errors
        console.error('API Error Response:', data);
        setSnackbarMessage(data.message || 'Failed to register Jamaat');
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Handle network or request errors
      console.error('Request Error:', error);
      setSnackbarMessage(error.message || 'Something went wrong');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };



  const handleSignInClick = () => {
    navigate('/'); // Update this path to match your routing setup
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline />
      <SignUpContainer>
        <Card variant="outlined">


          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 1,
            }}
          >
            <Box
              component="img"
              src={fmb52}
              alt="Logo"
              sx={{
                width: 'auto',
                height: isSmallScreen ? 60 : 130, // Adjusted for responsiveness
              }}
            />
          </Box>

          <Typography variant="h5" align="center" sx={{ color: 'brown', marginBottom: 1 }}>
            FAIZ-UL-MAWAID-IL-BURHANIYAH
          </Typography>
          {!isRegistered ? (
            <>
              <Grid container spacing={2} sx={{ pr: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City Name"
                    value={cityName}
                    onChange={handleCityChange}
                    variant="outlined"
                    error={cityError}
                    helperText={cityError ? 'City name is required' : ''}
                    InputProps={{
                      sx: {
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Admin Full Name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    variant="outlined"
                    error={fullNameError}
                    helperText={fullNameError ? 'Full name is required' : ''}
                    InputProps={{
                      sx: {
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    variant="outlined"
                    error={mobileError}
                    helperText={mobileError ? `Mobile number must be ${selectedCountry.maxLength} digits` : ''}
                    InputProps={{
                      sx: { height: '56px', display: 'flex', alignItems: 'center' },

                      startAdornment: (
                        <InputAdornment position="start">
                          <Select
                            value={`${selectedCountry?.code}|${selectedCountry?.isoCode}` || ''}
                            onChange={handleCountryChange}
                            displayEmpty
                            renderValue={() =>
                              selectedCountry ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <img
                                    src={getFlagURL(selectedCountry.isoCode)}
                                    alt={`${selectedCountry.name} Flag`}
                                    style={{ width: 24, height: 16 }}
                                  />
                                  <Typography variant="body2" sx={{ marginLeft: 1 }}>
                                    {selectedCountry.code}
                                  </Typography>
                                </Box>
                              ) : (
                                <span>Select Country</span>
                              )
                            }
                            sx={{ minWidth: 60 }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 200, // Set maximum height for the dropdown
                                  overflowY: 'auto', // Enable scrolling
                                },
                              },
                            }}
                          >
                            {countries.map((country) => (
                              <MenuItem key={`${country.code}|${country.isoCode}`} value={`${country.code}|${country.isoCode}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <img
                                    src={getFlagURL(country.isoCode)}
                                    alt={`${country.name} Flag`}
                                    style={{ width: 26, height: 16, }}
                                  />
                                  {`${country.name} (${country.code})`}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Currency"
                    variant="outlined"
                    select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    InputProps={{
                      sx: {
                        height: '56px', // Adjust height of the input box
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 200, // Limit the dropdown height
                            maxWidth: 250, // Limit the dropdown width
                            overflowY: 'auto', // Enable scrolling if content exceeds height
                          },
                        },
                      },
                    }}
                  >
                    {currencies.map((currency) => (
                      <MenuItem
                        key={currency.id}
                        value={currency.id}
                        sx={{
                          height: '40px', // Adjust the height of each dropdown item
                          fontSize: '0.9rem', // Adjust font size
                        }}
                      >
                        {`${currency.country_name} - ${currency.currency_name} (${currency.currency_symbol})`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    variant="outlined"
                    error={emailError}
                    helperText={emailError ? 'Invalid email address' : ''}
                    InputProps={{
                      sx: {
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      endAdornment: isLoading ? (
                        <CircularProgress size={24} sx={{ color: yellow[400] }} />
                      ) : (
                        <Button
                          onClick={handleSendOtp}
                          variant={isEmailValid && resendTimer === 0 ? "contained" : "outlined"}
                          disabled={!isEmailValid || resendTimer > 0}
                          sx={{
                            backgroundColor: isEmailValid && resendTimer === 0 ? yellow[400] : yellow[200],
                            '&:hover': { backgroundColor: isEmailValid && resendTimer === 0 ? yellow[100] : yellow[200], color: "#000" },
                          }}
                        >
                          <span style={{ color: resendTimer > 0 ? 'brown' : 'inherit' }}>
                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : isOtpSent ? 'Resend' : 'Verify'}
                          </span>
                        </Button>
                      ),
                    }}
                  />
                </Grid>
                {isOtpSent && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                      The OTP has been sent to your email.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      {otpFields.map((field, index) => (
                        <TextField
                          key={index}
                          inputRef={(el) => (otpRefs.current[index] = el)} // Set refs
                          value={field}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', width: '3rem' },
                          }}
                        />
                      ))}
                    </Box>
                    {/* Helper text */}

                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSignUpClick}

                    sx={{
                      backgroundColor: yellow[400], // Access primary color from theme
                      '&:hover': {
                        backgroundColor: yellow[100], // Hover color from theme
                        color: '#000',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
              <Divider sx={{ margin: '20px 0' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
                <Typography sx={{ textAlign: 'center' }}>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    onClick={handleSignInClick}

                    variant="body2"
                    sx={{
                      color: yellow[300],
                      '&:hover': {
                        color: yellow[400],
                      },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                padding: 2,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{color: yellow[400]}}>
                Welcome aboard!
              </Typography>
              <Typography variant="body1" gutterBottom sx={{color: yellow[400]}}>
                We're excited to have you with us.
              </Typography>
              <Typography variant="body1"  component="ul" gutterBottom  sx={{color: brown[700]}}>
                Your 1-month free trial starts today and lasts until{' '}
                <strong>{new Date(trialEndDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}</strong>.
              </Typography>
              <Typography variant="body1"  component="ul" gutterBottom  sx={{color: brown[700]}}>
                Your login credentials have been sent to your registered email.
              </Typography>
              <Typography variant="body1"  sx={{color: brown[700]}}>
                Feel free to explore all our features and enjoy the experience, completely risk-free!
              </Typography>
              <Button
                variant="contained"
                onClick={handleSignInClick}
                sx={{
                  marginTop: 4,
                  backgroundColor: yellow[400], // Access primary color from theme
                  '&:hover': {
                    backgroundColor: yellow[100], // Hover color from theme
                    color: '#000',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Card>
      </SignUpContainer>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
