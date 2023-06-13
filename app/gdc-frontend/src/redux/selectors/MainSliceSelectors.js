export function getSearchParams(state) {
    const searchParams = new URLSearchParams()

    var activeFilters = ''
    if (state.filterByMapExtent){
        // Datasets are not filtered by region if filterByMapExtent is true
        activeFilters = state.filters.filter(filter => (filter.key !== 'regions'));
    }
    else {
        // Datasets are not filtered by BBOX if filterByMapExtent is false
        activeFilters = state.filters.filter(filter => (filter.key !== 'bbox'));
    }
    

    for (let index = 0; index < activeFilters.length; index++) {
        const param = activeFilters[index];
        if (param.value){
            searchParams.append(param.key, param.value);
        }
    }
    return searchParams.toString()
}