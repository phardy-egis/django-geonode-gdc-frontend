// Import REACT (dynamic front-end framework)
import React, {useCallback, useEffect, useState} from "react";

// Import UIKIT (front-end css framework)
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
UIkit.use(Icons);

// React components
import IconCheckBox from "./IconCheckBox";
import ResultItem from "./ResultItem";
import RegionFilter from "./RegionFilter";
import FetchWrapper from "../Utils/customFetch";
import { useSelector, useDispatch } from 'react-redux'
import { getSearchParams } from "../../redux/selectors/MainSliceSelectors";
import { setSearchFilter, setCategoryFilter, setStartDateFilter, setEndDateFilter } from "../../redux/slices/MainSlice";
import debounce from 'lodash.debounce';
import NextLoader from "./NextLoader";

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
    const [resultsCount, setResultsCount] = useState(0)
    const [results, setResults] = useState([])
    const [nextURL, setNextURL] = useState(false)

    useEffect(() => {
        if (resultsReady) {
            setResultsReady(false)
            const dataLightFetcher = new FetchWrapper('gdc/api/geojson/?' + searchParams)
            dataLightFetcher.fetch()
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.results)
                    setResultsReady(true)
                    if (data.next){
                        setNextURL(data.next)
                    }
                    else {
                        setNextURL(false)
                    }
                    if(data.count){
                        setResultsCount(data.count)
                    }
                    else{
                        setResultsCount(data.count)
                    }
                })
                .catch(function (error) {
                    UIkit.notification(`Error. ${error}`, { status: 'danger' })
                });
        }
    }, [searchParams])

    // HANDLERS FOR STATE CHANGE

    // Handler for filter SEARCH
    function handleSearchFilter(e){
        dispatch(setSearchFilter(e.target.value))
    }
    const debouncedSearchFilterChangeHandler = useCallback( debounce(handleSearchFilter, 300) , []);


    // Handler for filter CATEGORY
    function toggleCategoryFilter(id) {
        dispatch(setCategoryFilter(id))
    }
    // Debounced function
    const debouncedCategoryChangeHandler = useCallback(debounce(toggleCategoryFilter, 150), []);

    // Handler for filter START DATE
    function handleSetStartDate(e){
        const date = new Date(e.target.value)
        dispatch(setStartDateFilter(date.toISOString()))
    }
    // Debounced function
    const debouncedStartDateFilterChangeHandler = useCallback(debounce(handleSetStartDate, 150), []);

    // Handler for filter END DATE
    function handleSetEndDate(e){
        const date = new Date(e.target.value)
        dispatch(setEndDateFilter(date.toISOString()))
    }
    // Debounced function
    const debouncedEndDateFilterChangeHandler = useCallback(debounce(handleSetEndDate, 150), []);

    function handleNextLoader(nextURL){
        const dataLightFetcher = new FetchWrapper(nextURL, [], {}, true)
        dataLightFetcher.fetch()
            .then((res) => res.json())
            .then((data) => {
                setResults(results.concat(data.results))
                if (data.next) {
                    setNextURL(data.next)
                }
                else {
                    setNextURL(null)
                }
            })
            .catch(function (error) {
                UIkit.notification(`Error. ${error}`, { status: 'danger' })
            });
    }

    // DOM RENDERING

    // NextItem if nextURL url is not null
    var nextLoaderDOM = null
    if (nextURL && results.length > 0 && resultsReady){
        nextLoaderDOM = (<NextLoader key={nextURL} onIntersect={handleNextLoader} nextURL={nextURL}></NextLoader>)
    }

    // Rendering results list
    var resultsDOM = null
    if(resultsReady){
        var resultsListDOM = []
        for (let index = 0; index < results.length; index++) {
            const resultItem = results[index];
            resultsListDOM.push(
                <ResultItem key={resultItem.properties.pk} layerid={resultItem.properties.pk} properties={resultItem.properties} geojson={resultItem} />
            )
        }

        if (!resultsListDOM.length){
            resultsDOM = (
                <p className="uk-text-small uk-text-muted">No results found.</p>
            )
        }
        else{
            resultsDOM = resultsListDOM
        }
    }
    else {
        resultsDOM = (
                    <p><span data-uk-spinner="ratio: 0.6"></span>&nbsp;Loading...</p>
        )
    }

    // Rendering categories list
    var categoriesFilterDOM = []
    for (let index = 0; index < categories.length; index++) {
        const category = categories[index];
        categoriesFilterDOM.push(
            <IconCheckBox key={category.id} src={category.icon_img} name={category.gn_description_en} onChange={(e) => { toggleCategoryFilter({id:category.identifier, checked:e.target.checked})}}></IconCheckBox>
        )
    }

    return (
        //  HTML ID is required to toggle the panel from Leaflet Map custom control
        < div className = "uk-padding-remove uk-width-1-3 uk-height-1-1 gdc-custom-panel" id = "searchpanel" >
            <div className="uk-card uk-card-default uk-card-body uk-height-1-1 uk-width-1-1 uk-padding-small">
                
                {/* Form with filtering fields */}
                <form className="uk-width-1-1">

                    {/* Search field */}
                    <fieldset className="uk-fieldset uk-margin-remove uk-padding-remove">
                        <div className="uk-width-1-1 uk-search uk-search-default">
                            <span data-uk-search-icon></span>
                            <input className="uk-search-input" type="search" placeholder="Search dataset" aria-label="" onChange={ debouncedSearchFilterChangeHandler } />
                        </div>
                    </fieldset>


                    {/* Results and filters grid */}
                    <div className="uk-container uk-width-1-1 uk-margin-remove uk-padding-remove">
                        <div data-uk-grid>
                            {/* Filters */}
                            <div className="uk-width-1-4@s uk-width-auto uk-margin-top uk-overflow-hidden">

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
                                            <div className="uk-margin-remove" data-uk-grid>
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
                                        <input className="uk-input uk-form-small uk-padding-remove" type="date" style={{width:"calc( 100% - 10px)"}} onChange={(e) => { debouncedStartDateFilterChangeHandler(e)}}></input>
                                        <label className="uk-form-label" >After</label>
                                        <input className="uk-input uk-form-small uk-padding-remove" type="date" style={{ width: "calc( 100% - 10px)" }} onChange={(e) => { debouncedEndDateFilterChangeHandler(e) }}></input>  
                                    </fieldset>
                                </div>
                            </div>

                            {/* Results list */}
                            <div className="uk-width-expand uk-margin-top uk-animation-fade uk-padding-remove">
                                <label className="uk-form-label uk-text-bolder">{resultsCount} Results</label>
                                {/* <span className="uk-text-light uk-text-small uk-text-muted">({results.length} listed)</span> */}
                                <div className="uk-width-1-1 uk-overflow-auto gdc-custom-scroller uk-margin-small-top uk-padding-small uk-padding-remove-top uk-padding-remove-bottom" style={{ height: 'calc( 100vh - 130px )' }}>
                                    {resultsDOM}
                                    {nextLoaderDOM}
                                </div>
                            </div>
                        </div>
                        
                    </div>

                </form>
                
            </div>
        </div >
    )
    
}