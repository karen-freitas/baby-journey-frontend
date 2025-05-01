import React from 'react';
import { Container, useTheme, useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import ImageCarousel from '../components/ImageCarousel';
import VerticalCardList from '../components/VerticalCardList';
import SectionTitle from '../components/SectionTitle';
import BottomNavBar from '../components/BottomNavBar';

const Home = () => {
  const theme = useTheme();
  const isMediumOrSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Header />
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          pb: isMediumOrSmall ? '80px' : 2, // Add padding bottom for BottomNavBar
          minHeight: '100vh',
          mt: 0
        }}
      >
        <SectionTitle text={"Registros especiais"}/>
        <ImageCarousel />
        <VerticalCardList />
      </Container>
      {isMediumOrSmall && <BottomNavBar />}
    </>
  );
};

export default Home;