export interface MenuItem {
  key: string;
  text: string;
  icon: string;
  route?: string;
  disabled?: boolean;
  action?: (...args: any) => any;
}

export interface MenuParts {
  [index: number]: MenuItem[];
}
