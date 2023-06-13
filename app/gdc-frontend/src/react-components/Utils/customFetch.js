export default class FetchWrapper {

    constructor(endpoint , params, options, absoluteURL){
        this.endpoint = endpoint
        this.params = params || []
        this.options = options || {}
        this.absoluteURL = absoluteURL || false
        this.url = null
        this.urlFromParamsAndEndpoint()
    }

    urlFromParamsAndEndpoint(){
        if(this.absoluteURL){
            this.url = new URL(this.endpoint)
        }
        else {
            this.url = new URL(process.env.REACT_APP_SITEURL + this.endpoint)
        }
        let inputParams = new URLSearchParams(this.url.search);
        inputParams.append('format', 'json');
        for (let index = 0; index < this.params.length; index++) {
            const param = this.params[index];
            inputParams.append(param.key, param.value);
        }
    }

    async fetch(){

        // Adding extra options for increased security
        const optionsWrappedWithSecurity = {
            ...this.options,
            credentials:'include',
        }

        // Wait and return fetch response
        const response = await fetch(this.url, optionsWrappedWithSecurity)
        return response
    }
}


export class PaginatedDataFetcher {

    constructor(URL, dataStateSetter, dataReadyStateSetter, loadingProgressSetter, dataReformatter) {
        this.URL = URL;
        this.dataStateSetter = dataStateSetter;
        this.dataReadyStateSetter = dataReadyStateSetter;
        this.loadingProgressSetter = loadingProgressSetter;
        this.dataReformatter = dataReformatter
        this.data = []; // Will contains the data loaded
    }

    fetch() {
        this.FetchPaginatedData(this.URL)
    }

    async FetchPaginatedData(FetchURL) {

        // Fetching data
        const DataFetcher = new FetchWrapper(FetchURL, [], {}, true)
        const response = await DataFetcher.fetch()
        const responseJSON = await response.json()

        // We push results to the data array
        this.data = this.data.concat(responseJSON.results)

        // We fetch the data
        if (responseJSON.next !== null) {
            this.FetchPaginatedData(responseJSON.next)
            // Get offset from URL
            const nexturl = new URL(responseJSON.next)
            const progress = nexturl.searchParams.get('offset')
            this.loadingProgressSetter([progress, responseJSON.count.toString()])
        }

        // If data fetching is completed, we reformat data
        else {
            this.dataStateSetter(this.data)
            this.loadingProgressSetter(['1', '1'])
            if (this.dataStateSetter) {
                this.dataStateSetter(this.dataReformatter(this.data))
            }
            // Once data is ready we change the status of the setter to TRUE
            this.dataReadyStateSetter(true)
        }
    }
}