function DataController (data, target_element_id, millisecondsPerStep) {
    var self = this
    this.mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(30, -89),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById(target_element_id), this.mapOptions);
    this.infoWindow = new google.maps.InfoWindow();
    this.json = data;
    this.points = (function(controller) {
        var points = [];
        for(i in controller.json){
            var pt = new Point(controller.json[i], controller)
            if(pt.geo){
                points.push(pt);
            }
        }
        points.sort(function (a,b){
            if (a.epoch > b.epoch) return 1;
            if (a.epoch < b.epoch) return -1;
            return 0;
        });
        return points;
    })(this);

    this.millisecondsPerStep = millisecondsPerStep;
    this.currentStep = 0;
    this.calculateSteps();

};

DataController.prototype.calculateSteps = function() {
    
    var steps = []
    this.ABS_MAX_TIME = this.points[this.points.length-1].epoch.getTime()
    this.ABS_MIN_TIME = this.points[0].epoch.getTime()
    this.SIM_LENGTH = this.ABS_MAX_TIME - this.ABS_MIN_TIME;
    this.SIM_STEPS = this.SIM_LENGTH / this.millisecondsPerStep;
    for(var current = this.ABS_MIN_TIME; current<this.ABS_MAX_TIME; current+=this.millisecondsPerStep){
        step = {
            'points': [],
            'min_time': current,
            'max_time': current + this.millisecondsPerStep,
        }
        steps.push(step);
    }

    for(i in this.points){
        pt = this.points[i]
        index = Math.floor((pt.epoch.getTime()-this.ABS_MIN_TIME)/this.millisecondsPerStep)
        steps[index].points.push(pt)
    }
    
    this.steps = steps;
    

};

DataController.prototype.step = function() {
    if(this.currentStep > this.steps.length-1){
        this.reset();
    }
    
    //hide all points in the frame steps_to_last before the current frame
    if(this.currentStep >= window.steps_to_last){
        this.hidePoints(this.steps[this.currentStep-window.steps_to_last].points)
    }

    this.showPoints(this.steps[this.currentStep].points)
    this.updateDescription()
    this.currentStep += 1;
};

DataController.prototype.stepBack = function() {
    if(this.currentStep < 1){
        return
    }

    this.hidePoints(this.steps[this.currentStep].points);
    this.currentStep -= 1;
    this.showPoints(this.steps[this.currentStep].points)
    this.updateDescription()
    
};

DataController.prototype.reset = function(first_argument) {
    this.hidePoints(this.points);
    this.currentStep = 0;
};

DataController.prototype.updateDescription = function(first_argument) {
    var tmp_date = new Date(parseFloat(this.steps[this.currentStep].min_time))
    var date_string = (tmp_date.getMonth() + 1) + "/" + tmp_date.getDate() + "/" + tmp_date.getFullYear() + " " + tmp_date.getHours() + ":" + tmp_date.getMinutes() + ":" + tmp_date.getSeconds()
    var time_at = parseInt(this.currentStep*((1/this.millisecondsPerStep)*1000)*1000)
    var time_end = parseInt(this.steps.length*((1/this.millisecondsPerStep)*1000)*1000)
    var out_string = "Time: "+date_string+ " | Step: " + this.currentStep + " of " + this.steps.length + " | " + time_at + " seconds of " +time_end + " seconds. "+(time_end-time_at)+" seconds remaining";
    $('#mintime').text(out_string);
};

DataController.prototype.hidePoints = function(points) {
    for(i in points){
        points[i].hide();
    }   
};

DataController.prototype.showPoints = function(points) {
    for(i in points){
        points[i].show();
    }   
};


function Point (data, controller) {
    if(data.geo){
        this.raw_geo = JSON.parse(data.geo)
        this.geo = new google.maps.LatLng(this.raw_geo[0], this.raw_geo[1]);
    }else{
        return;
    }
    
    this.body = data.body;
    this.user = data.user__author_handle;
    this.controller = controller
    
    this.epoch = new Date(Date.parse(data.our_time))
    this.marker = new google.maps.Marker({
        position: this.geo,
        title: this.user,
        map: this.controller.map,
        visible: false,
        tweet: this.body,
        epoch: this.epoch,
    }); 
    google.maps.event.addListener(this.marker, "click", function () {
        var date_string = (this.epoch.getMonth() + 1) + "/" + this.epoch.getDate() + "/" + this.epoch.getFullYear() + " " + this.epoch.getHours() + ":" + this.epoch.getMinutes() + ":" + this.epoch.getSeconds()
        controller.infoWindow.setContent('<p>From: @'+this.title+'</p><p>'+date_string+'</p><p>'+this.tweet+'</p>' )
        controller.infoWindow.open(controller.map, this); 
    });
};

Point.prototype.hide = function() {
    this.marker.setOptions({visible:false})
};

Point.prototype.show = function() {
    this.marker.setOptions({visible:true})
};
