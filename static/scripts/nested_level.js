$(document).ready(function () {
  // search suggestions
  $("#search-box").autocomplete({
    source: function (request, response) {
      console.log("in source function. search term: " + request.term)
      $.post('../searchSug',
        {
          search_term: request.term
        },

      function(data, status) {
        console.log(data)
        response(data);
      });
    },
    minLength: 1,
    select: function(event, ui) {
      if (ui.item.isUser == 0) {
        window.location.href = "../listings/" + ui.item.value;
      } else {
        window.location.href = "../users/" + ui.item.value;
      }
    }
  });
});