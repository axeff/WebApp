function JsApi(baseUrl, localStorageKey) {
    if (typeof localStorageKey == "undefined" || localStorageKey == null) localStorageKey = 'AffinitasJsApiData';

    this.localStorageKey = localStorageKey;
    this.baseUrl = baseUrl;

    this.getData = function(field) {
        if (typeof this.data == "undefined") {
            var data = undefined;
            try {
                data = localStorage.getItem(this.localStorageKey);
                if (data) data = JSON.parse(data);
                if (data == null) data = undefined;
            } catch (e) {
                data = undefined;
            }
            if (typeof data == "undefined" || data == null) {
                data = {
                    'username' : '',
                    'password' : '',
                };
            }
            this.data = data;
        }
        return (typeof field != "undefined" && field != null) ? this.data[field] : this.data;
    };
    this.setData = function(field, value) {
        if (typeof value != "undefined" && value != null) {
            this.data[field] = value;
        } else {
            this.data = field;
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
    };
    this.clearData = function() {
        this.data = undefined;
        localStorage.removeItem(this.localStorageKey);
    };
    this.dataIsComplete = function() {
        var data = this.getData();
        return (typeof data.username != "undefined" && data.username != null && data.username != '' &&
                typeof data.password != "undefined" && data.password != null && data.password != '');
    };

    this.request = function(settings) {
        var config = $.extend(true, {
            'baseUrl' : this.baseUrl,
            'path' : '',
            'data' : {},
            'async': false,
            'global': true,
            'method' : 'GET',
            'timeout' : 15000,
            'success' : function(data, status) {
            },
            'error' : function() {
            },

        }, settings);
        var result = null;
        $.ajax({
            async : config.async,
            cache : false,
            global : config.global,
            url : config.baseUrl + config.path,
            type : config.method,
            data : config.data,
            headers : config.header,
            timeout : config.timeout,
            success : function(data, status) {
                result = data;
                config.success(data, status);
            },
            error : function() {
                config.error();
            }
        });
        return config.async || result;
    };
    this.get = function(path, data) {
        if (typeof data == undefined) data = {};
        return this.request({
            path : path,
            data : data,
            method : 'GET'
        });
    };
    this.post = function(path, data) {
        if (typeof data == undefined) data = {};
        return this.request({
            path : path,
            data : data,
            method : 'POST'
        });
    };
    this.remove = function(path, data) { /*should be named delete, but causes naming-convention problems*/
        if (typeof data == undefined) data = {};
        return this.request({
            path : path,
            data : data,
            method : 'DELETE'
        });
    };

    this.upload = function(settings) {
        var config = $.extend(true, {
            'baseUrl' : this.baseUrl,
            'path' : '',
            'data' : {},
            'file' : '',
            'options' : {
                'fileKey' : 'file',
                'mimeType' : 'text/plain'
            },
            'success' : function(data, status) {
            },
            'error' : function(error) {
            }
        }, settings);

        var options = new FileUploadOptions();
        $.each(config.options, function(field, value) {
            options[field] = value;
        });
        options.params = config.data;

        var ft = new FileTransfer();

        ft.upload(
            config.file,
            config.baseUrl + config.path,
            function(successResponse) {
                return config.success(successResponse.response, successResponse.responseCode);
            },
            function(errorResponse) {
                switch (errorResponse) {
                    case FileTransferError.FILE_NOT_FOUND_ERR:
                        return config.error('FILE_NOT_FOUND_ERR');
                    case FileTransferError.INVALID_URL_ERR:
                        return config.error('INVALID_URL_ERR');
                    case FileTransferError.CONNECTION_ERR:
                        return config.error('CONNECTION_ERR');
                }
                return config.error('UNKNOWN_ERR');
            },
            options
        );
    };
};
JsApi.helper = {
    'stringToBytes': function(g) {
        for (var i = [], h = 0; h < g.length; h++) i.push(g.charCodeAt(h) & 255);
        return i
    },
    'bytesToBase64': function(g) {
        for (var i = [], h = 0; h < g.length; h += 3) for (var a = g[h] << 16 | g[h + 1] << 8 | g[h + 2], b = 0; b < 4; b++) h * 8 + b * 6 <= g.length * 8 ? i.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a >>> 6 * (3 - b) & 63)) : i.push("=");
        return i.join("")
    },
    'base64encode': function(g) {
        return AffinitasJsApi.helper.bytesToBase64(AffinitasJsApi.helper.stringToBytes(g));
    },
    'bytesToString': function (h) {
        for (var g = [], i = 0; i < h.length; i++) g.push(String.fromCharCode(h[i]));
        return g.join("")
    },
    'base64ToBytes': function (h) {
            for (var h = h.replace(/[^A-Z0-9+\/]/ig, ""), g = [], i = 0, a = 0; i < h.length; a = ++i % 4) a != 0 && g.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h.charAt(i - 1)) & Math.pow(2, -2 * a + 8) - 1) << a * 2 | "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h.charAt(i)) >>> 6 - a * 2);
            return g
    },
    'base64decode': function(g) {
        return AffinitasJsApi.helper.bytesToString(AffinitasJsApi.helper.base64ToBytes(g));
    },
    'sha1': function(a) {function e(a){a=a.replace(/\r\n/g,"\n");var b="";for(var c=0;c<a.length;c++){var d=a.charCodeAt(c);if(d<128){b+=String.fromCharCode(d)}else if(d>127&&d<2048){b+=String.fromCharCode(d>>6|192);b+=String.fromCharCode(d&63|128)}else{b+=String.fromCharCode(d>>12|224);b+=String.fromCharCode(d>>6&63|128);b+=String.fromCharCode(d&63|128)}}return b}function d(a){var b="";var c;var d;for(c=7;c>=0;c--){d=a>>>c*4&15;b+=d.toString(16)}return b}function c(a){var b="";var c;var d;var e;for(c=0;c<=6;c+=2){d=a>>>c*4+4&15;e=a>>>c*4&15;b+=d.toString(16)+e.toString(16)}return b}function b(a,b){var c=a<<b|a>>>32-b;return c}var f;var g,h;var i=new Array(80);var j=1732584193;var k=4023233417;var l=2562383102;var m=271733878;var n=3285377520;var o,p,q,r,s;var t;a=e(a);var u=a.length;var v=new Array;for(g=0;g<u-3;g+=4){h=a.charCodeAt(g)<<24|a.charCodeAt(g+1)<<16|a.charCodeAt(g+2)<<8|a.charCodeAt(g+3);v.push(h)}switch(u%4){case 0:g=2147483648;break;case 1:g=a.charCodeAt(u-1)<<24|8388608;break;case 2:g=a.charCodeAt(u-2)<<24|a.charCodeAt(u-1)<<16|32768;break;case 3:g=a.charCodeAt(u-3)<<24|a.charCodeAt(u-2)<<16|a.charCodeAt(u-1)<<8|128;break}v.push(g);while(v.length%16!=14)v.push(0);v.push(u>>>29);v.push(u<<3&4294967295);for(f=0;f<v.length;f+=16){for(g=0;g<16;g++)i[g]=v[f+g];for(g=16;g<=79;g++)i[g]=b(i[g-3]^i[g-8]^i[g-14]^i[g-16],1);o=j;p=k;q=l;r=m;s=n;for(g=0;g<=19;g++){t=b(o,5)+(p&q|~p&r)+s+i[g]+1518500249&4294967295;s=r;r=q;q=b(p,30);p=o;o=t}for(g=20;g<=39;g++){t=b(o,5)+(p^q^r)+s+i[g]+1859775393&4294967295;s=r;r=q;q=b(p,30);p=o;o=t}for(g=40;g<=59;g++){t=b(o,5)+(p&q|p&r|q&r)+s+i[g]+2400959708&4294967295;s=r;r=q;q=b(p,30);p=o;o=t}for(g=60;g<=79;g++){t=b(o,5)+(p^q^r)+s+i[g]+3395469782&4294967295;s=r;r=q;q=b(p,30);p=o;o=t}j=j+o&4294967295;k=k+p&4294967295;l=l+q&4294967295;m=m+r&4294967295;n=n+s&4294967295}var t=d(j)+d(k)+d(l)+d(m)+d(n);return t.toLowerCase()}
};