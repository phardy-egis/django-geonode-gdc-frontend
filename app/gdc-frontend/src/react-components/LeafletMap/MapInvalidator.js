import { debounce } from 'lodash';
import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet/esm/hooks'

// This function observes map size change on screen and trigger invalidateSize when map is resized
export default function MapInvalidator() {

    const map = useMap()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!ready) {
            const resizeObserver = new ResizeObserver(
                // (entries) => {
                //     map.invalidateSize()
                // }
                debounce((entries) => {
                    map.invalidateSize()
                }, 25)
            )
            resizeObserver.observe(map._container);
            setReady(true)
        }
    }, [ready])
    
    return null
}