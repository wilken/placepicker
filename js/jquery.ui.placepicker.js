(function($) {  
  $.widget("ui.placepicker", {  
		options: {  
			latitude: null,
			longtitude: null,
			width: "100%",
			height: "300px",
			popup: null
		},
		_create: function() {
			var self=this
//			var lat = $('#'+this.element.attr('id')+'-lat').attr('value')
//			var long = $('#'+this.element.attr('id')+'-long').attr('value')

			$text=$("<div class='text'>No place selected"+self.element.attr('id')+"hey</div>")
			$button=$("<img src='http://www.google.com/mapfiles/marker.png'></img>")
			self.element.html($button)
			$button.before($text)
			self.options.popup=self._createPopup(self)

			$button.click(function() {
				self.options.popup.click(function(){
					event.stopPropagation();
				})
				self.options.popup.css({left:self.element.offset().left+200})
				self.options.popup.css({top:self.element.offset().top})
				self.options.popup.appendTo(self.element)
				
				var map = self._createMap(self)
				event.stopPropagation();
			})
			
			//Remove popup if clicked outside popup
			$(document).click(function(){
  			self.options.popup.remove()
			})
			
		},
		_destroy: function() {
			self.options.popup.remove()
		},
		_createMap: function(self, myOptions) {
			var geocoder=new google.maps.Geocoder();
			var myLatlng = new google.maps.LatLng(self.options.latitude,self.options.longtitude)
			var myOptions = {
				zoom: 12,
				center: myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			var marker = new google.maps.Marker({
			    position: myLatlng
			})
			
			var map = new google.maps.Map(self.options.popup.find("div.map")[0],myOptions)
			google.maps.event.addListener(map, 'click', function(event) {
		   		self._placeMarker(event.latLng, map, marker);
				geocoder.geocode({latLng:event.latLng}, function(results, status) {
					self.options.latitude=event.latLng.lat()
					self.options.longtitude=event.latLng.lng()
			    if (status == google.maps.GeocoderStatus.OK) {
				   	if (results[0]) {
				     	self.options.popup.find("input.adress").val(results[0].formatted_address)
				   	}
				  } else {
			    		self.options.popup.find("input.adress").val("")
				 	}
				})
				
		
			})
			return map
		},
		_placeMarker: function(location, map, marker) {
			marker.setMap(map)
			marker.setPosition(location)
			map.panTo(location);
		},
		_createPopup: function(self){
			$popup=$("<div class='popup'><div class='map'>loading</div><div><input class='adress' type='text' value='type location'><input type='button' value='search'><input type='button' value='submit'></div></div>")
			$popup.css({width:'400px'})
			$popup.find("div.map").css({width: self.options.width,height: self.options.height})
			$popup.find("input.adress").css({width:'281px',display:'inline'})
			$popup.addClass('ui-dialog ui-corner-all')
			$popup.addClass('ui-widget-content')
			
			return $popup
		}
	})
})(jQuery);  
