import { createStyles, makeStyles } from '@material-ui/core';
import Table from 'components/Table';
import { SortDirection, SortingProps, TableColumnProps, TableData } from 'interfaces/table';
import React from 'react';

interface GroupsProps {
  [key: string]: any;
}

// const store: Store = new Store();
// const { height, width } = store.get('windowBounds') as any;
// console.info(height, width);

// const api = remote.getGlobal('api');

const defaultSort: SortingProps = {
  direction: SortDirection.ASC,
  orderBy: 'bubble',
};

const rows: TableData[] = [
  {
    accompaniment: 3,
    bubble: 1,
    bubblePart: 1,
    department: 'Limburg',
    id: 1,
    participants: 21,
    pavilion: '9B',
    profiling: 'Boomhutten',
  },
  {
    accompaniment: 4,
    bubble: 1,
    bubblePart: 2,
    department: 'Limburg',
    id: 2,
    participants: 21,
    pavilion: '9B',
    profiling: 'Boomhutten',
  },
  {
    accompaniment: 9,
    bubble: 2,
    bubblePart: 1,
    department: 'SMB',
    id: 3,
    participants: 53,
    pavilion: '1A - 1B (141-146)',
    profiling: 'Splash & Fun',
  },
  {
    accompaniment: 5,
    bubble: 3,
    bubblePart: 1,
    department: 'Antwerpen',
    id: 4,
    participants: 39,
    pavilion: '2A - 1B (147-150)',
    profiling: 'Aqua Extreme',
  },
  {
    accompaniment: 2,
    bubble: 4,
    bubblePart: 1,
    department: 'RMT',
    id: 5,
    participants: 19,
    pavilion: '3A',
    profiling: 'Mountain Action',
  },
  {
    accompaniment: 3,
    bubble: 4,
    bubblePart: 2,
    department: 'RMT',
    id: 6,
    participants: 19,
    pavilion: '3B (347-350)',
    profiling: 'Mountain Action',
  },
  {
    accompaniment: 7,
    bubble: 5,
    bubblePart: 1,
    department: 'Waas & Dender',
    id: 7,
    participants: 41,
    pavilion: '6',
    profiling: 'Splash & Fun',
  },
  {
    accompaniment: 10,
    bubble: 6,
    bubblePart: 1,
    department: 'Brugge',
    id: 8,
    participants: 59,
    pavilion: '4B - 2C - 4A',
    profiling: 'Puur Avontuur',
  },
  {
    accompaniment: 7,
    bubble: 7,
    bubblePart: 1,
    department: 'Gent',
    id: 9,
    participants: 40,
    pavilion: '5',
    profiling: 'Boomhutten',
  },
  {
    accompaniment: 7,
    bubble: 7,
    bubblePart: 1,
    department: 'Gent',
    id: 10,
    participants: 40,
    pavilion: '',
    profiling: 'Boomhutten',
  },
  {
    accompaniment: 6,
    bubble: 8,
    bubblePart: 1,
    department: 'Leuven',
    id: 11,
    participants: 41,
    pavilion: '7',
    profiling: 'Mountain Action',
  },
  {
    accompaniment: 7,
    bubble: 9,
    bubblePart: 1,
    department: 'Oostende',
    id: 12,
    participants: 58,
    pavilion: '2B - 3B (341-346)',
    profiling: 'Crazy Adventure',
  },
  {
    accompaniment: 8,
    bubble: 10,
    bubblePart: 1,
    department: 'RoeTie',
    id: 13,
    participants: 39,
    pavilion: '9A',
    profiling: 'Kazouwerf',
  },
  {
    accompaniment: 5,
    bubble: 11,
    bubblePart: 1,
    department: 'ZWVL',
    id: 14,
    participants: 38,
    pavilion: '8',
    profiling: 'Ultieme Dans',
  },
];

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

const Groups: React.FC<GroupsProps> = (props) => {
  const classes = useStyles();

  const tableProps = { columns, defaultSort, rows };

  return (
    <div className={classes.gridContainer}>
      <Table {...tableProps} />
    </div>
  );
};

export default Groups;
