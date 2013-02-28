
function DataController (data, map, millisecondsPerStep) {
    var self = this
    this.map = map;
    this.json = data;
    this.points = (function(controller) {
        var points = [];
        for(i in controller.json){
            var pt = new Point(controller.json[i], controller)
            if(pt.geo){ //requires geo to be defined on the datapoint object
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
    this.steps = this.calculateSteps();

};

DataController.prototype.calculateSteps = function() {
    
    var steps = []
    var ABS_MIN_TIME = this.points[0].epoch.getTime()
    var ABS_MAX_TIME = this.points[this.points.length-1].epoch.getTime()
    var SIM_LENGTH = ABS_MAX_TIME - ABS_MIN_TIME;
    var SIM_STEPS = SIM_LENGTH / this.millisecondsPerStep;
    this.ABS_MAX_TIME = ABS_MAX_TIME
    this.ABS_MIN_TIME = ABS_MIN_TIME
    this.SIM_STEPS = SIM_STEPS
    this.SIM_LENGTH = SIM_LENGTH
    for(var current = ABS_MIN_TIME; current<ABS_MAX_TIME; current+=this.millisecondsPerStep){
        step = {}
        step.points = []
        step.min_time = current;
        step.max_time = current + this.millisecondsPerStep;
        steps.push(step);
    }

    for(i in this.points){
        pt = this.points[i]
        index = Math.floor((pt.epoch.getTime()-this.ABS_MIN_TIME)/this.millisecondsPerStep)
        
        steps[index].points.push(pt)
    }
    
    this.steps = steps;
    return steps;

};

DataController.prototype.step = function() {
    if(this.currentStep > this.steps.length-1){
        for(i in this.points){
            this.points[i].hide();
        }
        this.currentStep = 0;
    }
    
    var new_points = this.steps[this.currentStep].points;


    if(this.currentStep >= window.steps_to_last){
        var old_points = this.steps[this.currentStep-window.steps_to_last].points;

        for(i in old_points){
            old_points[i].hide();
        }
    
    }
    
    for(i in new_points){
        new_points[i].show()
    }
    var tmp_date = new Date(parseFloat(this.steps[this.currentStep].min_time))
    
    var date_string = (tmp_date.getMonth() + 1) + "/" + tmp_date.getDate() + "/" + tmp_date.getFullYear() + " " + tmp_date.getHours() + ":" + tmp_date.getMinutes() + ":" + tmp_date.getSeconds()
    var time_at = parseInt(this.currentStep*((1/this.millisecondsPerStep)*1000)*1000)
    var time_end = parseInt(this.steps.length*((1/this.millisecondsPerStep)*1000)*1000)
    var out_string = "Time: "+date_string+ " | Step: " + this.currentStep + " of " + this.steps.length + " | " + time_at + " seconds of " +time_end + " seconds. "+(time_end-time_at)+" seconds remaining";
    $('#mintime').text(out_string);
    this.currentStep += 1;

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
        map: controller.map.map,
        visible:false,
        tweet: this.body,
        epoch: this.epoch,

    }); 
    google.maps.event.addListener(this.marker, "click", function () {
        var date_string = (this.epoch.getMonth() + 1) + "/" + this.epoch.getDate() + "/" + this.epoch.getFullYear() + " " + this.epoch.getHours() + ":" + this.epoch.getMinutes() + ":" + this.epoch.getSeconds()
        controller.map.infoWindow.setContent('<p>From: @'+this.title+'</p><p>'+date_string+'</p><p>'+this.tweet+'</p>' )
        controller.map.infoWindow.open(controller.map.map, this); 
    });
};

Point.prototype.auto = function() {
    
};

Point.prototype.hide = function() {
    this.marker.setOptions({visible:false})
};

Point.prototype.show = function() {
    self = this;
    this.marker.setOptions({visible:true})
//    setTimeout(self.hide, window.display_duration)
};
