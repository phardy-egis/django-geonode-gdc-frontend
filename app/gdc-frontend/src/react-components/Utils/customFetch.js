export default class FetchWrapper {

    constructor(endpoint , params = [], options = {}){
        this.endpoint = endpoint
        this.params = params
        this.options = options
        this.url = null
        this.urlFromParamsAndEndpoint()
    }

    urlFromParamsAndEndpoint(){
        this.url = new URL(process.env.REACT_APP_SITEURL + this.endpoint)
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