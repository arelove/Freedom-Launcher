import React from 'react';
import {
  Button,
  Switch,
  FormControlLabel,
  Typography,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Slider,
} from '@mui/material';
import { useThemeContext } from '../../ThemeContext';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../LanguageContext';
import { invoke } from '@tauri-apps/api';
import i18n from 'i18next';
import SmoothScrollContainer from '../Home/SmoothScrollContainer';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { setCustomThemeColors, fontFamily, fontSize, setFontFamily, setFontSize } = useThemeContext();
  const { language, setLanguage } = useLanguage();

  const [localTheme, setLocalTheme] = React.useState<string>('custom1');
  const [primaryColor, setPrimaryColor] = React.useState<string>('#6a0dad');
  const [secondaryColor, setSecondaryColor] = React.useState<string>('#9c27b0');
  const [onTop, setOnTop] = React.useState<boolean>(false);

  const fontOptions = [
    'Arial',
    'Verdana',
    'Tahoma',
    'Peak5', // Новый шрифт
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
  ];

  React.useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setLocalTheme(settings.theme || 'custom1');
      setPrimaryColor(settings.primaryColor || '#6a0dad');
      setSecondaryColor(settings.secondaryColor || '#9c27b0');
      setOnTop(settings.onTop ?? false);
      setFontFamily(settings.fontFamily || 'Arial');
      setFontSize(settings.fontSize || 14);
      setLanguage(settings.language || 'ru'); // Загружаем 
    }
  }, []);

  const handleOnTopChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isOnTop = event.target.checked;
    setOnTop(isOnTop);
    await invoke('set_always_on_top', { alwaysOnTop: isOnTop });
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    color: '#fff',
  };

  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    const selectedTheme = event.target.value;
    if (['custom1', 'custom2', 'custom3'].includes(selectedTheme)) {
      setLocalTheme(selectedTheme);

      let primary, secondary;
      switch (selectedTheme) {
        case 'custom1':
          primary = '#6a0dad';
          secondary = '#9c27b0';
          break;
        case 'custom2':
          primary = '#ff5722';
          secondary = '#ffeb3b';
          break;
        case 'custom3':
          primary = '#71a5eb';
          secondary = '#427fcf';
          break;
        default:
          primary = '#6a0dad';
          secondary = '#9c27b0';
      }

      setCustomThemeColors(primary, secondary);
      localStorage.setItem('theme', selectedTheme);
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const lang = event.target.value;
    if (i18n.changeLanguage) {
      i18n.changeLanguage(lang)
        .then(() => {
          setLanguage(lang);
          localStorage.setItem('language', lang);
        })
        .catch((err) => {
          console.error('Error changing language:', err);
        });
    } else {
      console.error('i18n.changeLanguage is not available');
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem(
      'app-settings',
      JSON.stringify({
        theme: localTheme,
        primaryColor,
        secondaryColor,
        onTop,
        fontFamily,
        fontSize,
        language,
      })
    );
  };

  const handleResetSettings = () => {
    setLocalTheme('custom1');
    setPrimaryColor('#6a0dad');
    setSecondaryColor('#9c27b0');
    setFontFamily('Arial');
    setFontSize(14);
    setOnTop(false); // Сброс значения onTop
    console.log('Settings reset to default');
    handleSaveSettings();
    setLanguage('ru');
  };

  return (
    
    <div style={containerStyle}>
      <SmoothScrollContainer
        damping={0.1}
        thumbMinSize={25}
        renderByPixels={false}
        height="80vh" // изменить высоту контейнера, если нужно
      >
      <Typography variant="h4" gutterBottom>{t('settings')}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            <FormControl fullWidth style={{ marginBottom: '20px' }}>
              <InputLabel>{t('theme')}</InputLabel>
              <Select
                value={localTheme}
                onChange={handleThemeChange}
                label={t('theme')}
              >
                <MenuItem value="custom1">{t('purple')}</MenuItem>
                <MenuItem value="custom2">{t('red')}</MenuItem>
                <MenuItem value="custom3">{t('blue')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: '20px' }}>
              <InputLabel>{t('language')}</InputLabel>
              <Select
                value={language}
                onChange={handleLanguageChange}
                label={t('language')}
              >
                <MenuItem value="en">{t('english')}</MenuItem>
                <MenuItem value="ru">{t('russian')}</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              sx={{marginLeft: '0px'}}
              control={<Switch checked={onTop} onChange={handleOnTopChange} />}
              label={t('alwaysOnTop')}
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} sm={6}>
          
          <FormControl fullWidth>
            <InputLabel>{t('font_family')}</InputLabel>
            <Select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                localStorage.setItem('fontFamily', e.target.value); // Сохраняем шрифт в localStorage
              }}
              label={t('font_family')}
            >
              {fontOptions.map((font) => (
                <MenuItem key={font} value={font}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Slider
            value={fontSize}
            min={12}
            max={30}
            step={1}
            onChange={(_, newValue) => {
              setFontSize(newValue as number);
              localStorage.setItem('fontSize', (newValue as number).toString()); // Сохраняем размер шрифта в localStorage
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}px`}
            style={{ marginTop: '20px' }}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={6}>
          <Button fullWidth variant="outlined" color="secondary" onClick={handleResetSettings}>{t('reset')}</Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSaveSettings}>{t('save')}</Button>
        </Grid>
      </Grid>
      </SmoothScrollContainer>
    </div>
  );
};

export default Settings;
