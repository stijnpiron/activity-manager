import { createStyles, makeStyles } from '@material-ui/core';
import Table from 'components/Table';
import Store from 'electron-store';
import { DataProps } from 'interfaces/data';
import { SortDirection, SortingProps, TableColumnProps, TableData } from 'interfaces/table';
import React from 'react';

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

const useStyles = makeStyles(() =>
  createStyles({
    gridContainer: {
      height: 'calc(100vh - 120px)',
      minWidth: '950px',
    },
  }),
);

const Groups: React.FC<GroupsProps> = ({ period, dataProps }) => {
  const { dataLocation, fileExtension } = dataProps;

  const storeProps = {
    cwd: dataLocation,
    encryptionKey: process.env.NODE_ENV === 'DEV' ? undefined : period,
    fileExtension,
    name: period,
  };

  const defaultSort: SortingProps = {
    direction: SortDirection.ASC,
    orderBy: 'bubble',
  };

  const groupsStore: Store = new Store(storeProps);
  const groups = [...(groupsStore.get('groups', []) as TableData[])];
  const tableProps = { columns, defaultSort, rows: groups };

  console.info({ groups, storeProps, tableProps });

  const classes = useStyles();

  return (
    <div className={classes.gridContainer}>
      <Table {...tableProps} />
    </div>
  );
};

export default Groups;
