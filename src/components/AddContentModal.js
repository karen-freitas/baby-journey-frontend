import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  styled,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import { postMilestone, postMemory } from '../services/apiService';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../constants/appConstants';
import { AchievementTitles, SpecialRecordTitles } from '../constants/RecordTitles';
import { useUserData } from '../context/UserDataContext';
import SnackbarMessage from './SnackbarMessage';
import imageCompression from 'browser-image-compression';

const ImagePreview = styled('img')({
  width: '100%',
  maxWidth: '100%',
  maxHeight: '300px',
  objectFit: 'contain',
  borderRadius: '8px',
  marginBottom: '16px',
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const achievementTitlesList = Object.values(AchievementTitles);
const specialRecordTitlesList = Object.values(SpecialRecordTitles);

const AddContentModal = ({ open, onClose, onSaveSuccess, defaultType }) => {
  const getInitialFormData = () => ({
    type: defaultType || "",
    titleType: 'predefined',
    title: '',
    customTitle: '',
    description: '',
    image: null,
    date: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Tipo é obrigatório.';
    if (formData.titleType === 'custom' && !formData.customTitle.trim()) {
      newErrors.customTitle = 'Título personalizado é obrigatório.';
    } else if (formData.titleType === 'custom' && formData.customTitle.length > TITLE_MAX_LENGTH) {
      newErrors.customTitle = `Título não pode exceder ${TITLE_MAX_LENGTH} caracteres.`;
    }
    if (formData.titleType === 'predefined' && !formData.title) {
      newErrors.title = 'Selecionar um título é obrigatório.';
    }
    if (!formData.date) newErrors.date = 'Data é obrigatória.';
    if (formData.description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Descrição não pode exceder ${DESCRIPTION_MAX_LENGTH} caracteres.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    // const MAX_FILE_SIZE = 10000000;

    if (file) {
      // if (file.size > MAX_FILE_SIZE) {
      //   setErrors((prev) => ({
      //     ...prev,
      //     image: 'O tamanho da imagem não pode exceder 3 MB.',
      //   }));
      //   return;
      // }
      const options = {
        maxSizeMB: 1, 
        maxWidthOrHeight: 1024,
        useWebWorker: true, 
      };

      const compressedFile = await imageCompression(file, options);

      setFormData({ ...formData, image: compressedFile });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const { addItem } = useUserData();

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const finalTitle = formData.titleType === 'custom' ? formData.customTitle : formData.title;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setSnackbar({ open: true, message: 'Erro: Usuário não identificado. Faça login novamente.', severity: 'error' });
      setIsSubmitting(false);
      return;
    }

    const formatDateForAPI = (dateStr) => {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    const payload = new FormData();
    payload.append('userId', userId);
    payload.append('title', finalTitle);
    payload.append('description', formData.description || '');
    payload.append('date', formatDateForAPI(formData.date));
    if (formData.image) {
      payload.append('file', formData.image);
    }

    const imageUrl = URL.createObjectURL(formData.image);
    const newItem = { title: finalTitle, description: formData.description, date: formData.date, file: imageUrl };

    try {
      let result;
      let type;
      if (formData.type === 'achievements') {
        result = await postMilestone(payload);
        type = "milestone";
      } else if (formData.type === 'special-records') {
        result = await postMemory(payload);
        type = "memory";
      }

      if (result && result._id) {
        await addItem(newItem, type);
        setSnackbar({ open: true, message: 'Registro salvo com sucesso!', severity: 'success' });
      }
      setTimeout(() => handleCloseModal(), 600);
    } catch (error) {
      const apiErrorMessage = error.response?.data?.message || error.message || 'Tente novamente.';
      setSnackbar({ open: true, message: `Erro ao salvar registro: ${apiErrorMessage}`, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(getInitialFormData());
    setImagePreview(null);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    handleReset();
    onClose();
  };

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      setImagePreview(null);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, defaultType]);

  return (
    <>
      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Adicionar novo registro
          <IconButton onClick={handleCloseModal} disabled={isSubmitting}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                sx={{ mt: imagePreview ? 1 : 0 }}
                disabled={isSubmitting}
              >
                {imagePreview ? 'Trocar imagem' : 'Adicionar imagem'}
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
              {errors.image && <FormHelperText error sx={{ textAlign: 'center' }}>{errors.image}</FormHelperText>}
            </Box>

            <FormControl fullWidth error={!!errors.type}>
              <InputLabel id="type-select-label">Tipo</InputLabel>
              <Select
                labelId="type-select-label"
                name="type"
                value={formData.type}
                label="Tipo"
                onChange={(e) => {
                  handleInputChange(e);
                  setFormData(prev => ({ ...prev, title: '', customTitle: '' }));
                }}
                disabled={isSubmitting}
              >
                <MenuItem value="achievements">Conquistas</MenuItem>
                <MenuItem value="special-records">Registros Especiais</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>

            {formData.type && (
              <>
                <FormControl component="fieldset" error={!!errors.titleType}>
                  <RadioGroup
                    name="titleType"
                    value={formData.titleType}
                    onChange={handleInputChange}
                    row
                  >
                    <FormControlLabel value="predefined" control={<Radio disabled={isSubmitting} />} label="Selecionar título" />
                    <FormControlLabel value="custom" control={<Radio disabled={isSubmitting} />} label="Título personalizado" />
                  </RadioGroup>
                  {errors.titleType && <FormHelperText>{errors.titleType}</FormHelperText>}
                </FormControl>

                {formData.titleType === 'predefined' ? (
                  <FormControl fullWidth error={!!errors.title}>
                    <InputLabel id="predefined-title-label">Título</InputLabel>
                    <Select
                      labelId="predefined-title-label"
                      name="title"
                      value={formData.title}
                      label="Título"
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      {(formData.type === 'achievements' ? achievementTitlesList : specialRecordTitlesList).map((titleOption) => (
                        <MenuItem key={titleOption} value={titleOption}>
                          {titleOption}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    name="customTitle"
                    label="Título personalizado"
                    value={formData.customTitle}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    inputProps={{ maxLength: TITLE_MAX_LENGTH }}
                    error={!!errors.customTitle}
                    helperText={errors.customTitle || `${formData.customTitle.length}/${TITLE_MAX_LENGTH}`}
                  />
                )}
              </>
            )}

            <TextField
              fullWidth
              name="description"
              label="Descrição (opcional)"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
              inputProps={{ maxLength: DESCRIPTION_MAX_LENGTH }}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/${DESCRIPTION_MAX_LENGTH}`}
            />

            <TextField
              name="date"
              type="date"
              label="Data"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={isSubmitting}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default AddContentModal;