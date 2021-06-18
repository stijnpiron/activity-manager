import { TableData } from './table';

export interface GroupData extends TableData {
  accompaniment: number;
  bubble: number;
  bubblePart: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
  code: string;
  department: string;
  id: string;
  participants: number;
  pavilion: string;
  profiling: string;
}
// code, verbond, profilering, groep, deelnemers, begeleiding, paviljoen
