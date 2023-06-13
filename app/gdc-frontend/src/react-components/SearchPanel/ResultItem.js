// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

export default class ResultItem extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="uk-animation-fade uk-margin-small-top uk-margin-small-bottom uk-padding-small uk-card uk-card-body gdc-custom-border uk-transition-toggle" >
                <p className="uk-margin-small uk-text-small uk-text-bolder">{this.props.title}</p>
                <ul className="uk-margin-small uk-iconnav">
                    <li><a href="#mainmodal" data-uk-tooltip="Display layer information" data-uk-icon="icon: info"></a></li>
                    <li><a href="/" data-uk-icon="icon: cloud-download" data-uk-tooltip="Download layer" target="_blank" rel="noreferrer noopener"></a></li>
                    <li><a data-uk-icon="icon: plus" data-uk-tooltip="Add layer to map"></a></li>
                </ul>
                <div className="uk-padding-remove">
                    <p className="uk-text-justify uk-text-small">{this.props.abstract}</p>
                </div>
            </div>
        )
    }
}