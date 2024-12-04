import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface GameSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const GameSearch: React.FC<GameSearchProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();

  return (
    <TextField
      variant="outlined"
      placeholder={t('searchGames')}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  );
};

export default GameSearch;
