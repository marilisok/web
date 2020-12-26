$(document).ready(() => {
  startConfig();
});

function startConfig() {
  $('#id02').hide();
  $('#id01').hide();
}

function editPicture(id, name, artist, price, min, max, trade, picture) {
  $('#id02').show();
  $("input[name='name']").val(name);
  $("input[name='artist']").val(artist);
  $("input[name='price']").val(price);
  $("input[name='min']").val(min);
  $("input[name='max']").val(max);
  $("input[name='picture']").val(picture);

  if (trade) {
    $("input[value='yes']").prop("checked", true);
  } else {
    $("input[value='no']").prop("checked", true);
  }

  $("form[name='postForm']").attr('action', 'editPicture/' + id);
}

function newPicture() {
  $('#id01').show();
}