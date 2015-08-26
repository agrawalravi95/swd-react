function submitNotice() {
  var data = new FormData();
  if (!$('#notice-file')[0].files.length) {
    alert("Please choose a file.");
    return;
  }
  data.append('file', $('#notice-file')[0].files[0]);
  data.append('title', $("#notice-title").val());
  $.ajax({
    url: '/api/backend/addNotice',
    type: 'POST',
    data: data,
    cache: false,
    dataType: 'json',
    processData: false,
    contentType: false,
    success: function(data) {
      if  (data.error) {
        alert("Error:\n" + JSON.stringify(data.error));
        return;
      }
      alert("Notice added.");
    },
    error: function(xhr, statsu, err) {
      alert(err.toString());
    }
  });
}
