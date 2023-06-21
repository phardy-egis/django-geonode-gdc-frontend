import { useSelector, shallowEqual } from "react-redux";
import { GeoJSON } from 'react-leaflet/esm/GeoJSON'
import { getGeoJSONBBOXes, getAvailableLayerReadinessStatus, getBBOXStatus, getSearchLayerIDs } from "../../redux/selectors/MainSliceSelectors";

export default function BBOXFilterLayer(){

    const bboxLayerActive = useSelector(state => getBBOXStatus(state), shallowEqual)
    const availableLayersReadiness = useSelector(state => getAvailableLayerReadinessStatus(state), shallowEqual)
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state), shallowEqual)
    const searchLayerIDs = useSelector(state => getSearchLayerIDs(state), shallowEqual)

    function setStyle(feature) {
        if(searchLayerIDs.includes(feature.properties.pk)){
            return {
                "color": "#0000FF",
                "weight": 1.2,
                "opacity": 1,
                "fillOpacity": 0,
            }
        }
        else {
            return {
                "color": "#FF0000",
                "weight": 1.2,
                "opacity": 0,
                "fillOpacity": 0,
            }
        }
    }

    // DOM rendering for GeoJSON BBOXes
    console.log('GeoJSON rendered')
    if (availableLayersReadiness){
        if (bboxLayerActive){
            return (
                <GeoJSON data={geoJSONBBOXesData} style={setStyle} />
            )
        }
        else {
            const geojsonStyle = {
                "color": "#0000FF",
                "weight": 1,
                "opacity": 0,
                "fillOpacity": 0,
            };
            return (
                <GeoJSON data={geoJSONBBOXesData} style={geojsonStyle}/>
            )
        }
    }
    else {
        return null
    }
}