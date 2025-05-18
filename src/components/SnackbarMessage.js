import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarMessage = ({ open, onClose, message, severity = "info" }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} elevation={6} variant="filled">
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarMessage;