import React, { useState } from 'react';
import { Button, TextField, Box, Paper, Snackbar, IconButton, Alert, LinearProgress } from '@mui/material';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/shell';
import { OpenInNew } from '@mui/icons-material';
import { join, resolve } from '@tauri-apps/api/path';

const defaultPath = 'C:';
const defaultFilePath = 'C:/Users/1/Downloads/disk_analysis_C.xlsx';
const defaultTimeWindow = 24;
const defaultDepth = 3;

const DiskAnalysisForm = () => {
  const [path, setPath] = useState(defaultPath);
  const [timeWindow, setTimeWindow] = useState(defaultTimeWindow);
  const [depth, setDepth] = useState(defaultDepth);
  const [pathtofileanalyze, setPathToFileAnalyze] = useState(defaultFilePath);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await invoke('python_script', {
        path,
        timeWindow: timeWindow * 3600, // переводим в секунды
        depth,
        pathtofileanalyze,
      });
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Ошибка при запуске Python скрипта:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async () => {
    try {
      const filePath = await resolve(await join(pathtofileanalyze));
      await open(filePath);
    } catch (error) {
      console.error('Ошибка при открытии файла:', error);
    }
  };

  const commonTextFieldProps = {
    fullWidth: true,
    variant: 'outlined' as 'outlined',
    size: 'small' as 'small', // Указываем тип явно
    sx: { backgroundColor: 'rgba(0, 0, 0, 0.2)', color: 'black' },
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 6, backgroundColor: 'rgba(0, 0, 0, 0.1)', color: 'white', maxWidth: 400, margin: 'auto' }}>
      {loading && <LinearProgress sx={{ marginBottom: 2 }} />}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Путь для анализа"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            {...commonTextFieldProps}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Путь для сохранения"
            value={pathtofileanalyze}
            onChange={(e) => setPathToFileAnalyze(e.target.value)}
            {...commonTextFieldProps}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="number"
            label="Окно времени (часы)"
            value={timeWindow}
            onChange={(e) => setTimeWindow(Number(e.target.value))}
            {...commonTextFieldProps}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="number"
            label="Максимальная глубина"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            {...commonTextFieldProps}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          Запустить анализ
        </Button>
      </form>

      <Snackbar open={showSuccessAlert} autoHideDuration={6000} onClose={() => setShowSuccessAlert(false)}>
        <Alert onClose={() => setShowSuccessAlert(false)} severity="success">
          Анализ завершен успешно!
          <IconButton color="inherit" onClick={handleOpenFile}>
            <OpenInNew />
          </IconButton>
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DiskAnalysisForm;
