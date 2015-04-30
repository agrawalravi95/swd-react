function changePendingLeaveBack(elt) {
  elt = $(elt);
  var header = elt.closest(".collapsible-header");
  header.toggleClass("green lighten-5",
      elt.attr("checked"));
  header.toggleClass('collapsible-header', false);
  setTimeout(function() {header.toggleClass('collapsible-header', true)}, 0);
}

function approveLeaves() {
  var leave_ids = $('.approve-checkbox:checked').map(function() parseInt(this.id)).get();
  $.ajax({
    url: '/api/backend/approveLeaves',
    type: 'POST',
    data: {leave_ids: leave_ids},
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      window.location.reload();
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}
