  function toggleMessOptions() {
    var on = $("#messoptionbox")[0].checked;
    $('.mess-options').toggle($("#messoptionbox")[0].checked);
    if (!$("#messoptionbox")[0].checked) {
      $.ajax({
        url: '/api/backend/closeMessOption',
        type: 'POST',
        data: JSON.stringify({month: $("#mess-month").val()}),
        success: function(data) {
          if (data.error) {
            alert("Error:\n" + JSON.stringify(data.error));
            return;
          }
          alert("Mess option closed.");
        }.bind(this),
        error: function(xhr, status, err) {
          alert(err.toString());
        }.bind(this)
      })
    }
  }

  function toastMessage(msg) {
    alert(msg);
    Materialize.toast(msg, 3000);
  }

  function openmess() {
    $.ajax({
      url: '/api/backend/openMessOption',
      type: 'POST',
      data: {month: $("#mess-month").val()},
      success: function(data) {
        if (data.error) {
          alert("Error:\n" + JSON.stringify(data.error));
          return;
        }
        alert("Mess option opened for " + $("#mess-month").val());
        $('.mess-options').toggle(false);
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err.toString());
      }.bind(this)
    });
  }
