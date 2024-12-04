import { SxProps } from '@mui/system';

export const getSettingsIconStyles = (rotate: boolean): SxProps => ({
    fontSize: '200px',
    transition: 'transform 1.2s ease, opacity 1.2s ease, filter 1.2s ease, border-color 0.4s ease',
    transform: rotate
        ? 'rotate(263deg) translateY(80%) translateX(3%) scale(0.2)'
        : 'rotate(0deg) translateX(0%)',
    opacity: 1,
    filter: rotate ? 'blur(2px)' : 'none',
    border: '2px solid transparent',
    borderRadius: '50%',
    padding: '10px',
    '&:hover': {
        borderColor: 'rgba(0, 150, 255, 0.8)',
        bgcolor: 'transparent',
        filter: 'brightness(1.2) saturate(1.5)',
        animation: 'pulse 2.5s infinite',
    },
    '&:active': {
        bgcolor: 'transparent',
        transform: rotate
            ? 'rotate(263deg) translateY(105%) translateX(0%) scale(0.25)'
            : 'rotate(0deg) translateX(0%) scale(1.05)',
    },
    '&:focus': {
        borderColor: 'rgba(0, 150, 255, 1)',
        boxShadow: '0px 0px 10px rgba(0, 150, 255, 0.5)',
    },
});


export const MuiStyles: { [key: string]: (isNotificationActive: boolean) => SxProps } = {
    saveButton: (isNotificationActive: boolean) => ({
        position: 'fixed',
        bottom: 16,
        right: 55,
        transition: 'transform 1s ease',
        animation: isNotificationActive ? 'bounce 3s ease' : 'none',
        '@keyframes bounce': {
            '0%': { transform: 'translateY(0)' },
            '10%': { transform: 'translateY(-20px)' },
            '20%': { transform: 'translateY(0)' },
            '30%': { transform: 'translateY(-20px)' },
            '40%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
            '60%': { transform: 'translateY(0)' },
            '70%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0)' },
        },
    }),

    

};