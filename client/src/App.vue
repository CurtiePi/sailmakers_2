<template>
  <div id="app">
      <HeaderNav v-if="getLoginApiStatus"  
        :nav-links="navLinks"/>
      <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderNav from '@/components/HeaderNavigation'

export default {
  name: 'App',
  components: {
   HeaderNav 
  },
  computed: {
    ...mapGetters("auth", {
      getLoginApiStatus: "getLoginApiStatus"
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
