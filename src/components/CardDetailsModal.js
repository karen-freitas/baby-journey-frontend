import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  IconButton,
  TextField,
  styled
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';

const StyledImage = styled('img')({
  width: '100%',
  maxHeight: '400px',
  objectFit: 'cover',
  borderRadius: '1rem',
});

const CardDetailsModal = ({ open, onClose, item, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedItem({ ...item });
  };

  const handleSave = () => {
    onEdit(editedItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItem(item);
  };

  if (!item) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        {isEditing ? (
          <TextField
            fullWidth
            value={editedItem.title}
            onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
            variant="standard"
          />
        ) : (
          <Typography variant="h6">{item.title}</Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={handleEdit}>
            <FaEdit />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete(item)}>
            <FaTrash />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <StyledImage src={item.imageUrl} alt={item.title} />
        </Box>

        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
            />
            <TextField
              type="date"
              label="Date"
              value={editedItem.date || ''}
              onChange={(e) => setEditedItem({ ...editedItem, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {item.date || 'Not specified'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {isEditing ? (
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailsModal;
