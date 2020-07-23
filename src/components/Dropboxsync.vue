<template>
  <b-container fluid>
      <h1> Do dropbox sync</h1> 
      <b-link v-on:click="doAuth()">authenticate</b-link>
      <br />
      <b-link v-on:click="doSetLocalStorage()">setLocalStorage</b-link>
      <br />
      <b-link v-on:click="doListFiles()">doListFiles</b-link>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Test from "../src/dropboxSync"

@Component({
  computed: {
  }
})
export default class LocalBookmark extends Vue {
  doAuth(){
    Test.authenticate();
  }

  doSetLocalStorage(){
    Test.setAccessTokenFromUrl();
  }

  doListFiles(){
    Test.listFiles()
  }

  mounted() {
    this.$store.state.pageName = "Dropbox Sync";
    debugger;
  }




}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>