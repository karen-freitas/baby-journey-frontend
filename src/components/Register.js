import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  styled,
  Avatar,
  IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RegisterContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  backgroundColor: '#fff',
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  marginTop: theme.spacing(3),
}));

const InputField = styled(TextField)({
  marginBottom: '1rem',
});

const PhotoUpload = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    babyName: '',
    birthDate: null,
    profilePhoto: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      birthDate: date
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add your registration logic here
    navigate('/home'); // Navigate to home after successful registration
  };

  return (
    <RegisterContainer>
      <Typography 
        component="h1" 
        variant="h4" 
        sx={{ 
          mb: 4,
          color: '#2C2C2C',
          fontWeight: 600
        }}
      >
        Cadastro
      </Typography>

      <Form onSubmit={handleSubmit}>
        <PhotoUpload>
          <LargeAvatar src={photoPreview} />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            type="file"
            onChange={handlePhotoChange}
          />
          <label htmlFor="photo-upload">
            <IconButton
              color="primary"
              aria-label="upload baby photo"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography variant="caption" color="textSecondary">
            Adicionar foto do bebê
          </Typography>
        </PhotoUpload>

        <InputField
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <InputField
          required
          fullWidth
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <InputField
          required
          fullWidth
          label="Nome do bebê"
          name="babyName"
          value={formData.babyName}
          onChange={handleInputChange}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Data de nascimento"
            value={formData.birthDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <InputField {...params} fullWidth required />
            )}
            sx={{ width: '100%', mb: 2 }}
          />
        </LocalizationProvider>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
            mt: 2,
            mb: 2,
            backgroundColor: '#ACFFDE',
            color: '#2C2C2C',
            '&:hover': {
              backgroundColor: '#9EEFD0'
            }
          }}
        >
          Cadastrar
        </Button>
      </Form>
    </RegisterContainer>
  );
};

export default Register;