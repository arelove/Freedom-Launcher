// src/components/BackgroundModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Grid, Card, CardMedia, CardActionArea, CardActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import ImageSettingsModal from './ImageSettingsModal';

interface BackgroundModalProps {
  open: boolean;
  onClose: () => void;
  onFileChange: (file: File) => void;
  onGifSelect: (gifUrl: string, blur: number, brightness: number) => void;
}

const BackgroundModal: React.FC<BackgroundModalProps> = ({ open, onClose, onFileChange, onGifSelect }) => {
  const [gifList, setGifList] = useState<{ id: string, url: string, blur: number, brightness: number }[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentGif, setCurrentGif] = useState<{ id: string, url: string, blur: number, brightness: number }>({ id: '', url: '', blur: 0, brightness: 100 });



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const newGif = { id: uuidv4(), url: fileURL, blur: 0, brightness: 100 };
      setGifList(prevList => [...prevList, newGif]);
      onFileChange(file);
      onGifSelect(fileURL, 0, 100); // Применение фона сразу после выбора
    }
  };

  const handleImageClick = (gif: { url: string, blur: number, brightness: number }) => {
    onGifSelect(gif.url, gif.blur, gif.brightness);
  };

  const handleSettingsClick = (gif: { id: string, url: string, blur: number, brightness: number }) => {
    setCurrentGif(gif);
    setSettingsOpen(true);
  };

  const handleDeleteClick = (gifId: string) => {
    setGifList(prevList => prevList.filter(gif => gif.id !== gifId));
  };

  const handleSettingsClose = (updatedGif: { id: string, blur: number, brightness: number } | null) => {
    if (updatedGif) {
      setGifList(prevList => 
        prevList.map(gif => gif.id === updatedGif.id ? { ...gif, blur: updatedGif.blur, brightness: updatedGif.brightness } : gif));
    }
    setSettingsOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            
          },
        }}
      >
        <DialogTitle>
          Выбор фона
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            style={{ position: 'absolute', right: 16, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="upload-background"
            
          
          />
          <Grid container spacing={2} style={{ marginTop: 16 } }  >
            {gifList.map((gif, index) => (
              <Grid item xs={4} sm={3} md={2} key={gif.id}>
                <Card style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <CardActionArea onClick={() => handleImageClick(gif)}>
                    <CardMedia
                      
                      component="img"
                      height="140"
                      image={gif.url}
                      alt={`GIF Preview ${index + 1}`}
                      style={{ filter: `blur(${gif.blur}px) brightness(${gif.brightness}%)` }}
                      
                    />
                  </CardActionArea>
                  <CardActions style={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <IconButton onClick={() => handleSettingsClick(gif)} size="small" style={{ color: 'white' }}>
                      <SettingsIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(gif.id)} size="small" style={{ color: 'white' }}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {gifList.length < 9 && (
              <Grid item xs={4} sm={3} md={2}>
                <label htmlFor="upload-background">
                  <Card style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
                    <IconButton color="primary" component="span">
                      +
                    </IconButton>
                  </Card>
                </label>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
      <ImageSettingsModal
        open={settingsOpen}
        onClose={() => handleSettingsClose(null)}
        imageSrc={currentGif.url}
        onApply={(blur, brightness) => handleSettingsClose({ id: currentGif.id, blur, brightness })}
      />
    </>
  );
};

export default BackgroundModal;
