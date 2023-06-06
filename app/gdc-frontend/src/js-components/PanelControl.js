// ==================================================================================================================
// ================================================PANEL TOGGLERS =================================================
// ==================================================================================================================



function followMapResize(target_map){

    function resizemap() {
        target_map.invalidateSize();
    }

    for (let i = 0; i <= 500; i = i + 10) {
        if (i > 0) {
            setTimeout(resizemap, i)
        }
    }
}

export function openLegendPanel(target_map) {
    document.getElementById("right-panel").style.width = "16.67%"
    document.getElementById("right-panel").style.opacity = "100"
    followMapResize(target_map)
}

export function togglePanel(target_map, side) {
    if (side == "left") {
        if (document.getElementById("left-panel").style.width == "0px") {
            document.getElementById("left-panel").style.width = "33.33%"
            document.getElementById("left-panel").style.opacity = "100"
        }
        else {
            document.getElementById("left-panel").style.width = "0px"
            document.getElementById("left-panel").style.opacity = "0"
        };
        followMapResize(target_map)
    }
    else if (side == "right") {
        if (document.getElementById("right-panel").style.width == "0px") {
            openLegendPanel(target_map)
        }
        else {
            document.getElementById("right-panel").style.width = "0px"
            document.getElementById("right-panel").style.opacity = "0"
            followMapResize(target_map)
        };
    }
}