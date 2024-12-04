import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  gameCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '180px',
    color: 'white',
    '&:hover': {
      transition: 'transform 0.2s, background-color 0.3s',
      transform: 'scale(1.02)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    '@media (max-height: 660px)': {
      height: '20vh', // Высота 20% от высоты экрана при маленьком экране
    },
  },
  downloadButton: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    '&:hover': {
      transition: 'transform 0.2s, background-color 0.3s',
      color: 'lightblue',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    position: 'relative',
  },
}));

interface GameCardProps {
  game: { name: string; path: string; icon: string };
  onDownload: (path: string) => void;
  onClick: () => void;
  // toggleFavorite: (game: { name: string; path: string; icon: string }) => void; // Добавление toggleFavorite
  // isFavorite: boolean; // Добавление isFavorite
}

const GameCard: React.FC<GameCardProps> = ({ game, onDownload, onClick}) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.gameCard}
      style={{ backgroundImage: `url(${game.icon})` }}
      onClick={onClick}
    >
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" sx={{ fontSize: '14px' }}>
          {game.name}
        </Typography>
        
        <IconButton
          className={classes.downloadButton}
          size="small"
          sx={{
            ml: 1,
            "&.MuiButtonBase-root:hover": {
              bgcolor: "transparent"
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDownload(game.path);
          }}
        >
          <DownloadIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default GameCard;

