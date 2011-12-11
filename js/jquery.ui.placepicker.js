(function($) {  
  $.widget("ui.placepicker", {  
		options: {  
			latitude: null,
			longtitude: null,
			width: "100%",
			height: "300px",
			zoom: 5,
			_interal_longtitude: null,
			_interal_latitude: null,
		},
		shared: {
		  popup:null,
		  map: null,
		  marker: null,
		  latLng: null,
		},
		_create: function() {
			var self=this
			$text=$("<div class='text'>No place selected"+self.element.attr('id')+"hey</div>")
			$button=$("<img src='http://www.google.com/mapfiles/marker.png'></img>")
			self.element.html($button)
			$button.before($text)

			$button.click(function() {
  			self._createPopup(self)
	   		
	   		self.options._interal_longtitude = self.options.longtitude
        self.options._interal_latitude = self.options.latitude
        
				self.shared.popup.css({left:self.element.offset().left+200})
				self.shared.popup.css({top:self.element.offset().top})
				self.shared.popup.appendTo(self.element)
				
				self.shared.latLng = new google.maps.LatLng(self.options._interal_latitude,self.options._interal_longtitude)
  			self.shared.mapOptions = {
  				zoom: self.options.zoom,
  				center: self.shared.latLng,
  				mapTypeId: google.maps.MapTypeId.ROADMAP
  			}
  			self.shared.marker = new google.maps.Marker({
  			    position: self.shared.latLng
  			})

  			self._createMap(self, self.shared.mapOptions)
  			self._placeMarker(self, self.shared.latLng);
				event.stopPropagation();
			})
			
			//Remove popup if clicked outside popup
			
			$(document).click(function(){
  			if( self.shared.popup != null) {
    			self.shared.popup.remove()
  			}
			})
			
		},
		_destroy: function() {
			if( self.shared.popup != null) {
  			self.shared.popup.remove()
			}
		},
		_createMap: function(self, options) {
			var geocoder=new google.maps.Geocoder();
			self.shared.map = new google.maps.Map(self.shared.popup.find("div.map")[0], options)

			google.maps.event.addListener(self.shared.map, 'click', function(event) {
		   		self._placeMarker(self, event.latLng);
				  geocoder.geocode({latLng:event.latLng}, function(results, status) {
					  self.options._internal_latitude=event.latLng.lat()
					  self.options._internal_longtitude=event.latLng.lng()
			      if (status == google.maps.GeocoderStatus.OK) {
				   	  if (results[0]) {
				     	  self.shared.popup.find("input.address").val(results[0].formatted_address)
				   	  }
				    } else {
			    	  self.shared.popup.find("input.address").val("")
				 	  }
				})
				
		
			})
		},
		_placeMarker: function(self, location) {
			self.shared.marker.setMap(self.shared.map)
			
			if(location.getNorthEast){
  			self.shared.marker.setPosition(location.getCenter())
  			self.shared.map.panToBounds(location);
			}else{
  			self.shared.marker.setPosition(location)
  			self.shared.map.panTo(location);
			}
		},
		_createPopup: function(self){
			self.shared.popup=$("<div class='popup'><div class='map'>loading</div><div><input class='address' type='text' value='type location'><input type='button' value='search'><input type='button' value='submit'></div></div>")
			self.shared.popup.css({width:'400px'})
			self.shared.popup.find("input[value='submit']").click(function(){
        self.options.longtitude = self.options._internal_longtitude
        self.options.latitude = self.options._internal_latitude
  			self.shared.popup.remove()
      })
			self.shared.popup.find("input[value='search']").click(function(){
			  var geocoder=new google.maps.Geocoder();
			  geocoder.geocode({address: self.shared.popup.find("input.address").val()}, function(results, status) {
				  self._placeMarker(self, results[0].geometry.location)
				  self.shared.popup.find("input.address").val(results[0].formatted_address)
			  })
      })
      
			self.shared.popup.find("div.map").css({width: self.options.width,height: self.options.height})
			self.shared.popup.find("input.address").css({width:'281px',display:'inline'})
			self.shared.popup.addClass('ui-dialog ui-corner-all')
			self.shared.popup.addClass('ui-widget-content')
			self.shared.popup.click(function(){
				event.stopPropagation();
			})
		}
	})
})(jQuery);  
