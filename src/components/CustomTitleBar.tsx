import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api';
import './CSS/CustomTitleBar.css';
import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Menu } from '@mui/icons-material';
import RightSidebar from './Menus-And-Sidebars/RightSidebar';

const CustomTitleBar: React.FC = () => {
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);
  

  const handleMouseDown = async (e: React.MouseEvent) => {
    e.preventDefault();
    await invoke('start_dragging');
  };

  const minimizeWindow = async () => {
    try {
      await invoke('minimize_window');
    } catch (error) {
      console.error('Error minimizing window:', error);
    }
  };

  const maximizeWindow = async () => {
    try {
      await invoke('toggle_maximize');
    } catch (error) {
      console.error('Error toggling maximize:', error);
    }
  };

  const closeWindow = async () => {
    try {
      await invoke('close_window');
    } catch (error) {
      console.error('Error closing window:', error);
    }
  };

  const reloadWindow = async () => {
    try {
      await invoke('reload_window');
    } catch (error) {
      console.error('Error reloading window:', error);
    }
  };

  const toggleFullscreen = async () => {
    try {
      await invoke('toggle_fullscreen');
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="custom-titlebar-container">
      <div className="custom-titlebar" onMouseDown={handleMouseDown}>
        <div className="titlebar-content">
          {/* Добавьте название приложения, если необходимо */}
        </div>
      </div>
      <div className="titlebar-controls">
        {/* Индикатор состояния сети */}
        <Tooltip title={isOnline ? 'Online' : 'Offline'}>
          <IconButton style={{ color: isOnline ? 'green' : 'red' }}>
            {isOnline ? <WifiIcon /> : <WifiOffIcon />}
          </IconButton>
        </Tooltip>

        <IconButton onClick={reloadWindow} style={{ color: '#fff' }}>
          <RefreshIcon />
        </IconButton>
        <IconButton onClick={toggleFullscreen} style={{ color: '#fff' }}>
          <FullscreenIcon />
        </IconButton>
        <IconButton onClick={toggleRightSidebar} style={{ color: '#fff' }}>
          <Menu />
        </IconButton>
        <IconButton onClick={minimizeWindow} style={{ color: '#fff' }}>
          <MinimizeIcon />
        </IconButton>
        <IconButton onClick={maximizeWindow} style={{ color: '#fff' }}>
          <CropSquareIcon />
        </IconButton>
        <IconButton onClick={closeWindow} style={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </div>
      <RightSidebar open={isRightSidebarOpen} onClose={toggleRightSidebar} />
    </div>
  );
};

export default CustomTitleBar;
