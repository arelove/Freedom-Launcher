import React from 'react';
import { Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface GameFilterProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const GameFilter: React.FC<GameFilterProps> = ({ filter, setFilter }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="left" mb={2} sx={{ gap: 1 }}>
      <Button variant={filter === 'all' ? 'contained' : 'outlined'} onClick={() => setFilter('all')}>
        {t('allGames')}
      </Button>
      <Button variant={filter === 'popular' ? 'contained' : 'outlined'} onClick={() => setFilter('popular')}>
        {t('popular')}
      </Button>
      <Button variant={filter === 'openworld' ? 'contained' : 'outlined'} onClick={() => setFilter('openworld')}>
        {t('openWorld')}
      </Button>
      <Button variant="contained" color="primary" onClick={() => navigate('/rutor')}>
      {t('openRutor')}
      </Button>
    </Box>
      
  );
};

export default GameFilter;
