$(document).ready(() => {
  startConfig();
});

function startConfig() {
  $("input[name='dt']").hide();
  $("input[name='tm']").hide();
  $("input[name='timeout']").hide();
  $("input[name='interval']").hide();
  $("input[name='pause']").hide();
  $('#ok').hide();
}

function editSettings(dt, tm, timeout, interval, pause) {
  $('#dt').hide();
  $('#tm').hide();
  $('#timeout').hide();
  $('#interval').hide();
  $('#pause').hide();
  $('#ok').show();
  $("input[name='dt']").val(dt).show();
  $("input[name='tm']").val(tm).show();
  $("input[name='timeout']").val(timeout).show();
  $("input[name='interval']").val(interval).show();
  $("input[name='pause']").val(pause).show();
  return false;
}