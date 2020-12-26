$(document).ready(() => {
  startConfig();
});

function startConfig() {
  $('#id02').hide();
  $('#id01').hide();
}

function editPerson(id, name, money) {
  $('#id02').show();
  $("input[name='name']").val(name);
  $("input[name='money']").val(money);
  $("form[name='pForm']").attr('action', 'editPerson/' + id);
}

function newPerson() {
  $('#id01').show();
}