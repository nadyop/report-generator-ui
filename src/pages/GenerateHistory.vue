<!--Created by Brenda Pinem and Nadya P-->
<template>
  <div>
    <v-layout row mt-5>
      <v-flex md10 offset-md1>
        <v-card>
          <v-card-title>
            <v-flex class="title">History of Generate Report</v-flex>
            <v-spacer></v-spacer>
          </v-card-title>
        </v-card>
        <v-card>
          <v-layout row justify-space-between>
            <v-dialog v-model="dialogDescription" persistent max-width="600px">
              <v-card>
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >
                  Values
                </v-card-title>
                <v-card-text>
                  <template v-for="val in editedItem.values">
                    <span :key="val.id">{{ val.order }}. </span>
                    <span :key="val.id">{{ val.value }}<br/></span>
                  </template>
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
            :pagination.sync="pagination_"
            :rows-per-page-items="[20]"
            class="elevation-1">
            <template slot="items" slot-scope="props">
              <!-- <td class="text-xs-left">{{ props.item.no }}</td> -->
              <td class="text-xs-left">{{ props.item.name.substring(21, props.item.name.length-38) }}</td>
              <td class="text-xs-left">{{ new Date(props.item.requestTime).toDateString() }}</td>
              <td class="text-xs-left">{{ new Date(props.item.requestTime).toTimeString().substr(0, 8) }}</td>
              <td v-if='props.item.status=="DONE"' class="text-xs-left">Done</td>
              <td v-else-if='props.item.status=="RUNNING"' class="text-xs-left">Running</td>
              <td v-else-if='props.item.status=="WAITING"' class="text-xs-left">Waiting</td>
              <td v-else class="text-xs-left">Failed</td>
              <td class="justify-center layout px-0">
                <v-tooltip bottom>
                  <v-btn v-if="props.item.values.length > 0" icon class="mx-0"
                         slot="activator"
                         @click="description(props.item)">
                    <v-icon color="yellow darken-4">info</v-icon>
                  </v-btn>
                  <span>Description</span>
                </v-tooltip>
                <v-tooltip bottom v-if='props.item.status=="DONE"'>
                  <v-btn slot="activator" icon class="mx-0" @click="downloadItemName(props.item)">
                    <v-icon color="blue">cloud_download</v-icon>
                  </v-btn>
                  <span>Download</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <!--<v-btn slot="activator" icon class="mx-0" @click="editItem(props.item)">-->
                  <v-btn slot="activator" icon class="mx-0" @click="deleteItem(props.item)">
                    <v-icon color="red">delete_forever</v-icon>
                  </v-btn>
                  <span>Delete</span>
                </v-tooltip>
              </td>
            </template>
            <template slot="no-data">
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                There is no data
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

<script src='./js/generatehistory.js'></script>

<style scoped>

</style>
