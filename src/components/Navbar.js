import React, { Component } from 'react';
import Identicon from 'identicon.js';
import dvideo from '../dvideo.png'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={dvideo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;DVide0
        </a>
        <ul className="navbar-nav px-3 d-flex justify-center">
          <li className="nav-item text-nowrap ">
            <h3>{this.props.balance}</h3>
          </li>
          <li className="nav-item text-nowrap">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>

          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;