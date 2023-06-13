// Import REACT (dynamic front-end framework)
import React from "react";

// Import UIKIT (front-end css framework)
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons);

// React components
import IconCheckBox from "./IconCheckBox";
import ResultItem from "./ResultItem";
import RegionFilter from "./RegionFilter";

export default class SearchPanel extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            searchMode:"map_extend",
            filters: {
                search: "",
                regions: [],
                categories: [],
            },
            options:{
                regions: [],
                categories: [],
            }

        }
    }

    componentWillMount(){

    }

    render(){

        return (
            <div className="uk-card uk-card-default uk-card-body uk-height-1-1 uk-width-1-1 uk-padding-small">
                
                {/* Form with filtering fields */}
                <form className="uk-width-1-1">

                    {/* Search field */}
                    <fieldset className="uk-fieldset uk-margin-remove uk-padding-remove">
                        <div className="uk-width-1-1 uk-search uk-search-default">
                            <span data-uk-search-icon></span>
                            <input className="uk-search-input" type="search" placeholder="Search dataset" aria-label="" />
                        </div>
                    </fieldset>


                    {/* Results and filters grid */}
                    <div className="uk-container uk-width-1-1 uk-margin-remove uk-padding-remove">
                        <div data-uk-grid>
                            {/* Filters */}
                            <div className="uk-width-1-4@s uk-margin-top uk-overflow-hidden">

                                {/* Layer extend filter */}
                                <div>
                                    <fieldset className="uk-fieldset uk-margin-remove uk-padding-remove">
                                        <label className="uk-form-label uk-text-bolder">Regions</label>
                                        <div className="uk-margin-small-top">
                                            <RegionFilter />
                                        </div>
                                    </fieldset>
                                </div>

                                {/* Category filter */}
                                <div className="uk-margin-top">
                                    
                                    <fieldset className="uk-fieldset uk-margin-remove uk-padding-remove">
                                        <label className="uk-form-label uk-text-bolder">Categories</label>
                                        <div className="uk-container uk-margin-remove">
                                            <div className="uk-margin-remove uk-width-3-5@m uk-child-width-1-2@s" data-uk-grid>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                                <IconCheckBox src="https://getuikit.com/images/uikit-logo.svg" name="test"></IconCheckBox>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>

                                {/* Dates filter */}
                                <div className="uk-margin-top">
                                    <fieldset className="uk-fieldset uk-margin-remove uk-padding-remove">
                                        <p className="uk-form-label uk-padding-remove uk-margin-remove uk-text-bold" >Created</p>
                                        <label className="uk-form-label" >Before</label>
                                        <input className="uk-input uk-form-small" type="date"></input>
                                        <label className="uk-form-label" >After</label>
                                        <input className="uk-input uk-form-small" type="date"></input>  
                                    </fieldset>
                                </div>
                            </div>

                            {/* Results list */}
                            <div className="uk-width-expand uk-margin-top" style={{paddingLeft: "10px"}}>
                                <label className="uk-form-label uk-text-bolder">Results</label>
                                <ResultItem title='ResultItem title' abstract='ResultItem abstract' url='/'/>
                                <ResultItem title='ResultItem title' abstract='ResultItem abstract' url='/'/>
                            </div>
                        </div>
                        
                    </div>

                </form>
                
            </div>
        )
    }
}