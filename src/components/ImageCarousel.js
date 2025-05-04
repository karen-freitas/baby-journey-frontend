import React, { useState, useRef, useCallback } from "react";
import { Box, IconButton, styled } from "@mui/material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CardDetailsModal from './CardDetailsModal';

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
  "&:active": {
    cursor: "grabbing"
  }
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  flex: "0 0 auto",
  width: "300px",
  height: "200px",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
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
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)"
  },
  zIndex: 1
}));

const ImageCarousel = ({ visibleImages = 3 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragX, setDragX] = useState(0);
  const dragThreshold = 50;

  // Add modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      alt: "Landscape 1",
      title: "Mountain View",
      description: "Beautiful mountain landscape with stunning views.",
      date: "2024-01-15"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb",
      alt: "Landscape 2",
      title: "Forest Path",
      description: "Serene path through a dense forest.",
      date: "2024-01-16"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      alt: "Landscape 3",
      title: "Sunset Valley",
      description: "Beautiful sunset over a peaceful valley.",
      date: "2024-01-17"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
      alt: "Landscape 4",
      title: "Mountain Lake",
      description: "Crystal clear mountain lake surrounded by peaks.",
      date: "2024-01-18"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe",
      alt: "Landscape 5",
      title: "Ocean View",
      description: "Breathtaking view of the ocean at sunset.",
      date: "2024-01-19"
    }
  ];

  const displayImages = [...images, ...images, ...images];
  const totalImages = images.length;
  const baseIndex = totalImages;

  // Add modal handlers
  const handleImageClick = (image) => {
    if (!isDragging) {
      setSelectedImage({
        ...image,
        imageUrl: image.url // Map url to imageUrl for CardDetailsModal
      });
      setModalOpen(true);
    }
  };

  const handleEdit = (editedItem) => {
    // Handle image edit
    console.log('Edited image:', editedItem);
    setModalOpen(false);
  };

  const handleDelete = (deletedItem) => {
    // Handle image deletion
    console.log('Deleted image:', deletedItem);
    setModalOpen(false);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= totalImages * 2) {
        return baseIndex;
      }
      return nextIndex;
    });
  }, [totalImages, baseIndex]);
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev - 1;
      if (nextIndex < baseIndex - totalImages) {
        return baseIndex + totalImages - 1;
      }
      return nextIndex;
    });
  }, [totalImages, baseIndex]);
  const handleDragStart = (e) => {
    setIsDragging(true);
    const point = e.touches ? e.touches[0] : e;
    setStartX(point.pageX);
    setDragX(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const point = e.touches ? e.touches[0] : e;
    const difference = point.pageX - startX;
    setDragX(difference);
};

  const handleDragEnd = () => {
    if (!isDragging) return;

    if (Math.abs(dragX) > dragThreshold) {
      if (dragX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    setIsDragging(false);
    setDragX(0);
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13";
    e.target.alt = "Fallback Image";
  };

  const slideWidth = 320;
  const currentTransform = -((currentIndex * slideWidth) + (isDragging ? -dragX : 0));

  return (
    <CarouselContainer
      role="region"
      aria-label="Image Carousel"
    >
      {currentIndex > 0 && (
        <NavigationButton
          onClick={handlePrev}
          aria-label="Previous image"
          sx={{ left: 0 }}
        >
          <FaChevronLeft />
        </NavigationButton>
      )}

      <ImageContainer
        ref={containerRef}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onMouseMove={handleDragMove}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onTouchMove={handleDragMove}
        sx={{
          transform: `translateX(${currentTransform}px)`,
          transition: isDragging ? 'none' : 'transform 0.5s ease',
          touchAction: "none"
        }}
      >
        {displayImages.map((image, index) => (
          <ImageWrapper 
            key={`${index}-${image.url}`}
            onClick={() => handleImageClick(image)}
            sx={{ cursor: 'pointer' }}
          >
            <CarouselImage
              src={image.url}
              alt={image.alt}
              loading="lazy"
              onError={handleImageError}
              draggable="false"
            />
          </ImageWrapper>
        ))}
      </ImageContainer>

      <NavigationButton
        onClick={handleNext}
        aria-label="Next image"
        sx={{ right: 0 }}
      >
        <FaChevronRight />
      </NavigationButton>

      <CardDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedImage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </CarouselContainer>
  );
};

export default ImageCarousel;