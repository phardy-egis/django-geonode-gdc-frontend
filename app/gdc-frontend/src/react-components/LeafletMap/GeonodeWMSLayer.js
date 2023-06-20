import { useSelector } from "react-redux"
import { getActiveLayerById } from "../../redux/selectors/MainSliceSelectors"
import { WMSTileLayer } from 'react-leaflet/esm/WMSTileLayer'
import { openLegendPanel } from "./PanelsToggleControls"
import { useEffect, useState } from "react"



export default function GeonodeWMSLayer(props) {

    // Opacity selector
    const layer = useSelector(state => getActiveLayerById(state, layer.id))
    const [ready, setReady] = useState(false)
    const [wmsOptions] = useState({
        layers: layer.details.alternate,
        transparent: true,
        format: 'image/png',
        maxZoom: 20,
    })
    const [displayOpacity, setDisplayOpacity] = useState(1)

    const url = new URL(layer.details.links.filter(link => (link.extension === 'png' && link.link_type === 'image' && link.name === 'PNG' && link.mime === 'image/png'))[0].url)

    useEffect(() => {
        if (!ready) {
            openLegendPanel()
            setReady(true)
        }
    }, [ready])

    // Setting opacity depending on visibility and
    useEffect(() => {
        if (layer.style.visibility) {
            setDisplayOpacity(layer.style.opacity)
        }
        else {
            setDisplayOpacity(0)
        }
    }, [layer.style.visibility, layer.style.opacity])

    // DOM returned
    return (
        <WMSTileLayer
            url={url.href.split('?')[0]}
            params={wmsOptions}
            opacity={displayOpacity}>
        </WMSTileLayer>
    )
}