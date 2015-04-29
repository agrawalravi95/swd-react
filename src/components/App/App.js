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
    $('.modal-trigger').leanModal({ready: function() {this.refs.username.getDOMNode().focus();}.bind(this)});
    $('ul.tabs').tabs();
    $('select').material_select();
    $('.datepicker').pickadate({
      selectMonths: true,
      selectYears: 60
    });
    $('.collapsible').collapsible({
      accordion : false
    });
    $.ajax({
      url: '/api/backend/getLoginType',
      dataType: 'json',
      type: 'POST',
      data: "",
      success: function(data) {
        if (data.error) {
          alert(JSON.stringify(data.error));
          return;
        }
        this.loginType = data.type ? data.type : "guest";
        this.refs.navbar.updateNavbar(this.loginType);
        if (this.loginType == "guest") {
          $(this.refs.loginButton.getDOMNode()).show(0);
          return;
        }
        $(this.refs.logoutButton.getDOMNode()).show(0);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  onLogout(e) {
    e.preventDefault();
    e.stopPropagation();
    $.ajax({
      url: '/api/backend/logout',
      dataType: 'json',
      type: 'POST',
      data: '',
      success: function(data) {
        $(this.refs.loginButton.getDOMNode()).show(0);
        $(this.refs.logoutButton.getDOMNode()).hide(0);
        this.loginType = "guest";
        this.refs.navbar.updateNavbar(this.loginType);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  onLoginSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    var user = this.refs.username.getDOMNode().value.trim();
    var pass = this.refs.password.getDOMNode().value;
    var makevalid = function(e) {
      $(e.target).toggleClass("invalid", false);
      e.target.removeEventListener("keypress", makevalid);
    }
    if (!user) {
      var userfield = this.refs.username.getDOMNode()
      $(userfield).toggleClass("invalid", true);
      userfield.addEventListener("keypress", makevalid);
      userfield.focus();
      return;
    }
    if (!pass) {
      var passfield = this.refs.password.getDOMNode();
      $(passfield).toggleClass("invalid", true);
      passfield.addEventListener("keypress", makevalid);
      passfield.focus();
      return;
    }
    $.ajax({
      url: '/api/backend/login',
      dataType: 'json',
      type: 'POST',
      data: {user: user, pass: pass},
      success: function(data) {
        if (data.error) {
          alert(JSON.stringify(data.error));
          return;
        }
        if (data.failure) {
          if (data.failure == "user") {
            var userfield = this.refs.username.getDOMNode()
            $(userfield).toggleClass("invalid", true);
            userfield.addEventListener("keypress", makevalid);
            userfield.focus();
            this.refs.password.getDOMNode().value = "";
          }
          else if (data.failure == "pass") {
            var passfield = this.refs.password.getDOMNode()
            $(passfield).toggleClass("invalid", true);
            passfield.addEventListener("keypress", makevalid);
            passfield.focus();
          }
          return;
        }
        this.loginType = data.type;
        $(this.refs.loginButton.getDOMNode()).hide(0);
        $(this.refs.logoutButton.getDOMNode()).show(0);
        window.location.href = "/student";
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidUpdate() {
    // alert("update");
   (function($){
      $(function(){
        $('.modal-trigger').leanModal();
        $('ul.tabs').tabs();
        $('select').material_select();
        $('.datepicker').pickadate({
          selectMonths: true,
          selectYears: 60
        });
        $('.collapsible').collapsible({
          accordion : false
        });
      });
    })(jQuery);
    if (!this.loginType) {
      return;
    }
    if (this.loginType == "guest") {
      $(this.refs.loginButton.getDOMNode()).show(0);
      $(this.refs.logoutButton.getDOMNode()).hide(0);
      return;
    }
    $(this.refs.loginButton.getDOMNode()).hide(0);
    $(this.refs.logoutButton.getDOMNode()).show(0);
  },

  getLoginType() {
    return this.loginType;
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
        <Navbar ref="navbar"/>
        {
          this.props.path === '/' ?
          <div className="main">
            <div className="section home-bg no-pad-bot" id="index-banner">
              <div className="container">
              <br/><br/>
                <h1 className="header center">Student Welfare Division</h1>
                <div className="row center">
                  <h5 className="header col s12 light">BITS, Pilani - K. K. Birla Goa Campus</h5>
                </div>
                <div className="row center">
                  <a ref="loginButton" className="waves-effect waves-light orange darken-2 btn modal-trigger hidden" href="#login-modal">Login</a>
                  <a ref="logoutButton" className="waves-effect waves-light orange darken-2 btn hidden" onClick={this.onLogout}>Logout</a>

                  <div id="login-modal" className="modal">
                    <div className="modal-content">
                      <h4>Login</h4>
                      <form className="col s12">
                        <div className="row">
                          <div className="input-field col s12">
                            <input ref="username" type="text" className="validate"/>
                            <label htmlFor="username">Username</label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12">
                            <input ref="password" type="password" className="validate"/>
                            <label htmlFor="password">Password</label>
                          </div>
                        </div>
                        <div className="modal-footer no-padding">
                          <input type="submit" value="Login" className="waves-effect waves-red btn orange modal-action" onClick={this.onLoginSubmit} ref="login" />
                          <a href="javascript:void(0)" className="waves-effect waves-red btn-flat modal-action modal-close">Cancel</a>
                        </div>
                      </form>
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
            Developed By Nihanth Subramanya and Ravi Agrawal
            </div>
          </div>
        </footer>
      </div>
      /* jshint ignore:end */
    );
  }

});

module.exports = Application;
