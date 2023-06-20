// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import LegendItem from './LegendItem';
import { getClusterStatus, getBBOXStatus, getActiveLayersOrderedIDList } from '../../redux/selectors/MainSliceSelectors';
import { toggleBBOXStatus, toggleClusterStatus } from '../../redux/slices/MainSlice';
import { useEffect, useRef } from 'react';

UIkit.use(Icons);

export default function LegendPanel(props) {

    // Allow redux dispatch function to be called
    const dispatch = useDispatch()
    const refLegendPanel = useRef(null);
    const clusterStatus = useSelector(state => getClusterStatus(state), shallowEqual)
    const bboxStatus = useSelector(state => getBBOXStatus(state), shallowEqual)
    const activeLayers = useSelector(state => getActiveLayersOrderedIDList(state), shallowEqual)

    useEffect(()=>{
        if (refLegendPanel.current) {
            // This effect enables the UIKit accordion toggling (availble onClick over "plus" button of each LegendItem) working
            const UIkitComponent = UIkit.accordion(refLegendPanel.current, {
                targets: props.targets,
                active: props.active,
                collapsible: props.collapsible,
                multiple: props.multiple,
                animation: props.animation,
                transition: props.transition,
                duration: props.duration
            });
            UIkitComponent.$emit(event = 'update');
        }
    }, [refLegendPanel.current])


    // the loop. it'll return array of react node.
    var legendItems = []
    if (activeLayers !== []) {
        for (let index = 0; index < activeLayers.length; index++) {
            const layerid = activeLayers[index];
            legendItems.push(<LegendItem key={layerid} layerid={layerid}></LegendItem>)
        }
    }

    return (
        // HTML ID is required to toggle the panel from Leaflet Map custom control
        <div className="uk-padding-remove uk-margin-remove uk-height-1-1 uk-width-1-6 gdc-custom-scroller gdc-custom-panel uk-animation-fade" id="legendpanel">            
            <ul ref={refLegendPanel} id="legend-accordion" multiple="true" className="uk-accordion uk-padding-small uk-width-1-1" data-uk-sortable="handle: .uk-sortable-handle">
                
                {/* Element that enable toggling of cluster and BBOX layers */}
                <li className="uk-open uk-padding-small uk-background-muted">
                    <a className="uk-accordion-title uk-text-small uk-text-bolder" href="#"><span className="uk-margin-small-right uk-text-center" data-uk-icon="icon: table"></span>Search panel results locations</a>
                    <div className="uk-accordion-content uk-text-small">
                        <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                            <label className="uk-form"><input className="uk-checkbox" type="checkbox" onChange={(e) => { dispatch(toggleClusterStatus(e.target.checked)) }} checked={clusterStatus} />  Centroids (center point of datasets)</label>
                        </div>
                        <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                            <label className="uk-form"><input className="uk-checkbox" type="checkbox" onChange={(e) => { dispatch(toggleBBOXStatus(e.target.checked)) }} checked={bboxStatus} />  Bounding boxes (extent rectangle for datasets)</label>
                        </div>
                    </div>
                </li>

                {/* Element that enables toggling of layers */}
                {legendItems}
            </ul>
        </div>
    )
}