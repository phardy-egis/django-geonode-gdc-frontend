import { useSelector, shallowEqual } from "react-redux";
import { getActiveLayersWithoutStyle } from "../../redux/selectors/MainSliceSelectors";
import GeonodeWMSLayer from "./GeonodeWMSLayer";

export default function GeonodeWMSLayers(){

    // geoJSONData selectors
    const activeLayers = useSelector(state => getActiveLayersWithoutStyle(state), shallowEqual )

    var layerDOM = []
    if (activeLayers.length > 0) {
        for (let index = 0; index < activeLayers.length; index++) {
            const layer = activeLayers[index];
            layerDOM.push(<GeonodeWMSLayer key={layer.id} layerid={layer.id} details={layer.details} />)
        }
    }

    return layerDOM
}