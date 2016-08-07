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
});
