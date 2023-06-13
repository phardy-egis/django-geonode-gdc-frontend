// LEGEND
// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// Import JQUERY
import $ from 'jquery';

export default class Accordion extends React.Component {
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