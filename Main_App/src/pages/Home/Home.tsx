import React, { useState, useEffect, useRef } from 'react';
import {useStyles} from './styles';
import {MuiStyles} from './stylesMui';
import { AppShortcut, UsageStats } from './types';
import Tooltip from '@mui/material/Tooltip';
import { dialog } from '@tauri-apps/api';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { 
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, IconButton, LinearProgress, Skeleton
} from '@mui/material';
import { invoke } from '@tauri-apps/api/tauri';
import { 
  PlayArrow as PlayArrowIcon, Info as InfoIcon,
  Settings as SettingsIcon,
  FolderOpen as FolderOpenIcon, Save as SaveIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import SettingsMenu from './SettingsMenu';
import CardDetail from './CardDetail'; // Замените на правильный путь к файлу
import Notifications from './Notifications';

import SmoothScrollContainer from './SmoothScrollContainer';


const Home: React.FC = () => {
  
    const [loadingSkeleton, setLoadingSkeleton] = useState(true); 
  
    const [columnsHome, setColumnsHome] = useState(4); // начальное значение для столбцов
    const [rowsHome] = useState(2); // начальное значение для строк
    const [ITEMS_PER_PAGE, setItemsHome] = useState(7); // начальное значение для строк
    const [openSettingsSE, setOpenSettingsSE] = useState(false);
    const classes = useStyles({ columns: columnsHome, rows: rowsHome, openSettingsSE});
    const [shortcuts, setShortcuts] = useState<AppShortcut[]>([]);
    const [open, setOpen] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [newAppPath, setNewAppPath] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [iconPath, setIconPath] = useState('');
    const [backgroundPath, setBackgroundPath] = useState('');
    const [selectedShortcut, setSelectedShortcut] = useState<AppShortcut | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
    const [openFirstShortcutNotification, setOpenFirstShortcutNotification] = useState(false);
    const [openSaveNotification, setOpenSaveNotification] = useState(false);
    const [DeleteShortcutNotification, setDeleteFirstShortcutNotification] = useState(false);
    const [progress, setProgress] = useState(0);
    const { t } = useTranslation();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [fileSize, setFileSize] = useState(0); // Храним размер файла
    const [startTime, setStartTime] = useState(0); // Храним время начала загрузки

    const totalPages = Math.ceil(shortcuts.length / ITEMS_PER_PAGE);
    const currentShortcuts = shortcuts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const pageOffset = (currentPage - 1) * ITEMS_PER_PAGE;
    const sourceIndex = result.source.index + pageOffset;
    const destinationIndex = result.destination.index + pageOffset;
    const items = Array.from(shortcuts);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    setShortcuts(items);
  };

  // Загрузка ярлыков из LMDB при монтировании компонента
  useEffect(() => {
    async function loadShortcuts() {
      try {
        setLoadingSkeleton(true)
        const storedShortcuts = await invoke<AppShortcut[]>('load_shortcuts');
        setShortcuts(storedShortcuts || []);
      } catch (error) {
        console.error('Failed to load shortcuts:', error);
      } finally {
        setLoadingSkeleton(false); // Выключаем загрузку после завершения
      }
    }
    loadShortcuts();
  }, []);

  // Сохранение ярлыков в LMDB
  const saveShortcutsToLMDB = async (shortcuts: AppShortcut[]) => {
    try {
      await invoke('save_shortcuts', { shortcuts }); // Измените этот вызов в зависимости от вашей реализации на Rust
    } catch (error) {
      console.error('Failed to save shortcuts to LMDB:', error);
    }
  };

  const generateUniqueId = (index: number) => (index + 1).toString();
  
  const handleAddShortcut = async () => {
    try {
      // Создание нового ярлыка
      const newShortcut: AppShortcut = {
        id: generateUniqueId(shortcuts.length),
        name: newAppName,
        path: newAppPath,
      };
  
      // Получение пути иконки
      const iconPath = await invoke<string>('get_icon_path', { path: newAppPath });
  
      // Обновление состояния ярлыков
      const updatedShortcuts = [...shortcuts, { ...newShortcut, icon: iconPath }];
      setShortcuts(updatedShortcuts);
  
      // Сохранение нового ярлыка в LMDB
      await saveShortcutsToLMDB(updatedShortcuts); // Обновленная функция сохранения
  
      // Сброс состояния формы
      setOpen(false);
      setNewAppName('');
      setNewAppPath('');
      setOpenFirstShortcutNotification(true);
  
      // Переключение на следующую страницу, если необходимо
      if (currentPage * ITEMS_PER_PAGE < updatedShortcuts.length) {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }
      
    } catch (error) {
      console.error('Failed to add shortcut:', error);
    }
  };

  const handleDeleteShortcut = (index: number) => {
  setDeleteFirstShortcutNotification(true);
  setShortcuts((prevShortcuts) => prevShortcuts.filter((_, i) => i !== index));
};


  const handleSaveToFile = async () => {
    setOpenSaveNotification(true);
    await saveShortcutsToLMDB(shortcuts); // Передаем текущие ярлыки в функцию
  };

  const handleSettings = (shortcut: AppShortcut) => {
    setSelectedShortcut(shortcut);
    setSettingsOpen(true);
    setIconPath(shortcut.icon || '');
    setBackgroundPath(shortcut.background || '');
  };

  const saveSettings = () => {
    if (selectedShortcut) {
      const updatedShortcut = { ...selectedShortcut, icon: iconPath, background: backgroundPath };
      const updatedShortcuts = shortcuts.map((shortcut) =>
        shortcut.path === selectedShortcut.path ? updatedShortcut : shortcut
      );
      setShortcuts(updatedShortcuts);
      setSettingsOpen(false);
    }
  };

  const handleDetailsOpen = (shortcut: AppShortcut) => {
    setSelectedShortcut(shortcut);
    setDetailsOpen(true);
  };


  const handleRunApp = async (path: string) => {
    try {
      const shortcut = shortcuts.find(s => s.path === path);
        if (shortcut) {
          updateUsageStats(shortcut); // Обновляем статистику использования
          await invoke('run_app', { path });
          saveUsageStats(shortcut); // Сохраняем статистику использования
    }
    } catch (error) {
      console.error('Failed to run app:', error);
    }
  };
  
  const openFileExplorer = async () => {
    const selectedPath = await dialog.open({
      filters: [
        { name: 'Executable Files', extensions: ['exe'] }
      ]
    });
    if (typeof selectedPath === 'string') {
      setNewAppPath(selectedPath);
    }
  };
  
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = () => {
    setLoadingProgress((prev) => {
      if (prev >= 100) {
        clearInterval(timeoutIdRef.current!);
        return 100;
      }
      const elapsed = Date.now() - startTime;
      const percentage = Math.min((elapsed / (fileSize * 10)) * 100, 100);
      return percentage;
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearInterval(timeoutIdRef.current);
    };
  }, []);

  const openFileExplorerICO = async () => {
    const selectedPath = await dialog.open({});
    if (typeof selectedPath === 'string') {
      setLoading(true);
      setLoadingProgress(0); // Сброс прогресса

      // Запускаем таймер для обновления прогресса
      const id = setInterval(updateProgress, 100); // Увеличиваем прогресс каждые 100 мс
      setTimeoutId(id);

      const data = await readBinaryFile(selectedPath);
      setFileSize(data.byteLength); // Сохраняем размер файла
      setStartTime(Date.now()); // Записываем время начала загрузки

      clearInterval(id); // Очищаем интервал, когда загрузка завершена
      setLoadingProgress(100); // Устанавливаем прогресс в 100%

      const base64 = arrayBufferToBase64(data);
      const imageUrl = `data:image/png;base64,${base64}`;
      setIconPath(imageUrl);
      setLoading(false); // Сбросьте состояние загрузки
    }
  };

  const openFileExplorerBG = async () => {
    const selectedPath = await dialog.open({});
    if (typeof selectedPath === 'string') {
      setLoading(true);
      setLoadingProgress(0); // Сброс прогресса

      // Запускаем таймер для обновления прогресса
      const id = setInterval(updateProgress, 100); // Увеличиваем прогресс каждые 100 мс
      setTimeoutId(id);

      const data = await readBinaryFile(selectedPath);
      setFileSize(data.byteLength); // Сохраняем размер файла
      setStartTime(Date.now()); // Записываем время начала загрузки

      clearInterval(id); // Очищаем интервал, когда загрузка завершена
      setLoadingProgress(100); // Устанавливаем прогресс в 100%

      const base64 = arrayBufferToBase64(data);
      const imageUrl = `data:image/png;base64,${base64}`;
      setBackgroundPath(imageUrl);
      setLoading(false); // Сбросьте состояние загрузки
    }
  };

  useEffect(() => {
    // Очищаем таймер, если компонент размонтирован
    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [timeoutId]);
  const saveUsageStats = (shortcut: AppShortcut) => {
    localStorage.setItem(`usageStats_${shortcut.path}`, JSON.stringify(shortcut.usageStats));
  };

  // Функция обновления статистики использования
const updateUsageStats = (shortcut: AppShortcut) => {
  const now = new Date();
  let usageStats: UsageStats = {
      launchCount: 0,
      totalTime: 0,
      averageTimePerLaunch: 0,
      lastLaunch: now.toISOString(), // Преобразуйте в строку ISO
  };

  if (shortcut.usageStats) {
      usageStats = { ...shortcut.usageStats };
      usageStats.launchCount += 1;
      usageStats.lastLaunch = now.toISOString(); // Обновите lastLaunch
  }

  // Обновляем состояние
  setShortcuts(prevShortcuts =>
      prevShortcuts.map(s =>
          s.path === shortcut.path ? { ...s, usageStats } : s
      )
    );
  };

  // Функции для обновления состояния
  const handleColumnChange = (newColumns: number) => setColumnsHome(newColumns);
  const handleItemsChange = (newItems: number) => setItemsHome(newItems);

  // Функция для обновления openSettingsSE
  const toggleOpenSettingsSE = (isOpen: boolean) => {
    setOpenSettingsSE(isOpen);
  };


  return (
    <div>
      <h1>{t('menu')}</h1>
      
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="shortcuts" direction="horizontal">
            
            {(provided) => (
              <SmoothScrollContainer>
              <div
                className={classes.grid}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {/* Условие отображения скелетонов при загрузке */}
                {loadingSkeleton
                ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <Skeleton
                      key={`skeleton-${index}`} // Уникальный ключ для Skeleton
                      variant="rectangular"
                      width="calc(100% / columnsHome - 10px)"
                      className={classes.itemSkeleton}
                      animation="wave"
                    />
                  ))
                  : currentShortcuts.map((shortcut, index) => (
                    <Draggable
                      key={shortcut.id || `shortcut-${index}`} // Уникальный ключ для ярлыка
                      draggableId={shortcut.id || `shortcut-${index}`}
                      index={index}
                    >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${classes.item} ${snapshot.isDragging ? 'dragging' : ''}`}
                        style={{
                          backgroundImage: shortcut.background ? `url(${shortcut.background})` : 'none',
                          ...provided.draggableProps.style,
                        }}
                      ><div className='iconContainer'>
                          {shortcut.icon &&
                            <img
                              src={shortcut.icon}
                              alt={shortcut.name}
                              className={classes.iconPreview}
                            />
                          }
                        </div>
                        <p>{shortcut.name}</p>
                        <div className={classes.buttonGroup}>
                          <Tooltip title={t('start')} arrow>
                            <IconButton className={classes.iconButton} onClick={() => handleRunApp(shortcut.path)}>
                              <PlayArrowIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('details')} arrow>
                            <IconButton 
                              className={classes.iconButton} 
                              onClick={() => handleDetailsOpen(shortcut)}
                              sx={{marginBottom: '2vh'}}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('settings')} arrow>
                            <IconButton 
                              className={classes.iconButton} 
                              onClick={() => handleSettings(shortcut)}
                            >
                              <SettingsIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </Draggable>
                 
                ))}
                
                {provided.placeholder}
                
                <div className={classes.item} onClick={() => setOpen(true)}>
                  <p className={classes.addButton}>+</p>
                </div>
              </div>
              </SmoothScrollContainer>
            )}
          </Droppable>
        </DragDropContext>
        <div 
            style={{ 
              
              position: 'fixed', 
              bottom: 65,
              left: 3,
              right: 0, // Это гарантирует, что элемент займет всю ширину экрана
              display: 'flex', 
              justifyContent: 'center', // Центрирует кружки
            }}
          >
            <div style={{ display: 'flex' }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <div
                  key={index}
                  className={`${classes.paginationDot} ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                />
              ))}
            </div>
        </div>
      <SettingsMenu
        handleColumnChange={handleColumnChange}
        handleItemsChange={handleItemsChange}
        columnsHome={columnsHome}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        onToggleOpen={toggleOpenSettingsSE}  
      />

        <IconButton
            color="primary"
            sx={MuiStyles.saveButton(openFirstShortcutNotification || DeleteShortcutNotification)}
            onClick={handleSaveToFile}
        >
            <SaveIcon />
        </IconButton>
        <Dialog
            className={classes.dialogAddApp}
            open={open} 
            onClose={() => setOpen(false)}
            PaperProps={{
              sx: { backgroundColor: 'rgba(0, 0, 0, 0.3)'},
              style: { borderRadius: '15px'},
            }}
        >
            <DialogTitle className={classes.dialogTitleSet}>{t('addApplication')}</DialogTitle>
              <DialogContent className={classes.dialogContentSet}>
                <div>
                  <TextField
                    sx={{marginTop: '5px'}}
                    label={t('appName')}
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    fullWidth
                    className={classes.textField}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label={t('appPath')}
                    value={newAppPath}
                    onChange={(e) => setNewAppPath(e.target.value)}
                    fullWidth
                    className={classes.textField}
                  />
                  <label htmlFor="select-app-path">
                    <IconButton onClick={openFileExplorer}>
                      <FolderOpenIcon />
                    </IconButton>
                  </label>
                </div>
              </DialogContent>
                <DialogActions className={classes.dialogActions}>
                  <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
                  <Button onClick={handleAddShortcut}>{t('add')}</Button>
                </DialogActions>
          </Dialog>
          <Dialog
            className={classes.dialogAddApp}
            open={settingsOpen}
            onClose={() => setOpen(false)}
            PaperProps={{
              sx: {
                backdropFilter: "blur(10px)", /* Эффект размытия */
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                
              },
              style: {
                borderRadius: '15px',
              },
            }}
          >
            <DialogTitle className={classes.dialogTitleSet}>{t('settings')}</DialogTitle>
            <DialogContent className={classes.dialogContentSet}>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <TextField
                  label={t('iconPath')}
                  value={iconPath.slice(0,30)}
                  onChange={(e) => setIconPath(e.target.value)}
                  fullWidth
                  className={classes.textField}
                />
                <IconButton onClick={openFileExplorerICO} 
                    className={classes.iconButton}>
                    <FolderOpenIcon />
                </IconButton>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label={t('backgroundPath')}
                  value={backgroundPath.slice(0,30)}
                  onChange={(e) => setBackgroundPath(e.target.value)}
                  fullWidth
                  className={classes.textField}
                />
                <IconButton onClick={openFileExplorerBG} className={classes.iconButton}>
                  <FolderOpenIcon />
                </IconButton>
                
              </div>
              {loading && <LinearProgress variant="determinate" value={loadingProgress} />}
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
              <Button onClick={() => setSettingsOpen(false)} className={classes.button}>{t('cancel')}</Button>
              <Button onClick={saveSettings} className={classes.button}>{t('save')}</Button>
            </DialogActions>
          </Dialog>

          <>
          {detailsOpen && selectedShortcut && (
            <CardDetail
              shortcut={selectedShortcut}
              onClose={() => setDetailsOpen(false)}
              onDelete={(index) => {
                handleDeleteShortcut(index);
                setDetailsOpen(false);
              }}
              index={shortcuts.indexOf(selectedShortcut)} // Передаем индекс шортката
            />
          )}
          </>
          <Notifications
            openFirstShortcutNotification={openFirstShortcutNotification}
            openSaveNotification={openSaveNotification}
            DeleteShortcutNotification={DeleteShortcutNotification}
            setOpenFirstShortcutNotification={setOpenFirstShortcutNotification}
            setOpenSaveNotification={setOpenSaveNotification}
            setDeleteFirstShortcutNotification={setDeleteFirstShortcutNotification}
            progress={progress}
            setProgress={setProgress}
          />
            
    </div> 
  );
};


export default Home;
  
