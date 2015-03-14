/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

//require('./NotFoundPage.less');

import React from 'react';

var NotFoundPage = React.createClass({

  render() {
    return (
      /* jshint ignore:start */
      <div>
        <h1>Page Not Found</h1>
        <p>Sorry, but the page you were trying to view does not exist.</p>
      </div>
      /* jshint ignore:end */
    );
  }

});

module.exports = NotFoundPage;
