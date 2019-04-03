<!--Created by Brenda Pinem and Nadya P-->
<template>
  <div>
    <v-layout row mt-5>
      <v-flex md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-flex class="title">
              Datasource Management
            </v-flex>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="key"
              label="Search by Database"
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
              <v-spacer></v-spacer>
              <v-btn color="info" dark slot="activator" class="text-xs-right">
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
                          <v-select
                            label="Division"
                            :rules="[v => !!v || 'Division is required']"
                            required
                            v-model="editedItem.division"
                            :items="selectDivision"
                            item-text="name"
                            item-value="id"></v-select>
                          <!--<v-select-->
                          <!--label="Database"-->
                          <!--:rules="[v => !!v || 'Database is required']"-->
                          <!--required-->
                          <!--v-model="editedItem.name"-->
                          <!--:items="selectDatasource"-->
                          <!--item-text="name"-->
                          <!--item-value="name"></v-select>-->
                          <v-text-field label="Database Name"
                                        required
                                        :rules="[v => !!v || 'Database name is required']"
                                        item-text="name"
                                        item-value="name"
                                        v-model="editedItem.name"></v-text-field>
                          <v-text-field label="Hostname"
                                        :rules="[
                                            v => !!v || 'Hostname is required',
                                            v => v.length <= 25 || 'Hostname must be less than 25 character'
                                        ]"
                                        :counter="25"
                                        required
                                        v-model="editedItem.hostname">
                          </v-text-field>
                          <v-text-field label="Port"
                                        :rules="[
                                            v => !!v || 'Port is required',
                                            v => v.length <= 6 || 'Port must be less than 6 character'
                                        ]"
                                        :counter="6"
                                        required
                                        v-model="editedItem.port"></v-text-field>
                          <v-text-field label="Username"
                                        :rules="[
                                            v => !!v || 'Username is required',
                                            v => v.length <= 70 || 'Username must be less than 70 character'
                                        ]"
                                        :counter="70"
                                        required
                                        v-model="editedItem.username"></v-text-field>
                          <v-text-field label="Password"
                                        type="password"
                                        :rules="[v => !!v || 'Password is required']"
                                        required
                                        v-model="editedItem.password">
                          </v-text-field>
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
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.division.name }}</td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.hostname }}</td>
              <td class="text-xs-left">{{ props.item.port }}</td>
              <td v-if="props.item.status" class="text-xs-left">Active</td>
              <td v-else class="text-xs-left">Non-active</td>
              <!--<td class="text-xs-left">{{ props.item.created }}</td>-->
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
          <v-btn color="deep-orange" small round v-if="pageLast===true || pageFirst===''" disabled>Next
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

<script src='./js/datasources.js'></script>

<style scoped>

</style>
