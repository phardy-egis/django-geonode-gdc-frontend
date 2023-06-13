export function getSearchParams(state) {
    const searchParams = new URLSearchParams()
    for (let index = 0; index < state.filters.length; index++) {
        const param = state.filters[index];
        searchParams.append(param.key, param.value);
    }
    return searchParams.toString()
}