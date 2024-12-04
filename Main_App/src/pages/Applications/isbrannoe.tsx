import { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Delete from '@mui/icons-material/Delete';
import SmoothScrollContainer from '../Home/SmoothScrollContainer';

const LOCAL_STORAGE_KEY = 'favoriteTorrents';

const FavoritesPage = () => {
  const [favoriteTorrents, setFavoriteTorrents] = useState<any[]>([]);
  const [maxChars, setMaxChars] = useState(60); // Начальное значение для символов
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'date', 'size', 'seeders', 'leechers', 'actions']); // Видимые столбцы

  useEffect(() => {
    const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedFavorites) {
      setFavoriteTorrents(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    const updateMaxChars = () => {
      const width = window.innerWidth;

      if (width < 1000) {
        const newMaxChars = Math.max(8, 60 - Math.floor((1000 - width) / 5));
        setMaxChars(newMaxChars);
      } else {
        setMaxChars(60); // Если ширина больше 1000, устанавливаем 60 символов
      }

      // Обновляем видимые столбцы в зависимости от ширины
      if (width < 430) {
        setVisibleColumns(['title', 'actions']); // Показываем только название и действия
      } else if (width < 670) {
        setVisibleColumns(['title', 'date', 'actions']); // Показываем название, дату и действия
      } else {
        setVisibleColumns(['title', 'date', 'size', 'seeders', 'leechers', 'actions']); // Показываем все столбцы
      }
    };

    updateMaxChars(); // Устанавливаем начальное значение
    window.addEventListener('resize', updateMaxChars); // Добавляем слушатель события изменения размера

    return () => {
      window.removeEventListener('resize', updateMaxChars); // Удаляем слушатель события при размонтировании
    };
  }, []);

  const handleRemoveFavorite = (torrentToRemove: any) => {
    const updatedFavorites = favoriteTorrents.filter(torrent => torrent.link !== torrentToRemove.link);
    setFavoriteTorrents(updatedFavorites);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedFavorites));
  };

  const handleDownloadTorrent = (downloadLink: string) => {
    const link = document.createElement('a');
    link.href = downloadLink;
    link.setAttribute('download', ''); // Устанавливаем атрибут download для начала скачивания
    document.body.appendChild(link); // Добавляем элемент в DOM
    link.click(); // Инициируем клик на элемент
    document.body.removeChild(link); // Удаляем элемент из DOM
  };

  return (
    <SmoothScrollContainer
        damping={0.1}
        thumbMinSize={25}
        renderByPixels={false}
        height="80vh" // изменить высоту контейнера, если нужно
    >
      <TableContainer 
          component={Paper}
          style={{
              backdropFilter: 'blur(10px)', 
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '8px'
          }}
      >
        <Table sx={{ minWidth: 120 }} aria-label="favorite torrents table">
          <TableHead>
            <TableRow>
              {visibleColumns.includes('title') && <TableCell>Название</TableCell>}
              {visibleColumns.includes('date') && <TableCell>Дата</TableCell>}
              {visibleColumns.includes('size') && <TableCell>Размер</TableCell>}
              {visibleColumns.includes('seeders') && <TableCell>Сиды</TableCell>}
              {visibleColumns.includes('leechers') && <TableCell>Личеры</TableCell>}
              {visibleColumns.includes('actions') && <TableCell>Действия</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {favoriteTorrents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center">Нет избранных торрентов</TableCell>
              </TableRow>
            ) : (
              favoriteTorrents.map((torrent, index) => (
                <TableRow key={index}>
                  {visibleColumns.includes('title') && (
                    <TableCell style={{ cursor: 'pointer' }}>
                      {torrent.title.slice(0, maxChars) + (torrent.title.length > maxChars ? '...' : '')}
                    </TableCell>
                  )}
                  {visibleColumns.includes('date') && <TableCell>{torrent.date}</TableCell>}
                  {visibleColumns.includes('size') && <TableCell>{torrent.size}</TableCell>}
                  {visibleColumns.includes('seeders') && <TableCell>{torrent.seeders}</TableCell>}
                  {visibleColumns.includes('leechers') && <TableCell>{torrent.leechers}</TableCell>}
                  {visibleColumns.includes('actions') && (
                    <TableCell>
                      <IconButton onClick={() => handleDownloadTorrent(torrent.downloadLink)} color="primary">
                        <DownloadIcon />
                      </IconButton>
                      <IconButton onClick={() => handleRemoveFavorite(torrent)} color="secondary">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </SmoothScrollContainer>
  );
};

export default FavoritesPage;

