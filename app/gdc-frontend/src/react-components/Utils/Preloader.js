import {setgeoJSONBBOXesReady, setGeoJSONBBOXes} from '../../redux/slices/MainSlice';
import FetchWrapper, { PaginatedDataFetcher } from './customFetch';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

export default function Preloader() {

    const [loadingProgress, setLoadingProgress] = useState([0,1])
    const [resultReady, setResultsReady] = useState(false)

    const dispatch = useDispatch()


    function handleAvailableLayersChange(availableLayers) {
        const layersWithCoords = availableLayers.filter(feature => feature.geometry.coordinates)
        const geoJSON = {
            "type": "FeatureCollection",
            "features": layersWithCoords
                
        }
        dispatch(setGeoJSONBBOXes(geoJSON))
    }

    function handleResultReadyChange(status) {
        dispatch(setgeoJSONBBOXesReady(status))
        setResultsReady(true)
    }

    useEffect(() => {
        if (!resultReady) {
            const dataFetcher = new PaginatedDataFetcher(
                process.env.REACT_APP_SITEURL + 'gdc/api/geojson/',
                handleAvailableLayersChange,
                handleResultReadyChange,
                setLoadingProgress,
                (data) => { return data }
            )
            dataFetcher.fetch()
            
            // This request authenticates the user against geoserver
            const oauth2Fetcher = new FetchWrapper(
                'geoserver/web/j_spring_oauth2_geonode_login',
                {},
                [],
                false
            )
            oauth2Fetcher.fetch()

        }
    }, [resultReady])

    return (
        <div id="preloader" className="uk-overlay-default uk-height-1-1">
            <div className="uk-position-center">
                <h3 className="uk-text-center uk-text-muted">
                    <p className="uk-text-small uk-text-bold"><span uk-spinner="ratio: 0.6"></span>&nbsp;&nbsp;&nbsp;Data loading...</p>
                    <progress id="js-progressbar" className="uk-progress" value={loadingProgress[0]} max={loadingProgress[1]} style={{height:"5px"}}></progress>
                </h3>
            </div>
        </div>
    )

}