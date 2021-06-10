export interface MenuItem {
  key: string;
  text: string;
  icon: string;
}

export interface MenuParts {
  [index: number]: MenuItem[];
}
