import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Modal,
  Button,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: '16px',
  transition: 'transform 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2),
  outline: 'none',
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  [theme.breakpoints.up('md')]: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    maxHeight: '80vh',
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  zIndex: 1,
}));

const ContentCard = ({ 
  image, 
  title, 
  description, 
  date, 
  onAdd, 
  onDelete 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <StyledCard onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="194"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            {formattedDate}
          </Typography>
        </CardContent>
      </StyledCard>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalContent>
          <CloseButton onClick={handleCloseModal}>
            <CloseIcon />
          </CloseButton>

          <Box sx={{ 
            width: '100%',
            position: 'relative',
            mt: isMobile ? 4 : 0 
          }}>
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{
                width: '100%',
                maxHeight: isMobile ? '300px' : '400px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {title}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {description}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {formattedDate}
              </Typography>

              <Box sx={{ 
                mt: 3,
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end'
              }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd();
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ContentCard;
