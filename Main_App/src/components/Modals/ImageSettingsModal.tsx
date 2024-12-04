import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Slider, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImageSettingsModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  onApply: (blur: number, brightness: number) => void;
}

const ImageSettingsModal: React.FC<ImageSettingsModalProps> = ({ open, onClose, imageSrc, onApply }) => {
  const [blur, setBlur] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);

  const handleBlurChange = (_event: Event, newValue: number | number[]) => {
    setBlur(newValue as number);
  };

  const handleBrightnessChange = (_event: Event, newValue: number | number[]) => {
    setBrightness(newValue as number);
  };

  const handleApply = () => {
    onApply(blur, brightness);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Темный фон с блюром
          color: 'white'
        }
      }}
    >
      <DialogTitle>
        Настройки изображения
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img 
            src={imageSrc} 
            alt="Selected" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              filter: `blur(${blur}px) brightness(${brightness}%)` 
            }} 
          />
        </div>
        <Typography gutterBottom>Blur</Typography>
        <Slider
          value={blur}
          onChange={handleBlurChange}
          aria-labelledby="blur-slider"
          step={1}
          min={0}
          max={10}
          marks
        />
        <Typography gutterBottom>Brightness</Typography>
        <Slider
          value={brightness}
          onChange={handleBrightnessChange}
          aria-labelledby="brightness-slider"
          step={1}
          min={0}
          max={200}
          marks
        />
        <Button onClick={handleApply} color="primary" variant="contained" style={{ marginTop: 16 }}>
          Применить
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSettingsModal;
