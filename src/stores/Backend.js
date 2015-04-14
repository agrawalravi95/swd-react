/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'swd',
  password: 'swd',
  database: 'students2'
});


function poolHelper(aSQL, aParams, aCallback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      aCallback(err);
      return;
    }
    conn.query(aSQL, aParams, aCallback);
    conn.release();
  });
}

var api = {
  login: function(req, res) {
    if (!validateLDAP(req.body.user, req.body.pass)) {
      res.json({error: "invalid login"});
      return;
    }
    req.session.reset();
    req.session.user = req.body.user;
    poolHelper("SELECT * FROM login_ids WHERE login_id=?", [req.session.user], function(err, row) {
      if (err) {
        res.json({error: "error accessing login id database"});
        return;
      }
      req.session.type = row[0].type;
      res.json({success: true});
    });
  },
  // Returns basic student info for login page.
  studentInfo: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != 'student') {
      res.json({error: "not logged in"});
      return;
    }
    poolHelper("SELECT * FROM student_info WHERE login_id=?", [req.session.user], function(err, row) {
      res.json({error: err, row: row ? row[0] : null});
    });
  },
  // Returns CSA members info. 4 rows.
  csaInfo: function(req, res) {
    poolHelper("SELECT * FROM csa", [], function(err, rows) {
      res.json({error: err, rows: rows || null});
    });
  },
  // Returns an object containing an error if any, and a variable "open" - true
  // or false depending on if mess option is open. Also current month and next month.
  messOptionOpen: function(req, res) {
    poolHelper("SELECT * FROM mess_option_open", [], function(err, rows) {
      res.json({error: err, open: rows[0].open == 1,
               currentMonth: rows[0].current_month,
               nextMonth: rows[0].next_month});
    });
  },
  // Returns an object containing an error if any, and a variable "open" - true
  // or false depending on if mess option is open. Also current month and next month.
  currentMessOption: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != 'student') {
      res.json({error: "not logged in"});
      return;
    }
    poolHelper("SELECT mess FROM mess_option INNER JOIN mess_option_open ON mess_option.month=mess_option_open.current_month WHERE login_id=?",
               [req.session.user], function(err, rows) {
      res.json({error: err, mess: rows && rows[0] ? rows[0].mess : null});
    });
  },
  // Returns an object containing an error if any, and a variable "open" - true
  // or false depending on if mess option is open. Also current month and next month.
  futureMessOption: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != 'student') {
      res.json({error: "not logged in"});
      return;
    }
    poolHelper("SELECT mess FROM mess_option_future WHERE login_id=?", [req.session.user], function(err, rows) {
      res.json({error: err, mess: rows && rows[0] ? rows[0].mess : null});
    });
  },
  chooseMessOption: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != 'student') {
      res.json({error: "not logged in"});
      return;
    }
    poolHelper("SELECT * FROM mess_option_open", [], function(err, rows) {
      if (err) {
        res.json({error: err});
        return;
      }
      if (rows[0].open == 0) {
        res.json({error: "mess option closed"});
        return;
      }
      var mess = req.body.mess == 0 ? "A Mess" : "C Mess";
      poolHelper("DELETE FROM mess_option_future WHERE login_id=?", [req.session.user], function(err, rows) {
        if (err) {
          res.json({error: err});
          return;
        }
        poolHelper("INSERT INTO mess_option_future (login_id, mess) VALUES (?, ?)", [req.session.user, mess], function(err, rows) {
          if (err) {
            res.json({error: err});
            return;
          }
          res.json({success: true});
        });
      })
    });
  },
  getNotices: function(req, res) {
    poolHelper("SELECT * FROM notices ORDER BY updated DESC", [], function(err, rows) {
      if (err) {
        req.json({error: err});
        return;
      }
      var rett = [];
      rows.forEach(function(row) {
        rett.push({
          archived: row.archived == 1,
          title: row.title,
          url: row.url,
          date: (new Date(row.updated)).toDateString()
        });
      });
      res.json(rett);
    });
  },
  getLeaves: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != 'student') {
      res.json({error: "not logged in"});
      return;
    }
    poolHelper("SELECT * FROM leave_requests WHERE login_id=? ORDER BY start_date DESC", [req.session.user], function(err, rows) {
      if (err) {
        res.json({error: err});
        return;
      }
      var ret = [];
      rows.forEach(function(row) {
        ret.push({
          id: row.leave_id,
          start: (new Date(row.start_date)).toDateString(),
          end: (new Date(row.end_date)).toDateString(),
          phone: row.phone,
          consent: row.consent_type,
          address: row.address,
          reason: row.reason,
          status: row.approved
        });
      });
      res.json({firstIsCurrent: rows.length ? rows[0].end_date >= (new Date()).valueOf() : false, leaves: ret});
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

