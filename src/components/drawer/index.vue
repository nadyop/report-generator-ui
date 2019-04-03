<!--Created by Brenda Pinem and Nadya P-->
<template>
  <div>
    <v-navigation-drawer fixed clipped
                         v-model="drawer"
                         app>
      <v-list>
        <template v-if="user.user.roles.name === 'REGEN.ROLE_REGEN_ADMIN'" v-for="item in itemAdmins">
          <v-list-tile :key="item.href" :to="item.href">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <template v-if="user.user.roles.name === 'REGEN.ROLE_REGEN_USER'" v-for="item in itemUsers">
          <v-list-tile :key="item.href" :to="item.href">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark
               color="blue accent-3"
               fixed
               clipped-left
               dense
               app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span>
          REGEN
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="changeIsLogin">
        <v-icon>power_settings_new</v-icon> &nbsp; LOGOUT
      </v-btn>
    </v-toolbar>
  </div>
</template>

<style scoped>

</style>

<script>
  import {mapGetters} from 'vuex'
  import axios from 'axios'
  import {hostAddress, casLogout, casLogin, casCheck} from 'utils/variable'
  export default {
    name: 'drawer',
    data: () => ({
      user: { user: {roles: {name: ''}}},
      drawer: null,
      itemAdmins: [
        {
          icon: 'history',
          text: 'Generate History',
          href: 'generate-history'
        },
        {
          icon: 'save_alt',
          text: 'Generate Report',
          href: 'generate'
        },
        {
          icon: 'file_copy',
          text: 'Report Configure',
          href: 'report'
        },
        {
          icon: 'storage',
          text: 'Datasources',
          href: 'datasource'
        },
        {
          icon: 'contacts',
          text: 'Divisions',
          href: 'division'
        }
        // {
        //   icon: 'people',
        //   text: 'Users',
        //   href: 'user'
        // },
      ],
      itemUsers: [
        {
          icon: 'history',
          text: 'Generate History',
          href: 'generate-history'
        },
        {
          icon: 'save_alt',
          text: 'Generate Report',
          href: 'generate'
        }
      ]
    }),
    methods: {
      changeIsLogin () {
        this.$store.commit('isLogin', false)
        this.logout()
      },
      logout: function () {
        const URL = '/api/api/regen/cas-auth/logout'
        axios.get(URL, { headers: {
          'Access-Control-Allow-Origin': '*'
        }})
          .then(() => {
            this.$route.router.go(this.casLogout)
          })
          .catch(() => {
            window.location.href = casLogout
          })
      },
      getUser: function () {
        const URL = '/api/api/regen/cas-user'
        axios.get(URL, { headers: {
          'Access-Control-Allow-Origin': '*'
        }})
          .then(response => {
            this.user = response.data
          })
          .catch(err => {
            console.log(err)
             window.location.href = casLogin + hostAddress + casCheck
          })
      }
    },
    created () {
      this.getUser()
    },
    computed: {
      ...mapGetters(['isLogin'])
    }
  }
</script>
