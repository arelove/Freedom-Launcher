import React, { useState } from 'react';
import {
    Card, CardContent, Typography, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Button 
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface UsageStats {
  launchCount: number;
  lastLaunch: string;
}

interface CardDetailProps {
  shortcut: {
    name: string;
    path: string;
    icon?: string;
    usageStats?: UsageStats;
    background?: string; // фон
  };
  onClose: () => void;
  onDelete: (index: number) => void; 
  index: number; 
}

const CardDetail: React.FC<CardDetailProps> = ({ shortcut, onClose, onDelete, index }) => {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false); // состояние для анимации закрытия

  const handleDelete = () => {
    onDelete(index); 
  };

  const handleClose = () => {
    setIsExiting(true); // включаем анимацию
    setTimeout(() => {
      onClose(); // закрываем диалог после завершения анимации
    }, 300); // время должно совпадать с продолжительностью анимации
  };

  // Стили для анимации
  const dialogStyle = {
    transform: isExiting ? 'translateY(-20px) scale(0.8)' : 'translateY(0)', // Сдвиг вверх
  transition: 'transform 0.3s ease',
    backgroundImage: shortcut.background ? `url(${shortcut.background})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose} // изменяем на handleClose
      PaperProps={{ style: dialogStyle }} // применяем стили
    >
      <DialogTitle>
        <IconButton onClick={handleClose} style={{ marginLeft: 'auto', color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6"><strong>{t('name')}:</strong> {shortcut.name}</Typography>
        <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
          <strong>{t('path')}:</strong> {shortcut.path}
        </Typography>
        {shortcut.icon && (
          <>
            <Typography variant="h6"><strong>{t('icon')}:</strong></Typography>
            <img src={shortcut.icon} alt={t('iconPreview')} style={{ width: '50px', height: '50px' }} />
          </>
        )}
        <Card style={{ backgroundColor: 'rgba(0,0,0,0.45)', marginTop: '16px' }}>
          <CardContent>
            <Typography variant="h6">{t('usageTime')}</Typography>
            <Typography>{t('launches')}: {shortcut.usageStats?.launchCount || 0}</Typography>
            <Typography>{t('lastLaunch')}: {shortcut.usageStats?.lastLaunch 
              ? new Date(shortcut.usageStats.lastLaunch).toLocaleString() 
              : t('noData')}</Typography>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
        <Button onClick={handleClose}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetail;
