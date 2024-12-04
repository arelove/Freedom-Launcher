// import React, { useState, useEffect } from 'react';
// import { invoke } from '@tauri-apps/api/tauri';
// import { Button, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';

// const SetupPage: React.FC = () => {
//   const [language, setLanguage] = useState('en');
//   const [alwaysOnTop, setAlwaysOnTop] = useState(false);
//   const [screenSize, setScreenSize] = useState('800x600');
  
//   const handleSaveSettings = async () => {
//     // Сохраняем настройки
//     await invoke('set_first_launch_done');
//     window.location.reload(); // Перезагрузка для перехода на основное приложение
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Welcome to the Setup</h1>
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="language-select-label">Language</InputLabel>
//         <Select
//           labelId="language-select-label"
//           value={language}
//           onChange={(e) => setLanguage(e.target.value as string)}
//         >
//           <MenuItem value="en">English</MenuItem>
//           <MenuItem value="ru">Русский</MenuItem>
//         </Select>
//       </FormControl>
//       <FormControlLabel
//         control={
//           <Switch
//             checked={alwaysOnTop}
//             onChange={(e) => setAlwaysOnTop(e.target.checked)}
//           />
//         }
//         label="Always on top"
//       />
//       <FormControl fullWidth margin="normal">
//         <InputLabel id="screen-size-select-label">Screen Size</InputLabel>
//         <Select
//           labelId="screen-size-select-label"
//           value={screenSize}
//           onChange={(e) => setScreenSize(e.target.value as string)}
//         >
//           <MenuItem value="800x600">800x600</MenuItem>
//           <MenuItem value="1024x768">1024x768</MenuItem>
//           <MenuItem value="1920x1080">1920x1080</MenuItem>
//         </Select>
//       </FormControl>
//       <Button variant="contained" color="primary" onClick={handleSaveSettings}>
//         Save and Continue
//       </Button>
//     </div>
//   );
// };

// export default SetupPage;
