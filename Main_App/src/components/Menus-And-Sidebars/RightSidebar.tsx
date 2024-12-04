import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  drawerPaper: {
    width: 250,
    backgroundColor: '#3f51b5',
    color: '#ffffff',
  },
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerOpen: {
    transition: 'transform 0.3s ease-in-out',
    
    transform: 'translateX(0)',
  },
  drawerClose: {
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(100%)',
  },
});

interface Props {
  open: boolean;
  onClose: () => void;
}

const RightSidebar: React.FC<Props> = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Drawer
    PaperProps={{
      sx: {
          backdropFilter: "blur(10px)", /* Эффект размытия */
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: "white",
          
      }}}
      anchor="right"
      open={open}
      onClose={onClose}
      classes={{
        paper: classes.drawerPaper,
      }}
      className={open ? classes.drawerOpen : classes.drawerClose}
    >
      <List>
        <ListItem button>
          <ListItemText primary="Удалить все мои данные" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Оставить отзыв" />
        </ListItem>
        
      </List>
    </Drawer>
  );
};

export default RightSidebar;
