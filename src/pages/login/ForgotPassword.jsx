// import * as React from 'react';
// import PropTypes from 'prop-types';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import OutlinedInput from '@mui/material/OutlinedInput';

// function ForgotPassword({ open, handleClose }) {
//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       PaperProps={{
//         component: 'form',
//         onSubmit: (event) => {
//           event.preventDefault();
//           handleClose();
//         },
//         sx: { backgroundImage: 'none' },
//       }}
//     >
//       <DialogTitle>Reset password</DialogTitle>
//       <DialogContent
//         sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
//       >
//         <DialogContentText>
//           Enter your account&apos;s email address, and we&apos;ll send you a link to
//           reset your password.
//         </DialogContentText>
//         <OutlinedInput
//           autoFocus
//           required
//           margin="dense"
//           id="email"
//           name="email"
//           label="Email address"
//           placeholder="Email address"
//           type="email"
//           fullWidth
//         />
//       </DialogContent>
//       <DialogActions sx={{ pb: 3, px: 3 }}>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button variant="contained" type="submit">
//           Continue
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// ForgotPassword.propTypes = {
//   handleClose: PropTypes.func.isRequired,
//   open: PropTypes.bool.isRequired,
// };

// export default ForgotPassword;


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
import fmbLogo1 from '../../assets/fmbLogo1.png';
import bg1 from '../../assets/bg1.jpg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import Dashboard from '../dashboard/index';
import { useUser } from '../../UserContext';
import { useTheme } from '@mui/material/styles';
import { yellow } from '../../styles/ThemePrimitives';
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

export default function ForgotPassword(props) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateEmail()) {
      setSnackbarMessage('Password reset link sent!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError(true);
      setEmailErrorMessage('Please enter your email address.');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      return false;
    }

    setEmailError(false);
    setEmailErrorMessage('');
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
            
            <Typography variant="h5" sx={{color: 'brown', textAlign: 'center'}}>
        FAIZ-UL-MAWAID-IL-BURHANIYAH
      </Typography>
      <FormControl>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email-basic"
                type="email"
                name="email"
                label="Email"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  sx: {
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                fontSize: '0.9rem',
                backgroundColor: yellow[400], // Access primary color from theme
                '&:hover': {
                  backgroundColor: yellow[100], // Hover color from theme
                  color: '#000',
                },
              }}
            >
              Send Password
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{
                fontSize: '0.97rem',
                alignSelf: 'center',
                fontFamily: 'inherit',
                color: yellow[300],
                '&:hover': {
                  color: yellow[400],
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Card>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </SignInContainer>
    </AppTheme>
  );
}
