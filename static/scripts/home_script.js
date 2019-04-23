      // search suggestions
      $("#search-box").autocomplete({
        source: function (request, response) {
          $.post('../search_sug',
            {
              search_term: request.term
            },

          function(data, status) {
            response(data);
          });
        },
        minLength: 1,
        select: function(event, ui) {
            window.location.href = "../" + ui.item.value;
        }
      });