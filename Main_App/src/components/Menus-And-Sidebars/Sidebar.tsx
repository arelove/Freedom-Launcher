import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Drawer, List, ListItem, ListItemText, IconButton, Badge 
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useThemeContext } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../../pages/Applications/FavoritesContext'; // Импортируйте ваш контекст

import {
  Download as DownloadIcon, 
  Memory as MemoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as Brightness4Icon
} from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';


interface Props {
  open: boolean;
  onToggle: () => void;
}


const useStyles = makeStyles({
  drawer: {
    width: 20,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    transition: 'width 0.3s',
    position: 'relative',
    
  },
  drawerOpen: {
    width: 240,
    overflow: 'hidden',
  },
  drawerClose: {
    width: 0,
  },
  drawerPaper: {
    backgroundColor: '#3f51b5',
    color: '#ffffff',
    overflowX: 'hidden',
    transition: 'width 0.3s',
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#5c6bc0',
    }
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  toggleButton: {
    position: 'fixed',
    left: 0,
    top: '52%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1200,
    transition: 'transform 0.4s ease, background-color 0.4s ease',
  },
  toggleButtonOpen: {
    transform: 'translateX(530%) rotate(360deg)',
  },
  toggleButtonClose: {
    transform: 'translateY(0%) rotate(0deg) scale(0.8)',
    backdropFilter: "blur(10px)", /* Эффект размытия */
    backgroundColor: 'rgba(0,0,0,0.2)', 
  },
});


const Sidebar: React.FC<Props> = ({ open, onToggle }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { favoriteTorrents } = useFavorites(); 

  const { setThemeModeLightDark, themeModeLightDark } = useThemeContext();  // Достаем setThemeMode и themeMode из контекста

  // Функция для переключения темы
  const toggleTheme = () => {
    const newMode = themeModeLightDark === 'dark' ? 'light' : 'dark';
    setThemeModeLightDark(newMode); // Переключение темы
  };

  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
              backdropFilter: "blur(25px)", /* Эффект размытия */
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: "white",
          }}}
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: open ? classes.drawerOpen : classes.drawerClose,
        }}
      >
        <List>
          <ListItem button component={Link} to="/" className={classes.listItem}>
            <ListItemText primary={t('home')} />
          </ListItem>
          <ListItem button component={Link} to="/monitoring" className={classes.listItem}>
            <ListItemText primary={t('monitoring')} />
          </ListItem>
          <ListItem button component={Link} to="/applications" className={classes.listItem}>
            <ListItemText primary={t('applications')} />
          </ListItem>
          <ListItem button component={Link} to="/settings" className={classes.listItem}>
            <ListItemText primary={t('settings')} />
          </ListItem>
          <ListItem button component={Link} to="/InWork" className={classes.listItem}>
            <ListItemText primary={t('synchronization')} />
          </ListItem>
          <ListItem button component={Link} to="/InWork" className={classes.listItem}>
            <ListItemText primary={t('downloads')} />
          </ListItem>
        </List>
        <div className={classes.bottomButtons}>
          <IconButton color="inherit" component={Link} to="/download-page">
              <DownloadIcon />
          </IconButton>
          <IconButton color="inherit" onClick={toggleTheme}>
            <Brightness4Icon />
          </IconButton>
          <IconButton color="inherit" component={Link} to="/disk-analysis">
            <MemoryIcon />
          </IconButton>
          <IconButton color="inherit" component={Link} to="/favorites">
            <Badge badgeContent={favoriteTorrents.length} color="secondary">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </div>
      </Drawer>
      <button
        className={`${classes.toggleButton} ${open ? classes.toggleButtonOpen : classes.toggleButtonClose}`}
        onClick={onToggle}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </button>
    </>
  );
};

export default Sidebar;
