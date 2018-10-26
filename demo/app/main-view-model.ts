import { Observable } from 'tns-core-modules/data/observable';
import { Oauth } from 'nativescript-oauth';

export class HelloWorldModel extends Observable {
  public message: string;
  private oauth: Oauth;

  constructor() {
    super();

    this.oauth = new Oauth();
    this.message = this.oauth.message;
  }
}
