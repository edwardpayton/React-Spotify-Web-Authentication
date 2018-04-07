import React, {Component, Fragment} from 'react';

import {parseQueryString} from '../utils/parseQueryString';

export default class Home extends Component {
  constructor() {
    super();

    this.client_id = 'bdc6ae7a0c5649a293e43904fffa230d',
    this.redirect_uri = 'http://localhost:3000',
    this.scopes = [
      'streaming', 
      'user-read-birthdate', 
      'user-read-email', 
      'user-read-private user-modify-playback-state'
    ].join('%20');
  }

  login() {
    window.location = [
    "https://accounts.spotify.com/authorize",
    `?client_id=${this.client_id}`,
    `&redirect_uri=${this.redirect_uri}`,
    `&scope=${this.scopes}`,
    "&response_type=token",
    "&show_dialog=true"
    ].join('');
  }

  loginCallback() {  
    if(this.getToken()) return true;
    else this.setToken();
  }

  loggedInStatus() {
    if(this.getToken()) return true;
    else return false;
  }

  getToken() {
    const tokenObj = JSON.parse(localStorage.getItem('spotify_token'));
    if(tokenObj 
      && tokenObj.access_token 
      && (new Date() < new Date(tokenObj.expires))
    ) {
        return tokenObj;
    }
    else return null;
  }

  setToken() {
    if(!window.location.hash.length) return;

    const hashObj = parseQueryString(window.location.hash);

    localStorage.setItem('spotify_token', JSON.stringify({
      access_token: hashObj.access_token,
      expires: new Date(Date.now() + (hashObj.expires_in * 1000))
    }));

    window.location.hash = '';
  }

  buttonClick(e) {
    e.preventDefault();
    this.login();
  }

  getExpiresTime() {
    const expires = this.getToken().expires;
    const date = new Date(expires);
    const addZero = number => number < 10 ? '0' + number : number;
    return `${addZero(date.getHours())}:${addZero(date.getMinutes())} on ${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()}`;
  }

  componentWillMount() {
    window.location.hash.length && this.loginCallback();
  }
  

  render() {
    return(
      <Fragment>
        {
          this.loggedInStatus()
          ? (
            <div>
              <p>You're logged in to Spotify!</p>
              <hr />
              <p>Your Spotify Access Token will expire at { this.getExpiresTime() }</p>
            </div>
          )
          : (
            <button className="btn btn-md btn-violet" onClick={this.buttonClick.bind(this)}>Log in with Spotify</button>
          )
        }
      </Fragment>
    )
  };

}
