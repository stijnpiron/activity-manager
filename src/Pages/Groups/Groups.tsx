import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import Table from 'components/Table';
import Store from 'electron-store';
import { DataProps } from 'interfaces/data';
import { GroupData } from 'interfaces/groups';
import { SortDirection, SortingProps, TableColumnProps } from 'interfaces/table';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface GroupsProps {
  dataProps: DataProps;
  period: string | undefined;
}

const columns: TableColumnProps[] = [
  { id: 'bubble', label: 'Bubbel', minWidth: 100 },
  { id: 'department', label: 'Verbond', minWidth: 175 },
  { id: 'profiling', label: 'Profilering', minWidth: 175 },
  {
    disableSort: true,
    id: 'bubblePart',
    label: 'Groep',
    minWidth: 75,
  },
  {
    disableSort: true,
    id: 'participants',
    label: 'Deelnemers',
    minWidth: 110,
  },
  {
    disableSort: true,
    id: 'accompaniment',
    label: 'Begeleiding',
    minWidth: 110,
  },
  { id: 'pavilion', label: 'Paviljoen', minWidth: 175 },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      alignItems: 'stretch',
      display: 'flex',
      flexFlow: 'column',
      width: '400px',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    gridContainer: {
      height: 'calc(100vh - 120px)',
      minWidth: '950px',
    },
    pageTitle: {
      alignItems: 'center',
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      margin: theme.spacing(1),
    },
  }),
);

const Groups: React.FC<GroupsProps> = ({ period, dataProps }) => {
  const { dataLocation, encryptionKey, fileExtension } = dataProps;

  const storeProps = {
    cwd: dataLocation,
    default: { activities: [], groups: [], vouchers: [] },
    encryptionKey,
    fileExtension,
    name: period,
  };

  const defaultSort: SortingProps = {
    direction: SortDirection.ASC,
    orderBy: 'bubble',
  };

  const newGroupTemplate: GroupData = {
    accompaniment: 1,
    bubble: 0,
    bubblePart: 'A',
    code: '',
    department: '',
    id: '',
    participants: 0,
    pavilion: '',
    profiling: '',
  };

  const groupsStore: Store = new Store(storeProps);
  const groups = [...(groupsStore.get('groups', []) as GroupData[])];
  const tableProps = { columns, defaultSort, rows: groups };

  const [newGroup, setNewGroup] = useState(newGroupTemplate);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validNewGroup, setValidNewGroup] = useState(false);

  const handleClickOpen = (): void => setDialogOpen(true);

  const handleClose = (): void => setDialogOpen(false);

  const handlenewGroupPropertyChanged = (key: string, e: React.ChangeEvent<any>): void =>
    setNewGroup({ ...newGroup, [key]: e.target.value });

  const handleCreateGroup = (): void => {
    handleClose();

    if (newGroup && groups.filter((g) => g.code === newGroup?.code).length === 0) {
      const groupToAdd = { ...newGroup, id: uuid() };
      setNewGroup(newGroupTemplate);
      console.info(groupToAdd);
      groups.push(groupToAdd);
      const storeGroups = [...groups];
      console.info({ storeGroups });
      groupsStore.set('groups', [...groups]);
    }
  };

  const requiredGroupProps = [
    'accompaniment',
    'bubble',
    'bubblePart',
    'code',
    'department',
    'participants',
    'pavilion',
    'profiling',
  ];

  const partsChoice = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  useEffect(() => {
    setValidNewGroup(requiredGroupProps.filter((gp) => !newGroup || newGroup[gp]?.length === 0).length === 0);
    // TODO: add logic to show an errr message in the create group popup if a coode is already present
  }, [newGroup]);

  const classes = useStyles();

  return (
    <>
      <div className={classes.pageTitle}>
        <h1>Groups</h1>
        <Button
          className={classes.formControl}
          color="primary"
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={handleClickOpen}
        >
          Create group
        </Button>
      </div>
      {groups.length ? (
        <div className={classes.gridContainer}>
          <Table {...tableProps} />
        </div>
      ) : (
        <div>Please create your first group</div>
      )}
      <Dialog disableBackdropClick disableEscapeKeyDown open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Create a new group</DialogTitle>
        <DialogContent>
          <div>{period}</div>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                type="text"
                label="Code"
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('code', e)}
                value={newGroup?.code}
              ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                type="text"
                label="Department"
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('department', e)}
                value={newGroup?.department}
              ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                type="text"
                label="Profiling"
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('profiling', e)}
                value={newGroup?.profiling}
              ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                type="number"
                label="Bubble"
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('bubble', e)}
                value={newGroup?.bubble}
                InputProps={{
                  inputProps: {
                    max: 50,
                    min: 1,
                  },
                }}
              ></TextField>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="newGroup-part-input-label">Part</InputLabel>
              <Select
                labelId="newGroup-part-input-label"
                id="newGroup-part-input"
                value={newGroup?.bubblePart}
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('bubblePart', e)}
                label="Part"
              >
                {partsChoice.map((pc) => (
                  <MenuItem key={pc} value={pc}>
                    {pc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                type="number"
                label="Participants"
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('participants', e)}
                value={newGroup?.participants}
                InputProps={{
                  inputProps: {
                    max: 500,
                    min: 1,
                  },
                }}
              ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                type="number"
                label="Accompaniment"
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('accompaniment', e)}
                value={newGroup?.accompaniment}
                InputProps={{
                  inputProps: {
                    max: 50,
                    min: 1,
                  },
                }}
              ></TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                variant="outlined"
                type="text"
                label="Pavilion"
                onChange={(e: React.ChangeEvent<any>): void => handlenewGroupPropertyChanged('pavilion', e)}
                value={newGroup?.pavilion}
              ></TextField>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateGroup} disabled={!validNewGroup} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Groups;
