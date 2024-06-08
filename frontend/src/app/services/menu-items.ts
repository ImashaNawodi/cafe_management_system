import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

// Correct MENUITEMS to be an array of Menu objects
const MENUITEMS: Menu[] = [
  {
    state: "dashboard",
    name: "dashboard",
    icon: "dashboard",
    role: ""
  }
];

@Injectable({
  providedIn: 'root'
})
export class MenuItem {
  getMenuItem(): Menu[] {
    return MENUITEMS;
  }
}
