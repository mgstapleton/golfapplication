/**
 * @author Michael Stapleton
 */
// 

function deviceReady() {
    console.log("deviceReady");
    var bounds = new google.maps.LatLngBounds();
}

if (typeof jQuery !== "undefined") {
	console.log("jQuery binding initialization called");
	// Initialization that runs when each page loads for the first time
	$(document).on("pageshow","#home_page",function(event){
		// Do stuff now that the DOM is ready
		console.log("home pageshow triggered from document");
		console.log("event target id is: " + event.target.id);
		// $(".map_button").on('click', function (event, ui) {
			// getMap();
		// });
	$(document).on("pagebeforeshow","#map_page",function(){
		 console.log("Other pagecreate for #map_page triggered");
	     getMap();
	     });
	$(document).on("pageshow","#map_page",function(){
			console.log("map resize triggered");
			google.maps.event.trigger(map, 'resize');
			map.setOptions(myOptions);
		});
	$(document).on("pageshow","#all_clubs_map_page",function(){
		console.log("map page show all resize triggered");
		showAllClubs();
		google.maps.event.trigger(mapAll, 'resize');
		mapAll.setOptions(myOptions);
	});
});
	// $(document).on("pagecreate","#map_page",function(event){
		// console.log("pagecreate triggered fror #map_page1");
		// var clubs = clubList[locator.getLocation()];
		// var clubLocation = new google.maps.LatLng(clubs.location.lat, clubs.location.lon);
		// $("#map_canvas").gmap({
			// center : clubLocation,
			// zoom : 12,
			// mapTypeId : google.maps.MapTypeId.ROADMAP,
			// disableDefaultUI : false,
			// callback : function (map) {
				// var self = this;
				// self.addMarker({
					// position : this.get('map').getCenter(),
					// title : clubs.club + " golf club is here!"
				// });
			// }
		// });
	  // });	
	  // $( document ).on( "pageshow","#map_page", function( event, data ){
		// console.log("resize triggered fror #map_page");
		// google.maps.event.trigger(map, 'resize');
		// });
};
 
// Populate index page list with golf club locations
var addClub = function () {
   console.log("addclub triggered (from body onload)");
	var inx, node;
	var newId, newLink, newPage;
	if (typeof jQuery === "undefined") {
		console.log('jQuery Mobile not defined.');
		for (inx = 0; inx < clubList.length; inx++) {
			node = document.createElement("a");
			document.getElementById("clubs").appendChild(document.createElement("li")).appendChild(node);
			node.setAttribute('href', 'HTML/Club.html');
			node.setAttribute('onclick', 'locationClicked(' + inx + ')');
			node.innerHTML = clubList[inx].club
		}
	} else {
		// Iterate through list of clubs
		$.each(clubList, function(i, item) {
			newId = '#' + item.club.split(" ").join('_');
			// Populate list of clubs
			newLink = $("<a>").text(item.club).attr("href", newId).attr("onclick", 'locationClicked(' + i + ')');
			$("<li>").append(newLink).appendTo('#clubs');
			newPage = $("#sub_page").clone().attr("id", item.club.split(" ").join('_')).appendTo("body");
			// Clone template page and populate with club details
			$(newId + ">header>h1").html(item.club);
			//$(newId + ">nav>img").attr("src", "Resources/" + item.image);
			//$(newId + ">nav>p#address").html(item.address);
		});
		$("#clubs").listview('refresh');
		$("#clubs").trigger('create'); // TODO: Needed?
		}
	};

// Save index of selected location
var locationClicked = function (locat) {
	(locat !== "") ? locator.setLocation(locat) : locator.setLocation("blank"); 
};

// Populate club details
var loadData = function () {
	console.log("loadData triggered (from doc)");
	var i = locator.getLocation();
	document.title = clubList[i].club + ' golf club';
	document.getElementById("header").innerHTML = clubList[i].club;
	//document.getElementById("flag").src = clubList[i].image;
	//document.getElementById("address").innerHTML = clubList[i].address;
};

// Initialize and display map
var getMap = function () {
	// Get URL for previous page for non-jQuery Mobile version
	console.log("getMap triggered from document");
	if (typeof jQuery === "undefined") {
		document.getElementById('back').href = document.referrer;
	}
	
	// Get club coordinates and display map
	var club = clubList[locator.getLocation()];
	var clubLocation = new google.maps.LatLng(club.location.lat, club.location.lon);
	myOptions = {
		center : clubLocation,
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	// Display a marker on the map
	var marker = new google.maps.Marker({
		position: clubLocation,
		map: map,
		title: "The " + club.club + " golf club is here!"
		});
};

var showAllClubs = function(){
	console.log("showAllClubs triggered from document");
	var bounds = new google.maps.LatLngBounds();
	var middle = new google.maps.LatLng(53.0914, -7.9133);
	myOptions = {
		center : middle,
		zoom : 7,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	mapAll = new google.maps.Map(document.getElementById("map_canvas2"), myOptions);
	
	// $.each(clubList, function(i,item) {
	// //locationClicked(i);
	// club = clubList[locator.getLocation()];
	// markers = [item.club + " Golf Club" , club.location.lat, club.location.lon];
	// clubLocation = new google.maps.LatLng(club.location.lat, club.location.lon);
	// marker = new google.maps.Marker({position: clubLocation,map: mapAll});
	
	// Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
	for (i=1; i<=clubList.length;i++){
		locator.setLocation(i);
		var club1 = clubList[locator.getLocation()];
		var position = new google.maps.LatLng(club1.location.lat, club1.location.lon);
        console.log(position);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: mapAll,
            title: club1.club + " Golf Club"
        });
	    // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent("Hello! : " + i);
                infoWindow.open(mapAll, marker);
              };
            })(marker, i));

        // Automatically center the map fitting all markers on the screen
        mapAll.fitBounds(bounds);
    }
    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((mapAll), 'bounds_changed', function(event) {
        this.setZoom(9);
        google.maps.event.removeListener(boundsListener);
    });
};
//};

var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>Golf Club</h3>' +
        '<p>Text here</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Palace of Westminster</h3>' +
        '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
        '</div>']
    ];
    
// These functions are exposed as a module named "locator"
var locator = (function () {
	// Private members	
	var setLoc = function (loc) {
		if(typeof(Storage) !== "undefined") {
		  sessionStorage.location = loc;
		}
		else {
		  alert("Can't set location - there is no local storage support on this browser.");
		}
	};
	
	var getLoc = function () {
		if(typeof(Storage) !== "undefined") {
		  return sessionStorage.location;
		}
		else {
		  alert("Can't get location - there is no local storage support on this browser.");
		}
	};

	return { 
		// Exposed functions
        setLocation: setLoc,
        getLocation: getLoc
   };

}());
