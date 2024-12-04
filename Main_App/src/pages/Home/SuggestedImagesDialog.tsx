import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, ImageList, ImageListItem, Button, DialogTitle, Snackbar, LinearProgress, TextField } from '@mui/material';
import { invoke } from '@tauri-apps/api';
import { AppShortcut } from './types';

interface SuggestedImagesDialogProps {
  open: boolean;
  onClose: () => void;
  query: string;
  onSave: (shortcut: AppShortcut, path: string) => void;
  selectedShortcut: AppShortcut | null;
}

const SuggestedImagesDialog: React.FC<SuggestedImagesDialogProps> = ({ open, onClose, query, onSave, selectedShortcut }) => {
  const [allImages, setAllImages] = useState<string[]>([]);
  const [displayedImages, setDisplayedImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputPath, setInputPath] = useState<string>(''); // Состояние для ввода пути
  const [loading, setLoading] = useState(false);
  const IMAGES_PER_PAGE = 5;

  useEffect(() => {
    if (open && query) {
      fetchImages(query);
    }
  }, [open, query]);

  const fetchImages = async (query: string) => {
    setLoading(true);
    try {
      const images: string[] = await invoke('fetch_images', { query });
      setAllImages(images);
      setDisplayedImages(images.slice(0, IMAGES_PER_PAGE));
      setCurrentIndex(0);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching images:", error);
      setErrorMessage("Ошибка при загрузке изображений.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    const nextIndex = currentIndex + IMAGES_PER_PAGE;
    if (nextIndex < allImages.length) {
      setDisplayedImages(allImages.slice(nextIndex, nextIndex + IMAGES_PER_PAGE));
      setCurrentIndex(nextIndex);
    }
  };

  const handlePreviousPage = () => {
    const prevIndex = currentIndex - IMAGES_PER_PAGE;
    if (prevIndex >= 0) {
      setDisplayedImages(allImages.slice(prevIndex, prevIndex + IMAGES_PER_PAGE));
      setCurrentIndex(prevIndex);
    }
  };

  const handleSaveImage = (_imagePath: string) => {
    if (selectedShortcut && inputPath) {
      onSave(selectedShortcut, inputPath); // Используйте введенный путь
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Предложения изображений</DialogTitle>
      <DialogContent>
        {loading && <LinearProgress />}
        <TextField
          label="Введите путь для сохранения"
          value={inputPath}
          onChange={(e) => setInputPath(e.target.value)} // Обновите состояние при вводе
          fullWidth
          margin="normal"
        />
        <ImageList cols={5} rowHeight={100}>
          {displayedImages.map((img) => (
            <ImageListItem key={img}>
              <img src={img} alt="Suggested" />
              <Button onClick={() => handleSaveImage(img)}>Сохранить</Button>
            </ImageListItem>
          ))}
        </ImageList>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Button disabled={currentIndex === 0} onClick={handlePreviousPage}>Назад</Button>
          <Button disabled={currentIndex + IMAGES_PER_PAGE >= allImages.length} onClick={handleNextPage}>Еще</Button>
        </div>
        <Button onClick={onClose}>Закрыть</Button>

        <Snackbar
          open={Boolean(errorMessage)}
          message={errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SuggestedImagesDialog;
