function applyForCert() {
  $.ajax({
    url: '/api/backend/bonafideRequest',
    type: 'POST',
    data: {reason: $('#cert-reason').val()},
    success: function(data) {
      if (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      alert("Bonafide Certificate request sent.");
    }.bind(this),
    error: function(xhr, status, err) {
      alert(err.toString());
    }.bind(this)
  });
}
