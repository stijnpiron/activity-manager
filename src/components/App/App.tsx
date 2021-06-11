import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MenuItem } from 'interfaces/menu.interface';
import React from 'react';
import Menu from './Menu';

type AppProps = {
  title: string;
  version: string;
};

const menuParts: MenuItem[][] = [
  [
    { icon: 'description', key: 'vouchers', text: 'Vouchers' },
    { icon: 'rowing', key: 'activities', text: 'Activiteiten' },
    { icon: 'group', key: 'groups', text: 'Groepen' },
  ],
  [
    { icon: 'settings', key: 'settings', text: 'Instellingen' },
    { icon: 'exit_to_app', key: 'logout', text: 'Afmelden' },
  ],
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    root: {
      display: 'flex',
    },
    title: {
      alignItems: 'baseline',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    version: {
      fontSize: '12px',
    },
  }),
);

const App: React.FC<AppProps> = (props) => {
  const classes = useStyles();
  debugger;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            <span>{props.title}</span>
            <span className={classes.version}>v{props.version}</span>
          </Typography>
        </Toolbar>
      </AppBar>
      <Menu parts={menuParts} />
      <main className={classes.content}>
        <Toolbar />
      </main>
    </div>
  );
};

export default App;