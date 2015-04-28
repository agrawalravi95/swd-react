/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import React from 'react';
//import NavbarGuest from '../NavbarGuest';

var NavbarGuest = React.createClass({

  render() {
    return (

      /* jshint ignore:start */
        <div className="navbar">
            <div className="top-nav--home">

            <ul id="nav-mobile" className="fixed side-nav">
              <li className="bold">
                <h5 className="grey-text">SWD</h5>
              </li>
              <li className="bold"><a href="/" className="waves-effect waves-blue"><i className="small mdi-action-home light-blue-text text-darken-3"></i> Home</a></li>
              <li className="bold"><a href="/swd-services" className="waves-effect waves-teal"><i className="small mdi-action-stars teal-text text-darken-1"></i> SWD Services</a></li>
              <li className="bold"><a href="/csa" className="waves-effect waves-purple"><i className="small mdi-social-people deep-purple-text text-darken-2"></i> CSA</a></li>
              <li className="bold"><a href="/activity-center" className="waves-effect waves-red"><i className="small mdi-maps-local-attraction red-text text-darken-1"></i> Activity Center</a></li>
          <li className="bold"><a href="/contact" className="waves-effect waves-blue"><i className="small mdi-action-perm-contact-cal blue-text text-darken-2"></i> Contact Us</a></li>
              <li className="bold"><a href="/anti-ragging" className="waves-effect waves-light"><i className="small mdi-action-assignment grey-text"></i> Anti Ragging</a></li>
              <li className="bold"><a href="/migration-form" className="waves-effect waves-light"><i className="small mdi-action-receipt grey-text"></i> Migration Form</a></li>
            </ul>
          </div>

          <header>
            <nav className="top-nav--home">
              <div className="container">
                <a href="#" data-activates="nav-mobile" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
              </div>
            </nav>
            <ul id="nav-mobile" className="fixed side-nav">
              <li className="logo">
                <a id="logo-container" href="http://www.bits-pilani.ac.in" className="brand-logo">
                  <img src="images/logo-small.png" width="125" height="125" alt="BITS Pilani Logo" />
                </a>
              </li>
              <li className="bold"><a href="/" className="waves-effect waves-blue"><i className="small mdi-action-home light-blue-text text-darken-3"></i> Home</a></li>
              <li className="bold"><a href="/swd-services" className="waves-effect waves-teal"><i className="small mdi-action-stars teal-text text-darken-1"></i> SWD Services</a></li>
              <li className="bold"><a href="/csa" className="waves-effect waves-purple"><i className="small mdi-social-people deep-purple-text text-darken-2"></i> CSA</a></li>
              <li className="bold"><a href="/activity-center" className="waves-effect waves-red"><i className="small mdi-maps-local-attraction red-text text-darken-1"></i> Activity Center</a></li>
          <li className="bold"><a href="/contact" className="waves-effect waves-blue"><i className="small mdi-action-perm-contact-cal blue-text text-darken-2"></i> Contact Us</a></li>
              <li className="bold"><a href="/anti-ragging" className="waves-effect waves-light"><i className="small mdi-action-assignment grey-text"></i> Anti Ragging</a></li>
              <li className="bold"><a href="/migration-form" className="waves-effect waves-light"><i className="small mdi-action-receipt grey-text"></i> Migration Form</a></li>
            </ul>
          </header>
        </div>
      /* jshint ignore:end */
    );
  }  

});


var NavbarStaff = React.createClass({

  render() {
    return (

      /* jshint ignore:start */
        <div className="navbar">
            <div className="top-nav--home">

            <ul id="nav-mobile" className="fixed side-nav">
              <li className="bold">
                <h5 className="grey-text">SWD</h5>
              </li>
              <li className="bold"><a href="/staff-profile" className="waves-effect waves-blue"><i className="small mdi-social-person light-blue-text text-darken-3"></i> Profile</a></li>
              <li className="bold"><a href="/search-student" className="waves-effect waves-blue"><i className="small mdi-action-search blue-text text-darken-2"></i> Search Student</a></li>
              <li className="bold"><a href="/staff-leave" className="waves-effect waves-teal"><i className="small mdi-image-landscape teal-text text-darken-1"></i> Leaves</a></li>
              <li className="bold"><a href="/staff-notice" className="waves-effect waves-purple"><i className="small mdi-action-assignment deep-purple-text text-darken-2"></i> Notices</a></li>
              <li className="bold"><a href="/staff-mess" className="waves-effect waves-red"><i className="small mdi-maps-local-restaurant red-text text-darken-1"></i> Mess Option</a></li>
              <li className="bold"><a href="/staff-certificate" className="waves-effect waves-green"><i className="small mdi-action-wallet-membership green-text text-darken-2"></i> Certificates</a></li>
              <li className="bold"><a href="/staff-product" className="waves-effect waves-blue"><i className="small mdi-action-shopping-cart blue-text text-darken-2"></i> Products</a></li>
            </ul>
          </div>

          <header>
            <nav className="top-nav--home">
              <div className="container">
                <a href="#" data-activates="nav-mobile" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
              </div>
            </nav>
            <ul id="nav-mobile" className="fixed side-nav">
              <li className="logo">
                <a id="logo-container" href="http://www.bits-pilani.ac.in" className="brand-logo">
                  <img src="images/logo-small.png" width="125" height="125" alt="BITS Pilani Logo" />
                </a>
              </li>
              <li className="bold"><a href="/staff-profile" className="waves-effect waves-blue"><i className="small mdi-social-person light-blue-text text-darken-3"></i> Profile</a></li>
              <li className="bold"><a href="/search-student" className="waves-effect waves-blue"><i className="small mdi-action-search blue-text text-darken-2"></i> Search Student</a></li>
              <li className="bold"><a href="/staff-leave" className="waves-effect waves-teal"><i className="small mdi-image-landscape teal-text text-darken-1"></i> Leaves</a></li>
              <li className="bold"><a href="/staff-notice" className="waves-effect waves-purple"><i className="small mdi-action-assignment deep-purple-text text-darken-2"></i> Notices</a></li>
              <li className="bold"><a href="/staff-certificate" className="waves-effect waves-green"><i className="small mdi-action-wallet-membership green-text text-darken-2"></i> Cerificates</a></li>
              <li className="bold"><a href="/staff-mess" className="waves-effect waves-red"><i className="small mdi-maps-local-restaurant red-text text-darken-1"></i> Mess Option</a></li>
              <li className="bold"><a href="/staff-product" className="waves-effect waves-blue"><i className="small mdi-action-shopping-cart blue-text text-darken-2"></i> Products</a></li>
            </ul>
          </header>
        </div>
      /* jshint ignore:end */
    );
  }  

});

var NavbarStudent = React.createClass({

  render() {
    return (

      /* jshint ignore:start */
        <div className="navbar">
            <div className="top-nav--home">

            <ul id="nav-mobile" className="fixed side-nav">
              <li className="bold">
                <h5 className="grey-text">SWD</h5>
              </li>
              <li className="bold"><a href="/student" className="waves-effect waves-blue"><i className="small mdi-social-person light-blue-text text-darken-3"></i> Profile</a></li>
              <li className="bold"><a href="/student-leave" className="waves-effect waves-teal"><i className="small mdi-image-landscape teal-text text-darken-1"></i> Leaves</a></li>
              <li className="bold"><a href="/student-dues" className="waves-effect waves-purple"><i className="small mdi-action-assignment deep-purple-text text-darken-2"></i> Dues</a></li>
              <li className="bold"><a href="/student-mess" className="waves-effect waves-red"><i className="small mdi-maps-local-restaurant red-text text-darken-1"></i> Mess Option</a></li>
              <li className="bold"><a href="/student-certificate" className="waves-effect waves-green"><i className="small mdi-action-wallet-membership green-text text-darken-2"></i> Certificates</a></li>
              <li className="bold"><a href="/student-product" className="waves-effect waves-blue"><i className="small mdi-action-shopping-cart blue-text text-darken-2"></i> Products</a></li>
            </ul>
          </div>

          <header>
            <nav className="top-nav--home">
              <div className="container">
                <a href="#" data-activates="nav-mobile" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
              </div>
            </nav>
            <ul id="nav-mobile" className="fixed side-nav">
              <li className="logo">
                <a id="logo-container" href="http://www.bits-pilani.ac.in" className="brand-logo">
                  <img src="images/logo-small.png" width="125" height="125" alt="BITS Pilani Logo" />
                </a>
              </li>
              <li className="bold"><a href="/student" className="waves-effect waves-blue"><i className="small mdi-social-person light-blue-text text-darken-3"></i> Profile</a></li>
              <li className="bold"><a href="/student-leave" className="waves-effect waves-teal"><i className="small mdi-image-landscape teal-text text-darken-1"></i> Leaves</a></li>
              <li className="bold"><a href="/student-dues" className="waves-effect waves-purple"><i className="small mdi-action-assignment deep-purple-text text-darken-2"></i> Dues</a></li>
              <li className="bold"><a href="/student-mess" className="waves-effect waves-red"><i className="small mdi-maps-local-restaurant red-text text-darken-1"></i> Mess Option</a></li>
              <li className="bold"><a href="/student-certificate" className="waves-effect waves-green"><i className="small mdi-action-wallet-membership green-text text-darken-2"></i> Products</a></li>
              <li className="bold"><a href="/student-product" className="waves-effect waves-blue"><i className="small mdi-action-shopping-cart blue-text text-darken-2"></i> Products</a></li>
            </ul>
          </header>
        </div>
      /* jshint ignore:end */
    );
  }  

});


var NavbarWarden = React.createClass({

  render() {
    return (

      /* jshint ignore:start */
        <div className="navbar">
            <div className="top-nav--home">

            <ul id="nav-mobile" className="fixed side-nav">
              <li className="bold">
                <h5 className="grey-text">SWD</h5>
              </li>
              <li className="bold"><a href="/warden-profile" className="waves-effect waves-blue"><i className="small mdi-social-person light-blue-text text-darken-3"></i> Profile</a></li>
              <li className="bold"><a href="/search-student" className="waves-effect waves-blue"><i className="small mdi-action-search blue-text text-darken-2"></i> Search Student</a></li>
              <li className="bold"><a href="/staff-leave" className="waves-effect waves-teal"><i className="small mdi-image-landscape teal-text text-darken-1"></i> Leaves</a></li>
              <li className="bold"><a href="/staff-late-comers" className="waves-effect waves-purple"><i className="small mdi-av-timer deep-purple-text text-darken-2"></i> Late Comers</a></li>
            </ul>
          </div>

          <header>
            <nav className="top-nav--home">
              <div className="container">
                <a href="#" data-activates="nav-mobile" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
              </div>
            </nav>
            <ul id="nav-mobile" className="fixed side-nav">
              <li className="logo">
                <a id="logo-container" href="http://www.bits-pilani.ac.in" className="brand-logo">
                  <img src="images/logo-small.png" width="125" height="125" alt="BITS Pilani Logo" />
                </a>
              </li>
              <li className="bold"><a href="/warden-profile" className="waves-effect waves-blue"><i className="small mdi-social-person light-blue-text text-darken-3"></i> Profile</a></li>
              <li className="bold"><a href="/search-student" className="waves-effect waves-blue"><i className="small mdi-action-search blue-text text-darken-2"></i> Search Student</a></li>
              <li className="bold"><a href="/staff-leave" className="waves-effect waves-teal"><i className="small mdi-image-landscape teal-text text-darken-1"></i> Leaves</a></li>
              <li className="bold"><a href="/staff-late-comers" className="waves-effect waves-purple"><i className="small mdi-av-timer deep-purple-text text-darken-2"></i> Late Comers</a></li>
            </ul>
          </header>
        </div>
      /* jshint ignore:end */
    );
  }  

});

var Navbar = React.createClass({

  getInitialState() {
    return {
      type: 'guest'
    }
  },

  componentDidMount() {
    $('.button-collapse').sideNav();
  },

  updateNavbar(foo) {
    this.setState({type: foo});
  },

  render() {

    var NavbarType = NavbarGuest;
    if(this.state.type === 'guest')
    {
      NavbarType = NavbarGuest;
    }
    if(this.state.type === 'staff')
    {
      NavbarType = NavbarStaff;
    }
    if(this.state.type === 'student')
    {
      NavbarType = NavbarStudent;
    }
    if(this.state.type === 'warden')
    {
      NavbarType = NavbarWarden;
    }
    return (
      <NavbarType />
    );
  }

});

module.exports = Navbar;
