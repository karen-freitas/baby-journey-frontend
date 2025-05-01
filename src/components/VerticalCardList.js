import React, { useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, Dialog, Skeleton, styled, useTheme, useMediaQuery } from "@mui/material";
import CardDetailsModal from './CardDetailsModal';

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  margin: "16px",
  position: "relative",
  transition: "all 0.3s ease",
  height: theme.breakpoints.down('sm') ? '120px' : '160px',
  cursor: 'pointer',
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4]
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    margin: '8px 0',
    borderRadius: 0,
  }
}));

const ContentWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflow: 'hidden'
});

const ListContainer = styled(Box)(({ theme }) => ({
  maxHeight: "100vh",
  overflowY: "auto",
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: 0,
    margin: '0 -16px',
    width: 'calc(100% + 32px)',
  }
}));

const VerticalCardList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    {
      id: 1,
      title: "Mountain Adventure xxxxxxxxxxxxxxx",
      description: "Explore the beautiful mountains and experience nature at its finest. This guided tour takes you through scenic trails and breathtaking viewpoints.",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Beach Paradise",
      description: "Relax on pristine beaches with crystal clear waters. Perfect for swimming, sunbathing, and enjoying water sports activities.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
    },
    {
      id: 3,
      title: "City Exploration",
      description: "Discover the vibrant urban life with its modern architecture, cultural attractions, and diverse culinary experiences.",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
    }
  ]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleEdit = (editedItem) => {
    setItems(items.map(item =>
      item.id === editedItem.id ? editedItem : item
    ));
  };

  const handleDelete = (itemToDelete) => {
    setItems(items.filter(item => item.id !== itemToDelete.id));
    setModalOpen(false);
  };

  const LoadingSkeleton = () => (
    <StyledCard>
      <Skeleton
        variant="rectangular"
        width={isMobile ? 120 : 160}
        height={isMobile ? 120 : 160}
      />
      <ContentWrapper sx={{ p: isMobile ? 1 : 2 }}>
        <Skeleton variant="text" width="80%" height={40} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
      </ContentWrapper>
    </StyledCard>
  );

  return (
    <ListContainer>
      {loading ? (
        [...Array(3)].map((_, index) => <LoadingSkeleton key={index} />)
      ) : items.length === 0 ? (
        <Typography variant="h6" align="center">
          No items to display
        </Typography>
      ) : (
        <>
          {items.map((item) => (
            <StyledCard key={item.id} onClick={() => handleCardClick(item)}>
              <CardMedia
                component="img"
                sx={{
                  width: isMobile ? 120 : 160,
                  height: isMobile ? 120 : 160,
                  objectFit: 'cover'
                }}
                image={item.imageUrl}
                alt={item.title}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13";
                }}
              />
              <ContentWrapper>
                <CardContent sx={{
                  p: isMobile ? 1.5 : 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  '&:last-child': { pb: isMobile ? 1.5 : 2 }
                }}>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    component="div"
                    noWrap
                    sx={{
                      fontSize: isMobile ? '0.9rem' : '1.1rem',
                      mb: 0.5,
                      fontWeight: 600
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: isMobile ? 2 : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </ContentWrapper>
            </StyledCard>
          ))}

          <CardDetailsModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            item={selectedItem}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </ListContainer>
  );
};

export default VerticalCardList;