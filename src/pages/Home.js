import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ImageCarousel from '../components/ImageCarousel';
import VerticalCardList from '../components/VerticalCardList';
import SnackbarMessage from '../components/SnackbarMessage';
import AddContentModal from '../components/AddContentModal';
import BottomNavBar from '../components/BottomNavBar';
import { Box, CircularProgress, Container, Button, Typography, Fab, useMediaQuery, useTheme } from '@mui/material';
import { Add, KeyboardArrowUp } from '@mui/icons-material';
import { useUserData } from '../context/UserDataContext';
import { useNavigate } from "react-router-dom";
import SectionTitle from '../components/SectionTitle';

const Home = () => {
  const navigate = useNavigate();
  const { memories, milestones, loading, fetchUserAndImages, setMemories, setMilestones } = useUserData();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addType, setAddType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
    const loginTimestamp = localStorage.getItem('loginTimestamp');
  if (loginTimestamp) {
    const loginDate = new Date(loginTimestamp);
    const now = new Date();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (now - loginDate > oneDayInMilliseconds) {
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  }
  }, [navigate]);

  const handleEditLocal = (updated, type) => {
    if (type === 'memory') {
      setMemories(memories => memories.map(m => m._id === updated._id ? { ...m, ...updated } : m));
    } else {
      setMilestones(milestones => milestones.map(m => m._id === updated._id ? { ...m, ...updated } : m));
    }
    setSnackbar({
      open: true,
      message: 'Alteração salva com sucesso!',
      severity: 'success',
    });
  };

  const handleDeleteLocal = (deletedId, type) => {
    if (type === 'memory') {
      setMemories(memories => memories.filter(m => m._id !== deletedId));
    } else {
      setMilestones(milestones => milestones.filter(m => m._id !== deletedId));
    }
    setSnackbar({
      open: true,
      message: 'Registro excluído com sucesso!',
      severity: 'success',
    });
  };

  React.useEffect(() => {
    fetchUserAndImages(true);
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Header onAdd={() => { setAddType(""); setAddModalOpen(true); }} />
      <Container maxWidth="lg" sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          pb: "80px",
          minHeight: "calc(100vh - 120px)",
          mt: 0,
      }}>
        <SectionTitle text={"Recordações especiais"}/>
        <ImageCarousel
          items={memories}
          onAddClick={() => { setAddType("special-records"); setAddModalOpen(true); }}
          onEditLocal={handleEditLocal}
          onDeleteLocal={handleDeleteLocal}
        />
         <SectionTitle text={"Marcos de desenvolvimento"}/>
        <VerticalCardList
          items={milestones}
          onAddClick={() => { setAddType("achievements"); setAddModalOpen(true); }}
          onEditLocal={handleEditLocal}
          onDeleteLocal={handleDeleteLocal}
        />
      </Container>
      <SnackbarMessage {...snackbar} onClose={() => setSnackbar({ ...snackbar, open: false })} />
      <AddContentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultType={addType}
      />
      <BottomNavBar onAdd={() => { setAddType(''); setAddModalOpen(true); }} />
    </>
  );
};

export default Home;
