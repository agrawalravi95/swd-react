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
        alert("Error:\n" + data.error);
        return;
      }
      data = data.row;
      $("#profile-name").text(data.name);
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
        alert("Error:\n" + data.error);
        return;
      }
      data.rows.forEach(function(row) {
        var id = "#" + row.title;
        $(id + "-name").text(row.name);
        $(id + "-email").text(row.email);
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
          alert("Error:\n" + data.error);
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
        alert("Error:\n" + data.error);
        return;
      }
      if (data.open) $("#mess-closed-section").hide()
      else $("#mess-open-section").hide();
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
  $.ajax({
    url: '/api/backend/messOptionOpen',
    type: 'POST',
    data: "",
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + data.error);
        return;
      }
      if (data.open) $("#mess-open-section").show()
      else $("#mess-closed-section").show();
      $("#allotted").text($("#allotted").text().replace("{MONTH}", data.currentMonth));
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
      data.forEach(function(notice) {
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
    url: '/api/backend/getLeaves',
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
      data.leaves.forEach(function(leave) {
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

var ContentPage = React.createClass({

  propTypes: {
    body: React.PropTypes.string.isRequired
  },

  componentDidUpdate() {
    if (Object.hasOwnProperty.call(componentDidMountFoos, this.props.path.substring(1))) {
      componentDidMountFoos[this.props.path.substring(1)]();
    }
    else if (!this.props.path.substring(1)) {
      componentDidMountFoos["index"]();
    }
  },

  componentDidMount() {
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
