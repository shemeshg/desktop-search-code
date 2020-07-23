<template>
  <b-container fluid>
      <h1> Do dropbox sync</h1> 
      <b-link v-on:click="doAuth()">authenticate</b-link>
      <br />
      <b-link v-on:click="doSetLocalStorage()">setLocalStorage</b-link>
      <br />
      <b-link v-on:click="doListFiles()">doListFiles</b-link>
<br />
      <b-link v-on:click="uploadFile()">uploadFile</b-link>
<br />
      <b-link v-on:click="downloadFile()">downloadFile</b-link>
      


  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Test from "../src/dropboxSync"
import * as Util from "../src/util"

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

  async uploadFile(){
    const str = await Util.doExport()
    Test.uploadFile("myTextFile.txt",str)
  }

  async downloadFile(){
    const str  = await Test.downloadFile("myTextFile.txt") as string
    await Util.doImport(str);
    this.$store.dispatch('getApplicationData')
  }

  mounted() {
    this.$store.state.pageName = "Dropbox Sync";
  }




}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>