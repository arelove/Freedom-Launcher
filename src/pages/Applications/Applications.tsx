import React, { useState, useCallback, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import * as cheerio from 'cheerio';
import { Box, Typography, Alert, Skeleton } from '@mui/material';
import GameCard from './GameCard';
import GameFilter from './GameFilter';
import GameSearch from './GameSearch';
import GamePagination from './GamePagination';
import Notification from './Notification';
import ToggleButtons from './ToggleButtons';
import CardDetail from './CardDetail';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import SmoothScrollContainer from '../Home/SmoothScrollContainer';

interface AppShortcut {
  name: string;
  path: any;
  icon: string;
}

const Applications: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [allGames, setAllGames] = useState<AppShortcut[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [noResults, setNoResults] = useState(false);
    const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [notification, setNotification] = useState<{ 
      open: boolean; 
      message: string; 
      severity: 'success' | 'error' 
    }>({
      open: false,
      message: '',
      severity: 'success',
    });
    const [filter, setFilter] = useState<string>('all'); // Состояние для фильтра
    const [iconsPerRow, setIconsPerRow] = useState(7);
    const [gamesPerPage, setGamesPerPage] = useState(12);
    const [rows, setRows] = useState(2);
    const [availableIconsPerRow, setAvailableIconsPerRow] = useState<number[]>([5, 6, 7, 8]);
    const [availableRows, setAvailableRows] = useState<number[]>([2]);
  
    const { t } = useTranslation();
    
    const [containerHeight, setContainerHeight] = useState(600); 
    // Начальная высота контейнера в пикселях
    

    const useStyles = makeStyles(() => ({
        gamesGrid: {
            display: 'grid',
            gridTemplateColumns: (props: { iconsPerRow: number }) => `repeat(${props.iconsPerRow}, 1fr)`,
            gap: 20,
            marginTop: 15,
            overflow: 'hidden'
          }
    }));
    
    const classes = useStyles({iconsPerRow});
  
    useEffect(() => {
      const updateContainerHeight = () => {
        const windowHeight = window.innerHeight;
        
        // Базовая высота для окна 1024px (например, 600px)
        const baseHeight = 700;
        const baseWindowHeight = 1024;

        // Пропорциональная зависимость: на каждый пиксель изменения окна увеличиваем высоту контейнера на 1px
        const newHeight = baseHeight + (windowHeight - baseWindowHeight);

        setContainerHeight(newHeight);
      };

      updateContainerHeight(); // Вызываем при первоначальной загрузке
      window.addEventListener('resize', updateContainerHeight); // Добавляем слушатель события для изменения окна

      // Убираем слушатель при размонтировании компонента
      return () => {
        window.removeEventListener('resize', updateContainerHeight);
      };
    }, []); // Массив зависимостей пустой, чтобы вызвать только один раз при монтировании


    const handleIconsPerRowChange = (
      _event: React.MouseEvent<HTMLElement>,
      newIconsPerRow: number | null
    ) => {
      if (newIconsPerRow !== null) {
        setIconsPerRow(newIconsPerRow);
        setGamesPerPage(newIconsPerRow * rows);
      }
    };
  
    const handleRowsChange = (
      _event: React.MouseEvent<HTMLElement>,
      newRows: number | null
    ) => {
      if (newRows !== null) {
        setRows(newRows);
        setGamesPerPage(iconsPerRow * newRows);
      }
    };
    
    useEffect(() => {
      const updateAvailableButtons = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth > 1200) {
          // Устанавливаем для больших экранов
          setAvailableIconsPerRow([5, 6, 7, 8, 9, 10, 11, 12]);
          setAvailableRows([2, 3, 4, 5, 10, 25, 40, 50, 75, 100, 1000]);
        } else {
          // Для маленьких экранов
          setAvailableIconsPerRow([5, 6, 7, 8]);
          setAvailableRows([2, 3, 4, 10, 25, 50, 100, 1000]);
          
          // Если выбранные значения выходят за пределы допустимых
          if (iconsPerRow > 8) setIconsPerRow(8);
          if (rows > 1000) setRows(1000);
        }
        
        // Обновляем количество игр на странице в зависимости от иконок и строк
        setGamesPerPage(iconsPerRow * rows);
      };
  
      updateAvailableButtons();
      window.addEventListener('resize', updateAvailableButtons);
  
      return () => window.removeEventListener('resize', updateAvailableButtons);
    }, [iconsPerRow, rows]); // Зависимости от iconsPerRow и rows

    const filteredGames = allGames.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      const indexOfLastGame = currentPage * gamesPerPage;
      const indexOfFirstGame = indexOfLastGame - gamesPerPage;
      const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
    
      const fetchGamesData = useCallback(async (url: string) => {
        try {
          const data = await invoke<string>('fetch_games_data', { url });
          const $ = cheerio.load(data);
      
          const games: AppShortcut[] = [];
      
          $('.mov.clearfix').each((_index, element) => {
            const name = $(element).find('.mov-t').text();
            const path = $(element).find('.mov-mask').data('link') || '';
            const icon = 'https://repack-games.ru/' + $(element).find('.mov-i img').attr('src') || '';
      
            games.push({ name, path, icon });
          });
      
          return games;
        } catch (error) {
          console.error('Error fetching games data:', error);
          return [];
        }
      }, []);
      
      useEffect(() => {
    const cacheKey = `gamesCache_${filter}`;
    const cachedGames = sessionStorage.getItem(cacheKey);
    
    if (cachedGames) {
        // Если данные есть в sessionStorage, используем их
        setAllGames(JSON.parse(cachedGames));
    } else {
        // Если данных нет в кэше, загружаем их
        const fetchAllGamesData = async () => {
            setLoading(true);
            setError(null);
            setNoResults(false);
            
            try {
                const totalPages = 259; // 259 max
                const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                const allGames: AppShortcut[] = [];
                
                const results = await Promise.all(
                    pages.map(page => {
                        let url;
                        if (filter === 'popular') {
                            url = `https://repack-games.ru/top-100-luchshih-igr-ot-mehanikov/page/${page}/`;
                        } else if (filter === 'openworld') {
                            url = `https://repack-games.ru/open-world-games/page/${page}/`;
                        } else {
                            url = `https://repack-games.ru/page/${page}/`;
                        }
                        return fetchGamesData(url);
                    })
                );

                results.forEach(games => {
                    games.forEach(game => {
                        if (!allGames.some(existingGame => existingGame.path === game.path)) {
                            allGames.push(game);
                        }
                    });
                });

                if (allGames.length === 0) {
                    setNoResults(true);
                }

                // Сохраняем данные в кэш
                sessionStorage.setItem(cacheKey, JSON.stringify(allGames));
                setAllGames(allGames);

            } catch (error) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };
        fetchAllGamesData();
    }
}, [filter, fetchGamesData]);



      
      const handleDownload = async (path: string) => {
        try {
          await invoke('download_torrent', { url: path});
          // Уведомление о успешной загрузке
          setNotification({
            open: true,
            message: 'Торрент успешно загружен!',
            severity: 'success',
          });
        } catch (error) {
          const errorMessage = error as string;
          if (errorMessage.includes('Торрент-файл пуст')) {
            setNotification({ 
              open: true, 
              message: 'Торрент-файл пуст. :(' , 
              severity: 'error'});
          } else {
            setNotification({ open: true, message: `Ошибка загрузки торрент-файла или это онлайн игра`, severity: 'error' });
          }
        }
      };
    
      const handleNotificationClose = () => {
        setNotification({ ...notification, open: false });
      };
    
      const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
      };
    
      const handleCardClick = (gameUrl: string) => {
        setSelectedGameUrl(gameUrl);
        setDetailDialogOpen(true);
      };
    
      const handleCloseDialog = () => {
        setDetailDialogOpen(false);
        setSelectedGameUrl(null);
      };



      return (
        <Box>
          <GameFilter filter={filter} setFilter={setFilter} />
          <GameSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          {error && (
            <Alert severity="error" sx={{ marginTop: 2 }}>
              {t('errorOccurred')}
            </Alert>
          )}
          <SmoothScrollContainer
            damping={0.1}
            thumbMinSize={25}
            renderByPixels={false}
            height={`${containerHeight}px`} // изменить высоту контейнера, если нужно
            >
          {loading ? (
            <Box className={classes.gamesGrid}>
            {[...Array(gamesPerPage)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '180px',
                  color: 'white',
                  
                }}
              >
              <Skeleton variant="rectangular" animation="wave" width="100%" height="100%" />
              <Box 
              sx = {{ 
                display: 'flex',
                flexDirection: 'column',
                
                height: '100%',
                width: '100%',
                position: 'relative', }}
              >
                
                <Skeleton variant="text" width="80%" animation="wave" sx={{ marginTop: 1 }} />
                <Skeleton variant="text" width="60%" animation="wave" />
                </Box>
              </Box>
              
            ))}
            
          </Box>
          
          
          
        ) : noResults ? (
          <Typography variant="h6" align="center" color="textSecondary" sx={{ marginTop: 4 }}>
            {t('noResults')}
          </Typography>
          
        ) : (
            <Box className={classes.gamesGrid}>
              {currentGames.map((game) => (
                <GameCard
                  key={game.path}
                  game={game}
                  onDownload={handleDownload}
                  onClick={() => handleCardClick(game.path)}
                />
              ))}
            </Box>
            
          )}
          </SmoothScrollContainer>
          <GamePagination
            count={Math.ceil(filteredGames.length / gamesPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />
          
    
          {selectedGameUrl && (
            <CardDetail
              open={detailDialogOpen}
              onClose={handleCloseDialog}
              gameUrl={selectedGameUrl}
            />
          )}
    
          <Box
            sx={{
              position: 'relative',
              bottom: 0,
              paddingTop: '5vh',
              left: 0,
              display: 'flex',
              justifyContent: 'space-between',
              width: 'calc(100% - 32px)',
            }}
          >
            <ToggleButtons
              value={iconsPerRow}
              options={availableIconsPerRow}
              onChange={handleIconsPerRowChange}
              ariaLabel={t('iconsPerRow')}
            />
            
            {availableRows.length > 2 && (
              <ToggleButtons
                value={rows}
                options={availableRows}
                onChange={handleRowsChange}
                ariaLabel={t('numberOfRows')}
              />
            )}
          </Box>
    
          <Notification
            open={notification.open}
            message={notification.message}
            severity={notification.severity}
            onClose={handleNotificationClose}
          />
        </Box>
      );
    };

export default Applications;
