function TimeMap(target_element_id) {
    this.mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(30, -89),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById(target_element_id), this.mapOptions);
    this.infoWindow = new google.maps.InfoWindow();

}

function SMTASMap(){
      this.mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(30, -89),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById(target_element_id), this.mapOptions);
    this.infoWindow = new google.maps.InfoWindow();
    this.tweets = tweets;
    this.markers = [];
    this.markerClusterer;

    this.attachClusterControl();


    this.placeMarkers();
    this.clusterMap();
};

SMTASMap.prototype.attachClusterControl = function() {
    var clusterControlDiv = document.createElement('div');
    var homeControl = new ClusterControl(clusterControlDiv, this);

    homeControlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(homeControlDiv);
};

SMTASMap.prototype.clusterMap = function () {
    this.markerClusterer.addMarkers(this.markers);
};

SMTASMap.prototype.unclusterMap = function() {
    this.markerClusterer.clearMarkers();

    for (var i = 0; i < this.markers.length; i++) { 
        this.markers[i].setOptions({map: this.map, visible:true});
    }
};

SMTASMap.prototype.placeMarkers = function() {
  //iterate over json data that's already been initialized.
  for(i in this.tweets){
    var url = data[i][3];
    var pts = data[i][1].substring(1,data[i][1].length-1).split(', ');
    var location = new google.maps.LatLng(pts[0], pts[1]);        
    var sender = 'From: <a href="http://twitter.com/#!/'+data[i][2]+'">' + data[i][2] + '</a><p> ' + data[i][0].replace("\\'", "'").replace('\\"', '"')+'</p>';

    var marker = new google.maps.Marker({
      position: location,
      title: url,
      map: map,
      sender:sender
  }); 

    google.maps.event.addListener(marker, "click", function () {

      var surl = 'http://api.screenshotmachine.com/?key=e89582&size=m&url=' + this.title

      if (this.title.trim() != ''){
        iw.setContent('<a href="'+this.title+'"><img src="'+surl+'"  /></a><p>'+ this.sender+'</p>' )
        iw.open(map, this); 
    }
    else{
        iw.setContent('<p>'+ this.sender+'</p>' )
        iw.open(map, this); 
    }
});

    this.markers.push(marker);
}
};
