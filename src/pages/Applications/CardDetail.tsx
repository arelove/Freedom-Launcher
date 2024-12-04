import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, CircularProgress, Box, Divider } from '@mui/material';
import { invoke } from '@tauri-apps/api/tauri';
import { useTranslation } from 'react-i18next';
import SmoothScrollContainer from '../Home/SmoothScrollContainer';


interface CardDetailProps {
  open: boolean;
  onClose: () => void;
  gameUrl: string | null;
}

const parseDetailsAndRequirements = (data: string, isSystemRequirements: boolean = false) => {
  try {
    if (isSystemRequirements) {
      return data
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line, index) => (
          <Typography variant="body2" key={index}>
            {line.trim()}
          </Typography>
        ));
    } else {
      const detailsObj = JSON.parse(data);
      return Object.entries(detailsObj).map(([key, value]) => (
        <Typography variant="body2" key={key}>
          <strong>{key}</strong>{' '}
          {/* Преобразуем значение в строку, если это объект или другой тип */}
          {typeof value === 'string' || typeof value === 'number' ? value : 'не указано'}
        </Typography>
      ));
    }
  } catch (e) {
    return <Typography variant="body2">Ошибка при обработке данных</Typography>;
  }
};


const CardDetail: React.FC<CardDetailProps> = ({ open, onClose, gameUrl }) => {
  const { t } = useTranslation();
  const [gameData, setGameData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameUrl) {
      setError(t('errorUrlLoad'));
      setLoading(false);
      return;
    }

    const fetchGameData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await invoke<string>('fetch_game_detail', { url: gameUrl });
        setGameData(JSON.parse(data));
      } catch (err) {
        setError(t('errorDataLoad')); // {t('errorDataLoad')}
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameUrl]);

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('error')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{error}</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!gameData) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('noData')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{t('noDataAvailable')}</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: "blur(10px)",
          borderRadius: '20px',
          color: 'white',
          width: '80vw',
          maxWidth: '800px',
          height: '80vh',
          maxHeight: '80vh',
          overflow: 'hidden', // Убираем стандартные полосы прокрутки
        },
      }}
    >
      <DialogTitle>{gameData.title || t('untitled')}</DialogTitle>
      <SmoothScrollContainer
      damping={0.1}
      thumbMinSize={25}
      renderByPixels={false}
      height="75vh" // изменить высоту контейнера, если нужно
      >
      <DialogContent
        sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden', // Убираем стандартные полосы прокрутки
        }}
      >
        
          {/* Изображение игры, если есть */}
          {gameData.image && (
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
              <img
                src={'https://repack-games.ru/' + gameData.image}
                alt={gameData.title}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 8,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
              />
            </Box>
          )}
          {/* Дополнительные детали игры и системные требования */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 1 }}
          >
            {t('additionalDetails')}
          </Typography>
          {parseDetailsAndRequirements(gameData.details || '{}')}
          <Divider sx={{ marginY: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 1 }}
          >
            {t('systemRequirements')}
          </Typography>
          {parseDetailsAndRequirements(gameData.system_requirements || '', true)}
          <Divider sx={{ marginY: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 1 }}
          >
            {t('description')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {gameData.description ? gameData.description.replace(/На этой странице.*$/, '').trim() : t('noDescription')}
          </Typography>
      </DialogContent>
      </SmoothScrollContainer>
    </Dialog>
  );
};

export default CardDetail;
