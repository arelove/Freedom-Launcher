import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';

const DownloadSettings = ({ open, onClose, onSave }: { open: boolean, onClose: () => void, onSave: (path: string, fileName: string) => void }) => {
  const [savePath, setSavePath] = useState("C:/Users/1/Downloads"); // Значение по умолчанию
  const [fileName, setFileName] = useState("GamesFromFreedom"); // Значение по умолчанию

  const handleSave = () => {
    onSave(savePath, fileName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Настройки загрузки торрента</DialogTitle>
      <DialogContent>
        <TextField
          label="Путь сохранения"
          value={savePath}
          onChange={(e) => setSavePath(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Название файла"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          fullWidth
          margin="dense"
        />
        <Button onClick={handleSave} color="primary">
          Сохранить
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadSettings;
