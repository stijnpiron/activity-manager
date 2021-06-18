import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DataProps } from 'interfaces/data';
import { MenuItem } from 'interfaces/menu';
import Activities from 'Pages/Activities';
import Groups from 'Pages/Groups';
import SelectPeriod from 'Pages/SelectPeriod';
import Vouchers from 'Pages/Vouchers';
import React, { useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';

type AppProps = {
  title: string;
  dataProps: DataProps;
  getPeriods: () => string[];
  saveNewPeriod: (periods: string[]) => void;
  shutdown: () => void;
  version: string;
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

const App: React.FC<AppProps> = ({ title, version, dataProps, getPeriods, saveNewPeriod, shutdown }) => {
  const classes = useStyles();
  const [periods, setPeriods] = useState(getPeriods());
  const [period, setPeriod] = React.useState(periods.length === 1 ? periods[0] : '');

  const addPeriod = (period: string, currentPeriods: string[]): void => {
    if (!currentPeriods.includes(period)) {
      setPeriod(period);
      const newPeriods = [...currentPeriods, period];
      saveNewPeriod(newPeriods);
      setPeriods(newPeriods);
    }
  };

  const parts: MenuItem[][] = [
    [
      { alwaysEnabled: true, icon: 'check_box', key: 'selectPeriod', route: 'selectPeriod', text: 'Selecteer Periode' },
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
        action: shutdown,
        alwaysEnabled: true,
        icon: 'exit_to_app',
        key: 'shutdown',
        text: 'Afsluiten',
      },
    ],
  ];

  const menuProps = { parts, periodSelected: !!period };
  const groupsProps = { dataProps, period };
  const selectPeriodProps = { addPeriod, periods, selectedPeriod: period, setPeriod };

  return (
    <HashRouter>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap className={classes.title}>
              <span>
                {title}
                {period && <> - SelectedPeriod: {period}</>}
              </span>
              <span className={classes.version}>v{version}</span>
            </Typography>
          </Toolbar>
        </AppBar>
        <Menu {...menuProps} />
        <main className={classes.content}>
          <Toolbar />
          <Switch>
            <Route
              exact
              path={['/', '/selectPeriod']}
              render={(): React.ReactElement => <SelectPeriod {...selectPeriodProps} />}
            />
            <Route exact path="/groups" render={(): React.ReactElement => <Groups {...groupsProps} />} />
            <Route exact path="/activities" component={Activities} />
            <Route exact path="/vouchers" component={Vouchers} />
          </Switch>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
