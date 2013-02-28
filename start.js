$(function () {
    window.controller = new DataController(window.RAW_DATA, "map_canvas", 60*60*1000);
    window.speed = 300
    window.steps_to_last = 24
    $('#play').on('click', play);
    $('#stepplus').on('click', stepForward);
    $('#stepminus').on('click', stepBackward);
    $('#reset').on('click', reset);
    $('#pause').on('click', pause);
    $('#setstep').on('click', setStep);
    $('#setspeed').on('click', setSpeed)
    $('#setduration').on('click', setDuration)
});

//wrap all this window shit in player and boom.
function play(){

    window.interval = setInterval(function () {window.controller.step()}, window.speed);
};

function stepForward(){
    window.controller.step();
};

function stepBackward(){
    window.controller.currentStep -= 2;
    window.controller.step();
}

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

function setDuration(){
    window.steps_to_last = $('#duration').val()
}