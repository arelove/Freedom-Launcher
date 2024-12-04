import React from 'react';
import { Pagination } from '@mui/material';

interface GamePaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const GamePagination: React.FC<GamePaginationProps> = ({ count, page, onChange }) => {

  return (
    <Pagination
      count={count}
      page={page}
      onChange={onChange}
      sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
    />
  );
};

export default GamePagination;
