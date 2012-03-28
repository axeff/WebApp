/*
 * jTwitter 1.1.1 - Twitter API abstraction plugin for jQuery
 *
 * Copyright (c) 2009 jQuery Howto
 *
 * Licensed under the GPL license:
 *   http://www.gnu.org/licenses/gpl.html
 *
 * URL:
 *   http://jquery-howto.blogspot.com
 *
 * Author URL:
 *   http://jquery-howto.blogspot.com
 *
 */
(function( $ ){
	$.extend( {
		jTwitter: function( query, page, fnk ) {
			var info = {};
			
			// If no arguments are sent or only username is set
			if( query == 'undefined' || page == 'undefined' ) {
				return;
			} else if( $.isFunction( page ) ) {
				// If only username and callback function is set
				fnk = page;
				page = 1;
			}
			
			var url = "http://search.twitter.com/search.json?q="+query+"&rpp=20&page="+page+"&callback=?";

			$.getJSON( url, function( data ){
				if( $.isFunction( fnk ) ) {
					fnk.call( this, data );
				}
			});
		}
	});
})( jQuery );