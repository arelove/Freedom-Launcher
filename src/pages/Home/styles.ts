import { makeStyles } from '@mui/styles';

const useMenuStyles = makeStyles(() => ({
  menuContainerSettingsSE: {
    position: "fixed",
    bottom: 130,
    right: -20,
    width: 250, // длина меню
    height: 110, // высота меню
    backgroundColor: "rgba(255, 255, 255, 0.0)", // полупрозрачное меню
    display: 'grid',
    zIndex: 2000, // слой для меню
    flexDirection: "row", // расположение элементов в столбец
    justifyContent: "space-around",
    
    transition: "transform 1.2s  ease", // анимация выезда
    transform: (props: { openSettingsSE: boolean }) =>
      props.openSettingsSE ? "translateX(8%)" : "translateX(100%)", // выезд справа
  },
  MenuBoxSettingsSE:{
    position: "absolute",
    transform: "scale(1.01)",
    
    zIndex: 0,
  },
  IconBoxSettingsSE:{
    position: 'fixed',
    zIndex: 1,
   
    "&:hover":{
     color: "white",
    }
  },
  settingsIconLargeopenSettingsSE: {
    position: "absolute",
    bottom: -135, // позиционирование значка настроек
    right: -130, // сдвигаем вправо, чтобы отображалась только половина значка
    transform: (props: { openSettingsSE: boolean }) =>
      props.openSettingsSE ? "translateX(0)" : "translateX(100%)", // выезд справа
    opacity: (props: { openSettingsSE: boolean }) =>
      props.openSettingsSE ? 0.1 : 0.1, // при открытии меню показывается часть значка
    
  },
}));

const useStyles = makeStyles({
  grid: (props: { columns: number; rows: number; openSettingsSE: boolean }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    gridTemplateRows: 'repeat(auto-fill, minmax(20vh, 1fr))',
    gap: '1.5vh',
    width: props.openSettingsSE ? 'calc(100% - 16vw)' : '100%',
    transition: 'width 1.2s ease',
    padding: '1vh 3vw',
    overflow: 'hidden', // Убираем лишние свойства
    scrollbarWidth: 'none',
  }),


  itemSkeleton: {
    minHeight: '20vh', // Одинаковая минимальная высота для скелетона и карточки
    height: '100%', // Обеспечивает, чтобы элемент растягивался на всю доступную высоту
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'space-between', // Распределение содержимого
    position: 'relative',
    padding: '20px', // Совпадает с карточкой
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    transition: 'transform 0.2s, background-color 0.3s',

  },
  
  item: {
    minHeight: '20vh', // Одинаковая минимальная высота для карточки
    height: '100%', // Обеспечивает растягивание на всю доступную высоту
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    border: '1px solid #3f51b5',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '10px',
    textAlign: 'center',
    borderRadius: '8px',
    transition: 'transform 0.2s, background-color 0.3s',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 20,
    },
    '&.dragging': {
      opacity: 0.32,
      transform: 'scale(0.9)',
      zIndex: 1000,
    },
    overflow: 'hidden',
  },
  

  addButton: {
    fontSize: '2rem',
    color: '#3f51b5',
    cursor: 'pointer',
  },

  iconButton: {
    color: '#3f51b5',
    margin: '0 0.5vw',
    width: '36px',
    height: '36px',

  },

  settingsButton: {
    position: 'relative',
    
    backgroundColor: '#3f51b5',
    '&:hover': {
      backgroundColor: '#303f9f',
    },
    
  },

  iconContainer: {
    width: '6vh',
    height: '6vh',
    minWidth: '32px',
    minHeight: '32px',
    maxWidth: '48px',
    maxHeight: '48px',
  },


  iconPreview: {
    width: '6vh',
    height: '6vh',
    minWidth: '32px',
    minHeight: '32px',
    maxWidth: '48px',
    maxHeight: '48px',
  },

  dialogBackground: {
    padding: '2vh',
    borderRadius: '1vh',
  },

  dialogActions: {
    justifyContent: 'space-between',
  },

  statisticTitle: {
    fontSize: '2vh',
    fontWeight: 'bold',
  },

  shortcutDetails: {
    margin: '1vh 0',
  },

  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around', // Распределяет кнопки равномерно
    alignItems: 'center', // Центрирует кнопки по вертикали
    marginTop: 'auto', // Позволяет кнопкам находиться внизу карточки
    padding: '10px 0', // Добавьте отступы, если необходимо
  },
  

  blurredBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(0.8vh)',
    zIndex: -1,
    transition: 'opacity 0.5s ease-in-out',
    opacity: 0,
  },

  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '2vh',
    borderRadius: '1vh',
    backdropFilter: 'blur(0.5vh)',
    transition: 'transform 0.2s ease-in-out',
    transform: 'scale(0.99)',
  },

  dialogOpen: {
    opacity: 1,
  },

  dialogContentOpen: {
    transform: 'scale(1)',
  },

  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dialogAddApp: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: '#fff',
    padding: '2vh',
    minWidth: '50vw',
    backdropFilter: 'blur(1vh)',
  },

  dialogTitleSet: {
    textAlign: 'center',
    fontSize: '2.5vh',
    fontWeight: 'bold',
  },

  dialogContentSet: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1vh',
    padding: '2vh 0',
  },

  textField: {
    '& .MuiInputBase-root': {
      color: '#fff',
    },
    '& .MuiInputLabel-root': {
      color: '#bbb',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#555',
    },
    '& .MuiInput-underline:hover:before': {
      borderBottomColor: '#aaa',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fff',
    },
  },

  button: {
    color: '#fff',
    borderColor: '#fff',
    '&:hover': {
      borderColor: '#bbb',
      color: '#bbb',
    },
  },

  paginationDot: {
    
    width: '1vh',
    height: '1vh',
    minWidth: '7px',
    minHeight: '7px',
    maxWidth: '10px',
    maxHeight: '10px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    margin: '0 5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&.active': {
      transform: 'scale(1.15)',
    },
    zIndex: 1,
  },
});
  
export { useStyles, useMenuStyles };


