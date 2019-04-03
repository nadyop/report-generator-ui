/*Created by Brenda Pinem and Nadya P*/

import axios from 'axios'
import swal from 'sweetalert2'

export default {
name: 'Divisions',
data: () => ({
    baseURL: '/api/internal/regen/division',
    valid: true,
    dialog: false,
    key: '',
    headers: [
    {text: 'Division Name', align: 'left', value: 'division', sortable: false},
    {text: 'Status', align: 'left', value: 'status', sortable: false},
    {text: 'Actions', value: 'id', sortable: false}
    ],
    items: [],
    pageStart: 0,
    pageFirst: '',
    pageLast: '',
    pageTotal: '',
    pageNumber: '',
    editedIndex: -1,
    editedItem: {
    id: '',
    name: '',
    status: ''
    },
    defaultItem: {
    id: '',
    name: '',
    status: ''
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
    this.init()
},
methods: {
    init () {
        this.fetchItem()
        this.searchItem()
        this.prevButton()
        this.nextButton()
    },
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
    const URL = this.baseURL + '?key=' + this.key + '&sort=name,asc' + '&page=' + this.pageStart + '&size=5'
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
    this.editedItem = Object.assign({}, item)
    this.dialog = true
    },
    offDeleteItem(item) {
    const URL = this.baseURL + '/' + item.id + '/update'
    axios.put(URL, {
        name: item.name,
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
              title: 'Active division failed !',
              showConfirmButton: false,
              timer: 1500
          })
        })
    },
    onDeleteItem(item) {
    const URL = this.baseURL + '/' + item.id + '/update'

    axios.put(URL, {
        name: item.name,
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
              title: 'Deactive division failed !',
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
        name: this.editedItem.name,
        status: this.editedItem.status
        })
        .then(() => {
            this.fetchItem()
            swal({
            type: 'success',
            title: 'Division has been updated !',
            showConfirmButton: false,
            timer: 1500
            })
        })
        .catch(() => {
            // what happen after error
            swal({
            type: 'error',
            title: 'Update division failed !',
            showConfirmButton: false,
            timer: 1500
            })
        })
    } else {
        // axios store
        const URL = this.baseURL + '/create'
        axios.post(URL, {
        id: this.editedItem.id,
        name: this.editedItem.name,
        status: true
        })
        .then(() => {
            // what happen after stored
            this.fetchItem()
            swal({
            type: 'success',
            title: 'Division has been created !',
            showConfirmButton: false,
            timer: 1500
            })
        })
        .catch(() => {
            // what happen after error
            swal({
            type: 'success',
            title: 'Create division failed !',
            showConfirmButton: false,
            timer: 1500
            })
        })
    }
    // }
    this.close()
    }
  }
}
