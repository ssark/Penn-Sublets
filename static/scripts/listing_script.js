$(document).ready(function () {
	var listingId = $('#listing_id').val()

	$("#delete-listing").click(function() {
		console.log('*****')
		var currId = $('#listing_id').val()
		var delUrl = '/listings/delete/' + currId
		$.ajax({
		url: delUrl,
		type: 'DELETE',
		success: function(data) {
			if (data === 'success') { // redirect back to home
			 window.location.href = '../';
			} else {
			console.log(data)
			}
		}
		});
	});

	var allReviews = []

	$.getJSON('../getReviews', {listingId: listingId}, function(reviews) {
		console.log(reviews)
    var htmlCode = "";
    allReviews = reviews;
    if (reviews.length == 0) {
    	htmlCode = "<h5> No reviews yet. Add one with the form below! </h5>"
    } else {
	    reviews.forEach(function(r) {
	  		htmlCode += "<h5 class=\"strong\">"+ r.title + "</h5>"
	  		htmlCode += "<p class=\"ma-p ma-p--small\">"+ r.text + "</p>"
	  		htmlCode += "<div class=\"ma-label ma-label--simple ma-label--simple--small\"> <a href=\"/users/" + r.user._id + "\">" + r.user.name + "</a> - "
	  		htmlCode += moment(r.date_posted).format('MMMM D, YYYY') + "</div>"
	  		htmlCode += "<hr class=\"ma-separator\">"
	  	})
    }
    $("#reviews-div").append(htmlCode);
  	
  });

	var allRanges = []
  // get all booking dates
  $.getJSON('../getBookings', {listingId: listingId}, function(bookings) {
  	allRanges = []
  	bookings.forEach(function(b) {
  		var curr = {s: moment(b.date_from), e: moment(b.date_to)}
  		allRanges.push(curr)
  	})
  });

	var startDate = null;
	var endDate = null;

	$("#book-listing").click(function() {
		var listingId = $('#listing_id').val()

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
				htmlCode = ""
			  	htmlCode += "<h5 class=\"strong\">"+ data.title + "</h5>"
		  		htmlCode += "<p class=\"ma-p ma-p--small\">"+ data.text + "</p>"
		  		htmlCode += "<div class=\"ma-label ma-label--simple ma-label--simple--small\"> <a href=\"/users/" + data.user._id + "\">" + data.user.name + "</a> - "
		  		htmlCode += moment(data.date_posted).format('MMMM D, YYYY') + "</div>"
		  		htmlCode += "<hr class=\"ma-separator\">"
		  		if (allReviews.length == 0) {
		  			$("#reviews-div").html(htmlCode);
		  		} else {
		  			$("#reviews-div").append(htmlCode);
		  		}
		  		$('#review-title').val('')
		  		$('#review-text').val('')
			})
			.fail(function(data) {
				alert("Error: " + data.responseJSON.msg)
			})
	});

	$('#booking-form-date').daterangepicker({
	"showDropdowns": true,
    "minYear": 2019,
    "minDate": moment(),
    "opens": "center",
    "applyButtonClasses": "ma-btn ma-btn--small ma-btn--primary",
    "isInvalidDate": function(date) {
    	for (var i = 0; i < allRanges.length; i++) {
    		var curr = allRanges[i]
    		var sameStart = curr.s.isSame(date, 'd')
    		var sameEnd = curr.e.isSame(date, 'd')
    		if (sameStart || sameEnd) {
    			return true;
    		}
    		if (date.isAfter(curr.s, 'd') && date.isBefore(curr.e, 'd')) return true
    	}
      return false;
    }
	}, function(start, end, label) {
	  startDate = start.format('YYYY-MM-DD')
	  endDate = end.format('YYYY-MM-DD')
	  $('#booking-form-date').addClass('ma-input--invalid')
	});
})