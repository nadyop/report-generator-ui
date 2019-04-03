/*Created by Brenda Pinem and Nadya P*/

import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import swal from 'sweetalert2'

Vue.use(VueAxios, axios)

export default {
    name: 'Report',
    data: () => ({
        baseURL: '/api/internal/regen/report',
        dialog: false,
        dialogGenerate: false,
        dialogDescription: false,
        key: '',
        headers: [
            { text: 'Title', align: 'left', value: 'title', sortable: false },
            { text: 'Division', align: 'left', value: 'division', sortable: false },
            { text: 'Datasource', align: 'left', value: 'datasource', sortable: false },
            { text: 'Status', align: 'left', value: 'status', sortable: false },
            // {text: 'Created by', align: 'left', value: 'status', sortable: true},
            { text: 'Actions', value: 'id', sortable: false }
        ],
        items: [],
        pageStart: 0,
        pageFirst: '',
        pageLast: '',
        pageTotal: '',
        pageNumber: '',
        editedIndex: -1,
        editedItem: {
            report: '',
            values: [],
            email: ''
        },
        defaultItem: {
            report: '',
            values: [],
            email: ''
        },
        valid: false,
        name: '',
        email: ''
    }),
    computed: {
        formTitle() {
            return 'GENERATING..'
        }
    },
    created() {
        this.fetchItem()
        this.searchItem()
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
                    .catch(err => {
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
                    report: item.id,
                    values: item.parameters,
                    email: item.email
                })
            this.dialogGenerate = true
        },
        description(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({},
                {
                    report: item.description
                })
            this.dialogDescription = true
        },
        close() {
            this.dialog = false
            this.dialogDescription = false
            this.dialogGenerate = false
        },
        save() {
            // axios generate
            const URL = this.baseURL + '/generate'
            axios.post(URL, {
                report: this.editedItem.report,
                values: this.editedItem.values,
                email: this.editedItem.email
            })
                .then(() => {
                    this.fetchItem()
                    let timerInterval
                    swal({
                        type: 'success',
                        title: 'Report is generating, please wait !',
                        html: "Go to <a href='generate-history'>Generate History</a>"
                    })
                })
                .catch(() => {
                    // what happen after error
                    swal({
                        type: 'error',
                        title: 'Generate report failed !',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
            this.close()
        }
    }
}
