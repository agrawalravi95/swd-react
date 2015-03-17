/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import './App.less';

import React from 'react';
import invariant from 'react/lib/invariant';
import AppActions from '../../actions/AppActions';
import NavigationMixin from './NavigationMixin';
import AppStore from '../../stores/AppStore';
import Navbar from '../Navbar';
import ContentPage from '../ContentPage';
import NotFoundPage from '../NotFoundPage';

var Application = React.createClass({

  mixins: [NavigationMixin],

  propTypes: {
    path: React.PropTypes.string.isRequired,
    onSetTitle: React.PropTypes.func.isRequired,
    onSetMeta: React.PropTypes.func.isRequired,
    onPageNotFound: React.PropTypes.func.isRequired
  },

  componentDidMount() {
   (function($){
      $(function(){
        $('.modal-trigger').leanModal();
        $('ul.tabs').tabs();
        $('select').material_select();
        $('.datepicker').pickadate({
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 60 // Creates a dropdown of 15 years to control year
        });
      }); 
    })(jQuery);
  },

  componentDidUpdate() {
   (function($){
      $(function(){
        $('.modal-trigger').leanModal();
        $('ul.tabs').tabs();
        $('select').material_select();
        $('.datepicker').pickadate();
      }); 
    })(jQuery);
  },

  render() {
    var page = AppStore.getPage(this.props.path);
    invariant(page !== undefined, 'Failed to load page content.');
    this.props.onSetTitle(page.title);

    if (page.type === 'notfound') {
      this.props.onPageNotFound();
      return React.createElement(NotFoundPage, page);
    }

    return (
      /* jshint ignore:start */
      <div className="App grey lighten-4">
        <Navbar />
        {
          this.props.path === '/' ?
          <div className="main">
            <div className="section  blue-grey darken-2 no-pad-bot" id="index-banner">
              <div className="container">
              <br/><br/>
                <h1 className="header center">SWD BITS Goa</h1>
                <div className="row center">
                  <h5 className="header col s12 light">Welcome to Student Welfare Division</h5>
                </div>
                <div className="row center">
                  <a className="waves-effect waves-light orange darken-2 btn modal-trigger " href="#login-modal">Login</a>

                  <div id="login-modal" className="modal">
                    <div className="modal-content">
                      <h4>Login</h4>
                      <form className="col s12">
                        <div className="row">
                          <div className="input-field col s12">
                            <input id="username" type="text" className="validate"/>
                            <label htmlFor="username">Username</label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                            <input id="password" type="password" className="validate"/>
                            <label htmlFor="password">Password</label>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <a href="/student" className="waves-effect waves-red btn-flat modal-action modal-close">Login</a>
                      <a href="/" className="waves-effect waves-red btn-flat modal-action modal-close">Cancel</a>
                    </div>
                  </div>  
                </div>
                <br/><br/>
              </div>
            </div>
          </div> :
          <div className="main">
            <div className="section  blue-grey darken-2 no-pad-bot" id="index-banner">
              <div className="container">
              <br/><br/>
                <h3 className="header center">{page.title}</h3>
                <br/><br/>
              </div>
            </div>
          </div>
        }
        <ContentPage {...page} />
        <footer className="page-footer  blue-grey darken-2">
          <div className="container">
            <div className="row">
              <div className="col l4 s12">
                <h5 className="white-text">Settings</h5>
                <ul>
                  <li><a className="white-text" href="#!">Link 1</a></li>
                  <li><a className="white-text" href="#!">Link 2</a></li>
                  <li><a className="white-text" href="#!">Link 3</a></li>
                  <li><a className="white-text" href="#!">Link 4</a></li>
                </ul>
              </div>
              <div className="col l4 s12">
                <h5 className="white-text">Connect</h5>
                <ul>
                  <li><a className="white-text" href="#!">Link 1</a></li>
                  <li><a className="white-text" href="#!">Link 2</a></li>
                  <li><a className="white-text" href="#!">Link 3</a></li>
                  <li><a className="white-text" href="#!">Link 4</a></li>
                </ul>
              </div>
              <div className="col l4 s12">
                <h5 className="white-text">Connect</h5>
                <ul>
                  <li><a className="white-text" href="#!">Link 1</a></li>
                  <li><a className="white-text" href="#!">Link 2</a></li>
                  <li><a className="white-text" href="#!">Link 3</a></li>
                  <li><a className="white-text" href="#!">Link 4</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            Developed By Nihant Subramanya and Ravi Agrawal
            </div>
          </div>
        </footer>
      </div>
      /* jshint ignore:end */
    );
  }

});

module.exports = Application;
