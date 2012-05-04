// Debug in browser?
// open terminal and run
// /Applications/Google\ Chrome.app/Contents/MacOS/Goog\ Chrome --disable-web-security
// to start chrome (must not be running before) with disabled cross-domain-restrictions
// then open debug.html to be able to start the app in a 400x800 window.

// project will be our global object wrapper
var project = {};
var appShortName = "masterApp"; 
var appVersion = "0.2";

// Set up our communication/storage api
project.jsApi = new JsApi("https://localhost", appShortName+"V"+appVersion); //live
//project.jsApi = new AffinitasJsApi("http://mobile-qa.betterdate.de", appVersix	on); //mobile-qa
//project.jsApi = new AffinitasJsApi("http://betterdate.mobile", appVersion); //betterdate.mobile

// Set up the mobile object and define our pages
project.mobile = new Mobile(
    {
	   'page-startup': {
            'show': function(e) {

			

                if (!debugInBrowser && (Connection.NONE == navigator.network.connection.type)) {
                    project.mobile.changePage('page-connect','page-connect.html');
                } else {
                    
	                
	                 project.mobile.changePage('page-dashboard','page-dashboard.html');
	                
                    
                }
                return "international"; // startup must not be translated
            }
        },
        'page-connect': {
            'show': function(e) {
            	project.app.unblockUI();
            	
            }
        },
        'menu': {
            'show': function(e) {
            	
                $('#page-visitors-list').empty().data('o',0);
                    var data = project.jsApi.get('/dashboard');
                    if (!data) return false;

            }
        },
       
        'page-dashboard': {
       	
            'show': function(e) {
            
                function calcDashboardItems() {
                    var displayWidth = $(window).width();
                    var width = Math.round(displayWidth / 3.8);
                    var height = width;
                    $('#page-dashboard-list li').css({
                       'width': width,
                       'height': height,
                       'margin':'2.4%'
                    });
                   
                }
                calcDashboardItems();
                $('#page-dashboard-list').listview("refresh");
            }
		},
		'page-multitouch': {

            'show': function(e) {

				var origScale = "";
				var origRotate = "";
				var origTranslate = "";
				var p = "";
				var mTarget = "";
				var lastTouch = {'pageX':0,'pageY':0};
				var startX, startY, startXTouch, startYTouch, startXNode, startYNode = 0;
				
				setTimeout(function(){
					//matrixTarget=$("#target").css("-webkit-transform");
					
					p = new RegExp(/matrix\(([\s\S]*?),\s([\s\S]*?),\s([\s\S]*?),\s([\s\S]*?),\s([\s\S]*?),\s([\s\S]*?)\)/);
					//mTarget = p.exec(matrixTarget);
				},100);
				
				var move = function ($node, xTouch, yTouch, isTouch) {
					
					if (!isTouch){
						startXTouch = xTouch;
						startYTouch = yTouch;
						startXNode = $node.offset().left;
						startYNode = $node.offset().top;

					}else{
					
						var x = (xTouch - startXTouch);
						var y = (yTouch - startYTouch);
						
						var left = startXNode + x;
						var top = startYNode + y;
						// var x = xTouch>=startXTouch ? xTouch : xTouch*(-1);
						// var y = yTouch>=startYTouch ? yTouch : yTouch*(-1);
						// var left = startXNode + (startXTouch + x) >= 0 ? startXNode + (startXTouch + x) : 0;
						// var top = startYNode + (startYTouch + y) >= 0 ? startYNode + (startYTouch + y) : 0;
						// left = $node.outerWidth() + left >= $(window).width() ? $(window).width() - $node.outerWidth() : left;
						// top = $node.outerHeight() + top >= $(window).height() ? $(window).height() - $node.outerHeight() : top;
						// startXTouch = left;
						// startYTouch = top;

						//console.log(top);
						$node.css({
							left: left + "px",
							top: top + "px",
							"-webkit-transform": origRotate+" "+origScale
						});
					}
				}
				
				var scale = function ($node, x1, y1, x2, y2){
					var originalSizeX = $node.width();
					var originalSizeY = $node.height();
					var distanceX = x1 > x2 ? x1 - x2 : x2 - x1;
					var distanceY = y1 > y2 ? y1 - y2 : y2 - y1;
					var scaleX = (distanceX / originalSizeX) > 1 ? distanceX / originalSizeX : 1;
					var scaleY = (distanceY / originalSizeY) > 1 ? distanceY / originalSizeY : 1;

					origScale = "scale("+scaleX+","+scaleY+")";


					$node.css({
						"-webkit-transform": origTranslate+" "+origRotate+" "+origScale
						/*"-webkit-transform": "scale("+scaleMap.scaleX+","+scaleMap.scaleY+")"*/
					});

				}
						
						
				var rotate = function ($node, x1, y1, x2, y2){
					var x = x1 - x2;
				    var y = y1 - y2;
				    origRotate = "rotate("+(Math.atan2(y, x) * 100)+"deg)";
					
				
					$node.css({
						"-webkit-transform": origTranslate+" "+origRotate+" "+origScale
						/*"-webkit-transform": "scale("+scaleMap.scaleX+","+scaleMap.scaleY+")"*/
					});
				}	
				
				var isAtTarget = function ($touchable){

					var matrixTouch=$touchable.css("-webkit-transform");

					var mTouch = p.exec(matrixTouch);

					var tolerance = 30; //in percent relative to viewport

					if (mTouch != null && mTouch != null){
						if (
							$touchable.offset().left - (($touchable.offset().left * tolerance) / 100)  <= $("#target").offset().left &&
							$touchable.offset().left + (($touchable.offset().left * tolerance) / 100)  >= $("#target").offset().left &&
							$touchable.offset().top - (($touchable.offset().top * tolerance) / 100)  <= $("#target").offset().top &&
							$touchable.offset().top + (($touchable.offset().top * tolerance) / 100)  >= $("#target").offset().top &&
							parseFloat(mTouch[1]) - Math.abs(parseFloat((mTouch[1] * tolerance) / 100)) <= parseFloat(mTarget[1]) &&
							parseFloat(mTouch[1]) + Math.abs(parseFloat((mTouch[1] * tolerance) / 100)) >= parseFloat(mTarget[1]) &&
							parseFloat(mTouch[2]) - Math.abs(parseFloat((mTouch[2] * tolerance) / 100)) <= parseFloat(mTarget[2]) &&
							parseFloat(mTouch[2]) + Math.abs(parseFloat((mTouch[2] * tolerance) / 100)) >= parseFloat(mTarget[2]) &&
							parseFloat(mTouch[3]) - Math.abs(parseFloat((mTouch[3] * tolerance) / 100)) <= parseFloat(mTarget[3]) &&
							parseFloat(mTouch[3]) + Math.abs(parseFloat((mTouch[3] * tolerance) / 100)) >= parseFloat(mTarget[3]) &&
							parseFloat(mTouch[4]) - Math.abs(parseFloat((mTouch[4] * tolerance) / 100)) <= parseFloat(mTarget[4]) &&
							parseFloat(mTouch[4]) + Math.abs(parseFloat((mTouch[4] * tolerance) / 100)) >= parseFloat(mTarget[4]) &&
							parseFloat(mTouch[5]) - Math.abs(parseFloat((mTouch[5] * tolerance) / 100)) <= parseFloat(mTarget[5]) &&
							parseFloat(mTouch[5]) + Math.abs(parseFloat((mTouch[5] * tolerance) / 100)) >= parseFloat(mTarget[5]) &&
							parseFloat(mTouch[6]) - Math.abs(parseFloat((mTouch[6] * tolerance) / 100)) <= parseFloat(mTarget[6]) &&
							parseFloat(mTouch[6]) + Math.abs(parseFloat((mTouch[6] * tolerance) / 100)) >= parseFloat(mTarget[6])
						){
							//YAY! Objects overlap.
							//Now unbind touches and fit 100%
							//$("#target").html("");
							$(document).unbind("touchmove").unbind("touchend");
							$touchable.html("")
										.css({
								"-webkit-transition": "all 0.5s ease-in-out",
								"-webkit-transform": $("#target").css("-webkit-transform"),
								"left": $("#target").css("left"),
								"top": $("#target").css("top"),
								"opacity": "0.5",
								"background":"url(img/haken.gif) 50% 50% no-repeat #A7FF85"
							});
							
						}
					}
				}
				
				var init = function (){

					
					// $("#target").css({
					// 						left: "190px",
					// 						top: "300px",
					// 						"-webkit-transform": "scale(1.7) rotate(30deg)"
					// 					});
					
						
					$("#touchable").css({
						"-webkit-transform": "translate(0px,0px) rotate(0deg) scale(1,1)",
						"left": "auto",
						"top": "auto",
						"-webkit-transition": "all 0s ease",
						"opacity": "1",
					});
					//$("#touchable").html("<p>1 Finger :: MOVE</p><p>2 Finger :: SCALE</p><p>3 Finger :: ROTATE</p>");
					//$("#target").html("<p>TARGET</p>");
				
					$('#touchable')[0].addEventListener('touchstart',function(event) {

						event.preventDefault();

						//console.log(event.originalEvent.touches.length+" Fingers, Freddy!");
						//var touches = event.originalEvent.touches || event.originalEvent.changedTouches;
						var touches = event.touches;
						
						switch (touches.length){
							case (1):
								move($("#touchable"), touches[0].pageX, touches[0].pageY, false);
							break;
							case (2):
								scale($("#touchable"), touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
							break;
							case (3):
								rotate($("#touchable"), touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
							break;
							
						}

					}, false);
				
					$('#touchable')[0].addEventListener('touchmove',function(event) {
						
						event.preventDefault();

						//console.log(event.originalEvent.touches.length+" Fingers, Freddy!");
						//var touches = event.originalEvent.touches || event.originalEvent.changedTouches;

						var touches = event.touches;
						
						switch (touches.length){
							case (1):
								move($("#touchable"), touches[0].pageX, touches[0].pageY, true);
							break;
							case (2):
								scale($("#touchable"), touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
							break;
							case (3):
								rotate($("#touchable"), touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
							break;
							
						}

					}, false);

					$('#touchable')[0].addEventListener('touchend',function(event) {
						if ($("#target").length > 0)
							isAtTarget($("#touchable"));
						event.preventDefault();

					}, false);
					
					$("#reset").click(function(){
						init();
						return false;
					});
					

				}
				
				init();
				
				

				//DEBUG IN BROWSER
				// $("#touchable").click(function(event) {
				// 	//event.preventDefault();
				// 	move($(this), event.pageX, event.pageY);
				// 
				// });
				

                
            }
        },
		'page-accelerometer': {

        	'show': function(e) {
				var $ball = $("#ball");
				var ch = $(document).height();
				var cw = $(document).width();
				
				//ball dimensions
				var ballW = $ball.width();
				var ballH = $ball.height();
				
				//start position
				// Position Variables
				var x = cw/2 - (ballW / 2);
				var y = ch/2 - (ballH / 2);
				
				$ball.css({
					'webkitTransform': 'translate3d('+x+'px, '+y+'px, 0px)'
				});

				

				// Speed - Velocity
				var vx = 0;
				var vy = 0;

				// Acceleration
				var ax = 0;
				var ay = 0;
				
				
				
				var delay = 1; //~60Hz (1000ms/16)
				var vMultiplier = 0.5;
				var bounceMultiplier = 0; //0-1
				

				window.ondevicemotion = function(event) {
					ax = event.accelerationIncludingGravity.x;
					ay = event.accelerationIncludingGravity.y;
				
				}
				
				setInterval(function() {
					if (debugInBrowser){
						//ax = Math.floor(10 + (1+(-10)-10)*Math.random());
						//ay = Math.floor(10 + (1+(-10)-10)*Math.random());
					}
					
					
					vy+= +(ay);
					vx+= - ax;

					y+= vy * vMultiplier; // Rounding removed - Omiod
					x+= vx * vMultiplier; // Rounding removed - Omiod

					if (x < 0) { 
			            x = 0;
			            vx = -vx * bounceMultiplier; 
			        }
					if (y < 0) { 
			           y = 0;
			           vy = -vy * bounceMultiplier; 
			        }
					if (x > cw - ballW) { 
			           x = cw - ballW; 
			           vx = -vx * bounceMultiplier; 
			        }
					if (y > ch - ballH) { 
			           y = ch - ballH;
			           vy = -vy * bounceMultiplier; 
			        }


			        //CCS3 3D transfroms are hardware accelerated on the iPhone/iPad, nice and smooth!
					$ball.css({
						'webkitTransform': 'translate3d('+x+'px, '+y+'px, 0px)'
					}); // added 3d Transform - REM
					//console.log("x: "+x+" y: "+y);
					//console.log("cw - x: "+(cw - x)+" ch - y: "+(ch - y));
				}, delay);
			}
		},
		'page-list': {
			'init': function(e){
				var $list = $('#page-list-list');
                var $refresh = $('#page-list-refresh');

                $list.bind('vclick', 'a.profileLink', function(e) {
                    e.preventDefault();
                    if ($list.data('refreshing')) return false;
                    
                });
                $refresh.bind('pull-refresh', function() {
					
                    setTimeout(function() {

						project.app.addMore("refresh");

                        $list.data('refreshing', false);
                    }, 200);
                });
                $refresh.bind('pull-cancel', function() {
                    setTimeout(function() {
                        $list.data('refreshing', false);
                    }, 200);
                });
                $refresh.bind('pull-pending', function() {
                    $list.data('refreshing', true);
                });
			},
			'show': function(e){
				project.app.page = 1;
				project.app.perPage = 20;
				
				project.app.addLoadButton = function() {
                    $('#page-list-list').append(
                        $('<li><a href="javascript:;" class="load-more lazyLoadTrigger"></a></li>').one("vclick", function(e) {
                            e.preventDefault();
                            //$(this).remove();
                            var $self = $(this);
                            $self.html('<li><img src="jqmobile/images/ajax-loader.png" alt="" class="ed_spinner inline_spinner" />loading more entries...</li>');
                            //eDarling.app.blockUI();
                            setTimeout(function() {
                                if (project.app.addMore()){
								
								}
                                
                                $self.remove();
                                $('#page-list-list').listview("refresh");
                                $('#page-list-list').trigger('updatelayout');

                                //eDarling.app.unblockUI();
                            }, 500);
                        })
                    );
                };
				
				
				project.app.addMore = function(option){
					if (option == "refresh"){
						$("#page-list-list").html("");
						project.app.page = 1;
					}
						
					$.jTwitter('berlin', project.app.page, function(data){
						
						for (var i=0; i<data.results.length; i++){

							if (!data.results[i]) {
								$("#page-list-list").listview("refresh");
								return false;
							}
							$("#page-list-list").append('<li><p>'+data.results[i].created_at+'</p>'+data.results[i].text+'</li>');
						}
												
						project.app.addLoadButton();
						$("#page-list-list").listview("refresh");
					});
					project.app.page++;
					return true;
				};
				
				project.app.addMore();
				
				
			}
		}
        


    },
    function(page, e, initResult) {
    	
        /* init callback */
       var footerHeight = 0;
        $(page).bind('pageshow orientationchange', function() {
            if (!debugInBrowser && !(["iPad","iPhone","iPod touch"].indexOf(device.platform) > -1 && parseInt(device.version) < 5)) {
                $('.fixed-top, .fixed-bottom', this).css({
                    'position':'fixed'
                }).each(function() {
                        if (!$(this).data('spacerElement')) {
                            $(this).data('spacerElement',$('<div></div>').css(
                                {
                                    'display': 'block',
                                    'position': 'relative'
                                }
                            ).insertAfter(this));
                        }
                        var height = $(this).height();
                        $($(this).data('spacerElement')).css({

                                    'width': $(this).css("width"),
                                    'height': $(this).css("height")
                        });
                        if ($(this).hasClass('fixed-bottom')) footerHeight += height;
                    });
            }
        });
       
    },
    function(page, e, showResult) {
        if (showResult === false) {
            $(page).hide();
            return false;
        }
        
        project.app.unblockUI();
    },
    function(page) {

		$.mobile.silentScroll(0);
        var $window = $(window);
        $window.unbind('scroll.lazyLoad');
        if ($(page).hasClass('lazyLoad')) {
            // if we could not init fixed footers, disable lazy load
            if ($($.mobile.activePage).find(":jqmData(position='fixed')").last().css('position') == 'relative') return false;
            $window.bind('scroll.lazyLoad', function() {
                var $elements = $('.lazyLoadTrigger', page);
                if ($elements.length == 0) return;
                var windowScrollBottom = $window.scrollTop() + $window.height();
                $elements.each(function() {
                    var $this = $(this);
                    if (windowScrollBottom >= $this.offset().top + ($this.height()/2)) {
                        // element scrolled half into view, trigger click!
                        $(this).trigger("vclick");
                    }
                });
            });
        }
    }
);

project.data = {
    'appDomains': {
        'de': {
            "name": "Deutschland",
            "flag": "img/flag_de.png",
            "language": "de"
        },
		'en': {
            "name": "UK",
            "flag": "img/flag_en.png",
            "language": "en"
        }
    }
};

// We need to authenticate with the sessionId whenever possible and always need to send
// the AppDomainId when communicating with the server. Let's hook into the ajax calls:
$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    // Escape the baseUrl to use it in the next expression
    var baseUrl = project.jsApi.baseUrl.replace(/[\][{}()*+?.\\^$|]/g, "\\$&");
    // match the request url against our base url
    var regex = new RegExp("^"+baseUrl+".*","m");
    if (regex.test(options.url)) {
        // the call is running to our server, attach the session id
        options.url = project.core.attachSessionId(options.url);
    }
});
// With every successful response, the server sends a user object we need to store
$(document).ajaxSuccess(function(e, xhr, settings) {
    var data = undefined;
    try {
        data = JSON.parse(xhr.responseText);
        if (data == null) data = undefined;
    } catch (e) {
        data = undefined;
    }
    if (typeof data== "object" && typeof data.u == "object") project.core.setUser(data.u);
});
// We have to handle every ajax error to evaluate if the user needs to be logged out or not
$(document).ajaxError(function(e, jqxhr, settings, exception) {
    var status = jqxhr.status;
    if (status === 0) {
        var match = /HTTP Status ([0-9]{3})/.exec(jqxhr.responseText);
        if (match != null) {
            status = parseInt(match[1]);
        }
    }
    var msg = "AJAX ERROR\n";
    msg += "Exception: " + exception + "\n";
    msg += "Status: " + status + " (" + jqxhr.status + ")\n";
    msg += "Text: " + jqxhr.responseText + "\n";
    msg += "URL: " + settings.url + "\n";
    msg += "Data: " + JSON.stringify(settings.data) + "\n";
    msg += "Headers: " + JSON.stringify(settings.headers) + "\n";
    if (settings.headers && settings.headers['Authorization']) {
        var auth = settings.headers['Authorization'].substr("Basic ".length);
        msg += "Auth: " + AffinitasJsApi.helper.base64decode(auth) + "\n";
    }

    // if there is no connection, don't process error
    if ((!debugInBrowser && Connection.NONE == navigator.network.connection.type) || !project.app.processAjaxError(status)) project.mobile.changePage('page-connect','page-connect.html');
});

/* Loader is not displayed when used in changeCallback, so we override the original function to show our loader and delay the change */
var tmpChangePage = $.mobile.changePage;
var globalChangePageTimeout = false;
$.mobile.changePage = function(toPage, options) {
	project.app.blockUI();
	
		
	if (debugInBrowser){
		$('.ui-page .ui-header, .ui-page .ui-footer').attr('style','position: fixed !important;');
		$('[data-role="content"]').attr("style","margin-top:45px !important;");
	}
		
    if (globalChangePageTimeout)
    	clearTimeout(globalChangePageTimeout);
    	
    globalChangePageTimeout = setTimeout(function() {
        tmpChangePage(toPage, options);
        project.app.unblockUI();
    }, 100);
};

var deviceReady = function() {

    document.addEventListener("searchbutton", project.app.onSearchButtonDown, false);
    document.addEventListener("menubutton", project.app.onMenuButtonDown, false);
    // ImageCache.initDatabase();
    // setTimeout(function(){
    	// ImageCache.createTables();
    // },100);
        

    // fix phonegaps strange back behaviour causing the site to close when history is emtpy:
    if (!debugInBrowser) {
        try {
        	document.addEventListener("backbutton", project.app.onBackButtonDown, false);
            window.history.back = navigator.app.origHistoryBack;
        } catch(e) {
            // fails on ios
        }
    }		
	
    $.mobile.initializePage();
};

// set to false for LIVE deployment!
if (typeof debugInBrowser == "undefined")
	var debugInBrowser = false && /chrome/.test( navigator.userAgent.toLowerCase() );
	


$(function() {

    if (!debugInBrowser && typeof navigator.device == "undefined") {
        document.addEventListener("deviceready", deviceReady, false);
    } else {
        deviceReady();
    }
    // The next line is for in-browser debugging
    if (debugInBrowser) {
        alert("DEBUG enabled.");
        $.mobile.initializePage();
    }
});

function successCallback(success) {
    project.app.alert("SUCCESS: "+success);
}


function errorCallback(error) {
    project.app.alert("Failed: " + error.code);
}

