// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// FILTER - SELECT MULTIPLE LIST ITEMS
export default class IconCheckBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleClick() {
        this.setState({
            active: !this.state.active,
        })        
    }

    handleOnChange(e){
        if (this.props.onChange){
            this.props.onChange(e)
        }
    }

    render() {
        
        var iconClassName
        if (this.state.active) { iconClassName = "gdc-custom-theme-icon-selected" }
        else { iconClassName = "gdc-custom-theme-icon"}

        if (this.props.src){
            return (
                <div
                    className="uk-margin-small-top uk-padding-remove-left uk-flex uk-flex-center uk-width-1-2@l"
                    uk-tooltip={"title: " + this.props.name + "; pos: top-center"} >
                    <div className='uk-width-1-2@l'>
                        <input
                            className="uk-checkbox uk-margin-remove"
                            type="checkbox"
                            checked={this.state.active}
                            onClick={(e) => { this.handleClick() }}
                            onChange={(e) => { this.handleOnChange() }}>
                        </input>&nbsp;
                    </div>
                    <div className='uk-width-1-2@l'>
                        <img className={"uk-icon-image uk-margin-remove " + iconClassName} src={this.props.src} onClick={(e) => { e.preventDefault(); this.handleClick(e) }} data-uk-svg="" />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div
                    className="uk-margin-small-top uk-margin-small-bottom uk-flex uk-flex-center uk-width-1-2@l">
                    <input
                        className="uk-checkbox uk-margin-remove"
                        type="checkbox"
                        checked={this.state.active}
                        onClick={(e) => { this.handleClick() }}
                        onChange={(e) => { this.handleOnChange() }}>
                    </input>
                    <label className="uk-form-label">{this.props.name}</label>
                </div>
            )
        }
    }
}