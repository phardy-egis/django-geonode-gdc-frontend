// LEGEND
// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// LEGEND ITEM
export default class LegendItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            status: 'loading',
            hidden: false,
        };
        this.style = {
            opacity: 100,
            opacityOld: 100,
        };
        // Adding "this" var to custom functions
        this.handleZoomExtentClick = this.handleZoomExtentClick.bind(this);
        this.handleHideClick = this.handleHideClick.bind(this);
        this.handleOpacityChange = this.handleOpacityChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }


    handleZoomExtentClick() {
        var polygon = this.state.bbox
        this.props.mainlayermgr.parentMap.fitBounds(polygon.getBounds());
    }

    handleHideClick() {
        this.props.mainlayermgr.toggleMapLayerVisibility(this.props.layerid)
        if (this.state.hidden) {
            this.setState({
                status: 'ready',
                hidden: false,
            })
        }
        else {
            this.setState({
                status: 'ready',
                hidden: true,
            })
        }
    }

    handleOpacityChange(event) {
        if (!this.state.hidden) {
            this.props.mainlayermgr.setLayerOpacity(this.props.layerid, event.target.value)
        }
    }

    handleDelete() {
        this.props.mainlayermgr.removeMapLayer(this.props.layerid)
        this.setState({
            status: 'deleted',
        });
    }

    componentDidMount() {
        const bbox = this.props.bbox
        fetch(this.props.domain_src + "gdc/api/resource_detail/" + this.props.id + "/", { importance: "low" })
            .then(res => res.json())
            .then(
                (result) => {
                    // Setting the layer polygon extent
                    var bbox_polygon = bbox

                    // Setting the layer center marker
                    var icon = L.icon({
                        iconSize: [30, 30],
                        iconAnchor: [15, 15],
                    });
                    var bbox_center = L.marker(bbox_polygon.getBounds().getCenter(), { icon: icon })

                    // Setting title nicer
                    //result.title = toTitleCase(result.title.replaceAll('_', ' '))

                    // Setting date nicer
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    var date_refactor = new Date(result.date)
                    result.date = date_refactor.toLocaleDateString("en-US", options)

                    // Getting thumbnail depending on custom thumbnail availability
                    if (result.curatedthumbnail != null) {
                        var thumbnail_url = this.props.domain_src + result.curatedthumbnail.thumbnail_url.toString()
                    }
                    else {
                        var thumbnail_url = result.thumbnail_url
                    }

                    // Getting proper legend URL
                    result.detail_url = this.props.domain_src + result.detail_url.toString()

                    // Loading layer
                    this.props.mainlayermgr.addMapLayer(result.alternate, this.props.layerid)


                    // Zoom to layer
                    this.props.mainlayermgr.parentMap.fitBounds(bbox_polygon.getBounds());

                    // Changing state of react component
                    this.setState({
                        status: 'ready',
                        layerData: result,
                        bbox: bbox_polygon,
                        bbox_center: bbox_center,
                        thumbnail_url: thumbnail_url
                    })
                },
                (error) => {
                    UIkit.notification('Error fetching data from server to load layer', 'danger');
                    this.setState({
                        status: 'error',
                        error
                    });
                }
            )
    }

    render() {

        if (this.state.hidden) {
            var classicon = "uk-text-danger"
        }
        else {
            var classicon = "uk-text-default"
        }

        if (this.state.status == 'ready') {


            return (
                <li id={"legend-item-" + this.props.layerid} layername={this.props.layerid} className="uk-open uk-padding-small uk-background-muted uk-width-1-1">
                    <a className="uk-accordion-title uk-text-small uk-text-bolder" href="#"><span className="uk-sortable-handle uk-margin-small-right uk-text-center" data-uk-icon="icon: table"></span>{this.state.layerData.title}</a>
                    <div className="uk-accordion-content uk-text-small">
                        <ul className="uk-iconnav">
                            <li><a data-uk-icon="icon: info" href={"#modal_layerlegend_" + this.props.layerid} data-uk-tooltip="title: Layer details; pos: bottom" data-uk-toggle=""></a></li>
                            <li><a href="#" onClick={this.handleZoomExtentClick} data-uk-icon="icon: search" data-uk-tooltip="title: Zoom to extent; pos: bottom"></a></li>
                            <li><a className={classicon} href="#" onClick={this.handleHideClick} data-uk-icon="icon: ban" data-uk-tooltip="title: Toggle visibility; pos: bottom"></a></li>
                            <li><a href="#" onClick={this.handleDelete} data-uk-icon="icon: trash" data-uk-tooltip="title: Remove; pos: bottom"></a></li>
                            <li><a href={this.state.layerData.detail_url} data-uk-icon="icon: cloud-download" data-uk-tooltip="title: Download layer; pos: bottom" target="_blank" rel="noreferrer noopener"></a></li>
                        </ul>
                        <div className="uk-margin">
                            <input className="uk-range" type="range" min="0" max="100" step="10" defaultValue="100" onChange={this.handleOpacityChange} data-uk-tooltip={"Opacity"}></input>
                        </div>
                        <div data-uk-tooltip="Click to enlarge" data-uk-lightbox>
                            <a data-type="image" href={this.props.domain_src + "geoserver/ows?&LAYER=" + this.state.layerData.alternate + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&transparent=false&format=image/png&LEGEND_OPTIONS=forceLabels:on;dpi=91;"} >
                                <ImgPlus key={uuidv4()} src={this.props.domain_src + "geoserver/ows?&LAYER=" + this.state.layerData.alternate + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&transparent=true&format=image/png&LEGEND_OPTIONS=forceLabels:on;dpi=91;"} width="500" height="500" alt="Legend"></ImgPlus>
                            </a>
                        </div>
                    </div>
                </li>);
        }
        else if (this.state.status == 'loading') {
            return (
                <li id={"legend-item-" + this.props.layerid} layername={this.props.layerid} className="uk-open uk-background-muted uk-padding-small">
                    <a className="uk-accordion-title uk-text-small uk-text-secondary" href="#"><div data-uk-spinner></div>&nbsp;&nbsp;&nbsp;Loading...</a>
                    <div className="uk-accordion-content uk-text-small">
                        <p><span data-uk-spinner className="uk-padding"></span>&nbsp;&nbsp;&nbsp;Data loading...</p>
                    </div>
                </li>
            )
        }
        else {
            return null
        }
    }

}