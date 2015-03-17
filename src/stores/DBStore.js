/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'swd',
  password: 'swd',
  database: 'students'
});

var api = {
  // Returns basic student info for login page.
  // PARAMS: id = ldap login id
  studentInfo: function(req, res, id) {
    conn.query("SELECT * FROM student_info WHERE loginID=?",
               req.query.id, function(err, row) {
      res.json([err, row]);
    });
  }
}

var DBStore = {
  process: function(req, res) {
    var path = req.path.substr(8);
    if (!api.hasOwnProperty(path)) {
      res.json("Trying something illegal?\n" + path);
      return;
    }
    api[path](req, res);
  }
};

module.exports = DBStore;

