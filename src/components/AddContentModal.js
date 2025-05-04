import React, { useState } from 'react';
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
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';

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

const achievementTitles = [
  'Andou com apoio',
  'Aprendeu a rolar',
  'Começou a balbuciar',
  'Engatinhou',
  'Ficou em pé com apoio',
  'Ficou em pé sem apoio',
  'Levantou a cabeça de bruços',
  'Primeira gargalhada',
  'Primeiras palavrinha',
  'Primeiro sorriso',
  'Segurou objetos',
  'Sentou com apoio',
  'Sentou sem apoio',
  'Tentou alcançar objetos',
];

const specialRecordTitles = [
  'Aniversário',
  'Conhecendo a família',
  'Meus pézinhos',
  'Minhas mãozinhas',
  'Mesversário',
  'Na materinadade',
  'Primeira papinha',
  'Primeira viagem',
  'Primeira vez na praia',
  'Primeiro/a amiguinho/a',
  'Primeiro banho',
  'Primeiro brinquedo',
  'Primeiro corte de cabelo',
  'Primeiro dentinho',
  'Primeiro dia na escolinha',
  'Primeiro Natal',
  'Primeiro passeio',
];

const AddContentModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    type: '',
    titleType: 'predefined',
    title: '',
    customTitle: '',
    image: null,
    date: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const finalTitle = formData.titleType === 'custom' ? formData.customTitle : formData.title;
    const submitData = {
      ...formData,
      title: finalTitle,
    };
    console.log('Submitting:', submitData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      type: '',
      titleType: 'predefined',
      title: '',
      customTitle: '',
      image: null,
      date: '',
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Adicionar novo registro
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Image Upload */}
          <Box sx={{ textAlign: 'center' }}>
            {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCamera />}
              sx={{ mt: 1 }}
            >
              {imagePreview ? 'Trocar imagem' : 'Adicionar imagem'}
              <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>

          {/* Type Selection */}
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              label="Tipo"
              onChange={(e) => setFormData({ ...formData, type: e.target.value, title: '' })}
            >
              <MenuItem value="achievements">Conquistas</MenuItem>
              <MenuItem value="special-records">Registros Especiais</MenuItem>
            </Select>
          </FormControl>

          {/* Title Selection */}
          {formData.type && (
            <>
              <FormControl>
                <RadioGroup
                  value={formData.titleType}
                  onChange={(e) => setFormData({ ...formData, titleType: e.target.value })}
                  row
                >
                  <FormControlLabel value="predefined" control={<Radio />} label="Selecionar título" />
                  <FormControlLabel value="custom" control={<Radio />} label="Título personalizado" />
                </RadioGroup>
              </FormControl>

              {formData.titleType === 'predefined' ? (
                <FormControl fullWidth>
                  <InputLabel>Título</InputLabel>
                  <Select
                    value={formData.title}
                    label="Título"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  >
                    {(formData.type === 'achievements' ? achievementTitles : specialRecordTitles).map((title) => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Título personalizado"
                  value={formData.customTitle}
                  onChange={(e) => setFormData({ ...formData, customTitle: e.target.value })}
                />
              )}
            </>
          )}

          {/* Date Selection */}
          <TextField
            type="date"
            label="Data"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => { onClose(); handleReset(); }}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddContentModal;