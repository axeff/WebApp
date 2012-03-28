Date.prototype.format=function(format){var returnStr='';var replace=Date.replaceChars;for(var i=0;i<format.length;i++){var curChar=format.charAt(i);if(i-1>=0&&format.charAt(i-1)=="\\"){returnStr+=curChar}else if(replace[curChar]){returnStr+=replace[curChar].call(this)}else if(curChar!="\\"){returnStr+=curChar}}return returnStr};Date.replaceChars={shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],longMonths:['January','February','March','April','May','June','July','August','September','October','November','December'],shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],longDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],d:function(){return(this.getDate()<10?'0':'')+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?'st':(this.getDate()%10==2&&this.getDate()!=12?'nd':(this.getDate()%10==3&&this.getDate()!=13?'rd':'th')))},w:function(){return this.getDay()},z:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((this-d)/86400000)}, W:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((((this-d)/86400000)+d.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?'0':'')+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),0).getDate()},L:function(){var year=this.getFullYear();return(year%400==0||(year%100!=0&&year%4==0))},o:function(){var d=new Date(this.valueOf());d.setDate(d.getDate()-((this.getDay()+6)%7)+3);return d.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(''+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?'am':'pm'},A:function(){return this.getHours()<12?'AM':'PM'},B:function(){return Math.floor((((this.getUTCHours()+1)%24)+this.getUTCMinutes()/60+this.getUTCSeconds()/ 3600) * 1000/24)}, g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?'0':'')+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?'0':'')+this.getHours()},i:function(){return(this.getMinutes()<10?'0':'')+this.getMinutes()},s:function(){return(this.getSeconds()<10?'0':'')+this.getSeconds()},u:function(){var m=this.getMilliseconds();return(m<10?'00':(m<100?'0':''))+m},e:function(){return"Not Yet Supported"},I:function(){return"Not Yet Supported"},O:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+'00'},P:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+':00'},T:function(){var m=this.getMonth();this.setMonth(0);var result=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,'$1');this.setMonth(m);return result},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1000}};

[].indexOf || (Array.prototype.indexOf = function(v, n) {
    n = (n == null) ? 0 : n;
    var m = this.length;
    for (var i = n; i < m; i++)
        if (this[i] == v)
            return i;
    return -1;
});

;(function($) {
$.fn.multiVal = function(glue) {
    var values = [];
	this.each(function(i, obj) {
		var val = $(obj).val();
        if (val.length > 0) values.push(val);
	});
    if (typeof glue == "undefined" || glue == null) return values;
    if (values.length == 0) return '';
	return values.join(glue);
};
})(jQuery);

//Linked List
function LinkedList() {}
LinkedList.prototype = {
  length: 0,
  first: null,
  last: null
};
LinkedList.prototype.append = function(node) {
  if (this.first === null) {
  	
    node.prev = node;
    node.next = node;
    this.first = node;
    this.last = node;
  } else {
  	
    node.prev = this.last;
    node.next = this.first;
    this.first.prev = node;
    this.last.next = node;
    this.last = node;
  }
  this.length++;
};
LinkedList.prototype.insertAfter = function(node, nextNode) {
  nextNode.prev = node;
  nextNode.next = node.next;
  node.next.prev = nextNode;
  node.next = nextNode;
  if (nextNode.prev == this.last) { this.last = nextNode; }
  this.length++;
};
LinkedList.prototype.remove = function(node) {
  if (this.length > 1) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    if (node == this.first) { this.first = node.next; }
    if (node == this.last) { this.last = node.prev; }
  } else {
    this.first = null;
    this.last = null;
  }
  node.prev = null;
  node.next = null;
  this.length--;
};
LinkedList.Node = function(data) {
  this.prev = null; this.next = null;
  this.data = data;
};


console.screen = function(msg, key){

	self = this;
	this.output = function(msg, key) {
		
		if (typeof msg == "object"){
			$.each(msg, function(ikey, value){
				console.log(ikey);
				self.output(value, ikey);
			});
			$('#debugWindowContent').prepend("<p style='margin:0;'>Object:</p>");
		} else {
			var output = typeof key == "undefined" ? msg : key+": "+msg;
			$('#debugWindowContent').prepend("<p style='margin:0;'>"+ output +"</p>");
		}
	};
	
	if ($("#debugWindow").length == 0){
		$("body").prepend("<div style='display: none;font-size: 10px;width: 200px;height: 120px;border-top: 1px solid white;border-left: 1px solid white;opacity: 0.8;background-color: black;position: fixed;right: 0;bottom: 0;z-index: 10000;color: white;border-top-left-radius: 10px 10px;-moz-border-radius-topleft: 10px 10px;padding: 5px;overflow-y:scroll;' id='debugWindow'></div>");
		var $clear = $("<a style='color:white;float: right;' href='#'>clear log</a>");
		$clear.tap(function(){$('#debugWindowContent').html("");return false;}); 
		$('#debugWindow').html("<h4 style='border-bottom: 1px solid white;margin-top: 0px;'>Debug Window (tap to close)</h4>").prepend($clear);
		if (typeof gitCommitCount != "undefined")
			$('#debugWindow').append("<div id='gitHead' style='font-size:10px;border-bottom: 1px dotted white'>GIT HEAD: "+gitCommitCount+"</div>");
		$('#debugWindow').append("<div style='clear: left;font-size: 9px;' id='debugWindowContent'></div>");
		$('#debugWindow').tap(function(){
			$(this).hide("fast");
			return false;
		});
		$('#debugWindow').show("fast");
	}else {
		$('#gitHead').hide("fast");
	}
	$('#debugWindow').show();
	this.output(msg);


}

