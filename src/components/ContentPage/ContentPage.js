/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import React from 'react';

var componentDidMountFoos = {}


componentDidMountFoos["student"] = function() {
  $.ajax({
    url: '/api/backend/studentInfo',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      data = data.row;
      $("#profile-name").text(data.student_name);
      $("#profile-id").text(data.id);
      $("#profile-bday").text(data.bday);
      $("#profile-addr").text(data.address);
      $("#profile-email").text(data.email);
      $("#profile-hostel").text(data.hostel);
      $("#profile-phone").text(data.phone);
      $("#profile-email").text(data.email);
      $("#father-name").text(data.father_name);
      $("#father-phone").text(data.father_phone);
      $("#father-email").text(data.father_email);
      $("#mother-name").text(data.mother_name);
      $("#mother-phone").text(data.mother_phone);
      $("#mother-email").text(data.mother_email);
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
};
componentDidMountFoos["csa"] = function() {
  $.ajax({
    url: '/api/backend/csaInfo',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      data.rows.forEach(function(row) {
        var id = "#" + row.title;
        $(id + "-name").text(row.name);
        $(id + "-name").attr("title", row.name);
        $(id + "-email").text(row.email);
        $(id + "-email").attr("title", row.email);
        $(id + "-phone").text(row.phone);
      });
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
};
componentDidMountFoos["student-mess"] = function() {
  $("#mess-submit").click(function() {
    var mess = null;
    if (document.getElementById("amess").checked) {
      mess = 0;
    }
    else if (document.getElementById("cmess").checked) {
      mess = 1;
    }
    if (mess == null) {
      alert("Please choose your mess option.");
      return;
    }
    $.ajax({
      url: '/api/backend/chooseMessOption',
      type: 'POST',
      data: {mess: mess},
      success: function(data) {
        if (data.error) {
          alert("Error:\n" + JSON.stringify(data.error));
          return;
        }
        alert("Mess option successfully chosen!");
        window.location.reload();
        }.bind(this),
        error: function(xhr, status, err) {
          alert(err.toString());
        }.bind(this)
    });
  });
  $.ajax({
    url: '/api/backend/messOptionOpen',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      if (data.open) $("#mess-open-section").show()
      else $("#mess-closed-section").show();
      $("#next-month").text($("#next-month").text().replace("{MONTH}", data.nextMonth));
      $("#chosen").text($("#chosen").text().replace("{MONTH}", data.nextMonth));
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
  $.ajax({
    url: '/api/backend/currentMessOption',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      if (!data.mess) {
        return;
      }
      $("#allotted-section").show();
      $("#allotted").text($("#allotted").text().replace("{MESS}", data.mess));
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
  $.ajax({
    url: '/api/backend/futureMessOption',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      if (data.mess == null) {
        return;
      }
      $("#mess-chosen-section").show();
      $("#chosen").text($("#chosen").text().replace("{MESS}", data.mess));
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
};

componentDidMountFoos["index"] = function() {
    $('.modal-trigger').leanModal({ready: function() {$("#login-username")[0].focus();}.bind(this)});
  $.ajax({
    url: '/api/backend/getNotices',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      var template = $('.first-card').clone();
      queueUIStuff(data, function(notice) {
        var elt = template.clone();
        elt.find('.card-title').text(notice.title);
        elt.find('.card-date').text(notice.date);
        elt.find('.dl-link').attr('href', notice.url);
        elt.find('.open-link').attr('href', notice.url);
        elt.attr('hidden', false);
        if (notice.archived) {
          $("#archived-notices").find(".row").append(elt);
        }
        else {
          $("#general-notices").find(".row").append(elt);
        }
      })
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

componentDidMountFoos["student-leave"] = function() {
  $.ajax({
    url: '/api/backend/getStudentLeaves',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      if (!data.leaves.length) {
        return;
      }
      $("#no-leaves").hide();
      var template = $('#leave-template').clone();
      if (data.firstIsCurrent) {
        $("#current-leave").show(0);
        var elt = $("#leave-template");
        let leave = data.leaves.shift();
        elt.find(".leave-id").text(leave.id);
        var status = leave.status === 1 ? "Approved" :
                     leave.status === 0 ? "Denied" : "Pending";
        elt.find(".status").text(status);
        if (status == "Approved") {
          elt.find(".status").addClass("green-text");
          $("#current-leave").find('.approved-tick').show();
          $("#current-leave").find('.approved-text').show();
        }
        else if (status == "Denied") {
          elt.find(".status").addClass("red-text");
          $("#current-leave").find('.denied-tick').show();
          $("#current-leave").find('.denied-text').show();
        }
        elt.find(".start-date").text(leave.start);
        elt.find(".end-date").text(leave.end);
        elt.find(".address").text(leave.address);
        elt.find(".reason").text(leave.reason);
        elt.find(".consent").text(leave.consent);
      }
      if (!data.leaves.length) {
        return;
      }
      $("#prev-leaves").show();
      queueUIStuff(data.leaves, function(leave) {
        var elt = template.clone();
        elt.find(".leave-id").text(leave.id);
        var status = leave.status === 1 ? "Approved" :
                     leave.status === 0 ? "Denied" : "Pending";
        elt.find(".status").text(status);
        if (status == "Approved") {
          elt.find(".status").addClass("green-text");
        }
        else if (status == "Denied") {
          elt.find(".status").addClass("red-text");
        }
        elt.find(".start-date").text(leave.start);
        elt.find(".end-date").text(leave.end);
        elt.find(".address").text(leave.address);
        elt.find(".reason").text(leave.reason);
        elt.find(".consent").text(leave.consent);
        $("#prev-leaves-list").append(elt);
      });
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

componentDidMountFoos["student-dues"] = function() {
  $.ajax({
    url: '/api/backend/getDues',
    type: 'POST',
    data: "",
    success: function(data) {
      //Materialize.toast("Test", 4000, function() {location.href="about:blank";});
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      var tbody = $('#dues-tbody');
      var template = tbody.find('.due-entry-template').clone();
      var balance = 0;
      data.forEach(function(due) {
        var elt = template.clone();
        elt.find('.desc').text(due.desc);
        elt.find('.credit').text(due.credit);
        elt.find('.debit').text(due.debit);
        balance += ((due.credit || 0) - (due.debit || 0));
        tbody.append(elt);
        elt.show(0);
      });
      var elt = template.clone();
      elt.find('.desc').text("Balance Amount");
      elt.find('.credit').text("");
      elt.find('.debit').text(balance);
      tbody.append(elt);
      elt.show(0);
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

componentDidMountFoos["staff-mess"] = function() {
  $.getScript('/scripts/staff-mess.js', function() {
    $('.mess-option-view').show(0);
  });
  $.ajax({
    url: '/api/backend/messOptionOpen',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      $("#messoptionbox")[0].checked = data.open;
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

componentDidMountFoos["staff"] = function() {
  $.ajax({
    url: '/api/backend/staffInfo',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      $(".profile-name").text(data.name);
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}
componentDidMountFoos["warden"] = function() {
  $.ajax({
    url: '/api/backend/wardenInfo',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      $(".profile-name").text(data.name);
      $(".hostel-line").text(data.hostel.toUpperCase() + " Warden");
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

componentDidMountFoos["search-student"] = componentDidMountFoos["search-student-min"] = function() {
  $.getScript("/scripts/search.js", function() {
    $('.search-field').show(0);
  });
}

componentDidMountFoos["student-certificate"] = function() {
  $.getScript("/scripts/cert-apply.js", function() {
    $('.cert-container').show(0);
    $.ajax({
      url: '/api/backend/getLatestBonafideRequest',
      type: 'POST',
      data: "",
      success: function(data) {
        if (data.error) {
          alert("Error:\n" + JSON.stringify(data.error));
          return;
        }
        if (data.norequests) {
          return;
        }
        var statusspan = data.printed ? $('.printed-status') : $('.pending-status');
        statusspan.text(statusspan.text().replace('{DATE}', data.date));
        statusspan.show(0);
        $('.current-status-section').show(0);
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err.toString());
      }.bind(this)
    });
  });
}

var leaveLoadID = 0;
componentDidMountFoos["staff-leave"] = function() {
  var currentLeaveLoadID = ++leaveLoadID;
  $.getScript("/scripts/staff-leave.js", function() {
    $('.main-container').show(0);
    $('ul.tabs').tabs();
    $.ajax({
      url: '/api/backend/getPendingLeavesStaff',
      type: 'POST',
      data: "",
      success: function(data) {
        if (data.error) {
          alert("Error:\n" + JSON.stringify(data.error));
          return;
        }
        if (!data.leaves.length) {
          return;
        }
        var template = $('#pending-leave-template').clone();
        var i = 0;
        queueUIStuff(data.leaves, function(leave) {
          var elt = template.clone();
          elt.find(".name").text(leave.name);
          elt.find(".name").attr("title", leave.name);
          elt.find(".student-id").text(leave.student_id);
          elt.find(".leave-id").text(leave.leave_id);
          elt.find(".start-date").text(leave.start);
          elt.find(".end-date").text(leave.end);
          elt.find(".address").text(leave.address);
          elt.find(".reason").text(leave.reason);
          elt.find(".consent").text(leave.consent);
          elt.find(".contact").text(leave.phone);
          elt.find(".hostel").text(leave.hostel);
          elt.find(".approve-checkbox").attr("id", leave.leave_id);
          elt.find(".approve-label").attr("for", leave.leave_id);
          elt.attr("id", "");
          $("#pending-list").append(elt);
          elt.show(0);
          i++;
        }, function() {
          return currentLeaveLoadID != leaveLoadID;
        });
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err.toString());
      }.bind(this)
    });
    $.ajax({
      url: '/api/backend/getLeaveHistoryStaff',
      type: 'POST',
      data: "",
      success: function(data) {
        if (data.error) {
          alert("Error:\n" + JSON.stringify(data.error));
          return;
        }
        if (!data.leaves.length) {
          return;
        }
        var template = $('#old-leave-template').clone();
        var i = 0;
        queueUIStuff(data.leaves, function(leave) {
          var elt = template.clone();
          elt.find(".name").text(leave.name);
          elt.find(".student-id").text(leave.student_id);
          elt.find(".leave-id").text(leave.leave_id);
          elt.find(".start-date").text(leave.start);
          elt.find(".end-date").text(leave.end);
          elt.find(".address").text(leave.address);
          elt.find(".reason").text(leave.reason);
          elt.find(".consent").text(leave.consent);
          elt.find(".contact").text(leave.phone);
          elt.find(".hostel").text(leave.hostel);
          var status = leave.status === 1 ? "Approved" :
                       leave.status === 0 ? "Denied" : "Pending";
          elt.find(".status").text(status);
          if (status == "Approved") {
            elt.find(".status").addClass("green-text");
          }
          else if (status == "Denied") {
            elt.find(".status").addClass("red-text");
          }
          elt.attr("id", "");
          $("#history-list").append(elt);
          elt.show(0);
          i++;
        }, function() {
          return currentLeaveLoadID != leaveLoadID;
        });
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err.toString());
      }.bind(this)
    });
  });
}

componentDidMountFoos["staff-notice"] = function() {
  $.getScript("/scripts/notices.js", function() {

  });
}

function queueUIStuff(aArray, aFoo, aStop) {
  if (!aArray.length || (aStop && aStop())) {
    return;
  }
  aArray.splice(0, 10).forEach(aFoo);
  setTimeout(queueUIStuff.bind(null, aArray, aFoo, aStop), 50)
}

var ContentPage = React.createClass({

  propTypes: {
    body: React.PropTypes.string.isRequired
  },
  prevpath: null,

  componentDidUpdate() {
    if (this.prevpath == this.props.path) {
      return;
    }
    this.prevpath = this.props.path;
    if (Object.hasOwnProperty.call(componentDidMountFoos, this.props.path.substring(1))) {
      componentDidMountFoos[this.props.path.substring(1)]();
    }
    else if (!this.props.path.substring(1)) {
      componentDidMountFoos["index"]();
    }
  },

  componentDidMount() {
    if (this.prevpath == this.props.path) {
      return;
    }
    this.prevpath = this.props.path;
    if (Object.hasOwnProperty.call(componentDidMountFoos, this.props.path.substring(1))) {
      componentDidMountFoos[this.props.path.substring(1)]();
    }
    else if (!this.props.path.substring(1)) {
      componentDidMountFoos["index"]();
    }
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
