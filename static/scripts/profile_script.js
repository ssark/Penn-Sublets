$(document).ready(function () {
	// start off with just bookings showing
	$("#bookings-tab-div").addClass("active")
	$("#listings-tab-div").removeClass("active")
	$("#listings-div").hide()
	$("#bookings-div").show()

	$("#bookings-tab").click(function() {
		$("#listings-tab-div").removeClass("active")
		$("#bookings-tab-div").removeClass("active").addClass("active")
		$("#bookings-div").show()
		$("#listings-div").hide()
	})

	$("#listings-tab").click(function() {
		$("#bookings-tab-div").removeClass("active")
		$("#listings-tab-div").removeClass("active").addClass("active")
		$("#listings-div").show()
		$("#bookings-div").hide()
	})
});