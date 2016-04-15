$(document).ready(function() {
	$('[data-accordeon]').on("click", function(e){
		e.preventDefault();
		$(this).parent(".dropdown").closest(".hasChildren").slideToggle(slow);
		console.log("click");
	});




	

});
