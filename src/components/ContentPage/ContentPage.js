/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import React from 'react';

var ContentPage = React.createClass({

  propTypes: {
    body: React.PropTypes.string.isRequired
  },

  componentDidMount() {
    $.ajax({
      url: '/api/backend/studentInfo',
      type: 'POST',
      data: "",
      success: function(data) {
        if (data.err) {
          alert("Error:\n" + data.err);
          return;
        }
        data = data.row;
        $("#profile-name").text(data.name);
        $("#profile-id").text(data.studentID);
        $("#profile-hostel").text(data.hostel);
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err.toString());
      }.bind(this)
    });
  },

  render() {
    var { className, title, body, other } = this.props;

    /* jshint ignore:start */
    return <div className={'ContentPage ' + className}
      dangerouslySetInnerHTML={{__html: body}} />;
    /* jshint ignore:end */
  }

});

module.exports = ContentPage;
