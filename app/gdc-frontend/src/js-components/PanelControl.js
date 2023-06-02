// ==================================================================================================================
// ================================================PANEL TOGGLERS =================================================
// ==================================================================================================================

export function openLegendPanel(target_map) {
    document.getElementById("right-panel").style.width = "16.67%"
    document.getElementById("right-panel").style.opacity = "100"
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
    }
    else if (side == "right") {
        if (document.getElementById("right-panel").style.width == "0px") {
            document.getElementById("right-panel").style.width = "16.67%"
            document.getElementById("right-panel").style.opacity = "100"
        }
        else {
            document.getElementById("right-panel").style.width = "0px"
            document.getElementById("right-panel").style.opacity = "0"
        };
    }
}