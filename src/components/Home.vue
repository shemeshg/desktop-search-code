<template>
  <b-container fluid>
      <b-form-radio-group  v-model.number="searchType" name="searchtype" size="sm"
      @change="searchTypeChange($event)"
      >
        <b-form-radio value="0" >Tags</b-form-radio>
        <b-form-radio value="1" >Fulltext</b-form-radio>
         <b-badge variant="success" v-if="isFavoritesOnly && searchType===1" v-on:click="isFavoritesOnly = !isFavoritesOnly">Favorites only</b-badge>
         <b-badge variant v-if="!isFavoritesOnly && searchType===1" v-on:click="isFavoritesOnly = !isFavoritesOnly">Favorites only</b-badge>
      </b-form-radio-group>
    <b-row>
      <b-col sm>
        <b-form-input
          type="search"
          :placeholder="getSearchPlaceholder"
          v-model="searchText"
          v-bind:style="{ direction: dirStyle}"
          v-on:keyup.enter="doSearch"
        ></b-form-input>
      </b-col>
      <b-col>
        <div class="input-group mb-2">
          <b-button class="mr-1" v-on:click="doSearch">Search</b-button>
          <b-button class="mr-1" v-on:click="doRedirect">Feel lucky</b-button>
          <div class="input-group-prepend">
            <b-button class="mr-0" v-on:click="doExternal">External</b-button>
          </div>
          <SelectDefaultExternalSearch />
        </div>
      </b-col>
    </b-row>

    <b-input-group size="sm" prepend="Local" class="mt-2">
      <b-input-group-append is-text>
        <b-form-checkbox switch class="mr-n2 mb-n1" v-model="isSearchLocal" @change="isSearchLocalChange($event)">
          <span class="sr-only"></span>
        </b-form-checkbox>
      </b-input-group-append>
    </b-input-group>
    <b-card v-if="isSearchLocal">
      <b-link v-on:click="addNewBookmark()">Add new bookmark</b-link>|
      <b-link v-on:click="doMoveResultToWorkbook()">Move results to workbook</b-link>
      <select v-model="movetoWorkbookId">
        <option
          v-for="option in workbooks"
          v-bind:key="option.uuid"
          v-bind:value="option.id"
        >{{ option.name }}</option>
      </select>
      &nbsp; |
      <b-badge variant="success" v-if="showTags" v-on:click="showTags = !showTags">Hide tags</b-badge>
      <b-badge variant v-if="!showTags" v-on:click="showTags = !showTags">Show tags</b-badge>

      <LocalBookmarkListItems :searchResult="searchLocalResult" :showTags="showTags" />See also:
      <b-link
        v-for="str in seeAlso"
        v-on:click="setSearchInputAndSearch(str)"
        v-bind:key="str"
      >{{str}},</b-link>
    </b-card>

    <b-input-group size="sm" prepend="Internet" class="mt-2">
      <b-input-group-append is-text>
        <b-form-checkbox switch class="mr-n2 mb-n1" v-model="isSearchInternet" @change="isSearchInternetChange($event)">
          <span class="sr-only"></span>
        </b-form-checkbox>
      </b-input-group-append>
    </b-input-group>
    <b-card v-if="isSearchInternet">
      <p>
        {{cachedDate}}
        <b-link v-on:click="doRefresh(cashedDbRowId)" v-if="this.cashedDbRowId !== -1">Refresh</b-link>
      </p>

      <ul>
        <li v-for="item in searchResult" :key="item.uuid">
          <b-link v-bind:href="item.url">{{item.header}}</b-link>
          <div>{{item.url}}</div>
          <p>
            {{item.text}}
            <br v-if="item.text" />
            <b-link v-on:click="addBookmarkFromItem(item)">Add bookmark</b-link>
          </p>
        </li>
      </ul>
    </b-card>&nbsp;
  </b-container>
</template>

<script lang="ts">
import { searchEngine } from "../src/SearchEngine";
import { LocalBookmark } from "../src/dxdb/localBookmark";
import { CashedSearch } from "../src/dxdb/cashedSearch";
import { GenericSearchResult } from "../src/genericSearchResult";
import { Component, Prop, Vue } from "vue-property-decorator";

import LocalBookmarkListItems from "./LocalBookmarkListItems.vue";
import SelectDefaultExternalSearch from "./SelectDefaultExternalSearch.vue";

import { mapState } from "vuex";

import { TWorkbook } from "../src/dxdb/workbook";
import { applicationConfig, SearchTypes } from "../src/ApplicationConfig";

@Component({
  computed: {
    ...mapState(["selectedWorkbookId", "workbooks"])
  },
  components: {
    LocalBookmarkListItems,
    SelectDefaultExternalSearch
  }
})
export default class Home extends Vue {
  @Prop() private msg!: string;
  showTags = false;
  selectedWorkbookId!: number;
  workbooks!: TWorkbook[];

  isSearchLocal = applicationConfig.isHomeSearchLocal;
  isSearchInternet = applicationConfig.isHomeSearchInternet;
  searchType = 0
  isFavoritesOnly = false;

  movetoWorkbookId = 1;

  searchText = "";
  cachedDate = "";
  cashedDbRowId = -1;
  searchTextForResult = "";
  seeAlso: string[] = [];

  searchResult: GenericSearchResult[] = [];
  searchLocalResult: GenericSearchResult[] = [];

  created(){
    this.searchType = applicationConfig.searchType;
  }

  mounted() {
    this.$store.state.pageName = "Home";
  }

  get getSearchPlaceholder() {
    if (this.searchType === SearchTypes.TAGS) {
      return "Tag search like a or (b and c)"
    } 
      return "Full text search, empty = all";    
  }

  isSearchLocalChange(val: boolean){
    applicationConfig.isHomeSearchLocal = val;
    applicationConfig.save();
  }

  isSearchInternetChange(val: boolean){
    applicationConfig.isHomeSearchInternet = val;
    applicationConfig.save();
  }

  searchTypeChange(val: number){   
    applicationConfig.searchType = Number(val);
    applicationConfig.save();
  }

  async doMoveResultToWorkbook() {
    for (let i = 0; i < this.searchLocalResult.length; i++) {
      const r = await LocalBookmark.getByUuid(this.searchLocalResult[i].uuid);
      r.workbookId = this.movetoWorkbookId;
      await r.save();
    }
    this.doClear();
  }

  doClear() {
    this.searchText = "";
    this.cachedDate = "";
    this.cashedDbRowId = -1;
    this.searchTextForResult = "";
    this.seeAlso = [];

    this.searchResult = [];
    this.searchLocalResult = [];
  }

  async doRefresh(cashedDbRowId: number) {
    await CashedSearch.deleteById(cashedDbRowId);
    this.doSearch();
  }

  setSearchInputAndSearch(str: string) {
    this.searchText = str;
    return this.doSearch();
  }

  doExternal() {
    searchEngine.doExternalSearch(this.searchText);
  }

  async doRedirect() {
    if (!this.searchText) {
      return;
    }
   await this.doSearch()
    if (this.searchLocalResult.length > 0 && !this.searchLocalResult[0].relatedSubject) {
      const url = this.searchLocalResult[0].url;
      this.doClear();
      window.location.href = url;
      return;
    }
    
    if (this.searchResult.length > 0 && !this.searchResult[0].relatedSubject) {
      const url = this.searchResult[0].url;
      this.doClear();
      window.location.href = url;
      return;
    }

  }

  async addBookmarkFromItem(item: GenericSearchResult) {
    const id = await LocalBookmark.addBookmarkFromGenericItem(
      item,
      this.searchTextForResult,
      this.selectedWorkbookId
    );
    this.$router.push({ name: "localBookmark", params: { id: id.toString() } });
  }

  addNewBookmark() {
    this.$router.push({ name: "localBookmark", params: { id: "-1" } });
  }

  async doSearch() {
    const searchText = this.searchText.toLowerCase().trim();
    
    if (!searchText) {
      if (this.searchType === SearchTypes.FULLTEXT) {
        this.doClear();
        await this.searchLocalFulltext(this.isFavoritesOnly)
      }
      return;
    }
    

    this.searchResult = [];
    try {
      if (this.isSearchInternet) {
        const r = await searchEngine.getResult(searchText);
        this.searchTextForResult = searchText;
        this.searchResult = r.data;
        this.cachedDate = new Date(r.dbRow.dateTime).toString();
        this.cashedDbRowId = r.dbRow.id ?? -1;
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }

    this.searchLocalResult = [];

    if (this.isSearchLocal) {
      if (this.searchType === SearchTypes.TAGS) {
        await this.searchLocalTags(searchText)
      } else {
        await this.searchLocalFulltext(this.isFavoritesOnly)
      }
    }
  }

  private async searchLocalFulltext(onlyFavorites: boolean){
    this.searchLocalResult = await LocalBookmark.fullTextSearch(this.searchText.toLowerCase(), onlyFavorites, this.selectedWorkbookId)    
  }

  private async searchLocalTags(searchText: string){
      const searchExp = searchText + ' or "' + searchText + '"';
      this.searchLocalResult = await LocalBookmark.tagSearch(
        searchExp,
        this.selectedWorkbookId
      );

      const seeAlso = await LocalBookmark.relatedTags(
        searchText,
        this.selectedWorkbookId
      );

      this.seeAlso = seeAlso.splice(0, 20);
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
