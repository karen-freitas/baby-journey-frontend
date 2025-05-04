import React, { useState } from 'react';
import { Container, useTheme, useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import ImageCarousel from '../components/ImageCarousel';
import VerticalCardList from '../components/VerticalCardList';
import SectionTitle from '../components/SectionTitle';
import BottomNavBar from '../components/BottomNavBar';
import AddContentModal from '../components/AddContentModal';

const Home = () => {
  const theme = useTheme();
  const isMediumOrSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Header onAdd={handleOpenAddModal} />
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          pb: isMediumOrSmall ? '80px' : 2,
          minHeight: '100vh',
          mt: 0
        }}
      >
        <SectionTitle text={"Registros especiais"}/>
        <ImageCarousel />
        <SectionTitle text={"Conquistas"}/>
        <VerticalCardList />
      </Container>
      {isMediumOrSmall && <BottomNavBar onAdd={handleOpenAddModal} />}
      <AddContentModal open={isAddModalOpen} onClose={handleCloseAddModal} />
    </>
  );
};

export default Home;