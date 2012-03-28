function Mobile(pages, initCallback, showCallback, changeCallback, pageContainer) {

//  pages is an object like this:
//    {
//        'page-id-1': {
//            'init': function(e) { // optional
//                // page is initialized (set up event listeners here...)
//            },
//            'show': function(e) { // optional
//                // page is about to be shown (load data / update view here...)
//            }
//        },
//        'page-id-2': {} // All pages MUST be defined, even if they are empty. They can't be loaded otherwise
//    }

    this.pages = pages;

    // initCallback will be triggered after the page's init function. initResult is the init function's return value.
    if (typeof initCallback == "undefined" || initCallback == null) initCallback = function(page, e, initResult) {
    };
    this.initCallback = initCallback;
    // showCallback will be triggered after the page's show function. showResult is the show function's return value.
    if (typeof showCallback == "undefined" || showCallback == null) showCallback = function(page, e, showResult) {
    };
    this.showCallback = showCallback;
    // changeCallback will be triggered before the page will be changed.
    if (typeof changeCallback == "undefined" || changeCallback == null) changeCallback = function(page, e) {
    };
    this.changeCallback = changeCallback;

    this.getPageObject = function(page) {
        if (typeof page == "string") return this.pages[page];
        return this.pages[$(page).attr("id")];
    }

    this.getParams = function(page) {
        var pageObject = this.getPageObject(page);
        return (typeof pageObject.params != "undefined") ? pageObject.params : {};
    }

    this.setParams = function(page, params) {
    	var pageObject = this.getPageObject(page);
        pageObject.params = params;
    }

    this.isInitialized = function(pageObject) {
        return (typeof pageObject.initialized != "undefined" && pageObject.initialized);
    }

    this.initPage = function(page, e) {
        var pageObject = this.getPageObject(page);
        if (!this.isInitialized(pageObject)) {
            pageObject.initialized = true;
            this.initCallback(page, e, (typeof pageObject.init == "function") ? pageObject.init.call(page, e) : null);
        }
        this.showCallback(page, e, (typeof pageObject.show == "function") ? pageObject.show.call(page, e) : null);
    };
    this.changePage = function(pageId, url, params, settings, forceReload) {
    	if (typeof forceReload == "undefined") forceReload = false;
    	if (typeof settings == "undefined") settings = {};
        if (typeof url == "object" && typeof params == "undefined") {
            params = url;
            url = undefined;
        }
        if (typeof params != "undefined") this.setParams(pageId, params);
		
		
		var destination = (typeof url == "undefined") ? $('#' + pageId) : url /*+'&ui-page='+pageId // DOES NOT WORK AT ALL */;
        
        if (forceReload) {
        	if (typeof params != "undefined") this.setParams("page-temp", $.extend(params, {'destinationPageId': pageId, 'destinationUrl': destination}));
        	$.mobile.changePage("page-temp.html", settings);
        }	
        else
        	$.mobile.changePage(destination, settings);
    }
    this.removePage = function(page, e) {
        var pageObject = this.getPageObject(page);
        pageObject.initialized = false;
    };
    this.updatePage = function(params, triggerChangeCallback) {
        var page =  $.mobile.activePage;
        var pageId = $(page).attr("id");
        if (typeof params != "undefined") {
            this.setParams(pageId, params);
        }
        if (typeof triggerChangeCallback != "undefined" && triggerChangeCallback) this.changeCallback(page, {});
        var self = this;
        setTimeout(function() {
            self.initPage(page, {});
        }, 100);

    };

    var pageSelector = '';
    $.each(pages, function(pageId, pageFunctions) {
        pageSelector += (pageSelector != '' ? ', ' : '') + '#' + pageId;
    });

    var self = this;

    $(pageSelector).live(
        'pagebeforeshow',
        function(e) {
            self.initPage(this, e);
        });


    $(pageSelector).live(
        'pageremove',
        function(e) {
            self.removePage(this, e);
        });

    if (typeof pageContainer == "undefined" || pageContainer == null) pageContainer = 'body';
    this.pageContainer = pageContainer;
    $(pageContainer).live(
        'pagebeforechange',
        function(e, data) {
            self.changeCallback(data.toPage, e);
        });
}

