$(document).ready(function() {
	var current_page, container;

	$window_width = $(window).width();
	$ingredients = "";

	container = $(".swipe");
	current_page = "home"; //home - recipes

	//Draggable and droppable.
	$(".ingredient").draggable({ opacity: 0.5, helper: "clone" });

	function add_ingredient_to_table($id) {
		$ok = 1;

		$(".start").remove();

		$(".table .ingredient").each(function(index) {
			if ($(this).attr("id") == $id) {
				$ok = 0;
			}
		});

		if ($ok == 1) {
			$image = "images/icons/" + $id + ".png";

			$(".table").append('<div class="ingredient" id="' + $id + '"> <img src="' + $image + '" /> </div>');

			$(".table .ingredient").click(function() {
				if ($(this).attr("id") != "first") {
					$(this).remove();
				}
			});
		}
	}

	$(".table").droppable({
		drop: function(event, ui) {
			$id = ui.draggable.attr("id");

			add_ingredient_to_table($id);
		}
	});

	//Dragging not supported fallback.
	$(".ingredient").click(function() {
		$id = $(this).attr("id");

		$(".to-remove").show();

		setTimeout(function() {
			$(".to-remove").remove();
		}, 3000);

		add_ingredient_to_table($id);
	});	

	//Home page.
	$(".results").fitText(1.1);
	$(".start").fitText(0.9);

	$(".start").css("margin-top", $(".table").height() / 2 - $(".start").height() / 3);

	$(".results").click(function() {
		make_recipes();
	});

	$("body").hammer({ drag_lock_to_axis: true }).on("swipeleft swiperight", handleHammer);

	$(window).resize(function() {
		$(".start").css("margin-top", $(".table").height() / 2 - $(".start").height() / 2);
	});

	//Recipes page.
	$(".button").click(function() {
		swipe_right();
	});

	function show_recipes(recipes) {
		$len = recipes.results.length;

		$(".recipes").empty();
		$(".recipes").append('<div class="recipes-title"> <div class="title"> <span>Got this recipes: </span> </div>');
		$(".recipes").append('<div class="recipes-overflow">');

		if ($len == 0) {
			$(".recipes").append('<div class="empty-results"><span>Sorry, we found no recipes.</span></div>');
		}
		else {
		$(".recipes-title .title").fitText(1);

		for ($i = 0; $i < $len; $i++) {
			$title = recipes.results[$i].title;
			$ingredients = recipes.results[$i].ingredients;
			$link = recipes.results[$i].href;
			$image = recipes.results[$i].thumbnail;
			$filter = "";

			if ($image == "") {
				$image = "images/logo-cook.jpg";

				$filter = "-webkit-filter: grayscale(100%); -moz-filter: grayscale(100%);";
			}

			if ($ingredients.length > 40) {
				$ingredients = $ingredients.substr(0, 40);
				$ingredients += '..';
			}

			$recipe = '<div class="recipe">';
			$recipe += '<div class="image" style="' + $filter + '"><img src="' + $image + '" /></div>';
			$recipe += '<div class="details">';
			$recipe += '<div class="title"><span>' + $title + '</span></div>';
			$recipe += '<div style="clear: both;"></div>';
			$recipe += '<div class="ingredients"><span>' + $ingredients + '</span></div>';
			$recipe += '<div style="clear: both;"></div>';
			$recipe += '<div class="link"><a href="' + $link + '" target="_new"><span>Click here to see the recipe.</span></div>';
			$recipe += '</div>';
			$recipe += '</div>';

			$(".recipes-overflow").append($recipe);
		}
		}

		$(".recipes-overflow").niceScroll();

		fix_font_sizes();
	}

	function fix_font_sizes() {
		$(".recipe .title").fitText(0.7);
		$(".recipe .ingredients").fitText(1);
		//$(".recipe .link").fitText(1);

		//Fixing font sizes.
		$max_font_size = 0;

		$(".recipe .title").each(function() {
			$font_size = $(this).css("font-size");

			$font_size = $font_size.substr(0, $font_size.indexOf("px"));

			if ($font_size > $max_font_size) {
				$max_font_size = $font_size;
			}
		});	

		$(".recipe .title").css("font-size", $max_font_size);

		if ($max_font_size - 5 < 25) {
			$max_font_size -= 5;
		}
		else {
			$max_font_size = 25;
		}

		$(".recipe .ingredients").css("font-size", $max_font_size);

		$(".recipe .link").css("font-size", $max_font_size - 4);

		$(".recipes").append('<div class="scroll">Scroll down to view more</div>');
	}

	function get_recipes(ingredients) {
		$.ajax({
			url: "http://www.recipepuppy.com/api/?i=" + ingredients,
			dataType: "jsonp",
			jsonpCallback: 'json'
		}).done(function(data) {
			show_recipes(data);
		});
	}

	function make_recipes() {
		$ingredients = "";
		$len = 0;

		$(".table .ingredient").each(function(index) {
			if ($(this).attr("id") != null && $(this).attr("id") != "first") {
				$ingredients += $(this).attr("id");

				if (index != $(".table .ingredient").length - 1) {
					$ingredients += ",";
				}

				$len++;
			}
		});

		if ($ingredients != "") {
			get_recipes($ingredients);

			$(".button").slideToggle('slow');

			$(".swipe").css("-webkit-transition-duration", "1s");
			$(".swipe").css("-moz-transition-duration", "1s");
			$(".swipe").css("transform", "translate3d(-100%, 0px, 0px)");

			current_page = "recipes";
		}
	}

	function swipe_left() {
		if (current_page == "home") {
			container.css("-webkit-transition-duration", "1s");
			container.css("-moz-transition-duration", "1s");
			container.css("transform", "translate3d(-100%, 0px, 0px)");

			current_page = "recipes";
		}
	}

	function swipe_right() {
		if (current_page == "recipes") {
			container.css("-webkit-transition-duration", "1s");
			container.css("-moz-transition-duration", "1s");
			container.css("transform", "translate3d(0px, 0px, 0px)");

			$(".button").slideToggle('slow');

			current_page = "home";
		}
	}

	function handleHammer(event) {
		event.gesture.preventDefault();

		switch(event.type) {
			case 'swipeleft':
				swipe_left();
			break;

			case 'swiperight':
				swipe_right();
			break;
		}
	}

	function log(target, message) {
		target.empty();

		target.append(message);
	}

	//List of API calls.
	/*
	Food2fork API call
	$url = "http://food2fork.com/api/search";

	$.ajax({
		type: "POST",
		url: $url,
		data: { key: "0c9708957d2a584d57e5312c7e58566d", q: "chicken" },
		success: function (result) {
			alert(result);
		},
		dataType: 'jsonp',
		crossDomain: true
	});
	*/

	/* 
	Recipe Puppy API call
	
	$url = "http://www.recipepuppy.com/api/";

	$ingredients = "eggs, chicken";

	$url += "?i=" + $ingredients;

	$.ajax({
		type: "GET",
		url: $url,
		success: function(result) {
			document.write(result);
		},
		error: function(xhr, status, result) {
			document.write("Error: " + xhr.responseText);
		},
		dataType: "jsonp",
		crossDomain: true
	});
	*/
});
