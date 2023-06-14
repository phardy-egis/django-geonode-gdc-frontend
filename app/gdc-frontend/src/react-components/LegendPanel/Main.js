// LEGEND
// Import REACT (dynamic front-end framework)
import React, { useState } from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// Import JQUERY
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux'
import LegendItem from './LegendItem';
import Accordion from './Accordion';
import { getClusterStatus, getBBOXStatus, getActiveGeonodeLayers } from '../../redux/selectors/MainSliceSelectors';
import { toggleBBOXStatus, toggleClusterStatus } from '../../redux/slices/MainSlice';

export default function LegendPanel(props) {

    // Allow redux dispatch function to be called
    const dispatch = useDispatch()
    const clusterStatus = useSelector(state => getClusterStatus(state))
    const bboxStatus = useSelector(state => getBBOXStatus(state))
    const activeGeonodeLayers = useSelector(state => getActiveGeonodeLayers(state))

    // the loop. it'll return array of react node.
    var legendItems = []
    if (activeGeonodeLayers !== []) {
        for (const layer of activeGeonodeLayers) {
            legendItems.push(<LegendItem key={layer.key} layerid={layer.key} id={layer.id} bbox={layer.bbox}></LegendItem>)
            legendItems = legendItems.reverse()
        }
    }
    return (
        <Accordion id="legned-accordion" multiple="true" className="uk-padding-small uk-accordion uk-width-1-1">
            
            {/* Element that enable toggling of cluster and BBOX layers */}
            <li className="uk-open uk-padding-small uk-background-muted">
                <a className="uk-accordion-title uk-text-small uk-text-bolder" href="#"><span className="uk-margin-small-right uk-text-center" data-uk-icon="icon: table"></span>Extent of layers</a>
                <div className="uk-accordion-content uk-text-small">
                    <form>
                        <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                            <label className="uk-form"><input className="uk-checkbox" type="checkbox" onChange={(e) => { dispatch(toggleClusterStatus(e.target.checked)) }} checked={clusterStatus} />  Cluster centroids</label>
                        </div>
                        <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                            <label className="uk-form"><input className="uk-checkbox" type="checkbox" onChange={(e) => { dispatch(toggleBBOXStatus(e.target.checked)) }} checked={bboxStatus} />  Bounding box</label>
                        </div>
                    </form>
                </div>
            </li>

            {/* Element that enables toggling of layers */}
            {legendItems}

        </Accordion>
    )
}