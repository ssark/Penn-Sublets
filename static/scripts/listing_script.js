$(document).ready(function () {
	var listingId = $('#listing_id').val()
	console.log("** ins cript", listingId)
	$("#delete-listing").click(function() {
		console.log('*****')
		var currId = $('#listing_id').val()
		var delUrl = '/listings/delete/' + currId
		$.ajax({
		url: delUrl,
		type: 'DELETE',
		success: function(data) {
			if (data === 'success') { // redirect back to home
			 window.location.href = '../home';
			} else {
			console.log(data)
			}
		}
		});
	});

	var allRanges = []
  // get all booking dates
  $.getJSON('../getBookings', {listingId: listingId}, function(bookings) {
  	allRanges = []
  	bookings.forEach(function(b) {
  		var curr = {s: moment.utc(b.date_from), e: moment.utc(b.date_to)}
  		// console.log("adding: " + moment(b.dat))
  		allRanges.push(curr)
  	})
  	console.log('************ all ranges', allRanges)
  	console.log("******* in listing script", bookings)

  });

	var startDate = null;
	var endDate = null;

	$("#book-listing").click(function() {
		// var dateFrom = $('#date-from').val()
		// var dateTo = $('#date-to').val()
		var listingId = $('#listing_id').val()

		console.log("start date", startDate, "end date", endDate)
		if (startDate == null || endDate == null) {
		alert('No dates selected yet')
		} else {
			$.ajax({
				type: "POST",
				url: '../createBooking',
				data: {
				listingId: listingId,
				dateFrom: startDate,
				dateTo: endDate
				},
				dataType: 'json'
			})
			.done(function(data) {
				alert(data.msg)
			})
			.fail(function(data) {
				alert("Error: " + data.responseJSON.msg)
			})
		}
	});

	$("#post-review").click(function() {
		var reviewTitle = $('#review-title').val()
		var reviewTexts = $('#review-text').val()
		var listingId = $('#listing_id').val()

		$.ajax({
				type: "POST",
				url: '../createReview',
				data: {
				listingId: listingId,
				title: reviewTitle,
				text: reviewTexts
				},
				dataType: 'json'
			})
			.done(function(data) {
				console.log(data)
				// posting logic here
			})
			.fail(function(data) {
				alert("Error: " + data.responseJSON.msg)
			})
	});

	$('#booking-form-date').daterangepicker({
    "minYear": 2019,
    "autoApply": true,
    "minDate": moment(),
    "opens": "center",
    "isInvalidDate": function(date) {
    	console.log("77777777", date.format('MM-DD'))

    	for (var i = 0; i < allRanges.length; i++) {
    		var curr = allRanges[i]
    		console.log(curr)
    		console.log('curr.s: ' + curr.s.format('YYYY-MM-DD') + ' curr.e: ' + curr.e.format('YYYY-MM-DD'))
    		var sameStart = curr.s.isSame(date, 'd')
    		var sameEnd = curr.e.isSame(date, 'd')
    		if (sameStart || sameEnd) {
    			console.log("sameStart: " + curr.s.format('MM-DD') + "sameEnd: " + curr.e.format('MM-DD'))
    			return true;
    		}
    		if (date.isAfter(curr.s, 'd') && date.isBefore(curr.e, 'd')) return true
    	}
      return false;
    }
	}, function(start, end, label) {
	  console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
	  startDate = start.format('YYYY-MM-DD')
	  endDate = end.format('YYYY-MM-DD')

	});
})