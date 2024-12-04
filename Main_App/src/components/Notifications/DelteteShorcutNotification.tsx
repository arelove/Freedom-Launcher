import React, { useState, useEffect } from 'react';
import { Snackbar, Button, LinearProgress } from '@mui/material';
import { Alert } from '@mui/material';

const DelteteShorcutNotification: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (open) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(timer);
                        setOpen(false);
                        return 0;
                    }
                    return Math.min(oldProgress + 1, 100);
                });
            }, 1000);
        }
    }, [open]);

    const handleCreateShortcut = () => {
        setOpen(true);
    };

    return (
        <>
            <Button onClick={handleCreateShortcut}>Создать первый ярлык</Button>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity="info" onClose={() => setOpen(false)}>
                    При удалении данные также нужно обновить
                    <LinearProgress variant="determinate" value={progress} />
                </Alert>
            </Snackbar>
        </>
    );
};

export default DelteteShorcutNotification;