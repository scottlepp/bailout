import { Component } from '@angular/core';

import { BondPage } from '../bond/bond';
import { ListPage } from '../list/list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = ListPage;
  tab2Root: any = BondPage;

  constructor() {
  }

  clearBond() {

  }
}
