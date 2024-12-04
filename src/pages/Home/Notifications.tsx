import React, { useEffect } from 'react';
import { Snackbar, Alert, LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';


interface NotificationsProps {
  openFirstShortcutNotification: boolean;
  openSaveNotification: boolean;
  DeleteShortcutNotification: boolean;
  setOpenFirstShortcutNotification: (value: boolean) => void;
  setOpenSaveNotification: (value: boolean) => void;
  setDeleteFirstShortcutNotification: (value: boolean) => void;
  progress: number;
  setProgress: (value: number | ((oldProgress: number) => number)) => void; // Обновленный тип
}

const Notifications: React.FC<NotificationsProps> = ({
  openFirstShortcutNotification,
  openSaveNotification,
  DeleteShortcutNotification,
  setOpenFirstShortcutNotification,
  setOpenSaveNotification,
  setDeleteFirstShortcutNotification,
  progress,
  setProgress,
}) => {
  const { t } = useTranslation();

  // Обработка уведомлений о добавлении ярлыка
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (DeleteShortcutNotification) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            setDeleteFirstShortcutNotification(false);
            return 0; // Сброс значения прогресса
          }
          return oldProgress + 0.7; // Увеличение прогресса
        });
      }, 1);
    }
    return () => clearInterval(timer);
  }, [DeleteShortcutNotification]);

  // Обработка уведомлений о добавлении ярлыка
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (openFirstShortcutNotification) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            setOpenFirstShortcutNotification(false);
            return 0; // Сброс значения прогресса
          }
          return oldProgress + 0.7; // Увеличение прогресса
        });
      }, 1);
    }
    return () => clearInterval(timer);
  }, [openFirstShortcutNotification]);

  // Обработка уведомления о сохранении
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (openSaveNotification) {
      // Устанавливаем начальное значение для countdown только при открытии уведомления
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            setOpenSaveNotification(false);
            return 0; // Сброс значения прогресса
          }
          return oldProgress + 0.7; // Увеличение прогресса
        });
      }, 1);
    }

    return () => clearInterval(timer);
  }, [openSaveNotification]); // Убираем setCountdown из зависимостей

  return (
    <>
      <Snackbar open={DeleteShortcutNotification} onClose={() => setDeleteFirstShortcutNotification(false)}>
        <Alert severity="info" onClose={() => setDeleteFirstShortcutNotification(false)}>
          {t('updateData')}
          <LinearProgress variant="determinate" value={progress} />
        </Alert>
      </Snackbar>
      <Snackbar open={openFirstShortcutNotification} onClose={() => setOpenFirstShortcutNotification(false)}>
        <Alert severity="info" onClose={() => setOpenFirstShortcutNotification(false)}>
          {t('saveData')}
          <LinearProgress variant="determinate" value={progress} />
        </Alert>
      </Snackbar>
      <Snackbar open={openSaveNotification} onClose={() => setOpenSaveNotification(false)}>
        <Alert severity="warning" onClose={() => setOpenSaveNotification(false)}>
          {t('restart')}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notifications;
