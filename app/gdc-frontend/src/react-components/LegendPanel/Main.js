// LEGEND
// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// Import JQUERY
import $ from 'jquery';


import LegendItem from './LegendItem';
import Accordion from './Accordion';

export default class LegendPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 0,
            layers: []
        };
        this.addLegendItem = this.addLegendItem.bind(this);
        this.toggleBBOXLayer = this.toggleBBOXLayer.bind(this);
        this.toggleMarkerLayer = this.toggleMarkerLayer.bind(this);
    }

    componentDidMount() {
        // Attach listener to modify layer order on layer change

        function reloadOnMove(item) {
            this.props.mainlayermgr.reloadMapLayers()
        }
        reloadOnMove = reloadOnMove.bind(this)

        UIkit.util.on('#legend_main_container', 'moved', reloadOnMove);
    }

    addLegendItem(geonodeLayerId, bbox) {
        var tempLayers = this.state.layers;
        var item = {
            key: this.state.key,
            id: geonodeLayerId,
            bbox: bbox,
        }

        tempLayers.push(item)

        var newKey = this.state.key + 1

        this.setState({
            layers: tempLayers,
            key: newKey,
        })

        return true;
    }

    toggleBBOXLayer() {

        return true;
    }

    toggleMarkerLayer() {
        if (this.props.target_map.hasLayer(this.props.marker_layer)) {
            $(this).removeClass('selected');
            this.props.target_map.removeLayer(this.props.marker_layer);
        } else {
            this.props.target_map.addLayer(this.props.marker_layer);
            $(this).addClass('selected');
        };
        return true;
    }

    toggleBBOXLayer() {
        if (this.props.target_map.hasLayer(this.props.bbox_layer)) {
            $(this).removeClass('selected');
            this.props.target_map.removeLayer(this.props.bbox_layer);
        } else {
            this.props.target_map.addLayer(this.props.bbox_layer);
            $(this).addClass('selected');
        };
        return true;
    }

    render() {
        // the loop. it'll return array of react node.
        var legendItems = []
        if (this.state.layers !== []) {
            for (const layer of this.state.layers) {
                legendItems.push(<LegendItem domain_src={this.props.domain_src} mainlayermgr={this.props.mainlayermgr} key={layer.key} layerid={layer.key} id={layer.id} bbox={layer.bbox}></LegendItem>)
                legendItems = legendItems.reverse()
            }
        }
        return (
            <Accordion id={this.props.id} multiple="true" className="uk-padding-small uk-accordion uk-width-1-1">
                <li id={"legend-item-" + this.props.layerid} layername={this.props.layerid} className="uk-open uk-padding-small uk-background-muted">
                    <a className="uk-accordion-title uk-text-small uk-text-bolder" href="#"><span className="uk-margin-small-right uk-text-center" data-uk-icon="icon: table"></span>Extent of layers</a>
                    <div className="uk-accordion-content uk-text-small">
                        <form>
                            <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                <label className="uk-form"><input className="uk-checkbox" type="checkbox" onClick={this.toggleBBOXLayer} defaultChecked={true} />  Bounding box</label>
                            </div>
                            <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                <label className="uk-form"><input className="uk-checkbox" type="checkbox" onClick={this.toggleMarkerLayer} defaultChecked={true} />  Cluster centroids</label>
                            </div>
                        </form>
                    </div>
                </li>
                {legendItems}
            </Accordion>
        )
    }
}