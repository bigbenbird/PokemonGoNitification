$(function(){
	var bgp = chrome.extension.getBackgroundPage();
	if( bgp == null){
		console.log("getBackgroundPage is null");
		return;
	}
	$('#start_btn').click(function(){
		console.log(bgp)
		bgp.start();
	});
	$('#stop_btn').click(function(){
		bgp.stop();
	});
	$('#options_btn').click(function(){
		chrome.tabs.create({url : "options.html"});
	});
	pokemon_array=chrome.storage.sync.get(["pokemon_list"], function(items) {
      		console.log('Settings retrieved', pokemon_array);
    	});
	$("#status").append("<ul></ul>");
	for(var i in pokemon_array) {
    		var li = "<li>";
    		$("ul").append(li.concat(pokemon_array[i]))
    	}
});
