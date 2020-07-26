<template>
  <b-container fluid>
    <h1>Dropbox</h1>
    <p>{{status}}</p>
    <b-link v-if="this.isTokenValid===false" v-on:click="doAuth()">Authenticate</b-link>
    <br />
    <b-link v-on:click="doSync(false)">Do Sync</b-link>
    <br />
    <p>Upload only for every time workbook is delited or renamed or delete the backup file on dropbox</p>
    <p>this is required since no log for changes exists on bookmark table</p>
    <b-link v-on:click="doSync(true)">Do Upload Only</b-link>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as DropboxSync from "../src/dropboxSync";
import * as Util from "../src/util";

@Component({
  computed: {},
})
export default class LocalBookmark extends Vue {
  status = "";
  isTokenValid = true;

  async doSync(forceUploadOnly: boolean) {
    const exportImportFilename = "backup.txt";

    this.status = "";
    if (!DropboxSync.isAuthenticated()) {
      this.status = "Not authenticated";
      this.isTokenValid = false;
      return;
    }

    // eslint-disable-next-line
    let listOfFiles: any = [];
    try {
      listOfFiles = await DropboxSync.listFiles();
    } catch (error) {
      this.status = "Could not authenticate";
      this.isTokenValid = false;
      return;
    }

    // eslint-disable-next-line
    const doDownload =listOfFiles.entries.map((row: any) => {return row.name;}).indexOf(exportImportFilename) > -1;
    if (doDownload && !forceUploadOnly) {
      this.status = "Downloading changes";
      const str = (await DropboxSync.downloadFile(exportImportFilename)) as string;
      await Util.doImport(str);
      this.$store.dispatch("getApplicationData");
    }
    this.status = "Uploading changes";
    const str = await Util.doExport();
    await DropboxSync.uploadFile(exportImportFilename, str);
    this.status = "Completed"
  }

  doAuth() {
    DropboxSync.authenticate();
  }




 

  mounted() {
    this.$store.state.pageName = "Dropbox Sync";
    this.status = "";
    this.isTokenValid = true;
        
    if (window.location.hash){
      DropboxSync.setAccessTokenFromUrl();
      this.$router.replace({name: "dropboxsync"})

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>