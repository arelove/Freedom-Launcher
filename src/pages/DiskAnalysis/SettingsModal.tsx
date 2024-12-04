// SettingsModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Slider, Typography } from '@mui/material';

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (settings: { minSize: number; stopWords: string[] }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onSubmit }) => {
    const [minSize, setMinSize] = useState(0);
    const [stopWords, setStopWords] = useState<string>("");

    const handleSubmit = () => {
        onSubmit({
            minSize,
            stopWords: stopWords.split(',').map(word => word.trim()),
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Настройки анализа диска</DialogTitle>
            <DialogContent>
                <Typography gutterBottom>Минимальный размер файла (кб): {minSize}</Typography>
                <Slider
                    value={minSize}
                    onChange={(_e, newValue) => setMinSize(newValue as number)}
                    min={0}
                    max={1024}
                    step={1}
                    valueLabelDisplay="auto"
                />

                <TextField
                    label="Стоп-слова (через запятую)"
                    fullWidth
                    margin="normal"
                    value={stopWords}
                    onChange={(e) => setStopWords(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} color="primary">Применить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsModal;
