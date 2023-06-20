import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getZoomFocus } from "../../redux/selectors/MainSliceSelectors"
import L from 'leaflet'
import { useMap } from 'react-leaflet/esm/hooks'
import { setZoomFocus } from "../../redux/slices/MainSlice"

export default function ZoomFocus(){

    const map = useMap()
    const dispatch = useDispatch()
    const zoomFocus = useSelector(state => getZoomFocus(state))

    useEffect(() =>{
        if(zoomFocus){
            if (zoomFocus.geometry.coordinates){
                const layer = L.geoJSON(zoomFocus)
                map.fitBounds(layer.getBounds());
            }

            dispatch(setZoomFocus(null))
        }
    }, [zoomFocus])

    return null
}