import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import SmoothScrollContainer from '../Home/SmoothScrollContainer';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    minHeight: 300,
  },
});

interface ProcessData {
  pid: string;
  name: string;
  writtenBytes: number;      // Принять как строку
  totalReadBytes: number;    // Принять как строку
  readBytes: number;         // Принять как строку
}

interface ProcessesModalProps {
  open: boolean;
  onClose: () => void;
  processes: ProcessData[];
}

const ProcessesModal: React.FC<ProcessesModalProps> = ({ open, onClose, processes }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  // Функция для разбора строк и извлечения данных
  const parseProcessData = (data: any[]): ProcessData[] => {
    const parsedData: ProcessData[] = [];

    for (let i = 0; i < data.length; i += 4) {
      try {
        const process = {
          pid: data[i]?.pid || 'Unknown',
          name: data[i]?.name || 'Unknown',
          // Оставляем байты в виде строк
          writtenBytes: data[i + 1]?.written_bytes || '0',
          totalReadBytes: data[i + 2]?.total_read_bytes || '0',
          readBytes: data[i + 3]?.read_bytes || '0',
        };

        parsedData.push(process);
      } catch (error) {
        console.error('Failed to parse process data:', data[i], error);
        parsedData.push({
          pid: 'Unknown',
          name: 'Unknown',
          writtenBytes: 0,
          totalReadBytes: 0,
          readBytes: 0,
        });
      }
    }

    return parsedData;
  };

  const processData = parseProcessData(processes);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          
        },
      }}
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(8px)',
        borderRadius: '10px',
        transition: 'background-color 0.3s ease',
        
      }}
    >
      <DialogTitle>{t('allProccess')}</DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <TextField
          style={{ backgroundColor: 'transparent', borderRadius: '10px' }}
          label={t('SearchProcesses')}
          variant="outlined"
          fullWidth
          // Реализуйте функциональность поиска здесь
        />
        <SmoothScrollContainer
          damping={0.1}
          thumbMinSize={25}
          renderByPixels={false}
          height="75vh" // изменить высоту контейнера, если нужно
          >
        <TableContainer
          component={Paper}
          style={{ backgroundColor: 'transparent', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
        >
          <Table
            className={classes.table}
            sx={{
              backgroundColor: 'transparent',
              borderRadius: '10px',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t('ProcessID')}</TableCell>
                <TableCell>{t('ProcessName')}</TableCell>
                <TableCell>{t('WrittenBytes')}</TableCell>
                <TableCell>{t('TotalReadBytes')}</TableCell>
                <TableCell>{t('ReadBytes')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processData.map((process, index) => (
                <TableRow key={index}>
                  <TableCell>{process.pid}</TableCell>
                  <TableCell>{process.name}</TableCell>
                  {/* Преобразуем строковые байты в числа для отображения */}
                  <TableCell>{(Number(process.writtenBytes) / 1024 / 1024).toFixed(2)}</TableCell>
                  <TableCell>{(Number(process.totalReadBytes) / 1024 / 1024).toFixed(2)}</TableCell>
                  <TableCell>{(Number(process.readBytes) / 1024 / 1024).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </SmoothScrollContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessesModal;
