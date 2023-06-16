// Import REACT (dynamic front-end framework)
import React, { useState } from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import FetchWrapper from '../Utils/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { addLayer } from '../../redux/slices/MainSlice';
import { layerExists } from '../../redux/selectors/MainSliceSelectors';
import L from 'leaflet';
UIkit.use(Icons);

export default function ResultItem(props) {
    const [layerLoading, setLayerLoading] = useState(false)
    const layerLoaded = useSelector(state => layerExists(state, props.layerid))
    const dispatch = useDispatch()

    function handleLayerAdd(id){
        setLayerLoading(true)
        const dataFetcher = new FetchWrapper('gdc/api/details/' + id + '/')
        dataFetcher.fetch()
            .then((res) => res.json())
            .then((details) => {
                // Adding layer to REDUX store
                dispatch(
                    addLayer({
                        id: id,
                        details: details,
                        bbox: props.geojson
                    })
                )
                // Removing the loading spinner
                setLayerLoading(false)
            })
            .catch(function (error) {
                UIkit.notification(`Error. ${error}`, { status: 'danger' })
            });
    }

    // This conditionnal block determines the status of layer addition button
    var layerAddButtonDom = null
    if (!layerLoading){
        if(layerLoaded){
            layerAddButtonDom = (
                <li>
                    <a data-uk-icon="icon: check" data-uk-tooltip="Layer already displayed" aria-disabled="true"></a>
                </li>
            )
        }
        else{
            layerAddButtonDom = (
                <li>
                    <a data-uk-icon="icon: plus" data-uk-tooltip="Add layer to map" onClick={() => { handleLayerAdd(props.properties.pk) }}></a>
                </li>
            )
        }
    }
    else {
        layerAddButtonDom = (
            <li>
                <a><span data-uk-spinner="ratio: 0.6"></span></a>
            </li>
        )
    }

    return (
        <div className='uk-padding-remove uk-margin-remove uk-transition-toggle' tabIndex="0">
            <div className="uk-animation-fade uk-margin-small-top uk-margin-small-bottom uk-padding-small uk-card uk-card-body gdc-custom-border uk-transition-toggle uk-transition-scale-up uk-overflow-hidden" >
                <p className="uk-margin-small uk-text-small uk-text-bolder">{props.properties.title}</p>
                <ul className="uk-margin-small uk-iconnav">
                    <li><a href="#mainmodal" data-uk-tooltip="Display layer information" data-uk-icon="icon: info"></a></li>
                    <li><a href={process.env.REACT_APP_SITEURL + props.properties.detail_url} data-uk-icon="icon: cloud-download" data-uk-tooltip="Download layer" target="_blank" rel="noreferrer noopener"></a></li>
                    {layerAddButtonDom}
                </ul>
                <div className="uk-padding-remove">
                    <p className="uk-text-justify uk-text-small">{props.properties.abstract}</p>
                </div>
            </div>
        </div>

    )
}