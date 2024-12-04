import React, { useState } from 'react';
import { IconButton, Popover, Box } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import AnchorIcon from '@mui/icons-material/Anchor';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const themes = {
  default: createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  }),
  sand: createTheme({
    palette: {
      primary: {
        main: '#c2b280',
      },
      secondary: {
        main: '#8b4513',
      },
    },
  }),
  pirate: createTheme({
    palette: {
      primary: {
        main: '#0e1d36',
      },
      secondary: {
        main: '#5c4033',
      },
    },
  }),
};

const HexagonalMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [theme, setTheme] = useState(themes.default);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeKey: keyof typeof themes) => {
    setTheme(themes[themeKey]);
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'hexagonal-menu' : undefined;

  return (
    <ThemeProvider theme={theme}>
      <IconButton
        aria-describedby={id}
        onMouseEnter={handleOpenMenu}
      >
        <AddToPhotosIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableRestoreFocus
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: 150,
            height: 150,
            padding: 1,
            backgroundColor: 'background.paper',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          <IconButton onClick={() => handleThemeChange('sand')}>
            <BeachAccessIcon />
          </IconButton>
          <IconButton onClick={() => handleThemeChange('pirate')}>
            <AnchorIcon />
          </IconButton>
          {/* Добавьте больше иконок по мере необходимости */}
        </Box>
      </Popover>
    </ThemeProvider>
  );
};

export default HexagonalMenu;
