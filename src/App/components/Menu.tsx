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
import { MenuItem } from 'interfaces/menu';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type MenuProps = {
  parts: MenuItem[][];
  periodSelected: boolean;
};

const drawerWidth = 200;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      flexShrink: 0,
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    drawerPaper: {
      width: drawerWidth,
    },
    linkButton: {
      color: '#000000',
    },
  }),
);

const Menu: React.FC<MenuProps> = ({ parts, periodSelected }) => {
  const classes = useStyles();

  const menuParts = parts
    .map((part, i) => (i < parts.length - 1 ? [part, <Divider key={i} />] : [part]))
    .reduce((res, curr) => [...res, ...curr]);

  const currentRoute = useLocation().pathname.replace('/', '');

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
                <ListItem
                  button
                  selected={currentRoute.includes(mi.route || 'no-route')}
                  key={mi.key}
                  component={mi.disabled || (!periodSelected && !mi.alwaysEnabled) || !mi.route ? 'li' : Link}
                  onClick={mi.action}
                  to={mi.route ? `/${mi.route}` : undefined}
                  disabled={!mi.alwaysEnabled && (mi.disabled || !periodSelected)}
                  className={classes.linkButton}
                >
                  <ListItemIcon>
                    <Icon>{mi.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={mi.text} />
                </ListItem>
              ))}
            </List>
          ) : (
            part
          ),
        )}
      </div>
    </Drawer>
  );
};

export default Menu;
