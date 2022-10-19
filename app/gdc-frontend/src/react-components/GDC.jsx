// Import REACT (dynamic front-end framework)
import React from 'react';
import $ from 'jquery';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// Import JS custom functions
import { openLegendPanel} from "../js-components/PanelControl.js"
import {uuidv4, toTitleCase} from "../js-components/Utilities.js"

// Import custom images
import layerCentroidIcon from '../assets/img/layer_position_icon_blue.png'
import layerCentroidIconRed from '../assets/img/layer_position_icon.png'


// LEGEND ACCORDION
class Accordion extends React.Component {
    static UIkitComponent;

    componentDidMount() {
        this.UIkitComponent = UIkit.accordion($(this.gridElement), {
            targets: this.props.targets,
            active: this.props.active,
            collapsible: this.props.collapsible,
            multiple: this.props.multiple,
            animation: this.props.animation,
            transition: this.props.transition,
            duration: this.props.duration
        });
    }

    componentDidUpdate() {
        this.UIkitComponent.$emit(event = 'update');
    }


    componentWillUnmount() {
        this.UIkitComponent.$destroy();

    }

    render() {
        return (
            <ul
                id={this.props.id}
                className={this.props.className}
                ref={(element) => { this.gridElement = element; }}
                data-uk-sortable="handle: .uk-sortable-handle">
                {this.props.children}
            </ul>
        );
    }
}

// LEGEND
class Legend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key:0,
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

    addLegendItem(geonodeLayerId){
        var tempLayers = this.state.layers;
        var item = {
            key: this.state.key,
            id: geonodeLayerId,
        }
        
        tempLayers.push(item)

        var newKey = this.state.key + 1

        this.setState({
            layers: tempLayers,
            key: newKey,
        })

        return true;
    }

    toggleBBOXLayer(){

        return true;
    }

    toggleMarkerLayer(){
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
        if (this.state.layers !== []){
            for (const layer of this.state.layers) {
                legendItems.push(<LegendItem domain_src={this.props.domain_src} mainlayermgr={this.props.mainlayermgr} key={layer.key} layerid={layer.key} id={layer.id}></LegendItem>)
                legendItems = legendItems.reverse()
            }
        }
        return(
            <Accordion id={this.props.id} multiple="true" className="uk-padding-small uk-accordion">
                <li id={"legend-item-" + this.props.layerid} layername={this.props.layerid} className="uk-open uk-padding-small uk-background-muted">
                    <a className="uk-accordion-title uk-text-small uk-text-bolder" href="#"><span className="uk-margin-small-right uk-text-center" data-uk-icon="icon: table"></span>Extent of layers</a>
                    <div className="uk-accordion-content uk-text-small">
                        <form>
                            <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                <label className="uk-form"><input className="uk-checkbox" type="checkbox" onClick={this.toggleBBOXLayer} defaultChecked={true} />  BBOX</label>
                            </div>
                            <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                <label className="uk-form"><input className="uk-checkbox" type="checkbox" onClick={this.toggleMarkerLayer} defaultChecked={true} />  Centroids clusters</label>
                            </div>
                        </form>
                    </div>
                </li>
                {legendItems}
            </Accordion>
        )
    }
}

// LEGEND ITEMS
class LegendItem extends React.PureComponent {

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
        fetch( this.props.domain_src + "gdc/api/resource_detail/" + this.props.id + "/")
            .then(res => res.json())
            .then(
                (result) => {
                    // Getting Layer coordinates from WMS servcie
                    fetch(this.props.domain_src+"capabilities/layer/" + this.props.id + "/")
                        .then(xml_text => xml_text.text())
                        .then(
                            (xml_text) => {

                                var parser = new DOMParser();
                                var xmlDoc = parser.parseFromString(xml_text, "text/xml");
                                var coordsXML = xmlDoc.getElementsByTagName("EX_GeographicBoundingBox")[0].children
                                var bbox_coords_correct = [
                                    [parseFloat(coordsXML[2].innerHTML), parseFloat(coordsXML[0].innerHTML)],
                                    [parseFloat(coordsXML[2].innerHTML), parseFloat(coordsXML[1].innerHTML)],
                                    [parseFloat(coordsXML[3].innerHTML), parseFloat(coordsXML[1].innerHTML)],
                                    [parseFloat(coordsXML[3].innerHTML), parseFloat(coordsXML[0].innerHTML)],
                                    [parseFloat(coordsXML[2].innerHTML), parseFloat(coordsXML[0].innerHTML)],
                                ]

                                // Setting the layer polygon extent
                                var bbox_polygon = L.polygon(bbox_coords_correct)

                                // Setting the layer center marker
                                var icon = L.icon({
                                    iconSize: [30, 30],
                                    iconAnchor: [15, 15],
                                });
                                var bbox_center = L.marker(bbox_polygon.getBounds().getCenter(), { icon: icon })

                                // Setting title nicer
                                result.title = toTitleCase(result.title.replaceAll('_', ' '))

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
                            }
                        )
                },
                (error) => {
                    UIkit.notification('Error retrieving datasets results from server', 'danger');
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

            var catList = []
            // for (var i = 0; i < this.state.layerData.adb_themes.length; i++) {
            //     if (i == this.state.layerData.adb_themes.length - 1) {
            //         catList.push(<span key={this.state.layerData.adb_themes[i].code}>{this.state.layerData.adb_themes[i].name} ({this.state.layerData.adb_themes[i].code})</span>)
            //     }
            //     else {
            //         catList.push(<span key={this.state.layerData.adb_themes[i].code}>{this.state.layerData.adb_themes[i].name} ({this.state.layerData.adb_themes[i].code}),</span>)
            //     }
            // }

            return (
                <li id={"legend-item-" + this.props.layerid} layername={this.props.layerid} className="uk-open uk-padding-small uk-background-muted">
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
                        <div id={"modal_layerlegend_" + this.props.layerid} className="uk-flex-top uk-modal-container" data-uk-modal>
                            <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                                <h2 className="uk-modal-title">{this.state.layerData.title}</h2>
                                <div className="uk-flex-middle" data-uk-grid>
                                    <div className="uk-width-2-3@m uk-padding-small">
                                        <ul className="uk-iconnav">
                                            <li><a href={this.state.layerData.detail_url} data-uk-icon="icon: cloud-download" data-uk-tooltip="Download layer" target="_blank" rel="noreferrer noopener"></a></li>
                                        </ul>
                                        <p><span className="uk-text-bold">Categories: </span>{catList}</p>
                                        <p><span className="uk-text-bold uk-text-capitalize"> {this.state.layerData.date_type} date: </span> {this.state.layerData.date}</p>
                                        <p><span className="uk-text-bold">Source: </span>{this.state.layerData.raw_supplemental_information}</p>
                                        <p><span className="uk-text-bold">Description: </span>{this.state.layerData.raw_abstract}</p>
                                        <button className="uk-modal-close-default" type="button" data-uk-close></button>
                                    </div>
                                    <div className="uk-width-1-3@m uk-flex-first">
                                        <ImgPlus key={uuidv4()} src={this.state.thumbnail_url.replace('http://', window.location.protocol + '://').replace('https://', window.location.protocol + '://')} width="500" height="500" alt="Layer thumbnail"></ImgPlus>
                                    </div>
                                </div>
                            </div>
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

// FILTER - SELECT LIST
class SelectGroupTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeLevel:1,
            filter_level2: 'filter{lft.gt}=1&filter{rght.lt}=8000000&filter{level}=2&page_size=50',
            filter_level2_light: '',
            filter_level3: 'filter{lft.gt}=1&filter{rght.lt}=8000000&filter{level}=3&page_size=50',
            filter_level3_light: '',
            filterByMapExtent:true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeChk = this.handleChangeChk.bind(this);
        //this.composeFilter = this.composeFilter.bind(this);
    }

    handleChange(evt, level) {

        // Setting the new filter value
        var current_state = this.state
        
        if (evt.target.value != ''){
            var tree_range = evt.target.value.split(',')

            if (level == 1) {
                current_state['filter_level2'] = 'filter{lft.gt}=' + tree_range[0] + '&filter{rght.lt}=' + tree_range[1] + '&filter{level}=2&sort[]=name&page_size=50'
                current_state['filter_level2_light'] = evt.target.value
                this.props.mainfiltermgr.setFilter(this.props.filter_key, evt.target.value)
            }
            else if (level == 2) {
                current_state['filter_level3'] = 'filter{lft.gt}=' + tree_range[0] + '&filter{rght.lt}=' + tree_range[1] + '&filter{level}=3&sort[]=name&page_size=50'
                current_state['filter_level3_light'] = evt.target.value
                this.props.mainfiltermgr.setFilter(this.props.filter_key, evt.target.value)
            }

            current_state['treeLevel'] = level + 1

            // Set state to refresh element
            this.setState(current_state)
        }
        else {
            current_state['treeLevel'] = level
            // Set state to refresh element
            this.setState(current_state)
            if (level == 1){
                this.props.mainfiltermgr.deleteFilter(this.props.filter_key)
            }
            else if (level==2){
                this.props.mainfiltermgr.setFilter(this.props.filter_key, this.state.filter_level2_light)
            }
            else if (level ==3){
                this.props.mainfiltermgr.setFilter(this.props.filter_key, this.state.filter_level3_light)
            }
            
        }

    }

    handleChangeChk(){

        // Changing layer state
        var current_state = this.state
        current_state['filterByMapExtent'] = !current_state['filterByMapExtent']
        if(current_state['filterByMapExtent']){
            this.setState({
                treeLevel: 1,
                filter_level2: 'filter{lft.gt}=0&filter{rght.lt}=8000000&filter{level}=2&sort[]=name&page_size=50',
                filter_level3: 'filter{lft.gt}=0&filter{rght.lt}=8000000&filter{level}=3&sort[]=name&page_size=50',
                filterByMapExtent: true,
            })
        }
        else (
            this.setState(current_state)
        )

        // TODO: Refresh layer filters
        this.props.mainfiltermgr.toggleBBOXFilterActive()
        
    }
    
    render(){
        var region_filters = []

        if(!this.state.filterByMapExtent){

            region_filters.push(
                < SelectList
                    domain_src={this.props.domain_src}
                    id="region"
                    key={"1_" + this.state.tree_lft + "_" + this.state.tree_rght}
                    endpoint='api/v2/regions'
                    filter='filter{lft.gt}=0&filter{rght.lt}=8000000&filter{level}=1&sort[]=name&page_size=50'
                    level={1}
                    verbose_name='Select region'
                    handleChange={this.handleChange}>
                </SelectList >
            )

            if (this.state.treeLevel >= 2) {
                region_filters.push(
                    <SelectList 
                        domain_src={this.props.domain_src}
                        id="country"
                        key={this.state.filter_level2}
                        endpoint='api/v2/regions'
                        filter={this.state.filter_level2}
                        level={2}
                        verbose_name='Select country'
                        handleChange={this.handleChange}>
                    </SelectList>
                )
            }

            if (this.state.treeLevel >= 3) {
                region_filters.push(
                    <SelectList 
                        domain_src={this.props.domain_src}
                        id="subdivision"
                        key={this.state.filter_level3}
                        endpoint='api/v2/regions'
                        filter={this.state.filter_level3}
                        level={3}
                        verbose_name='Select subdivision'
                        handleChange={this.handleChange}>
                    </SelectList>
                )
            }
        }
        
        return (
            <div className="uk-width-1-1 uk-margin-small-bottom">   
                <div className="uk-margin-remove">
                    <label className="uk-form-small uk-padding-remove"><input className="uk-checkbox" type="checkbox" onClick={this.handleChangeChk} defaultChecked={this.state.filterByMapExtent}/> Map extent</label>
                </div>
                <div className="uk-margin-remove">
                    {region_filters}
                </div>
            </div>
        )
    }
}

class SelectList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status:'loading',
            rcode: '',
            ccode: '',
            choices: {},
        };
    } 

    componentDidMount() {
        var url = this.props.domain_src + this.props.endpoint +'/?' + this.props.filter
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        status:'ready',
                        choices:result.regions,
                    })
                },
                (error) => {
                    UIkit.notification('Error loading filter: ' + this.props.verbose_name, 'danger');
                    this.setState({
                        status: 'error',
                        error
                    });
                }
            )
    }

    render() {

        // Loading option parameters
        var list_items = []
        for (var i = 0; i < this.state.choices.length; i++) {
            var item = this.state.choices[i];
            list_items.push(<option key={item['code']} value={[item['lft'],item['rght'], item['code']]}>{item['name']}</option>)
        }
        
        if (this.state.status == 'ready'){
            return (    
                <form>
                    <fieldset className="uk-fieldset">
                        <div className="uk-margin-small-bottom">
                            <select id={this.props.id + "_filter"} className="uk-select uk-form-small" onChange={evt => this.props.handleChange(evt, this.props.level)}>
                                <option value="">{this.props.verbose_name}</option>
                                {list_items}
                            </select>
                        </div>
                    </fieldset>
                </form>
            )
        }

        else {

            return (
                <form>
                    <fieldset className="uk-fieldset">
                        <div className="uk-margin-small-bottom">
                            <p><span data-uk-spinner></span>&nbsp;&nbsp;&nbsp;Loading...</p>
                        </div>
                    </fieldset>
                </form>
            )
        }
        
    }
}

// FILTER - SELECT MULTIPLE LIST
class SelectMultipleList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
            choices: {},
        };
    }

    componentDidMount() {
        fetch(this.props.domain_src + this.props.endpoint) // '/gdc/api/adb_themes')
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        status: 'ready',
                        choices: result.categories,
                    })
                },
                (error) => {
                    UIkit.notification('Error loading filter: ' + this.props.verbose_name, 'danger');
                    this.setState({
                        status: 'error',
                        error
                    });
                }
            )
    }

    render() {

        // Loading option parameters
        var list_items = []
        if (Array.isArray(this.state.choices)){
            var choices_ordered = this.state.choices.sort((a, b) => a.position_index - b.position_index)
            for (var i = 0; i < choices_ordered.length; i++) {
                var item = choices_ordered[i];
                if (item["icon_img"] != null){
                    var icon_url = new URL(item["icon_img"])
                    icon_url = icon_url.pathname
                }
                else {
                    var icon_url = null
                }

                list_items.push(
                    <SelectMulitpleListItem mainfiltermgr={this.props.mainfiltermgr} domain_src={this.props.domain_src} key={item["identifier"]} code={item["identifier"]} parent={this.props.filter_key} icon={icon_url} name={item["gn_description"]} item_id={item["identifier"]}></SelectMulitpleListItem>
                )
            }
        }


        if (this.state.status == 'ready') {
            return (
                <div className="uk-margin-remove uk-grid-small uk-child-width-auto uk-grid uk-width-1-1">
                    {list_items}
                </div>
            )
        }

        else {

            return (
                <div className="uk-margin-remove uk-grid-small uk-child-width-auto uk-grid uk-width-1-1">
                    <p><span data-uk-spinner></span>&nbsp; Loading...</p>
                </div>
            )
        }

    }
}

// FILTER - SELECT MULTIPLE LIST ITEMS
class SelectMulitpleListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active:false,
            class:"gdc-custom-theme-icon",
        };

        this.handleClick = this.handleClick.bind(this);
    }
      
    handleClick(){
        var item_id = this.props.item_id
        var filter_parent = this.props.parent
        var filter_value_current = this.props.mainfiltermgr.url.searchParams.get(this.props.parent)

        if (this.state.active){$
            this.setState({ 
                active: false,
            })
            var filter_value = filter_value_current.split(',').filter(function (value) { return value != item_id }).toString();
        }
        // Filter ON
        else {
            //this.props.mainfiltermgr.setFilter(this.props.parent, filter_value)
            this.setState({
                active: true,
            })

            if (filter_value_current == null || filter_value_current == '' ){
                var filter_value = item_id
            }
            else {
                var filter_value = filter_value_current.split(',')
                filter_value.push(item_id)
            }
        }
        this.props.mainfiltermgr.setFilter(filter_parent, filter_value)
    }

    render() {
            
        if(this.state.active){
            var itemDom = <img className="uk-icon-image gdc-custom-theme-icon-selected" src={this.props.domain_src + this.props.icon.substring(1)} width="20px" height="20px" data-uk-svg="" ></img>
        }
        else {
            var itemDom = <img className="uk-icon-image gdc-custom-theme-icon" src={this.props.domain_src + this.props.icon.substring(1)} width="20px" height="20px" data-uk-svg="" ></img>
        }


        return (
            <div className="uk-padding-small uk-padding-remove-top uk-padding-remove-left" >
                <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid" data-uk-tooltip={this.props.name + " (" + this.props.code + ")"}>
                    <label><input onClick={this.handleClick} className="uk-checkbox" type="checkbox"></input>&nbsp; {itemDom}</label>
                </div>
                
            </div>
        )
    }
}

// FILTER - SEARCH BAR
class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    handleChange(evt) {
        const filter_key = this.props.filter_key
        const filter_value = evt.target.value;

        // Updating filter options
        if (evt.target.value == ''){
            this.props.mainfiltermgr.deleteFilter(filter_key)
        }
        else {
            this.props.mainfiltermgr.setFilter(filter_key, filter_value)
        }
    }

    render() {
        return (
            <form className="uk-search uk-search-default uk-width-1-1 uk-margin-remove">
                <span  data-uk-search-icon></span>
                <input
                    className="uk-search-input"
                    type="search"
                    placeholder={this.props.verbose_name}
                    onChange={evt => this.handleChange(evt)}>
                </input>
            </form>

        )
    }
}

// RESULTS - RESULT LIST
class ResultList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
            results:[]
        };

    }

    componentDidMount() {
        fetch(this.props.mainfiltermgr.url.toString())
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        status:'ready',
                        results:result
                    })
                },
                (error) => {
                    UIkit.notification('Error retrieving datasets results from server', 'danger');                    
                    this.setState({
                        status: 'error',
                        error
                    });
                }
            )
    }

    render() {

        var resultlist_items = []

        // Hidding and emptying bbox layer
        //this.props.target_map.removeLayer(this.props.bbox_layer);
        //this.props.target_map.removeLayer(this.props.marker_layer);
        this.props.bbox_layer.clearLayers();
        this.props.marker_layer.clearLayers();
        
        for (var i = 0; i < this.state.results.length; i++) {
            var feature = this.state.results[i];
            if (feature.geometry != null){
                // Scrolling function
                var h = "#resultitem_" + feature.properties.id

                function scrollto() {
                    console.log(h);
                    UIkit.scroll(document.getElementById(h)).scrollTo(h);
                    UIkit.util.animate(document.getElementById(h), 'uk-animation-shake', 700);
                };

                // === BBOX ===
                // Fetchning
                var geojsonbboxfeature = L.geoJSON(feature)
                // Styling
                var geojsonbboxlayer = geojsonbboxfeature.setStyle({
                    color: "blue",
                    opacity: 1,
                    weight: 1,
                    fillColor: "blue",
                    fillOpacity: 0,
                });
                // Assigning a function to scroll to the element (inside result list)
                geojsonbboxfeature.on('click', scrollto)
                // Adding geometries elements to the map
                this.props.bbox_layer.addLayer(geojsonbboxlayer)

                // === MARKER ===
                // Styling
                var icon_red = L.icon({
                    iconUrl: layerCentroidIcon,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                });
                var geojsoncenterfeature = L.marker(geojsonbboxfeature.getBounds().getCenter(), { icon: icon_red })
                // Assigning a function to scroll to the element (inside result list)
                geojsoncenterfeature.on('click', scrollto)
                // Adding geometries elements to the map
                this.props.marker_layer.addLayer(geojsoncenterfeature)


                // === REACT COMPONENTS ====
                resultlist_items.push(
                    <ResultItem key={feature.properties.pk} pk={feature.properties.pk} coords={feature.geometry.coordinates} domain_src={this.props.domain_src} target_map={this.props.target_map} marker_layer={this.props.marker_layer} target_legend={this.props.target_legend} bbox_layer={this.props.bbox_layer}></ResultItem>
                )
            }
            else {
                // === REACT COMPONENTS ====
                resultlist_items.push(
                    <ResultItem key={feature.properties.pk} pk={feature.properties.pk}  domain_src={this.props.domain_src} target_map={this.props.target_map} marker_layer={this.props.marker_layer} target_legend={this.props.target_legend} bbox_layer={this.props.bbox_layer}></ResultItem>
                )
            }
            
        }

        // Showing layer on map
        //this.props.target_map.addLayer(this.props.bbox_layer);
        //this.props.target_map.addLayer(this.props.marker_layer);
        
        var resultlist_title
        if(this.state.status == 'ready'){
            resultlist_title = <p className="uk-text-default uk-text-middle uk-margin-small-top uk-margin-small-bottom"> {this.state.results.length} Results</p>
        }
        else {
            resultlist_title = <p className="uk-text-default uk-text-middle uk-margin-small-top uk-margin-small-bottom"><span data-uk-spinner uk-spinner="ratio: 0.8" className="uk-padding-remove"></span> &nbsp; Loading results...</p>
        }

        return (
            <div className="uk-margin-small-left" >
                {resultlist_title}
                <div className="gdc-custom-scroller uk-padding-small uk-padding-remove-bottom" style={{height:'calc(100vh - 200px)'}}>
                    {resultlist_items}
                </div>
            </div>

        )
    }
}


// RESULTS - RESULT LIST ITEMS
class ImgPlus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
        };
        this.handleOnLoad = this.handleOnLoad.bind(this);
    }

    handleOnLoad(){
        this.setState({ status:'ready'})
    }

    render() {
        var spinnerDom = []

        var altText = ''
        if (this.props.alt != ''){
            var altText = this.props.alt
        }
        else {
            altText = 'Image'
        }

        if(this.state.status == 'loading'){
            spinnerDom.push(
                <p key={this.props.src} className="uk-padding-small uk-margin-remove uk-text-small"><span data-uk-spinner="ratio: 0.8"></span> &nbsp; {altText} loading...</p>
            )
        }
        else{ spinnerDom = []}

        var domRes = (
            <div className="uk-width-1-1 uk-height-1-1">
                <img src={this.props.src} onLoad={this.handleOnLoad}/>
                {spinnerDom}
            </div>
        )

        return domRes
    }

}

// RESULTS - RESULT LIST ITEMS
class ResultItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            status:'loading',
            layerData: {}
        };
        this.handleLayerAdd = this.handleLayerAdd.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    
    componentDidMount() {
        fetch(this.props.domain_src + "gdc/api/resource_detail/" + this.props.pk + "/").then(res => res.json()).then(
            (result) => {
                if (result.hasOwnProperty('success')) {
                    if (!result.success) {
                        this.setState({
                            status: 'hidden',
                            layerData: {}
                        })

                    }
                }
                else {
                    // Setting title nicer
                    result.title = toTitleCase(result.title.replaceAll('_', ' '))

                    // Setting date nicer
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    var date_refactor = new Date(result.date)
                    result.date = date_refactor.toLocaleDateString("en-US", options)

                    // Changing thumbnail URL
                    var thumbnail_url = null
                    if (result.thumbnail_url != null) {
                        try {
                            var thumbnail_url = new URL(result.thumbnail_url.toString())
                            thumbnail_url = this.props.domain_src + thumbnail_url.pathname.toString().substring(1)

                        } catch (error) {
                            console.error('Bad URL for thumbnail')
                        }

                    }
                    result.thumbnail_url = thumbnail_url

                    // Setting bbox coords
                    var bbox_coords_correct = this.props.coords
                    for (var i = 0; i < bbox_coords_correct.length; i++) {
                        var coords_old = bbox_coords_correct[i]
                        var coords_new = [coords_old[1], coords_old[0]]
                        bbox_coords_correct[i] = coords_new
                    }

                    // Setting the layer polygon extent (this shows on result hover)
                    // Red (on hover layer)
                    var bbox_polygon_red = L.polygon(bbox_coords_correct)
                    bbox_polygon_red.setStyle({
                        color: "red",
                        opacity: 1,
                        weight: 1,
                        fillColor: "red",
                        fillOpacity: 0.3,
                    });

                    // Setting the layer center marker (this shows on layer hover)
                    // Red (on hover layer)
                    var icon_red = L.icon({
                        iconUrl: layerCentroidIconRed,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                    });
                    var bbox_center_red = L.marker(bbox_polygon_red.getBounds().getCenter(), { icon: icon_red })

                    // Adding layer polygon to map
                    this.setState({
                        status: 'ready',
                        layerData: result,
                        bbox_polygon_red: bbox_polygon_red,
                        bbox_center_red: bbox_center_red,
                        thumbnail_url: thumbnail_url
                        
                    })

                }
            },
            (error) => {
                UIkit.notification('Error retrieving datasets results from server ' + toString(error), 'danger');
                this.setState({
                    status: 'error',
                    error
                });
            }
        )
    }
    
    handleLayerAdd(){
        // Add layer to legend (legend component will handle layer addition to map)
        this.props.target_legend.addLegendItem(this.props.pk)
        openLegendPanel(this.props.target_map)
    }

    handleMouseEnter() {
        // Update bbox colors to red
        if (this.state.bbox_polygon_red != null) {
            this.state.bbox_polygon_red.addTo(this.props.target_map);
            this.state.bbox_center_red.addTo(this.props.target_map);
        }
    }

    handleMouseLeave(){
        // Update bbox colors to blue
        if (this.state.bbox_polygon_red != null){
            this.state.bbox_polygon_red.remove()
            this.state.bbox_center_red.remove();
        }

        //this.state.bbox_center.remove()
    }


    render() {        
        if (this.state.status == 'ready') {

            var catList = []
            var thumbnailDOM = (<div></div>)
            if (this.state.thumbnail_url != null){
                thumbnailDOM = (
                    <div className="uk-width-1-3@m uk-flex-first">
                        <ImgPlus key={uuidv4()} src={this.state.thumbnail_url.replace('http://', window.location.protocol + '://').replace('https://', window.location.protocol + '://')} width="500" height="500" alt="Layer thumbnail"></ImgPlus>
                    </div>
                )
            }

            
            var domToRender = (
                <div id={"resultitem_"+this.props.pk} key={this.props.pk} className="uk-animation-fade uk-margin-small-bottom uk-padding-small uk-card uk-card-body gdc-custom-border uk-transition-toggle" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} >
                    <p className="uk-margin-small uk-text-small uk-text-bolder">{this.state.layerData.title}</p>
                    <ul className="uk-margin-small uk-iconnav">
                        <li><a href={"#modal_layerresult_" + this.props.pk} data-uk-tooltip="Display layer information" data-uk-icon="icon: info" data-uk-toggle=""></a></li>
                        <li><a href={this.state.layerData.detail_url} data-uk-icon="icon: cloud-download" data-uk-tooltip="Download layer" target="_blank" rel="noreferrer noopener"></a></li>
                        <li><a data-uk-icon="icon: plus" data-uk-tooltip="Add layer to map" onClick={this.handleLayerAdd}></a></li>
                    </ul>

                    <div className="uk-padding-remove uk-grid-small" data-uk-grid>
                        <p className="uk-text-justify uk-text-small">{this.state.layerData.raw_abstract.substring(0, 150)}...</p>
                    </div>

                    <div id={"modal_layerresult_" + this.props.pk} className="uk-flex-top uk-modal-container" data-uk-modal>
                        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                            <h2 className="uk-modal-title">{this.state.layerData.title}</h2>
                            <div className="uk-flex-middle" data-uk-grid>
                                <div className="uk-width-2-3@m uk-padding-small">
                                    <ul className="uk-iconnav">
                                        <li><a href={this.state.layerData.detail_url} data-uk-icon="icon: cloud-download" data-uk-tooltip="Download layer" target="_blank" rel="noreferrer noopener"></a></li>
                                    </ul>
                                    <p><span className="uk-text-bold">Categories: </span>{catList}</p>
                                    <p><span className="uk-text-bold uk-text-capitalize"> {this.state.layerData.date_type} date: </span> {this.state.layerData.date}</p>
                                    <p><span className="uk-text-bold">Source: </span>{this.state.layerData.raw_supplemental_information}</p>
                                    <p><span className="uk-text-bold">Description: </span>{this.state.layerData.raw_abstract}</p>
                                    <button className="uk-modal-close-default" type="button" data-uk-close></button>
                                </div>
                                {thumbnailDOM}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.status == 'hidden'){
            var domToRender = (
                <div key={this.props.pk} className=" uk-animation-fade uk-margin-small-bottom uk-padding-small uk-card uk-card-body gdc-custom-border" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} >
                    <p className="uk-margin-small uk-text-small uk-text-bolder uk-text-muted">Data not visible.</p>
                    <div className="uk-padding-remove uk-grid-small uk-text-muted" data-uk-grid>
                        <p className="uk-text-justify uk-text-small uk-text-muted">Insufficient permissions to access this dataset.</p>
                    </div>

                </div>
            )

        }
        else {
            var domToRender = (
                <div key={this.props.pk} className="uk-animation-fade uk-margin-small-bottom uk-padding-small uk-card uk-card-body gdc-custom-border">
                    <p className="uk-animation-fade uk-padding-small uk-text-small uk-text-bolder"><span data-uk-spinner className="uk-padding-remove"></span>&nbsp; &nbsp; &nbsp;Result loading...</p>
                </div>
            )

        }
        return domToRender
    }
}



export {Legend, SelectGroupTree, SelectMultipleList, SearchBar, ResultList} ;