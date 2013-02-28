
function DataController (data, map) {
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
            return (a.time-b.time); //ascending
        });
        return points;
    })(this);

    this.millisecondsPerStep = 60*1000;
    this.currentStep = 0;
    this.steps = (function(controller){
        var steps = []
        var ABS_MIN_TIME = controller.points[0].epoch
        var ABS_MAX_TIME = controller.points[controller.points.length-1].epoch
        var SIM_LENGTH = ABS_MAX_TIME - ABS_MIN_TIME;
        var SIM_STEPS = SIM_LENGTH / controller.millisecondsPerStep;
        console.log(ABS_MIN_TIME, ABS_MAX_TIME, SIM_LENGTH, SIM_STEPS)
        for(var current = ABS_MIN_TIME; current<ABS_MAX_TIME; current+=controller.millisecondsPerStep){
            step = {}
            step.points = []
            step.min_time = current;
            step.max_time = current + controller.millisecondsPerStep;
            for(i in controller.points){
                if(controller.points[i].epoch > step.min_time){
                    if(controller.points[i].epoch < step.max_time){
                        step.points.push(controller.points[i]);
                    }
                }
            }
            steps.push(step);
        }
        return steps;
    })(this);

};

DataController.prototype.step = function() {
    console.log(this.currentStep);
    var new_points = this.steps[this.currentStep].points;
    // if(this.currentStep > 0){
    //     var old_points = this.steps[this.currentStep-1].points;

    //     for(i in old_points){
    //         old_points[i].hide();
    //     }
    
    // }
    
    for(i in new_points){
        new_points[i].show()
    }
    this.currentStep += 1;
};



// DataController.prototype.play_steps = function() {
//     // for(var i = 0; i< this.steps.length; i++){
//     //     this.step();
//     //     console.log(i)
//     //     setTimeout(500);
//     // }
//     // this.step();
//     // self = this;
//     // setInterval(self.step, 500);
//     // setTimeout(function () {return;}, 500)
//     // this.play_steps();
// };

DataController.prototype.simulate_realtime = function() {
    var st
    var minTime = this.points[0].epoch;
    var maxTime = this.points[this.points.length-1].epoch;

    console.log(minTime, maxTime);
    console.log(maxTime-minTime);
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
    this.time = Date(data.our_time);
    this.epoch = Date.parse(data.our_time)
    this.marker = new google.maps.Marker({
        position: this.geo,
        title: this.user,
        map: controller.map.map,
        visible:false,
        tweet: this.body,
        time: this.time,

    }); 
    google.maps.event.addListener(this.marker, "click", function () {
        controller.map.infoWindow.setContent('<p>From: @'+this.title+'</p><p>'+this.time+'</p><p>'+this.tweet+'</p>' )
        controller.map.infoWindow.open(controller.map.map, this); 
    });
};

Point.prototype.hide = function() {
    this.marker.setOptions({visible:false})
};

Point.prototype.show = function() {
    this.marker.setOptions({visible:true})
};

