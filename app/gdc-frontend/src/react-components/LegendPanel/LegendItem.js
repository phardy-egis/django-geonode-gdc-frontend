import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { getActiveLayerStyleById} from '../../redux/selectors/MainSliceSelectors';
import ImgPlus from '../Utils/ImgPlus';
import { removeLayerById, setLayerOpacity, toggleLayerVisibility } from '../../redux/slices/MainSlice';
import { debounce } from 'lodash';
UIkit.use(Icons);

// LEGEND ITEM
export default function LegendItem (props) {

    // props
    // details: JSON of detail loaded from geonode API endpoint /gec/api/details/
    // layerid: ID of geonode layer

    const dispatch = useDispatch()
    const layerStyle = useSelector(state => getActiveLayerStyleById(state, props.layerid), shallowEqual)
    
    function handleZoomExtentClick() {
        return null
    }

    function handleVisibilityChange(e) {
        dispatch(
            toggleLayerVisibility(props.layerid)
        )
    }

    // Function handling layer style parameter : opacity 
    function handleOpacityChange(e) {
        dispatch(
            setLayerOpacity(
                { 
                    layerid: props.layerid,
                    opacity: (
                        e.target.value/100
                    )
                }
            )
        )
    }
    // Debounced function
    const debouncedOpacityChangeHandler = useCallback(debounce(handleOpacityChange, 50), []);

    // Function that handle layer deletion from legend
    function handleDelete() {
        dispatch(
            removeLayerById(props.layerid)
        )
    }

    var classicon = "uk-text-default"
    if (!layerStyle.visibility) {
        classicon = "uk-text-danger"
    }

    return (
        <li id={"legend-item-" + props.layerid} layername={props.layerid} className="uk-open uk-padding-small uk-background-muted uk-width-1-1">
            
            <a className="uk-accordion-title uk-text-small uk-text-bolder" href="#"><span className="uk-sortable-handle uk-margin-small-right uk-text-center" data-uk-icon="icon: table"></span>{props.title}</a>
            
            <div className="uk-accordion-content uk-text-small">
                
                <ul className="uk-iconnav">
                    <li><a data-uk-icon="icon: info" href={"#modal_layerlegend_" + props.layerid} data-uk-tooltip="title: Layer details; pos: bottom" data-uk-toggle=""></a></li>
                    <li><a href="#" onClick={handleZoomExtentClick} data-uk-icon="icon: search" data-uk-tooltip="title: Zoom to extent; pos: bottom"></a></li>
                    <li><a className={classicon} href="#" onClick={handleVisibilityChange} data-uk-icon="icon: ban" data-uk-tooltip="title: Toggle visibility; pos: bottom"></a></li>
                    <li><a href="#" onClick={handleDelete} data-uk-icon="icon: trash" data-uk-tooltip="title: Remove; pos: bottom"></a></li>
                    <li><a href={props.details.detail_url} data-uk-icon="icon: cloud-download" data-uk-tooltip="title: Download layer; pos: bottom" target="_blank" rel="noreferrer noopener"></a></li>
                </ul>

                <div className="uk-margin">
                    <input className="uk-range" type="range" min="0" max="100" step="10" defaultValue="100" onChange={debouncedOpacityChangeHandler} data-uk-tooltip={"Opacity"}></input>
                </div>

                <div data-uk-tooltip="Click to enlarge" data-uk-lightbox>
                    <a data-type="image" href={process.env.REACT_APP_SITEURL + "geoserver/ows?&LAYER=" + props.details.alternate + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&transparent=false&format=image/png&LEGEND_OPTIONS=forceLabels:on;dpi=91;"} >
                        <ImgPlus key={"thumbnail_" + props.layerid} src={process.env.REACT_APP_SITEURL + "geoserver/ows/?LAYER=" + props.details.alternate + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&transparent=true&format=image/png&LEGEND_OPTIONS=forceLabels:on;dpi=91;"} width="500" height="500" alt="Legend"></ImgPlus>
                    </a>
                </div>

            </div>

        </li>
    );
}