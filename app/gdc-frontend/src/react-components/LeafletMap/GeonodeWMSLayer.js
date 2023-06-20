import { shallowEqual, useSelector } from "react-redux"
import { getActiveLayerStyleById } from "../../redux/selectors/MainSliceSelectors"
import { WMSTileLayer } from 'react-leaflet/esm/WMSTileLayer'
import { openLegendPanel } from "./PanelsToggleControls"
import { useEffect, useState } from "react"



export default function GeonodeWMSLayer(props) {

    // Opacity selector
    const layerStyle = useSelector(state => getActiveLayerStyleById(state, props.layerid), shallowEqual)
    const [ready, setReady] = useState(false)
    const [wmsOptions] = useState({
        layers: props.details.alternate,
        transparent: true,
        format: 'image/png',
        maxZoom: 20,
    })
    const [displayOpacity, setDisplayOpacity] = useState(1)

    const url = new URL(props.details.links.filter(link => (link.extension === 'png' && link.link_type === 'image' && link.name === 'PNG' && link.mime === 'image/png'))[0].url)

    useEffect(() => {
        if (!ready) {
            openLegendPanel()
            setReady(true)
        }
    }, [ready])

    // Setting opacity depending on visibility and
    useEffect(() => {
        console.log('opacity updated on layer')
        console.log(props.layerid)
        if (layerStyle.visibility) {
            setDisplayOpacity(layerStyle.opacity)
        }
        else {
            setDisplayOpacity(0)
        }
    }, [layerStyle.visibility, layerStyle.opacity])

    // DOM returned
    return (
        <WMSTileLayer
            key={props.layerid}
            url={url.href.split('?')[0]}
            params={wmsOptions}
            opacity={displayOpacity}>
        </WMSTileLayer>
    )
}