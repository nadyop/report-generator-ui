<!--Created by Brenda Pinem and Nadya P-->
<template>
  <div>
    <v-layout row mt-5>
      <v-flex md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-flex class="title">Generate Report</v-flex>
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
            <v-dialog v-model="dialogGenerate" persistent max-width="600px">
              <v-card>
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >
                  Send To
                </v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="sendEmailAndGenerate">
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                          <v-flex xs12 sm12 class="ml-3 mr-3">
                          <v-text-field label="Email"
                                        required
                                        placeholder="Please input your receiver email"
                                        :rules="[
                                            v => !!v || 'E-mail is required',
                                            v => /.+@.+/.test(v) || 'E-mail must be valid'
                                        ]"
                                        v-model="editedItem.email"
                                        hint="Use semicolon (;) to add more receiver " ></v-text-field>
                          </v-flex>
                            <template v-for="(input, index) in editedItem.values">
                            <v-text-field v-model="input.order"
                            :key="index"
                                          class="hidden-sm-and-up"
                                          item-value="order"
                                          @data="index"
                                          type="number">
                            </v-text-field>
                            <v-text-field v-model="input.type"
                            :key="index"
                                          item-value="type"
                                          class="hidden-sm-and-up"
                                          @data="index">
                            </v-text-field>
                            <v-flex xs6 sm5 :key="index" class="ml-3 mr-2">
                              <v-text-field v-model="input.name"
                                            readonly
                                            label="Name">
                              </v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 :key="index" class="">
                              <v-text-field v-model="input.value"
                                            item-value="value"
                                            label="Value">
                              </v-text-field>
                            </v-flex>
                          </template>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat :disabled="!valid" @click.native="save()">Send & Generate</v-btn>
                  </v-card-actions>
                </v-form>
                <v-divider></v-divider>
              </v-card>
            </v-dialog>
          </v-layout>
           <v-layout row justify-space-between>
            <v-dialog v-model="dialogDescription" persistent max-width="600px">
              <v-card>
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >
                  Description
                </v-card-title>
                <v-card-text>
                  <span class="subheading justify-center">
                    {{ editedItem.report }}
                  </span>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
            :rows-per-page-items="[20]"
            class="elevation-1">
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.title }}</td>
              <td class="text-xs-left">{{ props.item.division.name }}</td>
              <td class="text-xs-left">{{ props.item.datasource.name }}</td>
              <td v-if="props.item.status" class="text-xs-left">Active</td>
              <td v-else class="text-xs-left">Non-active</td>
              <td class="justify-center layout px-0">
                <v-tooltip bottom>
                  <v-btn icon class="mx-0"
                         slot="activator"
                         @click="description(props.item)">
                    <v-icon color="yellow darken-4">info</v-icon>
                  </v-btn>
                  <span>Description</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn slot="activator" v-if="editedItem.values" icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="blue">save_alt</v-icon>
                  </v-btn>
                  <v-btn slot="activator" v-else icon class="mx-0" @click.native="save">
                    <v-icon color="blue">save_alt</v-icon>
                  </v-btn>
                  <span>Send and Generate</span>
                </v-tooltip>
              </td>
            </template>
            <template slot="no-data">
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

<script src='./js/generate.js'></script>

<style scoped>

</style>
