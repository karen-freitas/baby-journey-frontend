import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import babyFeet from "../assets/icons8-caminho-de-pegadas-de-bebê-96.png";
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useUserData } from "../context/UserDataContext";
import { deleteUser } from "../services/apiService";
import SnackbarMessage from "./SnackbarMessage";

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: "100vw",
  height: "8rem",
  background:
    "linear-gradient(45deg,rgb(83, 40, 87) 0%,rgb(205, 183, 219) 100%)",
  display: "flex",
  alignItems: "flex-start",
  position: "relative",
  overflow: "hidden",
  margin: 0,
  padding: 0,
  top: 0,
  left: 0,
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: "3rem",
    background: "white",
    clipPath:
      "polygon(100% 100%, 0% 100%, 0% 60%, 4% 65%, 8% 70%, 12% 74%, 16% 77%, 20% 79%, 24% 80%, 28% 80%, 32% 79%, 36% 77%, 40% 74%, 44% 70%, 48% 65%, 52% 60%, 56% 55%, 60% 51%, 64% 47%, 68% 44%, 72% 41%, 76% 38%, 80% 35%, 84% 32%, 88% 30%, 92% 28%, 96% 27%, 100% 25%)",
    [theme.breakpoints.up("lg")]: {
      height: "5rem",
    },
  },
  [theme.breakpoints.up("lg")]: {
    height: "10rem",
  },
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  position: "relative",
  zIndex: 2,
  padding: "1rem 1rem 0 1rem",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem 24px 0 24px",
  },
  [theme.breakpoints.up("md")]: {
    padding: "1rem 32px 0 32px",
  },
  [theme.breakpoints.up("lg")]: {
    padding: "1rem 32px 0 80px",
  },
}));

const TitleContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: "white",
  fontWeight: 500,
  fontSize: "3.5rem",
  textShadow: "4px 4px 6px rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  margin: 0,
  padding: 0,
  fontFamily: "Gamja Flower",
  [theme.breakpoints.down("sm")]: {
    fontSize: "2.5rem",
  },
}));

const BabyFeet = styled("img")({
  height: "4rem",
  width: "auto",
  filter: "brightness(0) invert(1) drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.3))",
  marginLeft: "10px",
});

const Header = ({ onAdd }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isHomePage = location.pathname === "/home";
  const { resetContext } = useUserData();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    resetContext && resetContext();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    setConfirmOpen(false);
    handleClose();
    try {
      const userId = localStorage.getItem("userId");
      await deleteUser(userId);
      localStorage.clear();
      resetContext && resetContext();
      setSnackbar({
        open: true,
        message: "Conta cancelada com sucesso.",
        severity: "success",
      });
      setTimeout(() => navigate("/register"), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Erro ao cancelar conta. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleAdd = () => {
    handleClose();
    onAdd && onAdd();
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <TitleContainer>
            <HeaderTitle variant="h1">
              Baby Journey
              <BabyFeet src={babyFeet} alt="baby feet icon" />
            </HeaderTitle>
          </TitleContainer>
          {isLargeScreen && isHomePage && (
            <>
              <MenuIcon
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  color: "white",
                  fontSize: "2.5rem",
                  filter: "drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.3))",
                }}
              />

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleAdd}>
                  <ListItemIcon>
                    <AddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Adicionar</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sair</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setConfirmOpen(true)}>
                  <ListItemIcon>
                    <DeleteIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cancelar conta</ListItemText>
                </MenuItem>
              </Menu>
              <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>
                  Tem certeza que deseja cancelar sua conta?
                </DialogTitle>
                <DialogActions>
                  <Button onClick={() => setConfirmOpen(false)} color="primary">
                    Não
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    color="error"
                    variant="contained"
                  >
                    Cancelar conta
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </HeaderContent>
      </HeaderContainer>
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default Header;
