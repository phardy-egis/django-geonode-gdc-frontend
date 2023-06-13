// LEGEND
// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);


// FILTER - SELECT MULTIPLE LIST
export default class SelectMultipleList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
            choices: {},
        };
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_SITEURL + this.props.endpoint, { importance: "high" }) // '/gdc/api/adb_themes')
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        status: 'ready',
                        choices: result,
                    })
                },
                (error) => {
                    UIkit.notification('Error fetching data for region filter ' + this.props.verbose_name, 'danger');
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
        if (Array.isArray(this.state.choices)) {
            var choices_ordered = this.state.choices.sort((a, b) => a.position_index - b.position_index)
            for (var i = 0; i < choices_ordered.length; i++) {
                var item = choices_ordered[i];
                if (item["icon_img"] != null) {
                    var icon_url = new URL(item["icon_img"])
                    icon_url = icon_url.pathname
                }
                else {
                    var icon_url = null
                }

                list_items.push(
                    <SelectMulitpleListItem mainfiltermgr={this.props.mainfiltermgr} domain_src={process.env.REACT_APP_SITEURL} key={item["identifier"]} code={item["identifier"]} parent={this.props.filter_key} icon={icon_url} name={item["gn_description"]} item_id={item["identifier"]}></SelectMulitpleListItem>
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
