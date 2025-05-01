import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  styled,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

const LoginContainer = styled(Container)(({ theme }) => ({
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

const RegisterLink = styled(Box)({
  textAlign: 'center',
  marginTop: '1rem',
});

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Data:', formData);
    // Adicionar lógica
    navigate('/home');
  };

  return (
    <>
      <Header />
      <LoginContainer>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            mb: 3,
            color: '#333333',
            fontWeight: 400,
          }}
        >
          Login
        </Typography>

        <Form onSubmit={handleSubmit}>
          <InputField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
          />

          <InputField
            required
            fullWidth
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="current-password"
          />

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
                backgroundColor: '#9EEFD0',
              },
            }}
          >
            Entrar
          </Button>

          <RegisterLink>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                style={{
                  color: '#2C2C2C',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Cadastre-se
              </Link>
            </Typography>
          </RegisterLink>
        </Form>
      </LoginContainer>
    </>
  );
};

export default Login;