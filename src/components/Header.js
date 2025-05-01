import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  IconButton, 
  useTheme, 
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import babyFeet from '../assets/icons8-caminho-de-pegadas-de-bebê-96.png';
import { Add as AddIcon, Logout as LogoutIcon } from '@mui/icons-material';
const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '120px',
  background: '#ACFFDE',
  display: 'flex',
  alignItems: 'flex-start',
  position: 'relative',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: '30px',
    background: 'white',
    clipPath: 'polygon(100% 100%, 0% 100%, 0% 60%, 4% 65%, 8% 70%, 12% 74%, 16% 77%, 20% 79%, 24% 80%, 28% 80%, 32% 79%, 36% 77%, 40% 74%, 44% 70%, 48% 65%, 52% 60%, 56% 55%, 60% 51%, 64% 47%, 68% 44%, 72% 41%, 76% 38%, 80% 35%, 84% 32%, 88% 30%, 92% 28%, 96% 27%, 100% 25%)'
  }
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  position: 'relative',
  zIndex: 2,
  padding: '1rem 1rem 0 1rem',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 24px 0 24px',
  },
  [theme.breakpoints.up('md')]: {
    padding: '1rem 32px 0 32px',
  },
  [theme.breakpoints.up('lg')]: {
    padding: '1rem 32px 0 80px',
  }
}));

const TitleContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  fontSize: '3.5rem',
  textShadow: '4px 4px 6px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  fontFamily: "Gamja Flower",
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  }
}));

const BabyFeet = styled('img')({
  height: '4rem',
  width: 'auto',
  filter: 'brightness(0) invert(1) drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.3))',
  marginLeft: '10px'
});

const MenuButton = styled(IconButton)({
  color: 'white',
  filter: 'drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.3))',
  padding: 0,
  marginLeft: '8px'
});

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  cursor: 'pointer',
  boxShadow: '4px 4px 6px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#fff',
  color: '#2C2C2C',
}));

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isHomePage = location.pathname === '/home';

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
};

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    // Add lógica
    navigate('/register');
  };

  const handleAdd = () => {
    handleClose();
    // Add lógica
    console.log('Add content clicked');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <TitleContainer>
          <HeaderTitle variant="h1">
            Baby Journey 
            <BabyFeet src={babyFeet} alt="baby feet icon" />
          </HeaderTitle>
        </TitleContainer>
        
        {isHomePage && (
          <UserAvatar onClick={handleAvatarClick}>
            {/* Colocar foto*/}
            B
          </UserAvatar>
        )}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {isLargeScreen && isHomePage && (
            <MenuItem onClick={handleAdd}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Adicionar</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sair</ListItemText>
          </MenuItem>
        </Menu>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
