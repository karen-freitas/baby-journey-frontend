import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  styled,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Link as RouterLink } from "react-router-dom";
import { createUser } from '../services/apiService';
import SnackbarMessage from '../components/SnackbarMessage';

const RegisterContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  padding: theme.spacing(3),
  backgroundColor: "#fff",
}));

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  maxWidth: "400px",
  marginTop: theme.spacing(3),
}));

const InputField = styled(TextField)({
  marginBottom: "1rem",
});

const LoginLink = styled(Box)({
  textAlign: 'center',
  marginTop: '1rem',
});

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    babyName: "",
    birthDate: null,
    profilePhoto: null,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
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

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setSnackbar({ open: true, message: "A senha deve ter no mínimo 6 caracteres.", severity: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      await createUser({
        name: formData.babyName,
        email: formData.email,
        password: formData.password,
      });
      setSnackbar({ open: true, message: "Cadastro realizado com sucesso! Faça o login.", severity: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage = error.message || "Erro ao cadastrar usuário. Verifique os dados ou tente mais tarde.";
      if (error.statusCode === 400 && errorMessage.includes("already registered")) {
        setSnackbar({ open: true, message: "O e-mail informado já está cadastrado.", severity: "warning" });
      } else {
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      <Header />
      <RegisterContainer>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            mb: 0,
            color: "#333333",
            fontWeight: 400,
          }}
        >
          Cadastro
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
                sx={{ width: "100%", mb: 2 }}
              />
            </LocalizationProvider>

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
              Cadastrar
            </Button>

            <LoginLink>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{' '}
                <RouterLink
                  to="/login"
                  style={{
                    color: '#2C2C2C',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Faça login
                </RouterLink>
              </Typography>
            </LoginLink>
          </Form>
        )}
      </RegisterContainer>
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default Register;
