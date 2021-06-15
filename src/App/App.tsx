import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MenuItem } from 'interfaces/menu';
import Activities from 'pages/Activities';
import Groups from 'pages/Groups';
import Home from 'pages/Home';
import Vouchers from 'pages/Vouchers';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
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

  const parts: MenuItem[][] = [
    [
      { icon: 'group', key: 'groups', route: 'groups', text: 'Groepen' },
      {
        icon: 'rowing',
        key: 'activities',
        route: 'activities',
        text: 'Activiteiten',
      },
      {
        disabled: true,
        icon: 'description',
        key: 'vouchers',
        route: 'vouchers',
        text: 'Vouchers',
      },
    ],
    [
      {
        disabled: true,
        icon: 'settings',
        key: 'settings',
        text: 'Instellingen',
      },
      {
        action: props.shutdown,
        icon: 'exit_to_app',
        key: 'shutdown',
        text: 'Afsluiten',
      },
    ],
  ];

  const menuProps = { parts };

  return (
    <HashRouter>
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
        <Menu {...menuProps} />
        <main className={classes.content}>
          <Toolbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/groups" component={Groups} />
            <Route exact path="/activities" component={Activities} />
            <Route exact path="/vouchers" component={Vouchers} />
          </Switch>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
