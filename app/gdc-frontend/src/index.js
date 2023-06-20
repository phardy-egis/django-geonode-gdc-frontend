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
import {render} from 'react-dom';
import "leaflet-loading";
import "leaflet-switch-basemap";
import "leaflet.markercluster";
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { configureStore } from '@reduxjs/toolkit'
import { Provider, useSelector } from 'react-redux';
import LegendPanel from './react-components/LegendPanel';
import SearchPanel from './react-components/SearchPanel';
import LeafletMap from './react-components/LeafletMap';
import { getAvailableLayerReadinessStatus } from './redux/selectors/MainSliceSelectors';
import Preloader from './react-components/Utils/Preloader';
import mainSlice from './redux/slices/MainSlice';
UIkit.use(Icons);

export const store = configureStore({
    reducer: mainSlice.reducer
})

// // Used to track store changes
// store.subscribe(() => {
//     console.log("store changed!", store.getState());
// });

// This component is used to wrap <App> and <Preloader> components inside a similar tag.
export function AppWrapper(){
    return (
        <Provider store={store}>
            <App></App>
        </Provider>
    )
}

export function App(){

    const availableLayersReady = useSelector(state => getAvailableLayerReadinessStatus(state))

    if (availableLayersReady){
        return (
            <Provider store={store}>
                <div className="uk-height-1-1 uk-width-1-1 uk-overflow-hidden uk-margin-remove uk-animation-fade" data-uk-grid>
                    <SearchPanel/>
                    <LeafletMap/>
                    <LegendPanel multiple={true}/>
                </div>
            </Provider>
            
        )
    }
    else {
        return(
            <Provider store={store}>
                <div className="uk-height-1-1 uk-width-1-1 uk-overflow-hidden uk-margin-remove uk-animation-fade">
                    <Preloader></Preloader>
                </div>
            </Provider>
        )
    }
}

render(<AppWrapper />, document.querySelector('#appwrapper'))