import React, { useState } from 'react';
import {
  Paper, BottomNavigation, BottomNavigationAction, styled, Menu, MenuItem, Dialog, DialogActions, DialogTitle, Button
} from '@mui/material';
import { Add, MoreVert, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { deleteUser } from '../services/apiService';
import SnackbarMessage from './SnackbarMessage';

const StyledBottomNav = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  borderRadius: '12px 12px 0 0',
  boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.up('md')]: {
    display: 'none'
  }
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)({
  '& .MuiSvgIcon-root': {
    color: '#2C2C2C'
  }
});

const BottomNavBar = ({ onAdd }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const { resetContext } = useUserData();
  const handleMenuOpen = (e) => setMenuAnchorEl(e.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleLogout = () => {
    setConfirmLogoutOpen(true);
  };
  const confirmLogout = () => {
    localStorage.clear();
    resetContext && resetContext();
    setConfirmLogoutOpen(false);
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setConfirmDeleteOpen(false);
    handleMenuClose();
    try {
      const userId = localStorage.getItem('userId');
      await deleteUser(userId);
      localStorage.clear();
      resetContext && resetContext();
      setSnackbar({ open: true, message: 'Conta cancelada com sucesso.', severity: 'success' });
      setTimeout(() => navigate('/register'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: 'Erro ao cancelar conta. Tente novamente.', severity: 'error' });
    }
  };

  return (
    <>
      <StyledBottomNav elevation={3}>
        <BottomNavigation showLabels={false}>
          <StyledBottomNavigationAction
            icon={<Logout />}
            onClick={handleLogout}
            aria-label="Sair"
          />
          <StyledBottomNavigationAction
            icon={<Add />}
            onClick={onAdd}
            aria-label="Adicionar"
          />
          <StyledBottomNavigationAction
            icon={<MoreVert />}
            onClick={handleMenuOpen}
            aria-label="Mais ações"
          />
        </BottomNavigation>
      </StyledBottomNav>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MenuItem onClick={() => { setConfirmDeleteOpen(true); handleMenuClose(); }}>
          Cancelar conta
        </MenuItem>
      </Menu>
      <Dialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)}>
        <DialogTitle>Tem certeza que deseja sair da conta?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmLogoutOpen(false)} color="primary">
            Não
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            Sair
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Tem certeza que deseja cancelar sua conta?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Não
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Cancelar conta
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default BottomNavBar;