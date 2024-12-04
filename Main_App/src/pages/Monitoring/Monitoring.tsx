import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { makeStyles } from '@mui/styles';
import { 
  Typography, 
  CircularProgress, 
  List, ListItem, 
  ListItemText, Button, Skeleton 
} from '@mui/material';
import ProcessesModal from './ProcessesModal'; 
import { useTranslation } from 'react-i18next';
import SmoothScrollContainer from '../Home/SmoothScrollContainer';

const useStyles = makeStyles({
  container: {
    minHeight: '90vh',
    color: '#fff',
    padding: '2vw', // Используем vw для отступов
  },
  title: {
    color: '#fff',
    fontSize: '5vw', // Шрифт будет масштабироваться в зависимости от ширины экрана
  },
  list: {
    backgroundColor: 'rgba(40, 40, 40, 0.2)',
    borderRadius: '2vw',
    padding: '2vw',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
  },
  listItem: {
    borderRadius: '1vw',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
  },
  loaderContainer: {
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    minWidth: '60vw',
  },
  table: {
    minWidth: '65vw',
  },
  searchField: {
    marginBottom: '2vw',
  },
  systemContainer: {
    display: 'flex',
    flexWrap: 'wrap', // добавлено для гибкости
    marginBottom: '2vw',
  },
  block: {
    flex: 1,
    marginTop: '2vw',
    backgroundColor: 'rgba(40, 40, 40, 0.4)',
    backdropFilter: "blur(30px)",
    padding: '2vw',
    borderRadius: '1.5vw',
    margin: '1vw',
    border: '1px solid #000',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  },
  '@media (max-width: 768px)': {
    title: {
      fontSize: '7vw', // Меньший размер шрифта на маленьких экранах
    },
    block: {
      flex: '1 1 100%', // Блоки становятся на всю ширину экрана
      marginTop: '5vw',
    },
    table: {
      minWidth: '80vw', // Таблица адаптируется под экран
    },
  },
});

interface SystemInfo {
  cpu_count: number;
  memory_info: number,
  memory_usage: number,
  swap: string;
  system_name: string;
  kernel_version: string;
  os_version: string;
  host_name: string;
  processes: string;
  disks: string;
  networks: string;
  components: string;
}

const Monitoring: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [filteredProcesses, setFilteredProcesses] = useState<string[]>([]);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true); 
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchSystemInfo() {
      const info: SystemInfo = await invoke('get_system_info');
      setSystemInfo(info);
      setFilteredProcesses(info.processes.split(', '));
      setLoadingSkeleton(false); 
    }
    fetchSystemInfo();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    
    <div className={classes.container}>
      <Typography variant="h4" align="center" className={classes.title}>{t('monitoringSystem')}</Typography>
      <SmoothScrollContainer
      damping={0.1}
      thumbMinSize={25}
      renderByPixels={false}
      height="75vh" // изменить высоту контейнера, если нужно
      >
      {loadingSkeleton ? (
        <div className={classes.systemContainer}>
          {/* Первый блок скелетона */}
          <div className={classes.block}>
            <Skeleton variant="text" height={5} width="60%" style={{ marginBottom: '2vw' }} /> {/* Заголовок */}
            <List className={classes.list}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton 
                  key={index} 
                  variant="rectangular" 
                  height={5} // Высота для элемента списка
                  style={{ marginBottom: '2vw' }} // Отступ между элементами
                />
              ))}
            </List>
            <Skeleton variant="rectangular" sx={{ width: '14vw', height: 2 , marginTop:2, borderRadius:2}} />
          </div>
          
          {/* Второй блок скелетона */}
          <div className={classes.block}>
            <Skeleton variant="text" height={5} width="60%" style={{ marginBottom: '2vw' }} /> {/* Заголовок */}
            <List className={classes.list}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton 
                  key={index} 
                  variant="rectangular" 
                  height={5} // Высота для элемента списка
                  style={{ marginBottom: '2vw' }} // Отступ между элементами
                />
              ))}
            </List>
          </div>
          
        </div>
        
      ): systemInfo ? (
        <>
          <div className={classes.systemContainer}>
            <div className={classes.block}>
              <Typography variant="h6" gutterBottom>{t('monitoringSystemMainInfo')}</Typography>
              <List className={classes.list}>
                <ListItem className={classes.listItem}>
                  <ListItemText primary={t('cpuCount')} secondary={systemInfo.cpu_count} />
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemText 
                  primary={t('memory')} 
                  secondary={t('Ram') + systemInfo.memory_info + t('MBytes')}/>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemText 
                  primary={t('memoryUsage')} 
                  secondary={t('RamUsage') + systemInfo.memory_usage + t('MBytes')}/>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemText primary={t('swap')} secondary={systemInfo.swap} />
                </ListItem>
              </List>
            </div>
            <div className={classes.block}>
              <Typography variant="h6" gutterBottom>{t('monitoringSystemMainInfoSys')}</Typography>
              <List className={classes.list}>
                <ListItem className={classes.listItem}>
                  <ListItemText primary={t('systemName')} secondary={systemInfo.system_name} />
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemText primary={t('kernelVersion')} secondary={systemInfo.kernel_version} />
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemText primary={t('osVersion')} secondary={systemInfo.os_version} />
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemText primary={t('hostName')} secondary={systemInfo.host_name} />
                </ListItem>
              </List>
            </div>
          </div>
          <Button 
            variant="contained" 
            onClick={handleOpenModal}
            sx={{ 
              backgroundColor: 'rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1vw',
              marginLeft: '1vw',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            },}}>
            {t('ViewallProccess')}
          </Button>
          <ProcessesModal 
            open={openModal}
            onClose={handleCloseModal}
            processes={filteredProcesses.map(process => {
              const parts = process.split(' ');
              const pid = parts[0].replace(/\[|\]/g, '');
              const writtenBytes = parseInt(parts.find(part => part.includes('written_bytes:'))?.split(':')[1] ?? "0", 10);
              const totalReadBytes = parseInt(parts.find(part => part.includes('total_read_bytes:'))?.split(':')[1] ?? "0", 10);
              const readBytes = parseInt(parts.find(part => part.includes('read_bytes:'))?.split(':')[1] ?? "0", 10);

              return {
                pid,
                name: parts[1],
                writtenBytes: writtenBytes / (1024 * 1024),
                totalReadBytes: totalReadBytes / (1024 * 1024),
                readBytes: readBytes / (1024 * 1024),
              };
            })}
          />
        </>
      ) : (
        <div className={classes.loaderContainer}>
          <CircularProgress />
        </div>
      )}
      </SmoothScrollContainer>
    </div>
    
  );
};

export default Monitoring;
