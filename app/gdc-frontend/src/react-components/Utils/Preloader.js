import {setAvailableLayersReady, setGeoJSONBBOXes} from '../../redux/slices/MainSlice';
import { PaginatedDataFetcher } from './customFetch';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

export default function Preloader() {

    const [loadingProgress, setLoadingProgress] = useState(0)
    const [resultReady, setResultsReady] = useState(false)

    const dispatch = useDispatch()


    function handleAvailableLayersChange(availableLayers) {
        const layersWithCoords = availableLayers.filter(feature => feature.geometry.coordinates)
        const geoJSON = {
            "type": "FeatureCollection",
            "features": layersWithCoords
                
        }
        console.log(geoJSON)
        dispatch(setGeoJSONBBOXes(geoJSON))
    }

    function handleResultReadyChange(status) {
        dispatch(setAvailableLayersReady(status))
        setResultsReady(true)
        console.log('results ready')
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
        }
    }, [resultReady])

    return (
        <div id="preloader" className="uk-overlay-default uk-height-1-1">
            <div className="uk-position-center">
                <h3 className="uk-text-center uk-text-muted">
                    <span uk-spinner="ratio: 2"></span>
                </h3>
            </div>
        </div>
    )

}