import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
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
