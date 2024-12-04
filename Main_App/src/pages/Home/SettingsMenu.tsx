import React, { useState, useEffect } from 'react';
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Slider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { useMenuStyles } from './styles';
import { getSettingsIconStyles } from './stylesMui';
import { invoke } from '@tauri-apps/api';

interface SettingsMenuProps {
  handleColumnChange: (newColumns: number) => void;
  handleItemsChange: (newItems: number) => void;
  columnsHome: number;
  ITEMS_PER_PAGE: number;
  onToggleOpen: (isOpen: boolean) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  handleColumnChange,
  handleItemsChange,
  columnsHome,
  ITEMS_PER_PAGE,
  onToggleOpen,
}) => {
  const { t } = useTranslation();
  const [rotate, setRotate] = useState(false);
  const [openSettingsSE, setOpenSettingsSE] = useState(false);
  const menuClasses = useMenuStyles({ openSettingsSE });

  // Загрузка значений из localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('columnsHome');
    const savedItems = localStorage.getItem('ITEMS_PER_PAGE');
    
    if (savedColumns) handleColumnChange(Number(savedColumns));
    if (savedItems) handleItemsChange(Number(savedItems));
  }, [handleColumnChange, handleItemsChange]);

  const toggleMenuSettingsSE = () => {
    setRotate(!rotate);
    const newOpenState = !openSettingsSE;
    setOpenSettingsSE(newOpenState);
    onToggleOpen(newOpenState);
  };

  const [selectedWindowSize, setSelectedWindowSize] = useState({ width: 1920, height: 1080 });

  const handleWindowSizeChange = async (size: { width: number; height: number }) => {
    setSelectedWindowSize(size);
    await invoke('resize_window', { width: size.width, height: size.height });
  };

  // Сохранение значений в localStorage
  const handleColumnChangeWithSave = (newColumns: number) => {
    handleColumnChange(newColumns);
    localStorage.setItem('columnsHome', newColumns.toString());
  };

  const handleItemsChangeWithSave = (newItems: number) => {
    handleItemsChange(newItems);
    localStorage.setItem('ITEMS_PER_PAGE', newItems.toString());
  };

  return (
    <Box className={menuClasses.menuContainerSettingsSE}>
      <Box className={menuClasses.IconBoxSettingsSE}>
        <IconButton onClick={toggleMenuSettingsSE} sx={{ p: 0 }}>
          <SettingsIcon
            className={menuClasses.settingsIconLargeopenSettingsSE}
            sx={getSettingsIconStyles(rotate)}
          />
        </IconButton>
      </Box>
      {openSettingsSE && (
        <Box className={menuClasses.MenuBoxSettingsSE}>
          <Box>
            <ToggleButtonGroup
              value={selectedWindowSize.width}
              exclusive
              onChange={(_, newValue) => {
                switch (newValue) {
                  case 1:
                    handleWindowSizeChange({ width: 1400, height: 780 });
                    handleColumnChangeWithSave(4);
                    handleItemsChangeWithSave(7);
                    break;
                  case 2:
                    handleWindowSizeChange({ width: 1020, height: 630 });
                    handleColumnChangeWithSave(5);
                    handleItemsChangeWithSave(9);
                    break;
                  case 3:
                    handleWindowSizeChange({ width: 1100, height: 1070 });
                    handleColumnChangeWithSave(3);
                    handleItemsChangeWithSave(27);
                    break;
                  case 4:
                    handleWindowSizeChange({ width: 360, height: 1240 });
                    handleColumnChangeWithSave(1);
                    handleItemsChangeWithSave(7);
                    toggleMenuSettingsSE();
                    break;
                  case 5:
                    handleWindowSizeChange({ width: 1700, height: 480 });
                    handleColumnChangeWithSave(8);
                    handleItemsChangeWithSave(7);
                    break;
                  default:
                    break;
                }
              }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Tooltip title={t('default')} placement="left">
                <ToggleButton value={1}>1</ToggleButton>
              </Tooltip>
              <Tooltip title={t('default2')} placement="top">
                <ToggleButton value={2}>2</ToggleButton>
              </Tooltip>
              <Tooltip title={t('square')} placement="top">
                <ToggleButton value={3}>3</ToggleButton>
              </Tooltip>
              <Tooltip title={t('leftBar')} placement="top">
                <ToggleButton value={4}>4</ToggleButton>
              </Tooltip>
              <Tooltip title={t('upBar')} placement="top">
                <ToggleButton value={5}>5</ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Tooltip title={t('items_per_page')} placement="left">
              <Slider
                value={ITEMS_PER_PAGE}
                onChange={(_, newValue) => handleItemsChangeWithSave(newValue as number)}
                step={1}
                min={1}
                max={49}
                valueLabelDisplay="auto"
                marks={[...Array(49)].map((_, i) => ({ value: i + 1 }))}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </Tooltip>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Tooltip title={t('columns_home')} placement="left">
              <Slider
                value={columnsHome}
                onChange={(_, newValue) => handleColumnChangeWithSave(newValue as number)}
                step={1}
                min={1}
                max={10}
                valueLabelDisplay="auto"
                marks={[...Array(10)].map((_, i) => ({ value: i + 1 }))}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SettingsMenu;
