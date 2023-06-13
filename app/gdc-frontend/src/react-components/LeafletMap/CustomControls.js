import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import "leaflet.markercluster";

// Settings for the LEGEND panel toggling control
export function createLegendPanelToggleControl(map){

    const legendPanelToggleControl = L.Control.extend({

        options: {
            position: 'topright',
        },

        onAdd: function () {
            var container = L.DomUtil.create('input', "uk-text-bolder gdc-custom-leaflet-button gdc-custom-leaflet-button-right");
            container.type = "button";
            container.title = "No cat";
            container.value = "        Legend >   ";

            container.onclick = function (e) {
                togglePanel(map, "right")
            }

            return container;
        }
    });

    return new legendPanelToggleControl()
}


// Settings for the LEGEND panel toggling control
export function createSearchPanelToggleControl(map) {

    const searchPanelToggleControl = L.Control.extend({

        options: {
            position: 'topleft',
        },

        onAdd: function () {
            var container = L.DomUtil.create('input', "uk-text-bolder gdc-custom-leaflet-button gdc-custom-leaflet-button-left");
            <a href="#" onClick={this.handleDelete} uk-icon="icon: trash"></a>
            container.type = "button";
            container.title = "No cat";
            container.value = "   < Search        ";

            container.onclick = function (e) {
                togglePanel(map, "left")
            }

            return container;
        }
    });

    return new searchPanelToggleControl()
}


// Settings for the SEARCH panel toggling control
function openLegendPanel(target_map) {
    document.getElementById("legendpanel").style.width = "16.67%"
    document.getElementById("legendpanel").style.opacity = "100"
    
}

function togglePanel(target_map, side) {
    if (side == "left") {
        if (document.getElementById("searchpanel").style.width == "0px") {
            document.getElementById("searchpanel").style.width = "33.33%"
            document.getElementById("searchpanel").style.opacity = "100"
        }
        else {
            document.getElementById("searchpanel").style.width = "0px"
            document.getElementById("searchpanel").style.opacity = "0"
        };
        
    }
    else if (side == "right") {
        if (document.getElementById("legendpanel").style.width == "0px") {
            openLegendPanel(target_map)
        }
        else {
            document.getElementById("legendpanel").style.width = "0px"
            document.getElementById("legendpanel").style.opacity = "0"
            
        };
    }
}