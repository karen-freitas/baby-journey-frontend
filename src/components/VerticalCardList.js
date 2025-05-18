import React, { useState } from "react";
import { Box, Card, CardContent, CardMedia, Typography, styled, useTheme, useMediaQuery } from "@mui/material";
import CardDetailsModal from './CardDetailsModal';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import unavailableImage from '../assets/unavailable.png';

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  margin: "16px",
  position: "relative",
  transition: "all 0.3s ease",
  height: theme.breakpoints.down('sm') ? '120px' : '160px',
  cursor: 'pointer',
  backgroundColor: '#F4F4F4',
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    margin: '8px 0',
    borderRadius: 0,
  },
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

const VerticalCardList = ({ items = [], onAddClick, onEditLocal, onDeleteLocal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  if (!items || items.length === 0) {
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
          Adicione uma conquista
        </Button>
      </Box>
  );
  }

  return (
    <ListContainer>
      {items.map((item) => (
        <StyledCard key={item._id} onClick={() => handleCardClick(item)}>
          {item.file ?
            <CardMedia
              component="img"
              sx={{
                width: isMobile ? 120 : 160,
                height: isMobile ? 120 : 160,
                objectFit: 'cover'
              }}
              image={item.file}
              alt={item.title}
              onError={(e) => {
               e.target.src = unavailableImage;
              }}
            /> :
            <Box sx={{ width: isMobile ? 120 : 160, height: isMobile ? 120 : 160, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
              <Typography variant="caption" color="text.secondary">Sem imagem</Typography>
            </Box>
          }
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {item.date}
              </Typography>
            </CardContent>
          </ContentWrapper>
        </StyledCard>
      ))}
      <CardDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
        onEditLocal={onEditLocal}
        onDeleteLocal={onDeleteLocal}
      />
    </ListContainer>
  );
};

export default VerticalCardList;