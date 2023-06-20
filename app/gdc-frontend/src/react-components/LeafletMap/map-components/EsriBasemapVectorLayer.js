import { vectorBasemapLayer } from "esri-leaflet-vector";
import { useMap } from 'react-leaflet/esm/hooks'
import { useState } from 'react';
import { useEffect } from 'react';


// This function renders the background layer inside the map
export default function EsriVectorBasemapLayer(props) {

    const map = useMap()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!ready) {
            const apiKey = props.apiKey
            const backgroundPane = map.getPane(props.pane);
            const esriBasemap = vectorBasemapLayer("ArcGIS:Imagery:Standard", {
                apiKey: apiKey,
                pane: backgroundPane,
            })
            esriBasemap.addTo(map)
            map.invalidateSize()
            setReady(true)
        }
    })
    return null
}