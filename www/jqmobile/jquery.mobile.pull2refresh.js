( function( $, undefined ) {

$.fn.pull2refresh = function( options ) {

	options = ( options && ( $.type( options ) == "object" ) )? options : {};
	for ( var i = 0; i < this.length; i++ ) {
		var el = this.eq( i ),
			e = el[ 0 ],
			o = $.extend( {}, $.fn.pull2refresh.defaults, {
				target:       options.target       !== undefined ? options.target       : el.jqmData( "target" )
			}, options ),
            minDistanceToStopBubbling = 10,
            pullModifier = 3,
			activeClass = "pull2refresh-active",
			pendingClass = "pull2refresh-pending";

		$.each(o, function(key, value) {
			e.setAttribute( "data-" + $.mobile.ns + key, value );
			el.jqmData(key, value);
		});

        var start = 0,
            body = $('body')[0],
            $list = el.siblings(o.target).first(),
            $target = el,
            diff = 0,
            trigger = false,
            stopBubbling = false;

        $list.bind('touchstart', function(e) {
            start = e.originalEvent.touches[0].screenY;
            trigger = false;
            stopBubbling = false;
            $list.css('-webkit-transition','none');
        });
        $list.bind('touchend', function(e) {
            if (stopBubbling || trigger) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (trigger) {
                el.trigger('pull-refresh');
            } else {
                el.trigger('pull-cancel');
            }
            $list.css({'-webkit-transition': 'all .2s linear','-webkit-transform': 'translate3d(0,0,0)'});
        });
        $list.bind('touchmove', function(e) {
            if (start <= e.originalEvent.changedTouches[0].screenY && body.scrollTop == 0) {
                e.preventDefault();
                diff = (e.originalEvent.changedTouches[0].screenY-start)/pullModifier; // split to give more "pulling" feeling
    			//Start Pulling...
            	if (!stopBubbling && diff > minDistanceToStopBubbling) {
					$(".refreshBar img").css({"-webkit-animation-name": "flipThisDown", "-webkit-animation-duration":"0s"});
                    stopBubbling = true;
                }
				//Pending...
                if (diff <= $target.height()) {
                    $list.css('-webkit-transform','translate3d(0,'+(diff)+'px,0)');
                    $target.addClass(pendingClass).removeClass(activeClass);
                    trigger = false;
                }
 				//Done...
    			else {
                    if (!trigger)
						$(".refreshBar img").css({"-webkit-animation-name": "flipThisUp", "-webkit-animation-duration":"0.5s"});
					$list.css('-webkit-transform','translate3d(0,'+($target.height())+'px,0)');
                    $target.addClass(activeClass).removeClass(pendingClass);
                    trigger = true;
                }
            }
        });

	}

	return this;
};

$.fn.pull2refresh.defaults = {
    target: ":jqmData(role='listview')"
};

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){

	$( ":jqmData(role='pull2refresh')", e.target )
		.pull2refresh();
});

})( jQuery );

