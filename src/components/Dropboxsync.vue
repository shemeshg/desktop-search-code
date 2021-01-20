<template>
  <b-container fluid>
    <h1>Dropbox</h1>
    <p>{{ status }}</p>
    <b-link v-if="isTokenValid === false" v-on:click="doAuth()"
      >Authenticate</b-link
    >
    <br />
    <b-link v-on:click="doSync(false)">Do Sync</b-link>
    <br />
    <p>
      Upload only for every time workbook is delited or renamed or delete the
      backup file on dropbox
    </p>
    <p>this is required since no log for changes exists on bookmark table</p>
    <b-link v-on:click="doSync(true)">Do Upload Only</b-link>
  </b-container>
</template>

<script lang="ts">
import * as DropboxSync from "../src/dropboxSync";
import * as Util from "../src/util";

import { defineComponent, onMounted, inject, ref } from "@vue/composition-api";

export default defineComponent({
  setup() {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const router: any = inject("router");

    const status = ref("");
    const isTokenValid = ref(true);

    const doSync = async (forceUploadOnly: boolean) => {
      const exportImportFilename = "backup.txt";

      status.value = "";
      if (!DropboxSync.isAuthenticated()) {
        status.value = "Not authenticated";
        isTokenValid.value = false;
        return;
      }

      // eslint-disable-next-line
      let listOfFiles: any = [];
      try {
        listOfFiles = await DropboxSync.listFiles();
      } catch (error) {
        status.value = "Could not authenticate";
        isTokenValid.value = false;
        return;
      }

      const doDownload =
      // eslint-disable-next-line
        listOfFiles.entries.map((row: any) => {return row.name;}).indexOf(exportImportFilename) > -1;
      if (doDownload && !forceUploadOnly) {
        status.value = "Downloading changes";
        const str = (await DropboxSync.downloadFile(
          exportImportFilename
        )) as string;
        await Util.doImport(str);
        store.dispatch("getApplicationData");
      }
      status.value = "Uploading changes";
      const str = await Util.doExport();
      await DropboxSync.uploadFile(exportImportFilename, str);
      status.value = "Completed";
    };

    const doAuth = () => {
      DropboxSync.authenticate();
    };

    onMounted(() => {
      store.state.pageName = "Dropbox Sync";
      status.value = "";
      isTokenValid.value = true;

      if (window.location.hash) {
        DropboxSync.setAccessTokenFromUrl();
        router.replace({ name: "dropboxsync" });
      }
    });

    return { status, isTokenValid, doAuth, doSync };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>