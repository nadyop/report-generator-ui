/*Created by Brenda Pinem and Nadya P*/

import axios from 'axios'
import swal from 'sweetalert2'

export default {
    name: 'GenerateHistory',
    data: () => ({
        baseURL: '/api/internal/regen/job-history',
        dialogDescription: false,
        fileReportName: '',
        pageStart: 0,
        pageFirst: '',
        pageLast: '',
        pageTotal: '',
        pageNumber: '',
        headers: [
            { text: 'Name', align: 'left', value: 'name', sortable: false },
            { text: 'Date', align: 'left', value: 'date', sortable: false },
            { text: 'Time', align: 'left', value: 'time', sortable: false },
            { text: 'Status', align: 'left', value: 'status', sortable: false },
            // {text: 'Created by', align: 'left', value: 'status', sortable: true},
            { text: 'Actions', value: 'id', sortable: false }
        ],
        items: [],
        editedIndex: -1,
        editedItem: {
            no: '',
            id: '',
            name: '',
            status: '',
            requestTime: '',
            values: []
        },
        defaultItem: {
            no: '',
            id: '',
            name: '',
            status: '',
            requestTime: '',
            values: []
        }
    }),
    computed: {
        formTitle() {
            return 'Delete'
        }
    },
    created() {
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
        respFetchItem(response) {
          this.items = response.data.data.content
          this.pageFirst = response.data.data.first
          this.pageLast = response.data.data.last
          this.pageTotal = response.data.data.totalPages
          this.pageNumber = response.data.data.number
          this.pageNumber++
          if (response.data.data.totalPages === 0) {
            this.pageNumber
          } else {
            this.pageNumber = response.data.data.number
            this.pageNumber++
          }
        },
        fetchItem() {
            const URL = this.baseURL + '?sort=requestTime,desc&size=5&page=' + this.pageStart
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
            this.dialogDescription = true
        },
        respDeleteItem(result, item) {
          const URL = this.baseURL + '/' + item.id + '/delete'
          console.log(result)
          if (result.value === true) {
            axios.delete(URL)
              .then(() => {
                // this.dialog = false
                swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
                this.fetchItem()
              })
              .catch(err => {
                // what happen after error
                swal({
                  title: err,
                  showConfirmButton: false,
                  timer: 1000
                })
              })
          } else {
          }
        },
        deleteItem(item) {
            swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                this.respDeleteItem(result, item)
            })
        },
        description(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDescription = true
        },
        close() {
            this.dialogDescription = false
        },
        respDownloadItemName(response) {
          this.fileReportName = response.data.data.name
        },
        downloadItemName(item) {
            const URLFile = this.baseURL + '/' + item.id
            axios.get(URLFile)
                .then(response => {
                    this.respDownloadItemName(response)
                    this.downloadItem(item)
                })
                .catch(() => {
                    swal({
                        type: 'error',
                        title: 'Download report failed !',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        },
        respDownloadItem(response) {
          console.log(this.fileReportName)
          const data = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = data
          link.setAttribute('download', this.fileReportName + '.csv')
          document.body.appendChild(link)
          link.click()
          window.open(this.URL, '_blank')
          swal({
            type: 'success',
            title: 'Report downloaded !',
            showConfirmButton: false,
            timer: 2000
          })
          this.fetchItem()
        },
      respAlertDownloadItem(result) {
        if (
          // Read more about handling dismissals
          result.dismiss === swal.DismissReason.timer
        ) {
          console.log('I was closed by the timer')
        }
      },
        downloadItem(item) {
            let timerInterval
            swal({
                title: 'Downloading report !',
                html: '<h3>Please wait seconds to get your report !</h3>',
                timer: 2000,
                onOpen: () => {
                    swal.showLoading()
                },
                onClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                this.respAlertDownloadItem(result)
            })
            const URL = this.baseURL + '/' + item.id + '/download'
            axios.get(URL, {
                responseType: 'blob'
            })
                .then(response => {
                    this.respDownloadItem(response)
                })
                .catch(() => {
                    // what happen after error
                    swal({
                        type: 'error',
                        title: 'Download report failed !',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        }

    }
}
