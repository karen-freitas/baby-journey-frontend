import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '22px',
  lineHeight: '28px',
  fontWeight: 400,
  letterSpacing: 0,
  margin: 0,
  padding: '16px 0',
  color: theme.palette.text.primary,
}));
const SectionTitle = ({ text }) => {
  return (
    <Title variant="h2">
      {text}
    </Title>
  );
};

SectionTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SectionTitle;