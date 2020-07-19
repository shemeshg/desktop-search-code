<template>
  <b-container fluid>
      <b-row>
        <b-col>
          <b-form-input
            type="search"
            placeholder="Full text search, empty = all"
            v-model="searchText"
            v-bind:style="{ direction: dirStyle}"
            v-on:keyup.enter="doSearch(false)"
          ></b-form-input>
        </b-col>
        <b-col>
          <b-button class="mr-1" v-on:click="doSearch(false)">Search</b-button>
          <b-button class="mr-1" v-on:click="doSearch(true)">Search Favorites</b-button>
        </b-col>
      </b-row>

    <b-card >
      <b-link v-on:click="doMoveResultToWorkbook()">Move results to workbook </b-link>
      <select v-model="movetoWorkbookId" >
      <option
        v-for="option in workbooks"
        v-bind:key="option.uuid"
        v-bind:value="option.id"
      >{{ option.name }}</option>
      </select>
      &nbsp; |
          <b-badge variant="success" v-if="showTags" v-on:click="showTags = !showTags">Hide tags</b-badge>
      <b-badge variant v-if="!showTags" v-on:click="showTags = !showTags">Show tags</b-badge>

    <LocalBookmarkListItems :searchResult="searchResult" :showTags="showTags"/>
    </b-card >

  </b-container>

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import {LocalBookmark, TLocalBookmark} from "../src/dxdb/localBookmark"

import LocalBookmarkListItems from "./LocalBookmarkListItems.vue"
import { TWorkbook } from "../src/dxdb/workbook";

@Component({
  computed: {
    ...mapState(["selectedWorkbookId", "workbooks"])
  },
  components: {
    LocalBookmarkListItems,
  }
})
export default class LocalBookmarkList extends Vue {
  selectedWorkbookId!: number;
  workbooks!: TWorkbook[];
  searchText = ""
  searchResult: TLocalBookmark[] = []
  movetoWorkbookId = 1;
  showTags = false;

  mounted(){
    this.$store.state.pageName = "Bookmarks"
  }

  async doMoveResultToWorkbook(){
    for (let i=0; i<this.searchResult.length; i++){
      const r = await LocalBookmark.getByUuid(this.searchResult[i].uuid)
      r.workbookId = this.movetoWorkbookId
      await r.save()
    }
    this.searchResult = [];
  }


  async doSearch(onlyFavorites: boolean){
    this.searchResult = await LocalBookmark.fullTextSearch(this.searchText, onlyFavorites, this.selectedWorkbookId)    
  }

  get dirStyle() {
    const rtlChars =
        "\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC",
      rtlDirCheck = new RegExp("^[^" + rtlChars + "]*?[" + rtlChars + "]");

    if (rtlDirCheck.test(this.searchText)) {
      return "rtl";
    }
    return "";
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>