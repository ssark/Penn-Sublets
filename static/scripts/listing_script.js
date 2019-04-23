$(document).ready(function () {
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
    "opens": "center"
	}, function(start, end, label) {
	  console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
	  startDate = start.format('YYYY-MM-DD')
	  endDate = end.format('YYYY-MM-DD')

	});
})