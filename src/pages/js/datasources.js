/*Created by Brenda Pinem and Nadya P*/

import axios from 'axios'
import swal from 'sweetalert2'

export default {
  name: 'Datasources',
  data: () => ({
    baseURL: '/api/internal/regen/datasource',
    baseURLdivision: '/api/internal/regen/division',
    slash: '/',
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
      { text: 'Division', align: 'left', value: 'division', sortable: false },
      { text: 'Database', align: 'left', value: 'name', sortable: false },
      { text: 'Hostname', align: 'left', value: 'hostname', sortable: false },
      { text: 'Port', align: 'left', value: 'port', sortable: false },
      { text: 'Status', align: 'left', value: 'status', sortable: false },
      // {text: 'Created by', align: 'left', value: 'created', sortable: false},
      { text: 'Actions', value: 'id', sortable: false }
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      name: '',
      hostname: '',
      port: '',
      username: '',
      password: '',
      division: '',
      created: '',
      status: ''
    },
    defaultItem: {
      id: '',
      name: '',
      hostname: '',
      port: '',
      username: '',
      password: '',
      division: '',
      created: '',
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
    this.searchItem()
    this.fetchDivision()
    this.fetchItem()
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
      const URL = this.baseURL + 'key=' + this.key + '&size=5'
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
    respFetchDivision(response) {
      this.selectDivision = response.data.data
    },
    fetchDivision() {
      const URL = this.baseURLdivision + '/active'
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
      this.editedItem = Object.assign({},
        {
          id: item.id,
          name: item.name,
          hostname: item.hostname,
          port: item.port,
          username: item.username,
          password: item.password,
          division: item.division.id
        })
      this.dialog = true
    },

    onDeleteItem(item) {
      const URL = this.baseURL + this.slash + item.id + '/update'
      axios.put(URL, {
        name: item.name,
        hostname: item.hostname,
        port: item.port,
        username: item.username,
        password: item.password,
        division: item.division.id,
        created: 'superadmin',
        status: false
      })
        .then(() => {
          this.fetchItem()
          swal({
            type: 'success',
            title: 'Deactived !',
            showConfirmButton: false,
            timer: 1500
          })
        })
        .catch(() => {
          // what happen after error
          swal({
            type: 'error',
            title: 'Deactive datasource failed !',
            showConfirmButton: false,
            timer: 1500
          })
        })
    },
    offDeleteItem(item) {
      const URL = this.baseURL + this.slash + item.id + '/update'
      axios.put(URL, {
        name: item.name,
        hostname: item.hostname,
        port: item.port,
        username: item.username,
        password: item.password,
        division: item.division.id,
        created: 'superadmin',
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
            title: 'Active datasource failed !',
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
        const URL = this.baseURL + this.slash + this.editedItem.id + '/update'
        axios.put(URL, {
          name: this.editedItem.name,
          hostname: this.editedItem.hostname,
          port: this.editedItem.port,
          username: this.editedItem.username,
          password: this.editedItem.password,
          division: this.editedItem.division,
          status: true
        })
          .then(() => {
            this.fetchItem()
            swal({
              type: 'success',
              title: 'Datasource updated !',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch(() => {
            // what happen after error
            swal({
              type: 'error',
              title: 'Update datasource failed !',
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
          hostname: this.editedItem.hostname,
          port: this.editedItem.port,
          username: this.editedItem.username,
          password: this.editedItem.password,
          division: this.editedItem.division
          // status: true
        })
          .then(() => {
            // what happen after stored
            this.fetchItem()
            swal({
              type: 'success',
              title: 'Datasource has been created !',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch(() => {
            // what happen after error
            swal({
              type: 'error',
              title: 'Create datasource failed !',
              showConfirmButton: false,
              timer: 1500
            })
          })
      }
      this.close()
    }
  }
}
