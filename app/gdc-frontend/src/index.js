// ==================================================================================================================
// ================================================ LOADING DEPENDENCIES ============================================
// ==================================================================================================================

// CSS LIBRARIES
import '../node_modules/leaflet/dist/leaflet.css';
import '../node_modules/uikit/dist/css/uikit.css';
import '../node_modules/leaflet-switch-basemap/src/L.switchBasemap.css';
import './assets/css/spade.custom.css';
import './assets/css/flatpickr.min.css';
import './assets/css/leaflet.loading.css';
import './assets/css/MarkerCluster.Default.css';

// JS LIBRARIES
import React from 'react';
import {render} from 'react-dom';
import "leaflet-loading";
import "leaflet-switch-basemap";
import "leaflet.markercluster";
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';

// JSX COMPONENTS
import LegendPanel from './react-components/LegendPanel/LegendPanel';
import SearchPanel from './react-components/SearchPanel/SearchPanel';

// IMGs
import { toggleFullPageLoader } from './react-components/Utils/FullPageLoader';
import mainSlice from './redux/slices/MainSlice';
import LeafletMap from './react-components/LeafletMap/LeafletMap';

// This line enable UIKit icons use in react 
// (Source: https://stackoverflow.com/questions/50212241/using-uikit-3-icons-in-react)
UIkit.use(Icons);

// Main page loading spinner
setTimeout(toggleFullPageLoader, 500)

export const store = configureStore({
    reducer: mainSlice.reducer
})

class App extends React.Component{

    constructor(props){
        super(props)
    }

    componentDidMount(){
        document.getElementById("legendpanel").style.width = "0px"
    }

    render(){
        return (
            <Provider store={store}>
                <div className="uk-child-width-expand uk-grid-column-collapse uk-grid-row-collapse uk-height-1-1 uk-overflow-hidden" data-uk-grid>

                    <div className="uk-width-1-3 uk-height-1-1 gdc-custom-panel" id="searchpanel">
                        <SearchPanel></SearchPanel>
                    </div>

                    <div className="uk-width-expand uk-height-1-1">
                        <LeafletMap></LeafletMap>
                    </div>

                    <div className="uk-width-1-6 uk-height-1-1 gdc-custom-scroller gdc-custom-panel" id="legendpanel">
                        <LegendPanel></LegendPanel>
                    </div>

                </div>
            </Provider>
        )
    }
}

// Rendering app
console.log(document.querySelector('#app'))
render(<App />, document.querySelector('#app'));