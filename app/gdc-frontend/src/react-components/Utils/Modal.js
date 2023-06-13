// LEGEND
// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

export class ModalContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            layerData: null,
            dataLoaded: false
        };
        this.handleChangeModalLayer = this.handleChangeModalLayer.bind(this);
    }

    handleChangeModalLayer(selectedLayerId) {
        this.setState({
            layerId: selectedLayerId
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.layerId !== this.state.layerId) {
            if (this.props.layerId) {
                fetch(process.env.REACT_APP_SITEURL + "gdc/api/resource_detail/" + this.props.layerId + "/", { importance: "low" })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            this.setState({
                                dataLoaded: true,
                                layerData: result,
                            })
                        },
                        (error) => {
                            UIkit.notification('Error fetching data for region filter ' + this.props.verbose_name, 'danger');
                        }
                    )
            }
        }
    }

    render() {
        if (this.state.dataLoaded) {
            var thumbnailDOM = (<div></div>)
            if (this.state.thumbnail_url != null) {
                thumbnailDOM = (
                    <div className="uk-width-1-3@m uk-flex-first">
                        <ImgPlus key={uuidv4()} src={this.state.thumbnail_url} width="500" height="500" alt="Layer thumbnail"></ImgPlus>
                    </div>
                )
            }

            return (
                <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                    <h2 className="uk-modal-title">{this.state.layerData.title}</h2>
                    <div className="uk-flex-middle" data-uk-grid>
                        <div className="uk-width-2-3@m uk-padding-small">
                            <ul className="uk-iconnav">
                                <li><a href={this.state.layerData.detail_url} data-uk-icon="icon: cloud-download"
                                    data-uk-tooltip="Download layer" target="_blank" rel="noreferrer noopener"></a></li>
                            </ul>
                            <p><span className="uk-text-bold uk-text-capitalize"> {this.state.layerData.date_type} date: </span>
                                {this.state.layerData.date}</p>
                            <p><span className="uk-text-bold">Source: </span>{this.state.layerData.raw_supplemental_information}</p>
                            <p><span className="uk-text-bold">Description: </span>{this.state.layerData.raw_abstract}</p>
                            <button className="uk-modal-close-default" type="button" data-uk-close></button>
                        </div>
                        {thumbnailDOM}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                    <p>Data loading</p>
                </div>
            )
        }
    }
}