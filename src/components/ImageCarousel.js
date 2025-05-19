import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, IconButton, styled, Typography, Skeleton, Button, useTheme, useMediaQuery } from "@mui/material";
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
  cursor: "pointer",
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
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const ImageCarousel = ({ items = [], onAddClick, onEditLocal, onDeleteLocal }) => {
  const theme = useTheme();
  const isSmallOrMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalItems = items.length;
  const slideWidthWithGap = 300 + 20;

  const imageContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);
  const currentTranslateX = useRef(0);
  const handleImageClick = (item) => {
    if (Math.abs(touchEndX.current - touchStartX.current) < 10) {
    setSelectedItem(item);
    setModalOpen(true);
    }
  };

  const updatePosition = (animate = true) => {
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transition = animate ? "transform 0.5s ease" : "none";
      currentTranslateX.current = -currentIndex * slideWidthWithGap;
      imageContainerRef.current.style.transform = `translateX(${currentTranslateX.current}px)`;
    }
  };

  useEffect(() => {
    updatePosition();
  }, [currentIndex, slideWidthWithGap]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalItems - 1));
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleTouchStart = (e) => {
    if (!isSmallOrMediumScreen || totalItems <= 1) return;
    touchStartX.current = e.targetTouches[0].clientX;
    isSwiping.current = true;
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transition = "none";
    }
};

  const handleTouchMove = (e) => {
    if (!isSwiping.current || !isSmallOrMediumScreen || totalItems <= 1) return;
    touchEndX.current = e.targetTouches[0].clientX;
    const diffX = touchEndX.current - touchStartX.current;
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transform = `translateX(${currentTranslateX.current + diffX}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current || !isSmallOrMediumScreen || totalItems <= 1) return;
    isSwiping.current = false;
    const diffX = touchEndX.current - touchStartX.current;
    const swipeThreshold = slideWidthWithGap / 3;

    if (imageContainerRef.current) {
      imageContainerRef.current.style.transition = "transform 0.5s ease";
    }

    if (diffX < -swipeThreshold) {
      handleNext();
    } else if (diffX > swipeThreshold) {
      handlePrev();
    } else {
      updatePosition();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleImageError = (e) => {
    e.target.src = unavailableImage;
    e.target.alt = "Imagem indisponível";
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
    >
      <NavigationButton
        onClick={handlePrev}
        aria-label="Imagem anterior"
        sx={{ left: { xs: -5, sm: -10 } }}
        disabled={currentIndex === 0 || totalItems === 0}
      >
        <FaChevronLeft />
      </NavigationButton>
      <Box sx={{ overflow: 'hidden', width: '100%' }}>
        <ImageContainer
          ref={imageContainerRef}
          sx={{
            transform: `translateX(${currentTranslateX.current}px)`,
            transition: 'transform 0.5s ease',
          }}
        >
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
        sx={{ right: { xs: -5, sm: -10 } }}
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