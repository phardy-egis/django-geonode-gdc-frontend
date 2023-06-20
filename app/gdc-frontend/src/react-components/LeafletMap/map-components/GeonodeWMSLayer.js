import { useSelector } from "react-redux"
import { getActiveLayerStyleById } from "../../../redux/selectors/MainSliceSelectors"
import { WMSTileLayer } from 'react-leaflet/esm/WMSTileLayer'
import { parseQueryStringToDictionary } from "../../Utils/Utilities"


export default function GeonodeWMSLayer(props) {

    // Opacity selector
    const layerStyle = useSelector(state => getActiveLayerStyleById(state, props.layer.id))

    const url = new URL(props.layer.details.links.filter(link => (link.extension === 'png' && link.link_type === 'image' && link.name === 'PNG' && link.mime === 'image/png'))[0].url)
    const params = parseQueryStringToDictionary(url.search)

    // WMS Option used to display the request layer
    var wmsOptions = {
        ...params,
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
            url={process.env.REACT_APP_SITEURL + 'geoserver/ows'}
            params={wmsOptions}
            opacity={displayOpacity}>
        </WMSTileLayer>
    )
}