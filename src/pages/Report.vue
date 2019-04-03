<!--Created by Brenda Pinem and Nadya P-->
<template>
  <div>
    <v-layout row mt-5>
      <v-flex md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-flex class="title">Report Management</v-flex>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="key"
              label="Search by Title"
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
            <v-dialog v-model="dialog" persistent max-width="800px">
              <v-btn color="info" dark slot="activator" class="mb-2">
                <!--<v-icon>add_circle</v-icon>-->
                Create
              </v-btn>
              <v-card md6>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-select
                            label="Division"
                            v-model="editedItem.division"
                            :items="selectDivision"
                            required
                            :rules="[v => !!v || 'Division is required']"
                            item-text="name"
                            item-value="id"></v-select>
                          <v-select
                            label="Datasource"
                            required
                            :rules="[v => !!v || 'Datasource is required']"
                            v-model="editedItem.datasource"
                            :items="selectDatasource"
                            item-text="name"
                            item-value="id"></v-select>
                          <v-text-field label="Title"
                                        required
                                        :rules="[
                                            v => !!v || 'Title is required',
                                            v => v.length <= 125 || 'Title must be less than 125 character'
                                        ]"
                                        :counter="125"
                                        v-model="editedItem.title"></v-text-field>
                          <v-textarea label="Description"
                                      required
                                      :rules="[v => !!v || 'Description is required']"
                                      v-model="editedItem.description"></v-textarea>
                          <v-textarea label="Sql"
                                      required
                                      :rules="[v => !!v || 'SQL is required']"
                                      v-model="editedItem.sql"></v-textarea>
                          <v-layout row wrap class="ml-2">
                            <template v-for="(input, index) in editedItem.parameters">
                              <v-text-field class="hidden-sm-and-up"
                                            @data="index"
                                            :key="index"
                                            v-model="input.id">
                              </v-text-field>
                              <v-flex xs12 sm4 :key="index">
                                <v-text-field v-model="input.order"
                                              @data="index"
                                              :rules="[v => !!v || 'Required']"
                                              type="number"
                                              min=1
                                              label="Column Number">
                                </v-text-field>
                              </v-flex>
                              <v-flex xs12 sm5 class="ml-3" :key="index">
                                <v-text-field
                                  v-model="input.name"
                                  :rules="[v => !!v || 'Required']"
                                  label="Column Name"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm2 :key="index">
                                <v-btn flat icon color="red" @click="deleteRow(index)">
                                  <v-icon>clear</v-icon>
                                </v-btn>
                              </v-flex>
                            </template>
                            <v-btn color="info"
                                   @click="addRow"
                                   class="white--text">
                              Parameter
                              <v-icon right dark>add</v-icon>
                            </v-btn>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat :disabled="!valid" @click.native="save">Save</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
            class="elevation-1">
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.title }}</td>
              <td class="text-xs-left">{{ props.item.division.name }}</td>
              <td class="text-xs-left">{{ props.item.datasource.name }}</td>
              <td v-if="props.item.status" class="text-xs-left">Active</td>
              <td v-else class="text-xs-left">Non-active</td>
              <!--<td class="text-xs-left">{{ props.item.created }}</td>-->
              <td class="justify-center layout px-0">
                <v-tooltip bottom>
                  <v-btn icon class="mx-0"
                         slot="activator"
                         @click="editItem(props.item)">
                    <v-icon color="yellow darken-4">edit</v-icon>
                  </v-btn>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn v-if="props.item.status"
                         slot="activator"
                         icon class="mx-0" @click="onDeleteItem(props.item)">
                    <v-icon color="red">remove_circle</v-icon>
                  </v-btn>
                  <v-btn v-else icon
                         slot="activator"
                         class="mx-0" @click="offDeleteItem(props.item)">
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

<script src='./js/report.js'></script>

<style scoped>

</style>
