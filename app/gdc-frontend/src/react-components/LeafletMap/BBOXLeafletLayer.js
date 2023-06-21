import { useSelector, shallowEqual } from "react-redux";
import { GeoJSON } from 'react-leaflet/esm/GeoJSON'
import { getGeoJSONBBOXes, getAvailableLayerReadinessStatus, getBBOXStatus } from "../../redux/selectors/MainSliceSelectors";

export default function BBOXFilterLayer(){

    const bboxLayerActive = useSelector(state => getBBOXStatus(state), shallowEqual)
    const availableLayersReadiness = useSelector(state => getAvailableLayerReadinessStatus(state), shallowEqual)
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state), shallowEqual)

    // DOM rendering for GeoJSON BBOXes
    if (availableLayersReadiness){
        if (bboxLayerActive){
            const geojsonStyle = {
                "color": "#0000FF",
                "weight": 1,
                "opacity": 0.8,
                "fillOpacity": 0,
            };
            return (<GeoJSON data={geoJSONBBOXesData} style={geojsonStyle} />)
        }
        else {
            const geojsonStyle = {
                "color": "#0000FF",
                "weight": 1,
                "opacity": 0,
                "fillOpacity": 0,
            };
            return (<GeoJSON data={geoJSONBBOXesData} style={geojsonStyle} />)
        }
    }
    else {
        return null
    }
}