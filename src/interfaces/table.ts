export enum DataTableAlign {
  CENTER = 'center',
  INHERIT = 'inherit',
  JUSTIFY = 'justify',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortingProps {
  orderBy: string;
  direction: SortDirection;
}

export interface TableColumnProps {
  id: string;
  label: string;
  minWidth?: number;
  disableSort?: boolean;
  align?: DataTableAlign;
  format?: (value: number) => string;
}

export interface TableData {
  id: string | number;
  [key: string]: any;
}

export interface TableProps {
  columns: TableColumnProps[];
  defaultSort?: SortingProps;
  rows: TableData[];
}
