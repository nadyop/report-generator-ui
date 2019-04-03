<!--Created by Brenda Pinem and Nadya P-->
<template>
  <div>
    <v-layout row mt-5>
      <v-flex md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-flex class="title">Division Management</v-flex>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="key"
              label="Search by Name"
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
                            :rules="[
                                v => !!v || 'Name is required',
                                v => v.length <= 32 || 'Name must be less than 32 character'
                            ]"
                            :counter="32"
                            required
                            label="Division Name"
                            v-model="editedItem.name"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat
                           class="btn-save"
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
            :rows-per-page-items="[10]"
            class="elevation-1">
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td v-if="props.item.status==true" class="text-xs-left">Active</td>
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

<script src='./js/divisions.js'></script>

<style scoped>

</style>
