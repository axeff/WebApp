// wrapper for "core" functions (data storage...)
project.core = {
	'getAppDomainId' : function() {
		if( typeof project.data.appDomainId == "undefined") {
			var data = undefined;
			try {
				data = localStorage.getItem('betterDateAppDomainId');
			} catch (e) {
				data = undefined;
			}
			if( typeof data != "undefined" && data == null)
				data = undefined;
			project.data.appDomainId = data;
		}
		return project.data.appDomainId;
	},
	'setAppDomainId' : function(appDomainId) {
		project.data.appDomainId = appDomainId;
		localStorage.setItem('betterDateAppDomainId', appDomainId);
	},
	'clearAppDomainId' : function() {
		project.data.appDomainId = undefined;
		localStorage.removeItem('betterDateAppDomainId');
	},
	'getUser' : function(field) {
		if( typeof project.data.user == "undefined") {
			var data = undefined;
			try {
				data = localStorage.getItem("betterDateAppUser")
				if(data)
					data = JSON.parse(data);
				if(data == null)
					data = undefined;
			} catch (e) {
				data = undefined;
			}
			project.data.user = data;
		}
		if( typeof field != "undefined" && field != null) {
			if( typeof project.data.user != "undefined" && typeof project.data.user[field] != "undefined")
				return project.data.user[field];
			return undefined;
		}
		return ( typeof project.data.user != "undefined") ? project.data.user : undefined;
	},
	'setUser' : function(field, value) {
		if( typeof project.data.user == "undefined")
			project.data.user = {};
		if( typeof value != "undefined" && value != null) {
			project.data.user[field] = value;
		} else {
			project.data.user = field;
		}

		if(project.data.user.l) {
			project.core.setAppDomainId(project.data.user.l);
		}
		localStorage.setItem("betterDateAppUser", JSON.stringify(project.data.user));
	},
	'clearUser' : function() {
		CacheProxy.clear;
		project.data.user = undefined;
		localStorage.removeItem("betterDateAppUser");
		this.clearSearchParams();
		return localStorage.getItem("betterDateAppUser") ? false : true;
	},
	'getSearchParams' : function() {
		return project.jsApi.getData('searchParams') ? JSON.parse(project.jsApi.getData('searchParams')) : {};
	},
	'setSearchParams' : function(params) {
		project.jsApi.setData('searchParams', JSON.stringify(params));
	},
	'clearSearchParams' : function() {
		project.jsApi.setData('searchParams', '');
	},
	'attachSessionId' : function(aUrl) {
		var sid = project.core.getUser('sid');
		return aUrl + (( typeof sid == "undefined") ? '?sid=' : '?sid=' + sid);
	},
	'getLanguage' : function() {

		if( typeof project.core.getAppDomainId() == "undefined") {
			project.core.setAppDomainId("de");
		}
		var appDomainId = project.core.getAppDomainId();
		return project.data.appDomains[appDomainId].language;
	},
};
