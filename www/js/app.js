project.app = {
    'logout': function() {
        project.jsApi.setData('password','');
        project.core.clearUser();
        project.mobile.changePage('page-startup', 'index.html');
    },
    'alert': function(text, title, data) {
        var language = project.core.getLanguage();
        if (debugInBrowser) {
            alert(title+"\n"+text);
        } else {
            navigator.notification.alert(title+"\n"+text);
        }

    },
    'blockUI': function() {

    },
    'unblockUI': function() {
       
    },
    'scrollTo': function (elementId){
    	var headerHeight = $('.fixed-top').css('position') === 'relative' ? 0 : $('.fixed-top').outerHeight(); 
    	$('html,body').animate({scrollTop: eval($(elementId).offset().top-headerHeight)}, 1000, "swing");
    	return false;
    },
    'processAjaxError': function(status) {
        // return true to prevent auto-redirect to startup
        switch (status) {
        	case 0:
        		//project.app.alert("common.ajax.error.default.text","common.ajax.error.default.title",{"status":status});
        		project.app.unblockUI();
				break;
            case 401:
                project.jsApi.setData('password','');
                project.core.clearUser();
                project.app.alert("common.ajax.error.401.text","common.ajax.error.401.title");
                break;
            case 404:
                project.app.alert("common.ajax.error.default.text","common.ajax.error.default.title",{"status":status});
                break;
			case 500:
                project.app.alert("common.ajax.error.500.text","common.ajax.error.500.title");
				project.app.unblockUI();
				project.mobile.changePage('page-dashboard', 'page-dashboard.html');
                break;
            case 502:
                project.app.alert("common.ajax.error.502.text","common.ajax.error.502.title");
                break;
            case 560:
                project.app.alert("common.ajax.error.560.text","common.ajax.error.560.title");
                break;
            default:
                project.jsApi.setData('password','');
                project.core.clearUser();
                project.app.alert("common.ajax.error.default.text","common.ajax.error.default.title",{"status":status});
                break;
        }
        return false;
    },
    'onSearchButtonDown': function() {
        project.mobile.changePage('page-dashboard', 'page-dashboard.html');
    },
    'onMenuButtonDown': function() {

       project.mobile.changePage('page-dashboard', 'page-dashboard.html');
       
    },
    'onBackButtonDown': function() {
        window.history.back();
    },
    'addLoadButton': function(target) {
 	
    	self = this;
        $('#page-' + target + '-list').append(
            $('<li class="lazyloadWrap"><a href="javascript:;" class="load-more lazyLoadTrigger"><img src="jqmobile/images/ajax-loader.png" alt="" class="spinner"/><h3>lade weitere ...</h3></a></li>').one('click', function(e) {
                e.preventDefault();
                //$(this).remove();
                var $self = $(this);
                //$self.html('<li class="lazyloadWrap"><a href="javascript:;" class="load-more lazyLoadTrigger"><h3>lade weitere Nachrichten...</h3></a></li>');
                //eDarling.app.blockUI();
                setTimeout(function() {
                    if (self.addList(true)) {
                        self.addLoadButton();
                    }
                    
                    $self.remove();
                    $('#page-' + target + '-list').listview("refresh");
                    //eDarling.app.unblockUI();
                }, 100);
            })
        );
        $('#page-' + target + '-list').listview("refresh");
    },
       


};