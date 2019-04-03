<!--Created by Brenda Pinem and Nadya P-->
<template>
  <v-app id="inspire" v-if="isLogin === true">
    <v-content>
      <drawer/>
      <router-view/>
    </v-content>
    <v-footer class="pa-3" v-if="isLogin === true">
      <v-spacer></v-spacer>
      <div>
        <center>
          REGEN &copy; {{ new Date().getFullYear() }}
        </center>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
  import drawer from 'components/drawer'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      drawer
    },
    data: () => ({
      user: ''
    }),
    name: 'app',
    computed: {
      ...mapGetters(['isLogin'])
    },
    beforeCreate () {
      this.$store.commit('isLogin', true)
    }
  }
</script>

<style scoped>

</style>
