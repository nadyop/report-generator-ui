/*Created by Brenda Pinem and Nadya P*/

import axios from 'axios'
import swal from 'sweetalert2'

export default {
    name: 'Report',
    data: () => ({
        baseURL: '/api/internal/regen/report',
        valid: true,
        dialog: false,
        key: '',
        pageStart: 0,
        pageFirst: '',
        pageLast: '',
        pageTotal: '',
        pageNumber: '',
        selectDivision: [],
        selectDatasource: [],
        headers: [
            { text: 'Title', align: 'left', value: 'title', sortable: false },
            { text: 'Division', align: 'left', value: 'division', sortable: false },
            { text: 'Datasource', align: 'left', value: 'datasource', sortable: false },
            { text: 'Status', align: 'left', value: 'status', sortable: false },
            // {text: 'Created by', align: 'left', value: 'status', sortable: false},
            { text: 'Actions', value: 'id', sortable: false }
        ],
        items: [],
        editedIndex: -1,
        editedStatus: ['Active', 'Deactive'],
        editedItem: {
            id: '',
            title: '',
            description: '',
            sql: '',
            datasource: '',
            division: '',
            status: '',
            parameters: []
        },
        defaultItem: {
            id: '',
            title: '',
            description: '',
            sql: '',
            datasource: '',
            division: '',
            status: '',
            parameters: []
        }
    }),
    computed: {
        formTitle() {
          if (this.editedIndex === -1) {
            return 'Create'
          } else {
            return 'Edit'
          }
        }
    },
    created() {
        this.fetchItem()
        this.searchItem()
        this.fetchDivision()
        this.fetchDatasource()
    },
    methods: {
        prevButton() {
            this.pageStart--
            this.fetchItem()
        },
        nextButton() {
            this.pageStart++
            this.fetchItem()
        },
        addRow() {
            this.editedItem.parameters.push({
                order: '',
                name: '',
                type: ''
            })
        },
        deleteRow(index) {
            this.editedItem.parameters.splice(index, 1)
        },
        respFetchDatasource(response) {
          this.selectDatasource = response.data.data
        },
        fetchDatasource() {
            const URL = '/api/internal/regen/datasource/active'
            axios.get(URL)
                .then(response => {
                    this.respFetchDatasource(response)
                })
                .catch(err => {
                    swal({
                        title: err,
                        showConfirmButton: false,
                        timer: 1000
                    })
                })
        },
        respFetchDivision(response) {
          this.selectDivision = response.data.data
        },
        fetchDivision() {
            const URL = '/api/internal/regen/division/active'

            axios.get(URL)
                .then(response => {
                    this.respFetchDivision(response)
                })
                .catch(err => {
                    swal({
                        title: err,
                        showConfirmButton: false,
                        timer: 1000
                    })
                })
        },
        respSearchItem(response) {
          this.items = response.data.data.content
          this.pageFirst = response.data.data.first
          this.pageLast = response.data.data.last
          this.pageTotal = response.data.data.totalPages
          if (response.data.data.totalPages === 0) {
            this.pageNumber = 0
          } else {
            this.pageNumber = response.data.data.number
            this.pageNumber++
          }
        },
        searchItem() {
            const URL = this.baseURL + '?key=' + this.key + '&size=5'
            if (this.key !== '') {
                axios.get(URL)
                    .then(response => {
                        this.respSearchItem(response)
                    })
                    .catch(() => {
                        swal({
                            title: 'Data not found !',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    })
            } else {
                this.fetchItem()
            }
        },
        respFetchItem(response) {
          this.items = response.data.data.content
          this.pageFirst = response.data.data.first
          this.pageLast = response.data.data.last
          this.pageTotal = response.data.data.totalPages
          this.pageNumber = response.data.data.number
          // this.pageNumber++
          if (response.data.data.totalPages === 0) {
            this.pageNumber
          } else {
            this.pageNumber = response.data.data.number
            this.pageNumber++
          }
        },
        fetchItem() {
            const URL = this.baseURL + '?key=&sort=title,asc' + '&page=' + this.pageStart + '&size=5'
            axios.get(URL)
                .then(response => {
                    this.respFetchItem(response)
                })
                .catch(err => {
                    swal({
                        title: err,
                        showConfirmButton: false,
                        timer: 1000
                    })
                })
        },
        editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({},
                {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    sql: item.sql,
                    datasource: item.datasource.id,
                    division: item.division.id,
                    parameters: item.parameters
                })
            this.dialog = true
        },
        onDeleteItem(item) {
            const URL = this.baseURL + '/' + item.id + '/update'
            axios.put(URL, {
                title: item.title,
                description: item.description,
                sql: item.sql,
                datasource: item.datasource.id,
                division: item.division.id,
                parameters: item.parameters,
                status: false
            })
                .then(() => {
                    this.fetchItem()
                    swal({
                        type: 'success',
                        title: 'Deactivated !',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
                .catch(() => {
                    // what happen after error
                    swal({
                        type: 'error',
                        title: 'Deactive report failed !',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        },
        offDeleteItem(item) {
            const URL = this.baseURL + '/' + item.id + '/update'
            axios.put(URL, {
                title: item.title,
                description: item.description,
                sql: item.sql,
                datasource: item.datasource.id,
                division: item.division.id,
                parameters: item.parameters,
                status: true
            })
                .then(() => {
                    this.fetchItem()
                    swal({
                        type: 'success',
                        title: 'Activated !',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
                .catch(() => {
                    // what happen after error
                    swal({
                        type: 'error',
                        title: 'Active report failed !',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        },
        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        save() {
            if (this.editedItem.id !== '') {
                // axios update
                const URL = this.baseURL + '/' + this.editedItem.id + '/update'
                axios.put(URL, {
                    title: this.editedItem.title,
                    description: this.editedItem.description,
                    sql: this.editedItem.sql,
                    datasource: this.editedItem.datasource,
                    division: this.editedItem.division,
                    parameters: this.editedItem.parameters,
                    status: true
                })
                    .then(() => {
                        this.fetchItem()
                        swal({
                            type: 'success',
                            title: 'Report has been updated !',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                    .catch(() => {
                        // what happen after error
                        swal({
                            type: 'error',
                            title: 'Update report failed !',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
            } else {
                // axios store
                const URL = this.baseURL + '/create'
                axios.post(URL, {
                    id: this.editedItem.id,
                    title: this.editedItem.title,
                    description: this.editedItem.description,
                    sql: this.editedItem.sql,
                    datasource: this.editedItem.datasource,
                    division: this.editedItem.division,
                    parameters: this.editedItem.parameters,
                    status: true
                })
                    .then(() => {
                        // what happen after stored
                        this.fetchItem()
                        swal({
                            type: 'success',
                            title: 'Report has been created !',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                    .catch(() => {
                        // what happen after error
                        swal({
                            type: 'error',
                            title: 'Create report failed !',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
            }
            this.close()
        }
    }
}
