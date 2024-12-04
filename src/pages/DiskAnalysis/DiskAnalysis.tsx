import React, { useState, useEffect } from 'react';
import {
    Button, Snackbar, Alert, Typography, CircularProgress, Grid, Paper, Dialog,
    DialogTitle, DialogContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, LinearProgress, IconButton,
    Tooltip, Select, MenuItem, Slider, TextField, DialogActions
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import {
    PlayArrow as PlayArrowIcon, 
    SaveAlt as SaveAltIcon,
    Settings,
} from '@mui/icons-material';
import { Scrollbars } from 'react-custom-scrollbars-2';


import { invoke } from '@tauri-apps/api/tauri';
import useStyles from './DiskStyles';

import DiskUsageChart from './DiskUsageChart';
import DiskAnalysisForm from './ModalDisk';


import { saveData, getData } from '../../indexedDB';


const DiskAnalysis: React.FC = () => {
    const [analysisData, setAnalysisData] = useState<Record<string, any>>({});
    const [disks, setDisks] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedDisk, setSelectedDisk] = useState<string | null>(null);
    const [loadingSavedData, setLoadingSavedData] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [analysisTime, setAnalysisTime] = useState<number | null>(null);
    
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage, setFilesPerPage] = useState(10); // можно сделать это значение динамическим
    const [currentTypePage, setTypeCurrentPage] = useState(1);
    const [filesTypePerPage, setTypeFilesPerPage] = useState(10);

    // const [openFileSystemGraph, setOpenFileSystemGraph] = useState(false); // Новое состояние для модального окна

    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = analysisData[selectedDisk!]?.folder_sizes.slice(indexOfFirstFile, indexOfLastFile);

    // Определение индексов для текущей страницы
    const indexOfTypeLastFile = currentTypePage * filesTypePerPage;
    const indexOfTypeFirstFile = indexOfTypeLastFile - filesTypePerPage;
    const currentTypeFiles = analysisData[selectedDisk!]?.file_types.slice(indexOfTypeFirstFile, indexOfTypeLastFile);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [minFileSize, setMinFileSize] = useState<number>(0);
    const [fileTypes, setFileTypes] = useState<string>(''); // Будем хранить типы файлов как строку

    const [minFolderSize, setMinFolderSize] = useState<number>(0);
    

    /// python script modal dialog
    const [openDialogPython, setOpenDialogPython] = useState(false);

    const classes = useStyles();

    const handleOpenDialogPython = () => setOpenDialogPython(true);
    const handleCloseDialogPython = () => setOpenDialogPython(false);
    const handleOpenSettings = () => setSettingsOpen(true);
    const handleCloseSettings = () => setSettingsOpen(false);
    const handleCloseDialog = () => setOpen(false);
    const handleCloseSnackbar = () => setError(null);

    
    useEffect(() => {
        const fetchDisks = async () => {
            try {
                const diskList = await invoke<string[]>('list_disks');
                setDisks(diskList);
            } catch (e) {
                setError('Error fetching disks: ' + e);
            }
        };

        fetchDisks();
    }, []);

    useEffect(() => {
        const saveAnalysisData = async () => {
            try {
                await saveData('analysisData', analysisData);
            } catch (e) {
                setError('Ошибка при сохранении данных: ' + e);
            }
        };
    
        saveAnalysisData();
    }, [analysisData]);
    

    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const savedData = await getData('analysisData');
                if (savedData) {
                    setAnalysisData(savedData);
                }
            } catch (e) {
                setError('Ошибка при загрузке сохраненных данных: ' + e);
            }
        };
    
        loadSavedData();
    }, []);
    
    


    const handleAnalyze = async (disk: string) => {
        setSelectedDisk(disk);
        setLoading(true);
        setShowSuccessAlert(false);
        const startTime = Date.now();
    
        try {
            const data = await invoke<any>('analyze_disk', {
                disk,
                minFileSize,  // минимальный размер файла
                fileTypes: fileTypes.split(',').map(type => type.trim()), // фильтр типов файлов
                minFolderSize: minFolderSize,

            });
            setAnalysisData(prevData => ({ ...prevData, [disk]: data }));
            
            const endTime = Date.now();
            setAnalysisTime((endTime - startTime) / 1000);
            
            setShowSuccessAlert(true);
        } catch (error) {
            setError('Ошибка при анализе диска: ' + error);
        } finally {
            setLoading(false);
        }
    };
    
    
    
    

    const handleViewSavedData = async (disk: string) => {
        setSelectedDisk(disk);
        setOpen(true);
        setLoadingSavedData(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setLoadingSavedData(false);
    };

    

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        else if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
        else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`;
        else return `${(bytes / 1073741824).toFixed(2)} GB`;
    };

    const formatSizeB = (size: number): string => {
        if (size < 1024) return `${size} байт`;
        if (size < 1048576) return `${(size / 1024).toFixed(2)} КБ`;
        if (size < 1073741824) return `${(size / 1048576).toFixed(2)} МБ`;
        return `${(size / 1073741824).toFixed(2)} ГБ`;
    };
    
    const formatDataForChart = (data: any[] = [], _key: string) => {
        return data.map((item: any) => ({
            name: item.name || item.type_,
            value: item.size || item.value, // Используйте числовое значение для графиков
            formattedValue: formatSizeB(item.size || item.value), // Форматированное значение для подсказок
        }));
    };
    
    

    const handleSortChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    
    const sortedFileTypes = [...(currentTypeFiles || [])].sort((a, b) => {
        return sortOrder === 'asc' ? a.size - b.size : b.size - a.size;
    });

//////////// slider //////////////

    const formatSize = (size: number) => {
        if (size < 1024) return `${size} байт`;
        if (size < 1048576) return `${(size / 1024).toFixed(2)} КБ`;
        if (size < 1073741824) return `${(size / 1048576).toFixed(2)} МБ`;
        return `${(size / 1073741824).toFixed(2)} ГБ`;
    };

//////////// slider //////////////

    return (

        <div className={classes.container}>
        
            <Typography variant="h4" gutterBottom
                sx={{
                    paddingBottom: '40px',
                    textAlign: 'center'
                
                }}
            >Анализ жестких дисков</Typography>
            <Grid container spacing={3}>
                {disks.map((disk, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper className={classes.diskContainer}
                            sx={{
                        
                                backgroundColor: 'rgba(10, 10, 10, 0.3)',
                                border: '1px solid rgba(200, 200, 200, 0.15)',
                                borderRadius: '150px',
                                color: 'white'
                            
                            }}
                        >
                            <Typography variant="h6">{disk}</Typography>
                            <Tooltip title="Анализировать">
                                <IconButton color="primary" onClick={() => handleAnalyze(disk)}>
                                    <PlayArrowIcon />
                                </IconButton>
                            </Tooltip>
                            <IconButton color="secondary" onClick={handleOpenSettings}>
                                <Settings/>
                            </IconButton>



                            {analysisData[disk] && (
                                <Tooltip title="Просмотреть сохраненные данные">
                                    <IconButton color="secondary" onClick={() => handleViewSavedData(disk)}>
                                        <SaveAltIcon />
                                    </IconButton>
                                </Tooltip>
                                
                            )}
                             {/* <IconButton
                                    color="primary"
                                    onClick={() => setOpenFileSystemGraph(true)}
                                    style={{ display: analysisData[selectedDisk!] ? 'inline-flex' : 'none' }}
                                >
                                    <FolderIcon />
                            </IconButton> */}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog 
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        
                        backdropFilter: "blur(10px)", /* Эффект размытия */
                        borderRadius: '20px',
                        color: 'white'
                    }}}
                open={settingsOpen} 
                onClose={handleCloseSettings} 
                maxWidth="sm" 
                fullWidth
                
            >
            <DialogTitle >Настройки анализа</DialogTitle>
            <DialogContent >
                <Tooltip title="Минимальный размер папки для анализа ">
                    <Typography gutterBottom>Минимальный размер папки</Typography>
                </Tooltip>
                <Typography id="min-folder-size-slider" gutterBottom>
                    {formatSize(minFolderSize)}
                </Typography>
                <Tooltip title="Минимальный размер папок для поиска">
                <Slider
                    value={minFolderSize}
                    onChange={(_event, newValue) => setMinFolderSize(newValue as number)}
                    aria-labelledby="min-folder-size-slider"
                    min={0}
                    max={10737418240} // 1 GB в байтах
                    step={1000} // шаг 1 байт для возможности точного ввода
                    
                />
                </Tooltip>
                <Typography id="min-file-size-slider" gutterBottom>
                    {formatSize(minFileSize)}
                </Typography>
                <Tooltip title="Минимальный размер типов данных для поиска. 
                                ВАЖНО!:  
                                В результате учитывается общее число файлов, следовательно если вы выбрали минимум - 30 МБ, то файлы меньше 30 МБ в общем результате показаны не будут! Общий результат - это сложение размеров всех типов данных.">
                <Slider
                    value={minFileSize}
                    onChange={(_event, newValue) => setMinFileSize(newValue as number)}
                    aria-labelledby="min-file-size-slider"
                    min={0}
                    max={10737418240} // 1 GB в байтах
                    step={1000} // шаг 1 байт для возможности точного ввода
                    
                />
                </Tooltip>
                <Tooltip title="Укажите файлы, в формате: exe, pdf, xlsx и тд. 
                                ВАЖНО!: 
                                Если оставить поле пустым, анализ будет проведен без фильтра по типам ">
                <TextField
                    label="Типы файлов (через запятую)"
                    value={fileTypes}
                    onChange={(e) => setFileTypes(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                </Tooltip>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseSettings} color="primary">Отмена</Button>
                <Button onClick={handleCloseSettings} color="primary">Сохранить</Button>
            </DialogActions>
        </Dialog>

            <div>
            {loading && <LinearProgress />}
            {analysisTime && <Typography>Время анализа: {analysisTime} секунд</Typography>}
            </div>
            
             
            <Dialog PaperProps={{
                style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease',
                    backdropFilter: "blur(10px)", /* Эффект размытия */
                    borderRadius: '20px',
                    color: 'white'
                }
            }} open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                
                <Scrollbars
                    style={{ height: '100vh' }}
                    autoHide
                    renderThumbVertical={({ style, ...props }) => (
                        <div
                            {...props}
                            style={{
                                ...style,
                                 /* Полностью скрывает полосы прокрутки */
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: '10px',
                                
                            }}
                        />
                    )}
                >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        color: 'white'
                    }}
                
                >Анализ диска: {selectedDisk}</DialogTitle>
                <DialogContent className={classes.dialogContent} >
                    
                    {loadingSavedData ? (
                        <div style={{ textAlign: 'center' , marginTop: '20%'}}>
                            <CircularProgress />
                            <Typography>Загрузка данных...</Typography>
                        </div>
                    ) : (
                        
                        <div>
                            
                            {/* <Typography variant="h6" gutterBottom>Размер папок</Typography> */}
                            <Grid container spacing={3}>
                                
                                <Grid item xs={12} md={6}>
                                    
                                    <Paper className={classes.chartPaper}
                                        sx={{
                    
                                            backgroundColor: 'transparent',
                                            borderRadius: '150px',
                                            color: 'white'
                                        
                                    }}>
                                        <DiskUsageChart data={formatDataForChart(analysisData[selectedDisk!]?.folder_sizes || [], 'size')} />
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper className={classes.chartPaper} sx={{
                 
                                            backgroundColor: 'transparent',
                                            borderRadius: '100px',
                                            
                                        
                                    }}>
                                        <DiskUsageChart data={formatDataForChart(analysisData[selectedDisk!]?.file_types || [], 'size')} />
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom
                            sx={{
                                textAlign: 'center',
                            }}
                            >Размеры папок</Typography>
                            <TableContainer component={Paper} 

                                sx={{

                                    backgroundColor: 'transparent',
                                    borderRadius: '20px 100px 100px 20px;',
                                    color: 'white'
                                    
                                }}
                                
                                >          
                                
                                <Table>                                    
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Папка</TableCell>
                                            <TableCell>Размер</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentFiles?.map((folder: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{folder.name}</TableCell>
                                                <TableCell>{formatBytes(folder.size)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div style={{
                                    display: 'flex',
                                }}>
                                    <Select
                                        sx={{
                                            borderRadius: '0px 100px 100px 70px;',
                                        }}
                                        value={filesPerPage}
                                        onChange={(event) => setFilesPerPage(Number(event.target.value))} // Преобразование в число
                                    >
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>

                                        
                                    </Select>
                                    <Pagination
                                        sx={{
                                            marginTop: '15px',
                                            marginLeft: '58%',
                                        }}
                                        count={Math.ceil(analysisData[selectedDisk!]?.folder_sizes.length / filesPerPage)}
                                        page={currentPage}
                                        onChange={(_, value) => setCurrentPage(value)}

                                        />
                                </div>
                            </TableContainer>

                            <Typography variant="h6" gutterBottom

                            sx={{
                                textAlign: 'center',
                            }}

                            >Типы файлов</Typography>
                            <Button onClick={handleSortChange}>
                                Сортировать по {sortOrder === 'asc' ? 'убыванию' : 'возрастанию'}
                            </Button>
                            <TableContainer component={Paper} 
                                sx={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '20px 100px 100px 20px;',
                                    color: 'white'
                                }} 
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Тип файла</TableCell>
                                            <TableCell>Размер</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {sortedFileTypes.map((fileType: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{fileType.type_}</TableCell>
                                            <TableCell>{formatBytes(fileType.size)}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                <div style={{
                                    display: 'flex',
                                }}>
                                    <Select
                                        sx={{
                                            borderRadius: '0px 100px 100px 70px;',
                                        }}
                                        value={filesTypePerPage}
                                        onChange={(event) => setTypeFilesPerPage(Number(event.target.value))}
                                    >
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={10000}>All</MenuItem>
                                    </Select>
                                    <Pagination
                                        sx={{
                                            marginTop: '15px',
                                            marginLeft: '58%',
                                        }}
                                        count={Math.ceil((analysisData[selectedDisk!]?.file_types.length || 0) / filesTypePerPage)}
                                        page={currentTypePage}
                                        onChange={(_, value) => setTypeCurrentPage(value)}

                                        />
                                </div>
                            </TableContainer>
                            
                            <Paper className={classes.chartPaper}
                                sx={{
                                    backgroundColor: 'transparent',
                                    marginTop: '10px',
                                    borderRadius: '200px 2000px 200px 2000px;',
                                    color: 'white'
                                }} 
                            >
                                <Typography variant="h6" gutterBottom
                                    sx={{
                                        textAlign: 'center'
                                    }} 
                                >Граф файловой системы</Typography>
                               
                            </Paper>
                        </div>
                       
                    )}
                </DialogContent>
                </Scrollbars>
            </Dialog>
            <Button variant="outlined" color="primary" onClick={handleOpenDialogPython}>
            Открыть форму анализа диска
            </Button>
            <Dialog
                open={openDialogPython}
                onClose={handleCloseDialogPython}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    backdropFilter: "blur(10px)", 
                    borderRadius: '20px',
                    color: 'white',
                    },
                }}
                >
                <DialogTitle sx={{ textAlign: 'center' }}>Просмотр изменений на диске</DialogTitle>
                    <DialogContent>
                        <DiskAnalysisForm />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialogPython} color="primary">
                        Закрыть
                        </Button>
                    </DialogActions>
            </Dialog>
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseSnackbar} >
                <Alert 
                onClose={handleCloseSnackbar} 
                severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={showSuccessAlert} autoHideDuration={6000} onClose={() => setShowSuccessAlert(false)} >
                <Alert 
                style={{ marginBottom: '-40%' }}
                onClose={() => setShowSuccessAlert(false)} 
                severity="success" >
                    Анализ завершен успешно!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DiskAnalysis;
