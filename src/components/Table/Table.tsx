import { TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { SortDirection, TableProps } from 'interfaces/table';
import React, { useState } from 'react';

const useStyles = makeStyles({
  container: {
    height: '100%',
    maxHeight: '100%',
  },
  defaultCursor: {
    cursor: 'default',
  },
  nonSortableColumn: {
    fontWeight: 900,
  },
  root: {
    borderColor: '#dcdbdc',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    width: '100%',
  },
  sortableColumn: {
    cursor: 'pointer',
    fontWeight: 900,
  },
  whiteBackground: {
    backgroundColor: '#ffffff',
  },
});

const DataTable: React.FC<TableProps> = ({ columns, rows, defaultSort }) => {
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState(defaultSort?.orderBy || 'id');
  const [sortDirection, setSortDirection] = useState(defaultSort?.direction || SortDirection.ASC);
  const [tableRows, setTableRows] = useState(rows);

  const sortHandler = (key: string): void => {
    if (!columns.filter((c) => c.id === key)[0].disableSort) {
      let newSortDirection = SortDirection.ASC;

      if (orderBy === key) {
        newSortDirection = sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
      } else {
        setOrderBy(key);
      }
      setSortDirection(newSortDirection);

      const sortedRows = [...tableRows].sort((a, b) =>
        newSortDirection === SortDirection.ASC
          ? a[key] > b[key]
            ? 1
            : b[key] > a[key]
            ? -1
            : 0
          : b[key] > a[key]
          ? 1
          : a[key] > b[key]
          ? -1
          : 0,
      );
      setTableRows(sortedRows);
    }
  };

  return (
    <div className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  onClick={(): void => sortHandler(column.id)}
                  sortDirection={orderBy === column.id ? sortDirection : false}
                  className={`${classes.whiteBackground} ${
                    column.disableSort
                      ? `${classes.defaultCursor} ${classes.nonSortableColumn}`
                      : classes.sortableColumn
                  }`}
                >
                  {!column.disableSort && (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? sortDirection : 'asc'}
                      onClick={(): void => sortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  )}
                  {column.disableSort && column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];

                  return (
                    <TableCell key={column.id} align={column.align} className={classes.defaultCursor}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
