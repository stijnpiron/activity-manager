import {
  createStyles,
  Divider,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import { MenuItem } from 'interfaces/menu.interface';
import React from 'react';

type MenuProps = {
  parts: MenuItem[][];
};

const drawerWidth = 200;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
  })
);

const Menu: React.FC<MenuProps> = ({ parts }) => {
  const classes = useStyles();
  const menuParts = parts
    .map((part, i) => (i < parts.length - 1 ? [part, <Divider key={i} />] : [part]))
    .reduce((res, curr) => [...res, ...curr]);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        {menuParts.map((part, i) =>
          Array.isArray(part) ? (
            <List key={`list-${i}`}>
              {part.map((mi) => (
                <ListItem button key={mi.key}>
                  <ListItemIcon>
                    <Icon>{mi.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={mi.text} />
                </ListItem>
              ))}
            </List>
          ) : (
            part
          )
        )}
      </div>
    </Drawer>
  );
};

export default Menu;
