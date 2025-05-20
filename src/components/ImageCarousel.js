import React, { useState, useCallback, useRef } from "react";
import { Box, IconButton, styled, Typography, Skeleton, Button } from "@mui/material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CardDetailsModal from './CardDetailsModal';
import unavailableImage from '../assets/unavailable.png';
import { Add } from '@mui/icons-material';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  padding: "20px 0",
  touchAction: "pan-y pinch-zoom"
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  transition: "transform 0.5s ease",
  gap: "20px",
  cursor: "grab",
  "&:active": { cursor: "grabbing" }
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  flex: "0 0 auto",
  width: "300px",
  height: "200px",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  position: "relative",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)"
  }
}));

const CarouselImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  userSelect: "none",
  WebkitUserDrag: "none"
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
  zIndex: 1,
  '&.Mui-disabled': { display: 'none' },
}));

const ImageCarousel = ({ items = [], onAddClick, onEditLocal, onDeleteLocal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const totalItems = items.length;
  const slideWidth = 300 + 20;
  const currentTransform = -currentIndex * slideWidth;

  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const handleImageClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalItems - 1));
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleImageError = (e) => {
    e.target.src = unavailableImage;
    e.target.alt = "Imagem indisponível";
  };

  // Swipe Handlers
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    const deltaX = currentX.current - startX.current;

    if (deltaX > 50) {
      handlePrev(); // Swipe para a direita
    } else if (deltaX < -50) {
      handleNext(); // Swipe para a esquerda
    }

    isDragging.current = false;
    startX.current = 0;
    currentX.current = 0;
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    currentX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    const deltaX = currentX.current - startX.current;

    if (deltaX > 50) {
      handlePrev(); // Swipe para a direita
    } else if (deltaX < -50) {
      handleNext(); // Swipe para a esquerda
    }

    isDragging.current = false;
    startX.current = 0;
    currentX.current = 0;
  };

  if (items.length === 0) {
    return (
      <Box textAlign="center" sx={{ my: 4 }}>
        <Button
          onClick={onAddClick}
          startIcon={<Add />}
          sx={{
            bgcolor: "rgb(83, 40, 87)", color: "white",
            '&:hover': { bgcolor: "rgb(164, 130, 185)" },
            px: 4, py: 2, mb: 2, width: '20rem',
          }}
          size="large"
          variant="contained"
        >
          Adicione um registro
        </Button>
      </Box>
    );
  }

  return (
    <CarouselContainer
      role="region"
      aria-label="Image Carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <NavigationButton
        onClick={handlePrev}
        aria-label="Imagem anterior"
        sx={{ left: -10 }}
        disabled={currentIndex === 0 || totalItems === 0}
      >
        <FaChevronLeft />
      </NavigationButton>
      <Box sx={{ overflow: 'hidden', width: '100%' }}>
        <ImageContainer sx={{
          transform: `translateX(${currentTransform}px)`,
          transition: 'transform 0.5s ease',
        }}>
          {items.map((item, index) => (
            <ImageWrapper key={item?._id || index} onClick={() => handleImageClick(item)}>
              {item.file ? (
                <CarouselImage
                  src={item.file}
                  alt={item.title || "Memory image"}
                  loading="lazy"
                  onError={handleImageError}
                  draggable="false"
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              )}
              <Box sx={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                color: 'white', p: 1, textAlign: 'center'
              }}>
                <Typography variant="caption" noWrap>{item.title}</Typography>
              </Box>
            </ImageWrapper>
          ))}
        </ImageContainer>
      </Box>
      <NavigationButton
        onClick={handleNext}
        aria-label="Próxima imagem"
        sx={{ right: -10 }}
        disabled={currentIndex >= totalItems - 1 || totalItems === 0}
      >
        <FaChevronRight />
      </NavigationButton>
      {selectedItem && (
        <CardDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={{ ...selectedItem, type: 'memory' }}
          onEditLocal={onEditLocal}
          onDeleteLocal={onDeleteLocal}
        />
      )}
    </CarouselContainer>
  );
};

export default ImageCarousel;