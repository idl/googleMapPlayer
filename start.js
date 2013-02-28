$(function () {
    window.map = new TimeMap("map_canvas");
    window.controller = new DataController(window.RAW_DATA, window.map);

    
});

function play_steps(){
    setInterval(function () {window.controller.step()}, 300);
};