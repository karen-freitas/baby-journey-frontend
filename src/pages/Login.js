import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  styled,
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import { login } from '../services/apiService';
import { useUserData } from '../context/UserDataContext';
import SnackbarMessage from '../components/SnackbarMessage';

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
  const { fetchUserAndImages } = useUserData();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(formData);
      if (response.token && response.id) {
        await fetchUserAndImages(true);
        navigate('/home');
      } else {
        setSnackbar({
          open: true,
          message: 'Resposta de login inválida.',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Falha no login. Verifique seu e-mail e senha.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
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

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
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
                backgroundColor: 'rgb(83, 40, 87)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgb(164, 130, 185)',
                },
              }}
            >
              Entrar
            </Button>

            <RegisterLink>
              <Typography variant="body2" color="text.secondary">
                Não tem uma conta?{' '}
                <MuiLink component={RouterLink} to="/register" sx={{ color: '#2C2C2C', textDecoration: 'none', fontWeight: 500 }}>
                  Cadastre-se
                </MuiLink>
              </Typography>
            </RegisterLink>
          </Form>
        )}
      </LoginContainer>
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default Login;