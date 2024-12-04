import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({


    
    container: {
        padding: theme.spacing(4),
        background: 'rgba(10, 10, 10, 0.2)',
        
        backdropFilter: 'blur(5px)',
        borderRadius: '20px',
        boxShadow: theme.shadows[3],
    },
    diskContainer: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        transition: 'transform 0.6s, background-color 0.3s',
        '&:hover': {
            transform: 'scale(1.01)',
        },
    },
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    dialogContent: {
        minHeight: '400px',
    },
    chartPaper: {
        padding: theme.spacing(2),
        cursor: 'pointer',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        '&:hover': {
            boxShadow: theme.shadows[4],
        },
    },
    tabContent: {
        display: 'none',
    },
    showTab: {
        display: 'block',
    },
    hideTab: {
        display: 'none',
    },
}));

export default useStyles;
