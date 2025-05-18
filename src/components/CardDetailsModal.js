import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
  IconButton, TextField, styled
} from '@mui/material';
import SnackbarMessage from './SnackbarMessage';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../constants/appConstants';
import { updateMilestone, updateMemory, deleteMilestone, deleteMemory } from '../services/apiService';
import { useUserData } from '../context/UserDataContext';

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: '70vh', 
  objectFit: 'contain', 
  borderRadius: '10px', 
  display: 'block', 
  margin: '0 auto',
}));

const CardDetailsModal = ({ open, onClose, item }) => {
  const { deleteItem, updateItem } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    setEditedItem(item);
    if (!open) setIsEditing(false);
  }, [item, open]);

  const handleEditToggle = () => {
    if (isEditing) setEditedItem(item);
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      let apiDate = editedItem.date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(apiDate)) { // yyyy-mm-dd
        const [y, m, d] = apiDate.split('-');
        apiDate = `${d}/${m}/${y}`; // dd/mm/yyyy
      }
      const payload = {
        userId: localStorage.getItem('userId'),
        title: editedItem.title,
        description: editedItem.description,
        date: apiDate,
      };

      let type = item.type;
      if (type === "memory") {
        await updateMemory(item._id, payload);
      } else {
        await updateMilestone(item._id, payload);
      }

      setSnackbar({ open: true, message: 'Alteração salva com sucesso!', severity: 'success' });
      updateItem({ ...item, ...editedItem, date: apiDate }, type);
      setIsEditing(false);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      const apiErrorMessage = error.response?.data?.message || error.message || 'Tente novamente.';
      setSnackbar({ open: true, message: `Erro ao salvar alterações: ${apiErrorMessage}`, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('userId');
      let type = item.type;
      if (type === "memory") {
        await deleteMemory(item._id, userId);
      } else {
        await deleteMilestone(item._id, userId);
      }
      deleteItem(item._id, item.type);
      setSnackbar({ open: true, message: 'Registro excluído com sucesso!', severity: 'success' });
      setIsEditing(false);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      const apiErrorMessage = error.response?.data?.message || error.message || 'Tente novamente.';
      setSnackbar({ open: true, message: `Erro ao deletar: ${apiErrorMessage}`, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1
        }}>
          {isEditing ? (
            <TextField
              fullWidth
              name="title"
              value={editedItem?.title || ''}
              onChange={handleInputChange}
              variant="standard"
              inputProps={{ maxLength: TITLE_MAX_LENGTH }}
              helperText={`${editedItem?.title?.length || 0}/${TITLE_MAX_LENGTH}`}
              disabled={isSubmitting}
            />
          ) : (
            <Typography variant="h6">{item.title}</Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={handleEditToggle} disabled={isSubmitting}>
              <FaEdit />
            </IconButton>
            <IconButton size="small" color="error" onClick={handleDeleteClick} disabled={isSubmitting || isEditing}>
              <FaTrash />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {/* Verifica se item.imageUrl existe antes de tentar renderizar */}
          {item.file && (
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <StyledImage src={item.file} alt={item.title} />
            </Box>
          )}
          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Descrição"
                value={editedItem?.description || ''}
                onChange={handleInputChange}
                inputProps={{ maxLength: DESCRIPTION_MAX_LENGTH }}
                helperText={`${editedItem?.description?.length || 0}/${DESCRIPTION_MAX_LENGTH}`}
                disabled={isSubmitting}
              />
              <TextField
                type="date"
                name="date"
                label="Data"
                value={
                  /^\d{2}\/\d{2}\/\d{4}$/.test(editedItem?.date || '') ?
                    `${editedItem.date.split("/").reverse().join("-")}` :
                    editedItem?.date || ''
                }
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                disabled={isSubmitting}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {item.description || 'Nenhuma descrição fornecida.'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data: {item.date ? item.date : 'Não especificada'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {isEditing ? (
            <>
              <Button onClick={handleCancelEdit} disabled={isSubmitting}>Cancelar</Button>
              <Button onClick={handleSave} variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>Fechar</Button>
          )}
        </DialogActions>
      </Dialog>
      <SnackbarMessage {...snackbar} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </>
  );
};

export default CardDetailsModal;
