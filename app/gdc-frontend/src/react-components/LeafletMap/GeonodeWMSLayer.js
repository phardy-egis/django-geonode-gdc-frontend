import { useSelector } from "react-redux"
import { getActiveLayerStyleById } from "../../../redux/selectors/MainSliceSelectors"
import { WMSTileLayer } from 'react-leaflet/esm/WMSTileLayer'
import { openLegendPanel } from "./PanelsToggleControls"
import { useEffect, useState } from "react"


export default function GeonodeWMSLayer(props) {

    // Opacity selector
    const layerStyle = useSelector(state => getActiveLayerStyleById(state, props.layer.id))
    const [ready, setReady] = useState(false)

    const url = new URL(props.layer.details.links.filter(link => (link.extension === 'png' && link.link_type === 'image' && link.name === 'PNG' && link.mime === 'image/png'))[0].url)

    useEffect(()=>{
        if(!ready){
            openLegendPanel()
            setReady(true)
        }
    }, [ready])

    // WMS Option used to display the request layer
    var wmsOptions = {
        layers: props.layer.details.alternate,
        transparent: true,
        format: 'image/png',
        maxZoom: 20,
    }

    // Setting opacity depending on visibility and 
    var displayOpacity
    if (layerStyle.visibility) {
        displayOpacity = layerStyle.opacity
    }
    else {
        displayOpacity = 0
    }

    // DOM returned
    return (
        <WMSTileLayer
            url={url.href.split('?')[0]}
            params={wmsOptions}
            opacity={displayOpacity}>
        </WMSTileLayer>
    )
}