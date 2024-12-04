import React, { useState, useEffect } from 'react';
import { Snackbar, Button } from '@mui/material';
import { Alert } from '@mui/material';

const SaveShortcutNotification: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (open) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(timer);
                        // Здесь можно добавить логику перезапуска приложения
                        setOpen(false);
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }
    }, [open]);

    const handleSaveShortcuts = () => {
        setOpen(true);
    };

    return (
        <>
            <Button onClick={handleSaveShortcuts}>Сохранить ярлыки</Button>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity="warning" onClose={() => setOpen(false)}>
                    Перезапуск через {countdown}...
                </Alert>
            </Snackbar>
        </>
    );
};

export default SaveShortcutNotification;
