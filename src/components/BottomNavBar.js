import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, styled } from '@mui/material';
import { Download, Add, MoreVert } from '@mui/icons-material';

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
  '& .MuiBottomNavigationAction-label': {
    fontSize: '0.75rem'
  },
  '& .MuiSvgIcon-root': {
    color: '#2C2C2C'
  }
});

const BottomNavBar = () => {
  const [value, setValue] = React.useState(0);

  const handleNavChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAction = (action) => {
    switch(action) {
      case 'download':
        console.log('Download clicked');
        break;
      case 'add':
        console.log('Add clicked');
        break;
      case 'more':
        console.log('More clicked');
        break;
      default:
        break;
    }
  };

  return (
    <StyledBottomNav elevation={3}>
      <BottomNavigation
        value={value}
        onChange={handleNavChange}
        sx={{ 
          height: 65,
          backgroundColor: 'white'
        }}
      >
        <StyledBottomNavigationAction
          label="Download"
          icon={<Download />}
          onClick={() => handleAction('download')}
        />
        <StyledBottomNavigationAction
          label="Add"
          icon={<Add />}
          onClick={() => handleAction('add')}
        />
        <StyledBottomNavigationAction
          label="More"
          icon={<MoreVert />}
          onClick={() => handleAction('more')}
        />
      </BottomNavigation>
    </StyledBottomNav>
  );
};

export default BottomNavBar;