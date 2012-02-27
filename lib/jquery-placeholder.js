/*
	jQuery Placeholder Plugin
	Author: Eymen Gunay
	Web: http://www.egunay.com/
*/
(function( $ ){
	$.fn.placeHolder = function(options) {
		var eo = this;
		var settings = {
			'text'		  : 'Placeholder',
			'placeholder' : '#999',
			'active' 	  : '#000'
		};
		return this.each(function() {        
			if ( options ) { 
				$.extend( settings, options );
			}			
			eo.val(settings.text);
			eo.css("color", settings.placeholder);
			eo.focus(function() {
				if(eo.val() == settings.text) {
					eo.css("color", settings.active);
					eo.val("");	
				}
			});
			eo.focusout(function() {
				$("#search_box img").css("display","none");
				if(eo.val() == "" || eo.val() == settings.text) {
					eo.val(settings.text);
					eo.css("color", settings.placeholder);
				}
			});
		});				
	
	};
})( jQuery );