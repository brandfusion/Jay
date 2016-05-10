$(document).ready(function() {
	$('[data-accordeon]').on("click", function(e){
		e.preventDefault();
		$(this).parent(".dropdown").closest(".hasChildren").slideToggle(slow);
		console.log("click");
	});

  $('.favorite-add-line').on("click", function(e){
    e.preventDefault();
    var productId = $(this).attr("data-product-id");
    var quantity = $(this).parents(".favorite-quantity-wrapper").find('[name="quantity"]').val();
    var linkAdd = "/Default.aspx?productid=@productId&amp;variantID=@productVariantId&amp;cartcmd=add&amp;quantity=@productQuantity"
    console.log(productId);
    console.log(quantity);

  });
 




	

});

