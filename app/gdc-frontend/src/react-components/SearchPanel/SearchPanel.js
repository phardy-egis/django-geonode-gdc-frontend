// Import REACT (dynamic front-end framework)
import React, {useEffect, useState} from "react";

// Import UIKIT (front-end css framework)
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons);

// React components
import IconCheckBox from "./IconCheckBox";
import ResultItem from "./ResultItem";
import RegionFilter from "./RegionFilter";
import FetchWrapper, { PaginatedDataFetcher } from "../Utils/customFetch";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getSearchParams } from "../../redux/selectors/MainSliceSelectors";
import { setSearchFilter } from "../../redux/slices/MainSlice";
import debounce from 'lodash/debounce';


export default function SearchPanel(props) {

    // STATE MANAGEMENT

    // Allow redux dispatch function to be called
    const dispatch = useDispatch()

    // Managing categories list
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const categoriesFetcher = new FetchWrapper('gdc/api/categories/')
        categoriesFetcher.fetch()
            .then((res) => res.json())
            .then((data) => {
                setCategories(data)
            })
            .catch(function (error) {
                UIkit.notification(`Error. ${error}`, { status: 'danger' })
            });
    }, [])

    // Managing result list
    const searchParams = useSelector(state => getSearchParams(state))
    const [resultsReady, setResultsReady] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(false)
    const [results, setResults] = useState([])

    useEffect(() => {
        if (resultsReady) {
            const dataFetcher = new PaginatedDataFetcher(
                process.env.REACT_APP_SITEURL + 'gdc/api/geojson/?' + searchParams,
                setResults,
                setResultsReady,
                setLoadingProgress,
                (data) => { return data }
            )
            setResultsReady(false)
            dataFetcher.fetch()
        }
    }, [searchParams])

    // HANDLERS FOR STATE CHANGE

    function handleSearchFilter(e){
        dispatch(setSearchFilter(e.target.value))
    }

    function toggleSpatialExtentFilter(e){
        
    }

    // DOM RENDERING

    // Rendering results list
    var resultsDOM = null
    if(resultsReady){
        var resultsListDOM = []
        for (let index = 0; index < results.length; index++) {
            const resultItem = results[index];
            resultsListDOM.push(
                <ResultItem key={resultItem.properties.pk} properties={resultItem.properties} />
            )
        }

        resultsDOM = (
            <div className="uk-width-expand uk-margin-top" style={{ paddingLeft: "10px" }}>
                <label className="uk-form-label uk-text-bolder">Results</label>
                <div className="uk-width-1-1 uk-overflow-auto gdc-custom-scroller uk-margin-small-top uk-padding-small uk-padding-remove-top uk-padding-remove-bottom uk-padding-remove-left" style={{ height: 'calc( 100vh - 200px )' }}>
                    {resultsListDOM}
                </div>
            </div>
        )
    }
    else {
        resultsDOM = (
            <div className="uk-width-expand uk-margin-top" style={{ paddingLeft: "10px" }}>
                <label className="uk-form-label uk-text-bolder">Results</label>
                <div className="uk-width-1-1 uk-overflow-auto gdc-custom-scroller uk-margin-small-top uk-padding-small uk-padding-remove-top uk-padding-remove-bottom uk-padding-remove-left" style={{ height: 'calc( 100vh - 200px )' }}>
                    <p><span data-uk-spinner="ratio: 0.6"></span>&nbsp;Loading...</p>
                </div>
            </div>
        )
    }

    // Rendering categories list
    var categoriesFilterDOM = []
    for (let index = 0; index < categories.length; index++) {
        const category = categories[index];
        categoriesFilterDOM.push(
            <IconCheckBox key={category.id} src={category.icon_img} name={category.gn_description_en}></IconCheckBox>
        )
    }

    return (
        <div className="uk-card uk-card-default uk-card-body uk-height-1-1 uk-width-1-1 uk-padding-small">
            
            {/* Form with filtering fields */}
            <form className="uk-width-1-1">

                {/* Search field */}
                <fieldset className="uk-fieldset uk-margin-remove uk-padding-remove">
                    <div className="uk-width-1-1 uk-search uk-search-default">
                        <span data-uk-search-icon></span>
                        <input className="uk-search-input" type="search" placeholder="Search dataset" aria-label="" onChange={(e) => { handleSearchFilter(e) }} />
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
                                        <div className="uk-margin-remove  uk-child-width-1-2@s" data-uk-grid>
                                            {categoriesFilterDOM}
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
                        {resultsDOM}
                    </div>
                    
                </div>

            </form>
            
        </div>
    )
    
}