import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  CssBaseline,
  Snackbar, Alert
} from '@mui/material';
import AppTheme from '../../styles/AppTheme';
import { yellow } from '../../styles/ThemePrimitives';
import { useUser } from '../../contexts/UserContext';

function HofDetailsForm({ familyId, id }) {
  const [hofDetails, setHofDetails] = useState({
    name: '',
    its: '',
    gender: '',
    mobile: '',
    email: '',
    dob: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useUser();

   const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');



  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`https://api.fmb52.com/api/mumeneen/user/${familyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const json = await response.json();

        if (json.status && json.data) {
          setHofDetails({
            name: json.data.name || '',
            its: json.data.its || '',
            gender: json.data.gender || '',
            mobile: json.data.mobile || '',
            email: json.data.email || '',
            dob: json.data.dob || '',
          });
          setError(null);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [familyId, token]);

  const handleInputChange = (field, value) => {
    setHofDetails((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = () => {
  //   // Add your submit logic here
  //   console.log(hofDetails);
  // };


  const handleSubmit = async () => {
  try {
    const response = await fetch(`https://api.fmb52.com/api/mumeneen/update_details/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: hofDetails.name,
        email: hofDetails.email,
        mobile: hofDetails.mobile,
      }),
    });

    const text = await response.text();
    console.log("Raw response text:", text);

    const json = JSON.parse(text);

    console.log("Parsed JSON:", json);

    if (response.ok && json.status === 'success') {
        setSnackbarMessage('Record updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(`Update failed: ${json.message || 'Unknown error'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error updating record: ' + error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };




  if (error) return <div>Error: {error}</div>;

  return (
    <AppTheme>
      <CssBaseline />
     <div
        style={{
          filter: snackbarOpen ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease',
          pointerEvents: snackbarOpen ? 'none' : 'auto',
          userSelect: snackbarOpen ? 'none' : 'auto',
        }}
      >
      <Paper
        sx={{
          mt: 2,
          p: 4,
          borderRadius: '8px',
          backgroundColor: '#F7F4F1',
          minHeight: '630px',
        }}
      >
        <Box
          component="form"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
          noValidate
          autoComplete="off"
        >
          {/* Editable */}
          <TextField
            label="Name"
            value={hofDetails.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            fullWidth
            InputProps={{
              sx: {
                height: '52px',
                mb: '7px',
                border: `1px solid ${yellow[400]}`,
              },
            }}
          />

          {/* Read-only */}
          <TextField
            label="ITS"
            value={hofDetails.its}
            fullWidth
            InputProps={{
              readOnly: true,
              sx: {
                height: '52px',
                mb: '7px',
                border: `1px solid ${yellow[400]}`,
                bgcolor: '#f0f0f0', // subtle gray bg to indicate readonly
                userSelect: 'text',
              },
            }}
          />

          {/* Gender as text field (editable or read-only? You said normal text field, so editable?) */}
          <TextField
            label="Gender"
            value={hofDetails.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            fullWidth
            InputProps={{
              readOnly: true,
             sx: {
                height: '52px',
                mb: '7px',
                border: `1px solid ${yellow[400]}`,
                bgcolor: '#f0f0f0', // subtle gray bg to indicate readonly
                userSelect: 'text',
              },
            }}
          />

          {/* Editable */}
          <TextField
            label="Mobile"
            value={hofDetails.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            fullWidth
            InputProps={{
              sx: {
                height: '52px',
                mb: '7px',
                border: `1px solid ${yellow[400]}`,
              },
            }}
          />

          {/* Editable */}
          <TextField
            label="Email"
            value={hofDetails.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            fullWidth
            InputProps={{
              sx: {
                height: '52px',
                mb: '7px',
                border: `1px solid ${yellow[400]}`,
              },
            }}
          />

          {/* Read-only */}
          <TextField
            label="DOB"
            type="date"
            value={hofDetails.dob}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              // readOnly: true,
              sx: {
                height: '52px',
                mb: '7px',
                border: `1px solid ${yellow[400]}`,
                bgcolor: '#f0f0f0',
                userSelect: 'text',
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'bold',
              backgroundColor: yellow[400],
              '&:hover': {
                backgroundColor: yellow[100],
                color: '#000',
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
        </div>
       <Snackbar
              open={snackbarOpen}
              onClose={handleSnackbarClose}
               sx={{ height: "100%"}}
         anchorOrigin={{
            vertical: "top",
            horizontal: "center"
         }}
      
            >
              <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%",  
           }}
          action={
            <Button color="inherit" size="small" onClick={handleSnackbarClose}>
              OK
            </Button>
          }
        >
          {snackbarMessage}
        </Alert>
            </Snackbar>
    </AppTheme>
  );
}

export default HofDetailsForm;
