<template>
  <div>
    <v-layout row mt-5>
      <v-flex md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-flex class="title">User Management</v-flex>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="key"
              label="Search by Username"
              single-line
              hide-details
            ></v-text-field>
            <v-btn fab small slot="activator" @click.native="searchItem">
              <v-icon>search</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
        <v-card>
          <v-layout row justify-space-between>
            <v-dialog v-model="dialog" persistent max-width="500px">
              <v-btn color="info" dark slot="activator" class="mb-2">
                <!--<v-icon>add_circle</v-icon>-->
                Create
              </v-btn>
              <v-card md6>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-form ref="form" class="form-action" v-model="valid" lazy-validation @submit.prevent="save">
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-text-field
                            :rules="userRules"
                            required
                            label="Username"
                            v-model="editedItem.username"></v-text-field>
                          <v-text-field
                            type="password"
                            v-model="editedItem.password"
                            required
                            :rules="passRules"
                            label="Password"></v-text-field>
                          <v-select
                            label="Role"
                            :rules="[v => !!v || 'Role is required']"
                            required
                            v-model="editedItem.role"
                            :items="selectRole"
                            item-text="name"
                            item-value="id"></v-select>
                          <v-select
                            label="Division"
                            :rules="[v => !!v || 'Division is required']"
                            required
                            v-model="editedItem.division"
                            :items="selectDivision"
                            item-text="name"
                            item-value="id"></v-select>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat
                           :disabled="!valid"
                           @click.native="save">Save
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-data-table
            :headers="headers"
            :items="items"
            :rows-per-page-items="[20]"
            hide-actions
            class="elevation-1">
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.division.name }}</td>
              <td>{{ props.item.username }}</td>
              <td class="text-xs-left">{{ props.item.role.name }}</td>
              <td v-if="props.item.status" class="text-xs-left">Active</td>
              <td v-else class="text-xs-left">Non-active</td>
              <td class="justify-center layout px-0">
                <v-tooltip bottom>
                  <v-btn slot="activator" icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="yellow darken-4">edit</v-icon>
                  </v-btn>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn slot="activator" v-if="props.item.status" icon class="mx-0" @click="onDeleteItem(props.item)">
                    <v-icon color="red">remove_circle</v-icon>
                  </v-btn>
                  <v-btn slot="activator" v-else icon class="mx-0" @click="offDeleteItem(props.item)">
                    <v-icon color="green">check_circle</v-icon>
                  </v-btn>
                  <span v-if="props.item.status">Non-Active</span>
                  <span v-else>Active</span>
                </v-tooltip>
              </td>
            </template>
            <template slot="no-data">
              <!--<h2 class="title">No Data Found</h2>-->
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                There is no result "{{ key }}"
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="text-xs-center">
      <v-container>
        <v-layout justify-center>
          <v-btn color="deep-orange" small round v-if="pageFirst===true || pageLast===''" disabled>
            <v-icon>keyboard_arrow_left</v-icon>
            Prev
          </v-btn>
          <v-btn color="deep-orange" small dark round v-if="pageFirst===false || pageLast===''" @click="prevButton">
            <v-icon>keyboard_arrow_left</v-icon>
            Prev
          </v-btn>
          <v-flex xs1 sm1 style="margin-top: 1%">
            {{ pageNumber }} of {{ pageTotal }}
          </v-flex>
          <v-btn color="deep-orange" small round v-if="pageLast===true || pageLast===''" disabled>Next
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
          <v-btn color="deep-orange" small dark round v-if="pageLast===false || pageFirst===''" @click="nextButton">Next
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import alert from 'sweetalert2'

  export default {
    name: 'Users',
    data: () => ({
      baseURL: '/api/internal/regen/user',
      valid: true,
      userRules:
        [
          v => !!v || 'Username is required',
          v => v.length <= 15 || 'Username must be less than 15 character',
          v => v.length >= 3 || 'Username must be greater than 3 character'
        ],
      passRules:
        [
          v => !!v || 'Password is required',
          v => v.length <= 60 || 'Password must be less than 60 character',
          v => v.length >= 7 || 'Password must be greater than 7 character'
        ],
      dialog: false,
      key: '',
      pageStart: 0,
      pageFirst: '',
      pageLast: '',
      pageTotal: '',
      pageNumber: '',
      headers: [
        {text: 'Division Name', align: 'left', value: 'division', sortable: false},
        {text: 'Username', align: 'left', value: 'username', sortable: false},
        {text: 'Role', align: 'left', value: 'role', sortable: false},
        {text: 'Status', align: 'left', value: 'status', sortable: false},
        {text: 'Actions', value: 'id', sortable: false}
      ],
      items: [],
      selectDivision: [],
      selectRole: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        username: '',
        password: '',
        role: '',
        division: '',
        status: ''
      },
      defaultItem: {
        id: '',
        username: '',
        password: '',
        role: '',
        division: '',
        status: ''
      }
    }),
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Create' : 'Edit'
      }
    },
    created() {
      this.fetchItem()
      this.searchItem()
      this.fetchDivision()
      this.fetchRole()
      this.prevButton()
      this.nextButton()
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
      searchItem() {
        const URL = this.baseURL + '?key=' + this.key + '&size=5'
        if (this.key != '') {
          axios.get(URL)
            .then(response => {
              this.items = response.data.data.content
              this.pageFirst = response.data.data.first
              this.pageLast = response.data.data.last
              this.pageTotal = response.data.data.totalPages
              if (response.data.data.totalPages == 0) {
                this.pageNumber = 0
              } else {
                this.pageNumber = response.data.data.number
                this.pageNumber++
              }
            })
            .catch(err => {
              alert({
                title: 'Data not found !',
                showConfirmButton: false,
                timer: 1000
              })
            })
        } else {
          this.fetchItem()
        }
      },
      fetchDivision() {
        const URL = '/api/internal/regen/division?key='
        axios.get(URL)
          .then(response => {
            this.selectDivision = response.data.data.content
          })
          .catch(err => {
            alert({
              title: err,
              showConfirmButton: false,
              timer: 1000
            })
          })
      },
      fetchRole() {
        const URL = '/api/internal/regen/role'
        axios.get(URL)
          .then(response => {
            this.selectRole = response.data.data
          })
          .catch(err => {
            alert({
              title: err,
              showConfirmButton: false,
              timer: 1000
            })
          })
      },
      fetchItem() {
        const URL = this.baseURL + '?key=&sort=username,asc' + '&page=' + this.pageStart + '&size=5'

        axios.get(URL)
          .then(response => {
            this.items = response.data.data.content
            this.pageFirst = response.data.data.first
            this.pageLast = response.data.data.last
            this.pageTotal = response.data.data.totalPages
            this.pageNumber = response.data.data.number
            // this.pageNumber++
            if (response.data.data.totalPages == 0) {
              this.pageNumber
            } else {
              this.pageNumber = response.data.data.number
              this.pageNumber++
            }
          })
          .catch(err => {
            alert({
              title: err,
              showConfirmButton: false,
              timer: 1000
            })
          })
      },

      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, {
          id: item.id,
          username: item.username,
          password: item.password,
          role: item.role.id,
          status: item.status,
          division: item.division.id
        })
        this.dialog = true
      },

      offDeleteItem(item) {
        const URL = this.baseURL + '/' + item.id + '/update'
        axios.put(URL, {
          username: item.username,
          password: item.password,
          role: item.role.id,
          division: item.division.id,
          status: true
        })
          .then(response => {
            this.fetchItem()
            alert({
              type: 'success',
              title: 'Activated !',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch(err => {
            // what happen after error
            alert({
              type: 'error',
              title: 'Active user failed !',
              showConfirmButton: false,
              timer: 1500
            })
          })
      },
      onDeleteItem(item) {
        const URL = this.baseURL + '/' + item.id + '/update'

        axios.put(URL, {
          username: item.username,
          password: item.password,
          role: item.role.id,
          division: item.division.id,
          status: false
        })
          .then(response => {
            this.fetchItem()
            alert({
              type: 'success',
              title: 'Deactivated !',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch(err => {
            // what happen after error
            alert({
              type: 'error',
              title: 'Deactive user failed !',
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
        if (this.$refs.form.validate()) {
          if (this.editedItem.id !== '') {
            // axios update
            const URL = this.baseURL + '/' + this.editedItem.id + '/update'

            axios.put(URL, {
              id: this.editedItem.id,
              username: this.editedItem.username,
              password: this.editedItem.password,
              role: this.editedItem.role,
              division: this.editedItem.division,
              status: this.editedItem.status
            })
              .then(response => {
                this.fetchItem()
                alert({
                  type: 'success',
                  title: 'User has been updated !',
                  showConfirmButton: false,
                  timer: 1500
                })
              })
              .catch(err => {
                // what happen after error
                alert({
                  type: 'error',
                  title: 'Update user failed !',
                  showConfirmButton: false,
                  timer: 1500
                })
              })
          } else {
            // axios store
            const URL = this.baseURL + '/create'
            axios.post(URL, {
              id: this.editedItem.id,
              username: this.editedItem.username,
              password: this.editedItem.password,
              role: this.editedItem.role,
              division: this.editedItem.division,
              status: true
            })
              .then(response => {
                // what happen after stored
                this.fetchItem()
                alert({
                  type: 'success',
                  title: 'User has been created !',
                  showConfirmButton: false,
                  timer: 1500
                })
              })
              .catch(err => {
                // what happen after error
                alert({
                  type: 'success',
                  title: 'Create user failed !',
                  showConfirmButton: false,
                  timer: 1500
                })
              })
          }
        }
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>