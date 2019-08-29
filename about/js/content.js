var gallery = {
    albums : [
              {
              name : "Pet",
              thumbnail : "images/img_1.jpg",
              photos : [
                        {
                        src : "images/img_1.jpg",
                        },
                        {
                        src : "images/img_2.jpg",
                        },
                        {
                        src : "images/img_3.jpg",
                        },
                        {
                        src : "images/img_4.jpg",
                        },
                        {
                        src : "images/img_5.jpg",
                        },
                        {
                        src : "images/img_6.jpg",
                        },
                        {
                        src : "images/img_7.jpg",
                        },
                        {
                        src : "images/img_8.jpg",
                        },
                        {
                        src : "images/img_9.jpg",
                        },
                        {
                        src : "images/img_10.jpg",
                        }, 
                        {	
                        src : "images/img_11.jpg",
                        }, 
                        {	
                        src : "images/img_12.jpg",
                        } 
                        ]
              }
              
              ]
};

var about_template, photos_template, games_template;
var current_album = gallery.albums[0];
var current_photo = current_album.photos[0];

function showTemplate(template, data){
    var html    = template(data);
    $('#content').html(html);
}

$(document).ready(function(){

	var source   = $("#about-template").html();
	about_template = Handlebars.compile(source);
	
	
	
	
	source   = $("#games-template").html();
	games_template = Handlebars.compile(source);


	$("#About-tab").click(function () {


        $('#content').html(about_template);
                          
		$(".nav-tabs .active").removeClass("active");

		$("#About-tab").addClass("active");


    });


	$("#photos-tab").click(function () {
		
        showTemplate(photos_template, current_album);
        $('#content').html(photos_template);

		$(".nav-tabs .active").removeClass("active");

		$("#photos-tab").addClass("active");

	});


	$("#Games-tab").click(function () {


		$('#content').html(games_template);

		$(".nav-tabs .active").removeClass("active");

		$("#Games-tab").addClass("active");
	});

	$("#About-tab").click();

});
