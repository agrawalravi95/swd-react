/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';
var mysql = require('mysql');
var _pool = null;

function getPool() {
  if (!_pool) {
    try {
      _pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'swd',
        password: 'swd',
        database: 'students2'
      });
    } catch(e) {
      throw e;
    }
  }
  return _pool;
}

function poolHelper(aSQL, aParams, aCallback) {
  var pool;
  try {
    pool = getPool();
  } catch(e) {
    aCallback(e);
    return;
  }
  pool.getConnection(function(err, conn) {
    if (err) {
      aCallback(err);
      return;
    }
    conn.query(aSQL, aParams, aCallback);
    conn.release();
  });
}

var api = {
  login: function(req, res) {
    poolHelper("SELECT * FROM login_ids WHERE login_id=?", [req.body.user], function(err, row) {
      if (err) {
        res.json({error: err});
        return;
      }
      if (!row.length) {
        res.json({failure: "user"});
        return;
      }
      if (!validateLDAP(req.body.user, req.body.pass)) {
        res.json({failure: "pass"});
        return;
      }
      req.session.reset();
      req.session.user = req.body.user;
      req.session.type = row[0].type;
      res.json({success: true, type: req.session.type});
    });
  },
  // Returns basic student info for login page.
  studentInfo: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != 'student') {
      res.json({error: "Not logged in"});
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
        res.json({error: err});
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
  getStudentLeaves: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != "student") {
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
        var start = (new Date(row.start_date)).toDateString();
        var end = (new Date(row.end_date)).toDateString();
        ret.push({
          id: row.leave_id,
          start: start,
          end: end,
          days: 1 + Math.floor((Date.parse(end) - Date.parse(start)) / 86400000),
          phone: row.phone,
          consent: row.consent_type,
          address: row.address,
          reason: row.reason,
          status: row.approved
        });
      });
      res.json({firstIsCurrent: rows.length ? rows[0].end_date >= (new Date()).valueOf() : false, leaves: ret});
    });
  },
  getLeavesStaff: function(req, res) {
    if (!req.session || !req.session.user) {
      res.json({error: "not logged in"});
      return;
    }
    if (req.session.type == 'student') {
      res.json({error: "not authorized"});
      return;
    }
    poolHelper("SELECT hostel FROM wardens WHERE login_id = ?", [req.session.user], function(err, rows) {
      if (err) {
        res.json({error: err});
        return;
      }
      if (!rows.length) {
        res.json({error: "warden's hostel not found"});
        return;
      }
      var hostel = rows[0].hostel;
      poolHelper("SELECT leave_requests.*, student_info.student_name, student_info.id FROM leave_requests INNER JOIN student_info ON leave_requests.login_id=student_info.login_id WHERE student_info.hostel LIKE ? ORDER BY start_date DESC", [hostel + "%"], function(err, rows) {
        if (err) {
          res.json({error: err});
          return;
        }
        var ret = [];
        rows.forEach(function(row) {
          var start = (new Date(row.start_date)).toDateString();
          var end = (new Date(row.end_date)).toDateString();
          ret.push({
            student_id: row.id,
            name: row.student_name,
            leave_id: row.leave_id,
            start: start,
            end: end,
            days: 1 + Math.floor((Date.parse(end) - Date.parse(start)) / 86400000),
            phone: row.phone,
            consent: row.consent_type,
            address: row.address,
            reason: row.reason,
            status: row.approved
          });
        });
        res.json({leaves: ret});
      });
    });
  },
  getDues: function(req, res) {
    if (!req.session || !req.session.user || req.session.type != 'student') {
      res.json({error: "not logged in"});
      return;
    }
    poolHelper("SELECT * FROM student_dues WHERE login_id=?", [req.session.user], function(err, rows) {
      if (err) {
        res.json({error: err});
        return;
      }
      var row = rows[0];
      var ret = [];
      for (var key in row) {
        if (!Object.hasOwnProperty.call(row, key) || key == "login_id" || !row[key])
          continue;
        var item = {desc: key};
        item[key == "Advance" ? "credit" : "debit"] = row[key];
        ret.push(item);
      }
      res.json(ret);
    });
  },
  searchStudentSimple: function(req, res) {
    poolHelper("SELECT student_name, id, hostel FROM student_info WHERE student_name RLIKE ? OR id RLIKE ? OR hostel RLIKE ?", ["(^|[[:blank:]]+)" + req.body.query + ".*", req.body.query, req.body.query], function(err, rows) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(rows);
    });
  },
  searchStudentStaff: function(req, res) {
    if (!req.session || !req.session.user) {
      res.json({error: "not logged in"});
      return;
    }
    if (req.session.type == 'student') {
      res.json({error: "not authorized"});
      return;
    }
    poolHelper("SELECT student_info.*, cgpa.cgpa FROM student_info INNER JOIN cgpa ON student_info.login_id=cgpa.login_id WHERE student_name RLIKE ? OR student_info.id RLIKE ? OR hostel RLIKE ?", ["(^|[[:blank:]]+)" + req.body.query + ".*", req.body.query, req.body.query], function(err, rows) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(rows);
    });
  },
  getDisco: function(req, res) {
    if (!req.session || !req.session.user) {
      res.json({error: "not logged in"});
      return;
    }
    if (req.session.type == 'student') {
      res.json({error: "not authorized"});
      return;
    }
    poolHelper("SELECT discp.* FROM student_info INNER JOIN discp ON student_info.login_id=discp.login_id WHERE student_info.login_id=?", [req.body.login_id], function(err, rows) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(rows);
    });
  },
  getLoginType: function(req, res) {
    if (!req.session) {
      res.json({error: "Not logged in."});
      return;
    }
    res.json({type: req.session.type});
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
      res.json({error: "Trying something illegal?\n" + path});
      return;
    }
    api[path](req, res);
  }
};

module.exports = Backend;

