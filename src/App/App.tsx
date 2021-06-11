import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MenuItem } from 'interfaces/menu.interface';
import React from 'react';
import Menu from './components/Menu';

type AppProps = {
  title: string;
  version: string;
};

const menuParts: MenuItem[][] = [
  [
    { key: 'vouchers', text: 'Vouchers', icon: 'description' },
    { key: 'activities', text: 'Activiteiten', icon: 'rowing' },
    { key: 'groups', text: 'Groepen', icon: 'group' },
  ],
  [
    { key: 'settings', text: 'Instellingen', icon: 'settings' },
    { key: 'logout', text: 'Afmelden', icon: 'exit_to_app' },
  ],
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      background: '#69AA49',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      width: '100%',
    },
    version: {
      fontSize: '12px',
    },
  })
);

const App: React.FC<AppProps> = (props) => {
  const classes = useStyles();

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
