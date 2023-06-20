import { useMap, useMapEvent } from 'react-leaflet/esm/hooks'
import { store } from '../..';
import { setBBOXFilter } from '../../redux/slices/MainSlice';

export default function BBOXFilterTracker() {

    const map = useMap()

    const tracker = useMapEvent('moveend', () => {
        const bounds = map.getBounds().toBBoxString();
        store.dispatch(setBBOXFilter(bounds))
    })

    return null
}
