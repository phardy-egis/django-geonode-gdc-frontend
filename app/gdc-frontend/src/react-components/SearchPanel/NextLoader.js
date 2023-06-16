import { useEffect, useRef, useState } from "react"

export default function NextLoader(props){

    const [ready, setReady] = useState(false)
    const refNextLoader = useRef()

    useEffect(() => {
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        };

        let observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if(entry.isIntersecting){
                console.log('NEXT intersected')
                props.onIntersect(props.nextURL)
            }
        }, options);
        observer.observe(refNextLoader.current)
        
    }, [ready])

    return (
        <div ref={refNextLoader} className="uk-animation-shake uk-margin-small-top uk-margin-small-bottom uk-padding-small uk-card uk-card-body uk-overflow-hidden uk-flex uk-flex-center" >
            <p className="uk-margin-small uk-text-small uk-text-muted"><span data-uk-spinner="ratio: 0.6"></span>&nbsp;&nbsp;&nbsp;Loading more results...</p>
        </div>
    )
}