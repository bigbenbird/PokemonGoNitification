var time_id = 0;
var started = false;
function renderStatus(statusText) {
    console.log(statusText)
}
chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    //console.log("image intercepted: " + info.url);
    // Redirect the lolcal request to a random loldog URL.
    pokemon_id = info.url.match("[0-9]+");
    new_url = chrome.extension.getURL("pixel_icons/" + pokemon_id + ".png");
    //console.log("new url:" + new_url);
    return {redirectUrl: new_url};
  },
  // filters
  {
    urls: [
      "https://skipcdn.net/img/pokemon/small/*"
    ],
    types: ["image"]
  },
  // extraInfoSpec
  ["blocking"]);

function show_notification(max_item){
    console.log(max_item);
    if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}
    pokemon_message = filter_pokemon + " found . location is " + max_item.latitude + " , " + max_item.longitude + 
        "expires time is " + max_item.expires + " seconds\n" ;
    var opt = { 
        type : "basic",
        title : '找到了精灵',
        message: String(pokemon_message),
        iconUrl: chrome.runtime.getURL('al.png'),
        };
    expires_seconds = max_item.expires  - Date.now() / 1000;
    notification_url = String.format("notification.html?name={0}&latitude={1}&longitude={2}&expires={3}", max_item.pokemon_name, max_item.latitude, max_item.longitude, expires_seconds); 
    chrome.tabs.create({url : notification_url});
    chrome.notifications.create("0", opt, function() {});
    chrome.notifications.onClicked.addListener(function(){
        clearInterval(time_id);
        started = false;
        chrome.browserAction.setIcon({path:"gray.png"});
        console.log("close interval");
    })
}
function notification_click_listenser(max_item){

}
function network_filter(callback, errorCallback) {
    console.log("xixi  running network_filter");
    // console.log(callback);
    // console.log(errorCallback);
    var xhr = new XMLHttpRequest();
    var search_url = "https://skiplagged.com/api/pokemon.php?bounds=22.253869,113.59167,22.580134,114.980067"

    xhr.open("GET", search_url);
    xhr.onreadystatechange= function() {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            console.log("yes ready state is true");
            var data = JSON.parse(xhr.responseText);
            pokemons_list = data.pokemons;
            var max_item = null
            for(var i = 0, l = pokemons_list.length; i < l; i++)
            {
                item = pokemons_list[i];
                filter_pokemon = "Lapras";
                //filter_pokemon = "Snorlax";
                //filter_pokemon = "Dratini";
                if(item.pokemon_name == filter_pokemon)
                {
                    if(max_item == null || item.expires > max_item.expires)
                        max_item = item;
                }
            }
            if( max_item != null)
            {
                    callback(max_item)
                    return;
            }
        }
        else{
            if(xhr.status != 200)
            {
                console.log('No response from pokemon search!\t' + search_url + "\t" 
                    + xhr.status);
                return;
            }
        }
    };
    xhr.onerror = function(){
        errorCallback("Network error");
    };
    xhr.send();
}
function stop(){
    started = false;
    clearInterval(time_id);
    chrome.browserAction.setIcon({path:"gray.png"});
    console.log("close interval");
}
function start(){
    console.log("entry background script's start function")
    chrome.browserAction.setIcon({path:"rsz_1180x180.png"});
    if( started == true)
        return;
    started = true;
    time_id = setInterval(network_filter, 2500, show_notification, function(errMessage){
        renderStatus("Cannot display connect.\t" + errMessage);
    });
}
