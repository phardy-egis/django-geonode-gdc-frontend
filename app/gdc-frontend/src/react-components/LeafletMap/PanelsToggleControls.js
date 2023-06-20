import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import "leaflet.markercluster";
import { useMap } from 'react-leaflet/esm/hooks'
import { useState, useEffect } from 'react';


// import { createLegendPanelToggleControl, createSearchPanelToggleControl } from './CustomControls';


// Settings for the LEGEND panel toggling control
export function createLegendPanelToggleControl(map) {

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
                togglePanel("right")
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
                togglePanel("left")
            }

            return container;
        }
    });

    return new searchPanelToggleControl()
}


// Settings for the SEARCH panel toggling control
export function openLegendPanel() {
    document.getElementById("legendpanel").style.width = "16.67%"
    document.getElementById("legendpanel").style.opacity = "100"

}

function togglePanel(side) {
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
            openLegendPanel()
        }
        else {
            document.getElementById("legendpanel").style.width = "0px"
            document.getElementById("legendpanel").style.opacity = "0"

        };
    }
}

// This function renders a Spinner control showing the loading state of the layer
export default function PanelsToggleControls() {

    const map = useMap()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!ready) {
            map.addControl(createLegendPanelToggleControl(map));
            map.addControl(createSearchPanelToggleControl(map));
            map.addControl(new L.Control.loading());
            setReady(true)
        }

    }, [ready])

    return null
}