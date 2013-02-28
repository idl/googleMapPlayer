function TimeMap(target_element_id) {
    this.mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(30, -89),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById(target_element_id), this.mapOptions);
    this.infoWindow = new google.maps.InfoWindow();

}


// SMTASMap.prototype.attachClusterControl = function() {
//     var clusterControlDiv = document.createElement('div');
//     var homeControl = new ClusterControl(clusterControlDiv, this);

//     homeControlDiv.index = 1;
//     this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(homeControlDiv);
// };

// SMTASMap.prototype.clusterMap = function () {
//     this.markerClusterer.addMarkers(this.markers);
// };

// SMTASMap.prototype.unclusterMap = function() {
//     this.markerClusterer.clearMarkers();

//     for (var i = 0; i < this.markers.length; i++) { 
//         this.markers[i].setOptions({map: this.map, visible:true});
//     }
// };
