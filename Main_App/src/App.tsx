import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CustomThemeProvider } from './ThemeContext';
import SplashAnimation from './components/SplashAnimation';
import Home from './pages/Home/Home';
import Monitoring from './pages/Monitoring/Monitoring';
import Applications from './pages/Applications/Applications';
import RutorParser from './pages/Applications/RutorParser';
import FavoritesPage from './pages/Applications/isbrannoe';
import Downloads from './pages/Downloads/Downloads';
import Settings from './pages/Settings/Settings';
import InWork from './pages/in_work/InWork';
import Sidebar from './components/Menus-And-Sidebars/Sidebar';
import BackgroundModal from './components/Modals/BackgroundModal';
import DiskAnalysis from './pages/DiskAnalysis/DiskAnalysis';
import { makeStyles } from '@mui/styles';
import { Box, IconButton, Tooltip } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import CustomTitleBar from './components/CustomTitleBar';
import { BottomMenuProvider } from './components/Menus-And-Sidebars/BottomMenuContext';
import { LanguageProvider } from './LanguageContext';
import './i18n'; // Импортируйте файл конфигурации
import { FavoritesProvider } from './pages/Applications/FavoritesContext';

const useStyles = makeStyles({
  app: {
    display: 'flex',
    flexDirection: 'column', // Для поддержки смещения верхним и нижним меню
    position: 'relative',
    height: '100vh',
    overflowX: 'hidden',
  },
  contentWrapper: {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    transition: 'all 0.4s ease', // Плавная анимация
  },
  mainContent: {
    flexGrow: 1,
    paddingTop: '36px',
    paddingLeft: '40px',
    paddingRight: '40px',
    transition: 'margin 0.3s', // Плавная анимация смещения
    
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: -1,
    transition: 'filter 0.3s ease',
  }
});

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [background, setBackground] = useState<string>('/icons/gifback/AMAZINGLoadingHologram.gif');
  const [isBackgroundVisible, setBackgroundVisible] = useState(true);
  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);

  const classes = useStyles();

  const handleBackgroundChange = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    setBackground(fileURL);
    setBackgroundVisible(true);
  };

  const handleOpenBackgroundModal = () => setBackgroundModalOpen(true);
  const handleCloseBackgroundModal = () => setBackgroundModalOpen(false);

  const handleGifSelect = (gifUrl: string) => {
    setBackground(gifUrl);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };


  return (
    <FavoritesProvider>
    <LanguageProvider>
    <CustomThemeProvider>
      <Router>
        <BottomMenuProvider>
        <div className={classes.app}>
          {isBackgroundVisible && (
            <div
              className={classes.background}
              style={{
                backgroundImage: `url(${background})`,
                
              }}
            />
          )}
          <SplashAnimation />
          <CustomTitleBar />
          <div
            className={classes.contentWrapper}
            style={{
              marginLeft: isSidebarOpen ? '200px' : 0,
              
            }}
          >
            <Sidebar open={isSidebarOpen} onToggle={toggleSidebar} />
            <main className={classes.mainContent}>
              <Box style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2001 }}>
                <Tooltip title="Выбрать фон" arrow>
                  <IconButton color="primary" onClick={handleOpenBackgroundModal}>
                    <AddToPhotosIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Routes>

                <Route path="/monitoring" element={<Monitoring />} />
                <Route 
                  path="/applications" 
                  element={
                      <Applications />
                  } 
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/inwork" element={<InWork />} />
                <Route path="/disk-analysis" element={<DiskAnalysis />} />
                <Route 
                  path="/download-page" 
                  element={
                    <Downloads />
                  } 
                /> 
                <Route path="/rutor" element={<RutorParser />} />
                <Route path="/favorites" element={<FavoritesPage />} />

              <Route 
                path="/" 
                element={
                  <Home /> 
                } 
              />
              
              </Routes>
            </main>
          </div>
          <BackgroundModal
            open={backgroundModalOpen}
            onClose={handleCloseBackgroundModal}
            onFileChange={handleBackgroundChange}
            onGifSelect={handleGifSelect}
          />
          
        </div>
        </BottomMenuProvider>
      </Router>
    </CustomThemeProvider>
    </LanguageProvider>
    </FavoritesProvider>
  );
};

export default App;

