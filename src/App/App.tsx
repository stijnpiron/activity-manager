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
  shutdown: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      background: '#7aad55',
      zIndex: theme.zIndex.drawer + 1,
      background: '#69AA49',
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

  const menuParts: MenuItem[][] = [
    [
      { disabled: true, icon: 'description', key: 'vouchers', text: 'Vouchers' },
      { disabled: true, icon: 'rowing', key: 'activities', text: 'Activiteiten' },
      { disabled: true, icon: 'group', key: 'groups', text: 'Groepen' },
    ],
    [
      { disabled: true, icon: 'settings', key: 'settings', text: 'Instellingen' },
      { action: props.shutdown, disabled: true, icon: 'exit_to_app', key: 'shutdown', text: 'Afsluiten' },
    ],
  ];

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
