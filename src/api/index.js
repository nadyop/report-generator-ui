import axios from 'axios'
const baseURL = '/api/internal/regen/division'
const resp = {
    content : [],
    first : 0,
    last : 0,
    totalPages : 0,
    pageNumber : 0
}
export default {
    searchItem(key) {
        const URL = baseURL + '?key=' + key + '&size=5'
        if (key !== '') {
            return axios.get(URL)
                .then(response => {
                    this.resp.content = response.data.data.content
                    this.resp.first = response.data.data.first
                    this.resp.last = response.data.data.last
                    this.resp.totalPages = response.data.data.totalPages
                    return this.resp
                })
        }
    },
    fetchItem(key, pageStart) {
        const URL = baseURL + '?key=' + key + '&sort=name,asc' + '&page=' + pageStart + '&size=5'
        return axios.get(URL)
            .then(response => {
                    this.resp.content = response.data.data.content
                    this.resp.first = response.data.data.first
                    this.resp.last = response.data.data.last
                    this.resp.totalPages = response.data.data.totalPages
                    this.resp.pageNumber = response.data.data.pageNumber
                    return this.resp
                // this.pageNumber++
            })
    }
}