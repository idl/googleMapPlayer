$(function () {
    window.map = new TimeMap("map_canvas");
    window.controller = new DataController(window.RAW_DATA, window.map, 60*60*1000);
    window.speed = 300
    $('#play').on('click', play);
    $('#reset').on('click', reset);
    $('#pause').on('click', pause);
    $('#setstep').on('click', setStep);
    $('#setspeed').on('click', setSpeed)


});

//wrap all this window shit in player and boom.
function play(){

    window.interval = setInterval(function () {window.controller.step()}, window.speed);
};

function pause(){
    window.clearInterval(window.interval);
};

function reset(){
    pause()
    controller.currentStep = 0;
    for(i in controller.points){
        controller.points[i].hide();
    }
};

function setStep(){
    pause();
    reset();
    controller.millisecondsPerStep = parseFloat($('#step').val())*60*60*1000;
    controller.calculateSteps();
}

function setSpeed(){
    pause();
    window.speed = $('#speed').val()
}