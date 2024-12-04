import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ToggleButtonsProps {
  value: number;
  options: number[];
  onChange: (event: React.MouseEvent<HTMLElement>, newValue: number | null) => void;
  ariaLabel: string;
}

const ToggleButtons: React.FC<ToggleButtonsProps> = ({ value, options, onChange, ariaLabel }) => {
  return (
    <ToggleButtonGroup 
        value={value} 
        exclusive onChange={onChange} 
        aria-label={ariaLabel}
        sx={{height: 24}}
    >
        {options.map((option) => (
          <ToggleButton key={option} value={option}>
            {option}
          </ToggleButton>
        ))}
    </ToggleButtonGroup>
  );
};

export default ToggleButtons;
