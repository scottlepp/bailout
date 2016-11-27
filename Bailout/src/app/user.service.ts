import {Injectable} from "@angular/core";

@Injectable()
export class User {
  public name;
  public offline: boolean = false;
  
  constructor () {
    this.name = {};
  }

}