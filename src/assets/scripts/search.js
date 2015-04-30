var queryNumber = 0;

function searchMin() {
  var val = $("#search").val();
  if (!val) {
    return;
  }
  $.ajax({
    url: '/api/backend/searchStudentSimple',
    type: 'POST',
    data: {query: val},
    success: function(data) {
      if (data.error) {
        if (data.error.errno == 1139) { // bad regex
          alert("You tried a regular expression search, but your syntax was invalid. (did you forget to close a bracket?)");
          return;
        }
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      if (!data.length) {
        $("#results-section").hide(0);
        $("#no-results-section").show(0);
        return;
      }
      $("#results-section").show(0);
      $("#no-results-section").hide(0);
      var list = $('#results-list');
      var template = list.find('.search-result-template').detach();
      list.empty();
      list.append(template);
      template = list.find('.search-result-template').clone();
      template.removeClass('search-result-template');
      var searchID = ++queryNumber;
      queueUIStuff(data, function(student) {
        var elt = template.clone();
        elt.find('.name').text(student.student_name);
        elt.find('.id').text(student.id);
        elt.find('.hostel').text(student.hostel);
        list.append(elt);
        elt.show(0);
      }, function() {
        return queryNumber != searchID;
      });
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

function searchWarden() {
  var val = $("#search").val();
  if (!val) {
    return;
  }
  $.ajax({
    url: '/api/backend/searchStudentStaff',
    type: 'POST',
    data: {query: val},
    success: function(data) {
      if (data.error) {
        if (data.error.errno == 1139) { // bad regex
          alert("You tried a regular expression search, but your syntax was invalid. (did you forget to close a bracket?)");
          return;
        }
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      if (!data.length) {
        $("#results-section").hide(0);
        $("#no-results-section").show(0);
        return;
      }
      $("#results-section").show(0);
      $("#no-results-section").hide(0);
      var list = $('#results-list');
      var template = list.find('.search-result-template').detach();
      list.empty();
      list.append(template);
      template = list.find('.search-result-template').clone();
      template.removeClass('search-result-template');
      var i = 0;
      var searchID = ++queryNumber;
      queueUIStuff(data, function(student) {
        var elt = template.clone();
        elt.find('.name').text(student.student_name);
        elt.find('.id').text(student.id);
        elt.find('.hostel').text(student.hostel);
        elt.find('.phone').text(student.phone);
        elt.find('.email').text(student.email);
        elt.find('.address').text(student.address);
        elt.find('.cgpa').text(student.cgpa);
        elt.find('.father-name').text(student.father_name);
        elt.find('.father-phone').text(student.father_phone);
        elt.find('.father-email').text(student.father_email);
        elt.find('.mother-name').text(student.mother_name);
        elt.find('.mother-phone').text(student.mother_phone);
        elt.find('.mother-email').text(student.mother_email);
        elt.find('.profile-tab').attr("id", "profile-" + i);
        elt.find('.leave-tab').attr("id", "leave-" + i);
        elt.find('.dc-tab').attr("id", "dc-" + i);
        elt.find('.profile-a').attr("href", "#profile-" + i);
        elt.find('.leave-a').attr("href", "#leave-" + i);
        elt.find('.dc-a').attr("href", "#dc-" + i);
        elt.attr('login_id', student.login_id);
        i++;
        list.append(elt);
        elt.show(0);
      }, function() {
        return queryNumber != searchID;
      });
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

function populateLeaves(item) {
  item = $(item);
  if (item.attr('leave-populated')) {
    return;
  }
  var login_id = item.attr("login_id");
  $.ajax({
    url: '/api/backend/getStudentLeaves',
    type: 'POST',
    data: {login_id: login_id},
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      var list = item.find('.leave-list');
      list.find('.leave-count').text(data.leaves.length);
      if (!data.leaves.length) {
        list.find('.days').text("");
        return;
      }
      var template = item.find('.leave-item-template').clone();
      template.removeClass('leave-item-template');
      var daycount = 0;
      var searchID = queryNumber;
      queueUIStuff(data.leaves, function(leave) {
        daycount += leave.days;
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
        elt.find(".start").text(leave.start);
        elt.find(".end").text(leave.end);
        elt.find(".address").text(leave.address);
        elt.find(".reason").text(leave.reason);
        elt.find(".consent").text(leave.consent);
        list.append(elt);
        elt.show(0);
      }, function() {
        return searchID != queryNumber;
      });
      list.find('.days').text("(" + daycount + " days)");
      item.attr('leave-populated', 'true');
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

function populateDisco(item) {
  item = $(item);
  if (item.attr('disco-populated')) {
    return;
  }
  var login_id = item.attr("login_id");
  $.ajax({
    url: '/api/backend/getDisco',
    type: 'POST',
    data: {login_id: login_id},
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      var list = item.find('.dc-list');
      if (!data.length) {
        list.find('.no-dc-cases').show(0);
        return;
      }
      var template = item.find('.dc-item-template').clone();
      template.removeClass('dc-item-template');
      var searchID = queryNumber;
      queueUIStuff(data, function(dc) {
        var elt = template.clone();
        elt.find(".disco-title").text(dc.heading);
        elt.find(".action").text(dc.action);
        elt.find(".date").text(new Date(dc.date).toDateString());
        if (dc.severe) {
          elt.find(".icon").addClass("red-text");
        }
        else
          elt.find(".icon").addClass('yellow-text');
        list.append(elt);
        elt.show(0);
      }, function() {
        return searchID != queryNumber;
      });
      item.attr('disco-populated', 'true');
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}

function queueUIStuff(aArray, aFoo, aStop) {
  if (!aArray.length || (aStop && aStop())) {
    return;
  }
  aArray.splice(0, 10).forEach(aFoo);
  setTimeout(queueUIStuff.bind(null, aArray, aFoo, aStop), 50)
}
