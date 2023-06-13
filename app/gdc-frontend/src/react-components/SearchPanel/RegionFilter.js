// LEGEND
// Import REACT (dynamic front-end framework)
import React from 'react';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// FILTER - SELECT LIST
export default class RegionFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeLevel: 1,
            filter_level2: 'filter{lft.gt}=1&filter{rght.lt}=8000000&filter{level}=2&page_size=50',
            filter_level2_light: '',
            filter_level3: 'filter{lft.gt}=1&filter{rght.lt}=8000000&filter{level}=3&page_size=50',
            filter_level3_light: '',
            filterByMapExtent: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeChk = this.handleChangeChk.bind(this);
    }

    // Function triggered when region is selected
    handleChange(evt, level) {

        // Setting the new filter value
        var current_state = this.state

        if (evt.target.value != '') {
            var tree_range = evt.target.value.split(',')

            if (level == 1) {
                current_state['filter_level2'] = 'filter{lft.gt}=' + tree_range[0] + '&filter{rght.lt}=' + tree_range[1] + '&filter{level}=2&sort[]=name&page_size=50'
                current_state['filter_level2_light'] = evt.target.value
            }
            else if (level == 2) {
                current_state['filter_level3'] = 'filter{lft.gt}=' + tree_range[0] + '&filter{rght.lt}=' + tree_range[1] + '&filter{level}=3&sort[]=name&page_size=50'
                current_state['filter_level3_light'] = evt.target.value
            }

            current_state['treeLevel'] = level + 1

            // Set state to refresh element
            this.setState(current_state)
        }
        else {
            current_state['treeLevel'] = level
            // Set state to refresh element
            this.setState(current_state)
        }

    }

    // Function triggered when map extend is selected
    handleChangeChk() {

        // Changing layer state
        var current_state = this.state
        current_state['filterByMapExtent'] = !current_state['filterByMapExtent']
        if (current_state['filterByMapExtent']) {
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
    }

    render() {
        var region_filters = []

        if (!this.state.filterByMapExtent) {

            region_filters.push(
                < SelectList
                    id="region"
                    key={"1_" + this.state.tree_lft + "_" + this.state.tree_rght}
                    endpoint='api/v2/regions'
                    filter='filter{lft.gt}=0&filter{rght.lt}=8000000&filter{level}=1&sort[]=name&page_size=50'
                    level={1}
                    verbose_name='Region'>
                </SelectList >
            )

            if (this.state.treeLevel >= 2) {
                region_filters.push(
                    <SelectList
                        id="country"
                        key={this.state.filter_level2}
                        endpoint='api/v2/regions'
                        filter={this.state.filter_level2}
                        level={2}
                        verbose_name='Country'>
                    </SelectList>
                )
            }

            if (this.state.treeLevel >= 3) {
                region_filters.push(
                    <SelectList
                        id="subdivision"
                        key={this.state.filter_level3}
                        endpoint='api/v2/regions'
                        filter={this.state.filter_level3}
                        level={3}
                        verbose_name='Subdivision'>
                    </SelectList>
                )
            }
        }

        return (
            <div className="uk-width-1-1">
                <div className="uk-margin-remove">
                    <label className="uk-form-small uk-padding-remove">
                    <input className="uk-checkbox" type="checkbox" onClick={this.handleChangeChk} defaultChecked={this.state.filterByMapExtent}/> Map extent</label>
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
            status: 'loading',
            rcode: '',
            ccode: '',
            choices: {},
        };
    }

    componentDidMount() {
        var url = process.env.REACT_APP_SITEURL + this.props.endpoint + '/?' + this.props.filter
        fetch(url, { importance: "high" })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        status: 'ready',
                        choices: result.regions,
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
        for (var i = 0; i < this.state.choices.length; i++) {
            var item = this.state.choices[i];
            list_items.push(<option key={item['id']} value={item['id']}>{item['name']}</option>)
        }

        if (this.state.status == 'ready') {
            return (
                <fieldset className="uk-fieldset">
                    <select className="uk-select uk-form-small" onChange={evt => this.props.handleChange(evt, this.props.level)}>
                        <option value="">{this.props.verbose_name}</option>
                        {list_items}
                    </select>
                </fieldset>
            )
        }

        else {

            return (
                <fieldset className="uk-fieldset">
                    <p className='uk-text-small uk-margin-small-top'><span data-uk-spinner="ratio: 0.6"></span>&nbsp;Loading...</p>
                </fieldset>
            )
        }

    }
}
