import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, Popover, Box, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  Notifications as NotificationsIcon, 
  AccountCircle as AccountCircleIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import AnchorIcon from '@mui/icons-material/Anchor';
// import {createTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';

// const themes = {
//   default: createTheme({
//     palette: {
//       primary: {
//         main: '#1976d2',
//       },
//       secondary: {
//         main: '#dc004e',
//       },
//     },
//   }),
//   sand: createTheme({
//     palette: {
//       primary: {
//         main: '#c2b280',
//       },
//       secondary: {
//         main: '#8b4513',
//       },
//     },
//   }),
//   pirate: createTheme({
//     palette: {
//       primary: {
//         main: '#0e1d36',
//       },
//       secondary: {
//         main: '#5c4033',
//       },
//     },
//   }),
// };

const useStyles = makeStyles({
  drawer: {
    width: '100%', // Ширина меню
    flexShrink: 0,
    whiteSpace: 'nowrap',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0, // Это гарантирует, что элемент займет всю ширину экрана
    display: 'flex', 
    justifyContent: 'center', // Центрирует кружки
    borderRadius: '16px 16px 0 0',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1200,
  },
  drawerOpen: {
    transform: 'translate(-50%, 0)', // Центрирование и подъем при открытии
    transition: 'transform 0.3s ease',
  },
  drawerClose: {
    transform: 'translate(-50%, 100%)', // Центрирование и скрытие за пределами экрана
    transition: 'transform 0.3s ease',
  },
  drawerPaper: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '60px',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    marginLeft: '25%',
    paddingLeft: '20%',
    paddingRight: '20%',
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.4)',
  },
  toggleButton: {
    position: 'fixed',
    left: '49%',
    bottom: 10,
    transform: 'translateX(-50%)',
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1300,
    transition: 'transform 0.4s ease, background-color 0.4s ease',
  },
  toggleButtonOpen: {
    transform: 'translateY(-50%) rotate(630deg)',
  },
  toggleButtonClose: {
    transform: 'translateY(20%) rotate(270deg) scale(0.8)',
    backdropFilter: "blur(10px)", /* Эффект размытия */
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#5c6bc0',
    }
  },
hexagonWrapper: {
  position: 'relative',
  width: 150,
  height: 150,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
},
hexagonSVG: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
},
hexagonContent: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '100%',
  height: '100%',
  zIndex: 1,
},


  listItemIcon: {
    color: 'white',
    
  },
});

interface Props {
  open: boolean;
  onClose: () => void;
}

const BottomMenu: React.FC<Props> = ({ open, onClose }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSilent, setIsSilent] = useState(false);
  // const [theme, setTheme] = useState(themes.default);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const toggleSilentMode = () => {
    setIsSilent(!isSilent);
  };

  // const handleThemeChange = (themeKey: keyof typeof themes) => {
  //   setTheme(themes[themeKey]);
  //   handleCloseMenu();
  // };

  const openPopover = Boolean(anchorEl);
  
  return (
    
    <>
      <Drawer
        PaperProps={{
            sx: {
                backdropFilter: "blur(10px)", /* Эффект размытия */
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: "white",
            }}}
        variant="persistent"
        anchor="bottom"
        open={open}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
          <ListItem button className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <HomeIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <SearchIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button className={classes.listItem} onClick={toggleSilentMode}>
            <ListItemIcon className={classes.listItemIcon}>
              {isSilent ? <NotificationsOffIcon /> : <NotificationsIcon />} {/* Используем иконку без звука */}
            </ListItemIcon>
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>            
              <AccountCircleIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem 
              button 
              className={classes.listItem}
              >
                {/* onClick={onSave} */}
              <ListItemIcon className={classes.listItemIcon}>            
                <SaveIcon />
              </ListItemIcon>
          </ListItem>

          <ListItem 
            
            button 
            className={classes.listItem}
            onMouseEnter={handleOpenMenu}
          >
            <ListItemIcon className={classes.listItemIcon}>            
                <AddToPhotosIcon />
            </ListItemIcon>
          </ListItem>
          
        </List>
        <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
      >
        <Box
          className={classes.hexagonWrapper}
          onMouseLeave={handleCloseMenu}
        >
          
          <Box className={classes.hexagonContent}
          onMouseLeave={handleCloseMenu} // Закрытие меню при отведении мыши
        >
          <IconButton 
          // onClick={() => handleThemeChange('sand')}
          >
            <BeachAccessIcon />
          </IconButton>
          <IconButton 
          // onClick={() => handleThemeChange('pirate')}
          >
            <AnchorIcon />
          </IconButton>
          <IconButton 
          // onClick={() => handleThemeChange('sand')}
          >
            <BeachAccessIcon />
          </IconButton>
          <IconButton 
          // onClick={() => handleThemeChange('pirate')}
          >
            <AnchorIcon />
          </IconButton>
          <IconButton 
          // onClick={() => handleThemeChange('sand')}
            >
            <BeachAccessIcon />
          </IconButton>
          <IconButton 
          // onClick={() => handleThemeChange('pirate')}
            >
            <AnchorIcon />
          </IconButton>
          {/* Добавьте больше иконок по мере необходимости */}
          </Box>
          </Box>
      </Popover>

      </Drawer>
      <button
        className={`${classes.toggleButton} ${open ? classes.toggleButtonOpen : classes.toggleButtonClose}`}
        onClick={onClose}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </button>
    </>
    
  );
};

export default BottomMenu;
