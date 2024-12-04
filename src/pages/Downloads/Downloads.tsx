import { useLocation } from 'react-router-dom';

const DownloadPage = () => {
  const location = useLocation();
  const { downloadLink } = location.state || {};  // Получаем ссылку на скачивание из состояния

  const startDownload = async () => {
    if (!downloadLink) {
      alert('Ошибка: не указана ссылка для скачивания');
      return;
    }

    try {
      // Здесь вы можете выполнить скачивание файла через fetch или использовать любой другой метод
      const response = await fetch(downloadLink);
      if (response.ok) {
        alert('Торрент успешно загружен!');
      } else {
        alert('Ошибка при скачивании.');
      }
    } catch (error) {
      console.error('Ошибка при скачивании:', error);
      alert('Ошибка при скачивании.');
    }
  };

  return (
    <div>
      <h1>Страница загрузки</h1>
      {downloadLink ? (
        <div>
          <p>Начинаем скачивание:</p>
          <button onClick={startDownload}>Скачать</button>
        </div>
      ) : (
        <p>Ссылка для скачивания не найдена.</p>
      )}
    </div>
  );
};

export default DownloadPage;
