import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import clsx from 'clsx';
import React from 'react';

interface ISelectPeriodProps {
  addPeriod: (period: string, periods: string[]) => void;
  periods: string[];
  selectedPeriod: string;
  setPeriod: (period: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexColumn: {
    flexFlow: 'column nowrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  pageTitle: {
    margin: theme.spacing(1),
  },
  periodSelect: {
    width: '300px',
  },
}));

const SelectPeriod: React.FC<ISelectPeriodProps> = ({ addPeriod, periods, selectedPeriod, setPeriod }) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [periodInput, setPeriodInput] = React.useState('1');

  const [periodYear, setPeriodYear] = React.useState(new Date().getFullYear());

  const handleSelectChange = (event: React.ChangeEvent<any>): void => setPeriod(event.target.value);

  const handlePeriodYearChange = (event: React.ChangeEvent<any>): void => setPeriodYear(event.target.value);

  const handlePeriodInputChange = (event: React.ChangeEvent<any>): void => setPeriodInput(event.target.value);

  const handleClickOpen = (): void => setDialogOpen(true);

  const handleClose = (): void => setDialogOpen(false);

  const handleCreatePeriod = (): void => {
    handleClose();
    const newPeriod = `${periodYear}-${periodInput}`;
    setPeriod(newPeriod);
    addPeriod(newPeriod, periods);
  };

  return (
    <>
      <h1 className={classes.pageTitle}>Select the period to start with</h1>
      <div className={clsx(classes.container, classes.flexColumn, classes.periodSelect)}>
        {periods?.length ? (
          <>
            <FormControl variant="outlined" className={clsx(classes.formControl)}>
              {(periods.length > 1 && (
                <>
                  <InputLabel id="period-select-label">Period</InputLabel>
                  <Select
                    labelId="period-select-label"
                    id="period-select"
                    value={selectedPeriod}
                    onChange={handleSelectChange}
                    label="Period"
                  >
                    {periods
                      .sort()
                      .reverse()
                      .map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                  </Select>
                </>
              )) || <div>{periods[0]}</div>}
            </FormControl>
          </>
        ) : (
          <div>Please create your first period</div>
        )}
        <Button
          className={classes.formControl}
          color="primary"
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={handleClickOpen}
        >
          Create period
        </Button>
        <Dialog disableBackdropClick disableEscapeKeyDown open={dialogOpen} onClose={handleClose}>
          <DialogTitle>Select a year and a period to create</DialogTitle>
          <DialogContent>
            <form className={classes.container}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="period-year-input-label">Year</InputLabel>
                <Select
                  labelId="period-year-input-label"
                  id="period-year-input"
                  value={periodYear}
                  onChange={handlePeriodYearChange}
                  label="Year"
                >
                  {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + 5 - i - 1).map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  type="number"
                  label="Period"
                  onChange={handlePeriodInputChange}
                  value={periodInput}
                  InputProps={{
                    inputProps: {
                      max: 20,
                      min: 1,
                    },
                  }}
                ></TextField>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreatePeriod} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SelectPeriod;
