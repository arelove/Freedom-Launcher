import { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  InputLabel,
  Paper, 
  Radio, 
  RadioGroup, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  MenuItem, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  TextField, 
  Typography, 
  InputAdornment,
  IconButton,
  Skeleton
} from '@mui/material';

import { Search as SearchIcon } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import SmoothScrollContainer from '../Home/SmoothScrollContainer';
import { useTranslation } from 'react-i18next';

const LOCAL_STORAGE_KEY = 'favoriteTorrents';

const RutorParser = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('0');
  const [sort, setSort] = useState('4');
  const [order, setOrder] = useState('0');
  const [searchMethod, setSearchMethod] = useState('1');
  const [searchIn, setSearchIn] = useState('0');
  const [torrentDetails, setTorrentDetails] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  

  const [page, setPage] = useState(0);
  const rowsPerPage = 6; // Количество торрентов на странице

  const [favoriteTorrents, setFavoriteTorrents] = useState<any[]>(() => {
    // Получаем избранные торренты из локального хранилища при инициализации
    const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    // Получаем историю поиска из локального хранилища при инициализации
    const storedHistory = localStorage.getItem('searchHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  

  const handleAddToFavorites = (torrent: any) => {
    // Проверяем, есть ли уже этот торрент в избранных
    if (!favoriteTorrents.some(fav => fav.link === torrent.link)) {
      const updatedFavorites = [...favoriteTorrents, torrent];
      setFavoriteTorrents(updatedFavorites);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedFavorites));
    }
  };



  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);

  

  // Функция для парсинга основной страницы
  const parseData = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const torrents = Array.from(doc.querySelectorAll('tr.gai, tr.tum')).map((row) => {
      const titleElement = row.querySelector('a[href^="/torrent/"]');
      const title = titleElement?.textContent || t('unknownTitle');
      const size = row.querySelector('td:nth-child(4)')?.textContent ||  t('unknownSize');
      const date = row.querySelector('td:nth-child(1)')?.textContent ||  t('unknownDate');
      const downloadLink = row.querySelector('a.downgif')?.getAttribute('href') || '';
      const link = titleElement?.getAttribute('href') || '';
      const magnetLink = row.querySelector('a[href^="magnet:?"]')?.getAttribute('href') || '';
      const seeders = row.querySelector('td:nth-child(5) .green')?.textContent?.trim() || '0';
      const leechers = row.querySelector('td:nth-child(5) .red')?.textContent?.trim() || '0';

      return {
        title,
        size,
        date,
        link,
        downloadLink,
        magnetLink,
        seeders,
        leechers,
      };
    });
    return torrents;
  };

  interface Detail {
    key: string | undefined;
    value: string | undefined;
  }

  const handleDownload = (downloadLink: string) => {
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = downloadLink.split('/').pop() || 'file.torrent'; // Используем название файла по умолчанию
    link.click();
  };
  
  
  const parseTorrentDetails = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    // Получаем только первые несколько строк с нужными данными
    const rows = doc.querySelectorAll('tr');
    const details: Detail[] = [];
  
    for (let i = 6; i < 14; i++) {
      const row = rows[i];
      if (row) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const key = cells[0]?.textContent?.trim(); 
          const value = cells[1]?.textContent?.trim(); 
          
          if (key && value) {
            details.push({ key, value });
          }
        }
      }
    }
  
    // Извлекаем изображение (предположительно первое изображение на странице)
    const images = doc.querySelectorAll('img');
    const imageUrl = images.length > 3 ? images[3]?.getAttribute('src') : ''; 
  
    return {
      details,      // Массив всех пар ключ-значение
      imageUrl,     // Изображение
    };
  };
  
  
  const fetchTorrentDetails = async (link: string, title: string) => {
    try {
      const url = `https://api.allorigins.win/get?url=` + encodeURIComponent(`https://rutor.info/${link}`);
      const response = await fetch(url);
      const data = await response.json();
      const html = data.contents;  // Получаем HTML содержимое страницы
      const fetchedDetails = parseTorrentDetails(html);  // Парсим данные
      setTorrentDetails({
        title,        // Сохраняем название
        details: fetchedDetails.details,
        imageUrl: fetchedDetails.imageUrl,
      });
      setOpenDialog(true);  // Открываем модальное окно
    } catch (error) {
      console.error(t('errorFetchingData'), error);
    } finally {
      setLoading(false);
    }
  };
  

  
  // Функция для получения основной страницы с результатами
  const fetchRutorData = async () => {
    setLoading(true);
    try {
        // Добавляем текущий запрос в историю
        setSearchHistory(prevHistory => {
          const updatedHistory = [searchQuery, ...prevHistory.filter(query => query !== searchQuery)];
          const limitedHistory = updatedHistory.slice(0, 5); // Ограничиваем до 5 последних запросов
          localStorage.setItem('searchHistory', JSON.stringify(limitedHistory)); // Сохраняем в локальное хранилище
          return limitedHistory;
        });
        const url = `https://api.allorigins.win/get?url=` + 
                    encodeURIComponent(`https://rutor.info/search/0/${category}/000/${sort}/${searchQuery}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { contents } = await response.json();

        const torrents = parseData(contents);
        setData(torrents);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    } finally {
        setLoading(false);
    }
};


  // const corsServices = [
  //   'https://api.allorigins.win/get?url=',
  //   'https://cors-anywhere.herokuapp.com/',
  //   'https://thingproxy.freeboard.io/fetch/',
  //   'https://api.codetabs.com/v1/proxy/?quest=',
  //   'https://crossorigin.me/'
  // ];
  
  // const fetchWithFallback = async (url: string) => {
  //   for (const service of corsServices) {
  //     try {
  //       const fullUrl = `${service}${encodeURIComponent(url)}`;
  //       const response = await fetch(fullUrl);
        
  //       if (!response.ok) {
  //         throw new Error(`Network response was not ok. Status: ${response.status}`);
  //       }
  
  //       const data = await response.json();
  //       if (!data.contents) {
  //         throw new Error('No contents found');
  //       }
  
  //       return data.contents;
  //     } catch (error) {
  //       console.error(`Ошибка с сервисом ${service}:`, error);
  //       continue;  // Пробуем следующий сервис
  //     }
  //   }
    
  //   throw new Error('Все сервисы для обхода CORS не работают');
  // };
  
  // const fetchTorrentDetails = async (link: string, title: string) => {
  //   try {
  //     const url = `https://rutor.info/${link}`;
  //     const html = await fetchWithFallback(url);  // Получаем HTML через один из сервисов
      
  //     const fetchedDetails = parseTorrentDetails(html);  // Парсим данные
  //     setTorrentDetails({
  //       title,        // Сохраняем название
  //       details: fetchedDetails.details,
  //       imageUrl: fetchedDetails.imageUrl,
  //     });
  //     setOpenDialog(true);  // Открываем модальное окно
  //   } catch (error) {
  //     console.error('Ошибка при получении данных:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const fetchRutorData = async () => {
  //   setLoading(true);
  //   try {
  //     const url = `https://rutor.info/search/0/${category}/000/${sort}/${searchQuery}`;
  //     const contents = await fetchWithFallback(url);  // Получаем данные через один из сервисов
      
  //     const torrents = parseData(contents);
  //     setData(torrents);
  //   } catch (error) {
  //     console.error('Ошибка при получении данных:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (_event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);  // Сбрасываем на первую страницу
  };

  const handleDeleteSearchHistory = (queryToDelete: string) => {
    const updatedHistory = searchHistory.filter(query => query !== queryToDelete);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory)); // Обновляем локальное хранилище
  };
  

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('torrentSearchTitle')}
      </Typography>
      {/* Форма поиска */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          variant="outlined"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />


       {/* Метод поиска */}
       <div>
      {/* Button to open drawer */}
      <IconButton
        onClick={isMenuOpen ? handleCloseMenu : handleOpenMenu} // В зависимости от состояния меню
        style={{
          position: 'fixed',
          right: '10px',
          zIndex: 10,
          bottom: isMenuOpen ? '370px' : '60px', // Меняется положение в зависимости от состояния меню
          transition: 'bottom 0.3s ease-in-out', // Плавная анимация перехода по оси Y
        }}
      >
        {/* Если меню открыто, показываем крестик, если нет — настройки */}
        {isMenuOpen ? (
          <CloseIcon fontSize="large" />
        ) : (
          <SettingsIcon fontSize="large" />
        )}
    </IconButton>

    

      {/* Выпадающее меню */}
      <Box
        style={{
          display:"flex",
          flexDirection:"row",
          alignItems:"center",
          justifyContent:"space-between",
          width: '330px',
          position: 'fixed',
          bottom: isMenuOpen ? '0%' : '-100%',  // Меню появляется снизу
          right: '0',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '30px',
          paddingBottom: '50px',
          
          zIndex: 5,
          transition: 'bottom 0.3s ease-in-out',  // Плавная анимация
        }}
      >
        
        
        <div style={{ zIndex: 2 }}>
        
          {/* Метод поиска */}
          <FormControl variant="outlined" margin="normal" style={{ flex: 1, marginRight: 10}}>
          <InputLabel>{t('searchMethod')}</InputLabel>
          <Select
            value={searchMethod}
            onChange={(e) => setSearchMethod(e.target.value)}
            label={t('searchMethod')}
          >
            <MenuItem value="0">{t('exactPhrase')}</MenuItem> 
            <MenuItem value="1">{t('allWords')}</MenuItem> 
            <MenuItem value="2">{t('anyWords')}</MenuItem>
            <MenuItem value="3">{t('logicalExpression')}</MenuItem>
          </Select>
        </FormControl>

        {/* Область поиска */}
        <FormControl variant="outlined" margin="normal" style={{ flex: 1, marginRight: 10 }}>
          <InputLabel>{t('searchIn')}</InputLabel>
          <Select
            value={searchIn}
            onChange={(e) => setSearchIn(e.target.value)}
            label={t('searchIn')}
          >
            <MenuItem value="0">{t('title')}</MenuItem>
            <MenuItem value="1">{t('titleAndDescription')}</MenuItem> 
          </Select>
        </FormControl>

        {/* Категория поиска */}
        <FormControl variant="outlined" margin="normal" style={{ flex: 1, marginRight: 10 }}>
        <InputLabel>{t('category')}</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label={t('category')}
          >
            <MenuItem value="0">{t('anyCategory')}</MenuItem> 
            <MenuItem value="1">{t('foreignMovies')}</MenuItem> 
            <MenuItem value="5">{t('localMovies')}</MenuItem> 
            <MenuItem value="12">{t('documentaries')}</MenuItem> 
            <MenuItem value="4">{t('foreignSeries')}</MenuItem> 
            <MenuItem value="16">{t('localSeries')}</MenuItem> 
            <MenuItem value="6">{t('tvShows')}</MenuItem>
            <MenuItem value="7">{t('animation')}</MenuItem> 
            <MenuItem value="10">{t('anime')}</MenuItem> 
            <MenuItem value="2">{t('music')}</MenuItem> 
            <MenuItem value="8">{t('games')}</MenuItem> 
            <MenuItem value="9">{t('software')}</MenuItem> 
            <MenuItem value="13">{t('sportsHealth')}</MenuItem>
            <MenuItem value="15">{t('humor')}</MenuItem> 
            <MenuItem value="14">{t('household')}</MenuItem> 
            <MenuItem value="11">{t('books')}</MenuItem> 
            <MenuItem value="3">{t('other')}</MenuItem>
            <MenuItem value="17">{t('foreignReleases')}</MenuItem>
          </Select>
        </FormControl>

  {/* Сортировка */}
        <FormControl variant="outlined" margin="normal" style={{ flex: 1, marginRight: 10 }}>
        <InputLabel>{t('sortBy')}</InputLabel> 
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            label={t('sortBy')}
          >
            <MenuItem value="0">{t('byDateAdded')}</MenuItem> 
            <MenuItem value="2">{t('bySeeders')}</MenuItem> 
            <MenuItem value="4">{t('byLeechers')}</MenuItem> 
            <MenuItem value="6">{t('byTitle')}</MenuItem> 
            <MenuItem value="8">{t('bySize')}</MenuItem> 
            <MenuItem value="10">{t('byRelevance')}</MenuItem> 
          </Select>
        </FormControl>

        {/* Порядок сортировки */}
        <FormControl component="fieldset" margin="normal" style={{ flex: 1, marginRight: 10}}>
        <FormLabel component="legend">{t('sortOrder')}</FormLabel> 
          <RadioGroup
              row
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <FormControlLabel 
                  value="1" 
                  control={<Radio />} 
                  label={t('ascending')} /> 
              <FormControlLabel 
                  value="0" 
                  control={<Radio />} 
                  label={t('descending')} /> 
          </RadioGroup>
        </FormControl>
        </div>
      </Box>
    </div>
    
        <Button variant="contained" color="primary" onClick={fetchRutorData}>
          {t('search')}
        </Button>
      </Box>
      <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
        {searchHistory.map((query, index) => (
          <Box key={index} display="flex" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSearchQuery(query)}
              style={{
                marginBottom: '10px',
                padding: '4px 8px', // Уменьшаем внутренние отступы, чтобы кнопки были тоньше
              }}
            >
              {query}
            <IconButton size="small" onClick={() => handleDeleteSearchHistory(query)}
              style={{
                
                
                padding: '1px 0px 0px 20px', // Уменьшаем внутренние отступы, чтобы кнопки были тоньше
              }}
              >
              <CloseIcon fontSize="small" />
            </IconButton>
            </Button>
            
          </Box>
        ))}
      </Box>




      {/* Отображение результатов */}
      {loading ? (
        <TableContainer component={Paper} style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <Table sx={{ minWidth: 550 }} aria-label="skeleton table">
            <TableHead>
              <TableRow>
                <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                <TableCell><Skeleton variant="text" width="40%" /></TableCell>
                <TableCell><Skeleton variant="text" width="30%" /></TableCell>
                <TableCell><Skeleton variant="text" width="30%" /></TableCell>
                <TableCell><Skeleton variant="text" width="30%" /></TableCell>
                <TableCell><Skeleton variant="text" width="20%" /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => ( // Показать 5 строк скелета
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width="90%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={30} height={30} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <SmoothScrollContainer
        damping={0.1}
        thumbMinSize={25}
        renderByPixels={false}
        height="60vh" // изменить высоту контейнера, если нужно
        >
        <TableContainer 
          component={Paper} 
          style={{
            backdropFilter: 'blur(10px)', 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          <Table sx={{ minWidth: 550}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t('title')}</TableCell> 
                <TableCell>{t('date')}</TableCell> 
                <TableCell>{t('size')}</TableCell>
                <TableCell>{t('seeders')}</TableCell> 
                <TableCell>{t('leechers')}</TableCell> 
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((torrent, index) => (
                <TableRow
                  key={index}
                  onClick={() => fetchTorrentDetails(torrent.link, torrent.title)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{torrent.title.slice(0,60) + '...'}</TableCell>
                  <TableCell>{torrent.date}</TableCell>
                  <TableCell>{torrent.size}</TableCell>
                  <TableCell>{torrent.seeders}</TableCell>
                  <TableCell>{torrent.leechers}</TableCell>
                  <TableCell>
                    {/* Иконка для скачивания */}
                    <IconButton onClick={() => handleDownload(torrent.downloadLink)} color="primary">
                      <DownloadIcon />
                    </IconButton>
                    {/* Иконка для добавления в избранное */}
                    <IconButton onClick={() => handleAddToFavorites(torrent)} color="secondary">
                      <FavoriteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </SmoothScrollContainer>
      )}

      {/* Пагинация */}
      <TablePagination
        
        rowsPerPageOptions={[10]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Модальное окно с подробностями */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }
        }}
        >
        <DialogTitle>{torrentDetails?.title || t('titleNotFound')}</DialogTitle>
        <DialogContent>
          <Box display="flex">
            <img
              src={torrentDetails?.imageUrl}
              alt={torrentDetails?.title || t('titleNotFound')}
              style={{ maxWidth: '200px', maxHeight: '200px', width: 'auto', height: 'auto', marginRight: '20px' }}
            />
            <Box>
              {torrentDetails?.details?.map((detail: { key: string, value: string }, index: number) => (
                <Box key={index} display="flex" justifyContent="space-between" marginBottom="10px">
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>{detail.key}:</Typography>
                  <Typography variant="body1">{detail.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RutorParser;
