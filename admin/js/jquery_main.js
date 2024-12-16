$(document).ready(function(){
	// $("#h-banner").css('background-color','yellow');
	// $("#h-banner").html("<h1 style='margin: 0px' >HomeFoody</h1>");
	// $(".product-item").first().css('border-radius',50);
	// $(".product-item").last().css('border-radius',50);
	// var a = $(".product-item").first();
	// var p = a.find(".product-price").text();
	// alert(p);
	var orderDetails = "";
	var count = 0;
	$(".product-item").find(".buy").click(function(){
		var item = $(this).parent();
		var name = item.find(".product-name").text();
		var price = item.find(".product-price").text();
		var photo = item.find("img").attr("src");
		
		var order = {
			'name' : name,
			'price' : price,
			'photo' : photo,
		}
		if(orderDetails != "")
			orderDetails += "," + JSON.stringify(order);
		else
			orderDetails += JSON.stringify(order);
		if (orderDetails.substring(0,1) == "," )
			orderDetails = orderDetails.substring(1);
		alert(orderDetails);
		localStorage.setItem("orderDetails","[" + orderDetails + "]");
		count +=1;
		$("#cart").find("a").text("Giỏ hàng (" + count + ")");
		
	});
	
	
});