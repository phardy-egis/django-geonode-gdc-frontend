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

    handleOnChange(){
        console.log('clicked')
    }

    render() {
        
        var iconClassName
        if (this.state.active) { iconClassName = "gdc-custom-theme-icon-selected" }
        else { iconClassName = "gdc-custom-theme-icon"}

        if (this.props.src){
            return (
                <div
                    className="uk-margin-remove-top uk-padding-remove-left"
                    uk-tooltip={"title: " + this.props.name + "; pos: top-center"} >
                    <input
                        className="uk-checkbox uk-margin-remove"
                        type="checkbox"
                        checked={this.state.active}
                        onClick={(e) => { this.handleClick() }}
                        onChange={(e) => { this.handleOnChange() }}>
                    </input>
                    <img className={"uk-icon-image uk-margin-small-left " + iconClassName} src={this.props.src} onClick={(e) => { e.preventDefault(); this.handleClick() }} data-uk-svg="" />
                </div>
            )
        }
        else {
            return (
                <div
                    className="uk-margin-remove-top uk-padding-remove-left">
                    <input
                        className="uk-checkbox uk-margin-remove"
                        type="checkbox"
                        checked={this.state.active}
                        onClick={(e) => { this.handleClick() }}
                        onChange={(e) => { this.handleOnChange() }}>
                    </input>
                    <label className="uk-form-label uk-margin-small-left">{this.props.name}</label>
                </div>
            )
        }
    }
}