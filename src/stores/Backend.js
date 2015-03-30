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
  login: function(req, res) {
    if (!validateLDAP(req.body.user, req.body.pass)) {
      res.json({error: "invalid login"});
      return;
    }
    req.session.reset();
    req.session.user = req.body.user;
    res.json({success: true});
  },
  // Returns basic student info for login page.
  // PARAMS: id = ldap login id
  studentInfo: function(req, res) {
    if (!req.session || !req.session.user) {
      res.json({error: "not logged in"});
      return;
    }
    conn.query("SELECT * FROM student_info WHERE loginID=?",
               req.session.user, function(err, row) {
      res.json({error: err, row: row?row[0]:null});
    });
  }
}

function validateLDAP(user, pass) {
  return true;
}

function validateSession(u) {
  return true;
}

var Backend = {
  process: function(req, res) {
    var path = req.url.substr(13);
    if (!api.hasOwnProperty(path)) {
      res.json("Trying something illegal?\n" + path);
      return;
    }
    api[path](req, res);
  }
};

module.exports = Backend;

