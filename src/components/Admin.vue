<template>
  <b-container fluid>
    <h2>Chrome extention: drag link to chrome bookmarks bar</h2>
    <a v-bind:href="addDesktopsearchBookmark">Add Bookmark</a>
    <h2>Workbooks</h2>
    <b-card class="mb-2">
      <b-link v-on:click="addWorkbook()">Add</b-link>
      <ul>
        <li v-for="(workbook, idx) in workbooks" :key="workbook.uuid" class="mb-2">
          <b-form-input :value="workbook.name" @change="emitWorkbookName(workbook, $event)"></b-form-input>

          <span v-if="idx !== 0">
            <b-link v-on:click="deleteWorkbook(workbook, idx)">Del</b-link>
          </span>
        </li>
      </ul>
    </b-card>

    <h2>External search</h2>
    <b-card class="mb-2">
      <ul>
        <div v-for="(externalSearch, idx) in externalSearchs" :key="externalSearch.uuid">
          <b-form-row>
            <b-form-group label="Name:" class="mb-2 mr-sm-2 mb-sm-0">
              <b-form-input
                :value="externalSearch.name"
                @change="emitExternalSearchName(externalSearch, $event)"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Url:" class="mb-2 mr-sm-2 mb-sm-0">
              <b-form-input
                :value="externalSearch.url"
                @change="emitExternalSearchUrl(externalSearch, $event)"
                required
              ></b-form-input>
            </b-form-group>
          </b-form-row>
          <span v-if="idx !== 0">
            <b-link v-on:click="deleteExternalSearch(externalSearch, idx)">Del</b-link> &nbsp;|
          </span>
          <b-link v-on:click="addExternalSearchParam(externalSearch)">Add param</b-link>
          <b-card
            v-for="(externalSearchParam, idxp) in externalSearch.externalSearchParams"
            :key="externalSearchParam.uuid"
          >
            <b-form-row>
              <b-form-group label="Param:" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input
                  :value="externalSearchParam.paramName"
                  @change="emitExternalSearchearchParamName(externalSearch, idxp, $event)"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Val:" class="mb-2 mr-sm-2 mb-sm-0">
                <b-input-group prepend="is search param">
                  <b-input-group-append is-text>
                    <b-form-checkbox
                      switch
                      class="mr-n2 mb-n1"
                      v-model="externalSearchParam.paramValueIsSearchText"
                      @change="emitExternalSearchearchPValueIsSearchText(externalSearch, idxp, $event)"
                    >
                      <span class="sr-only"></span>
                    </b-form-checkbox>
                    <b-form-input
                      class="ml-2"
                      v-if="!externalSearchParam.paramValueIsSearchText "
                      :value="externalSearchParam.paramValue"
                      @change="emitExternalSearchearchParamValue(externalSearch, idxp, $event)"
                    ></b-form-input>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-form-row>
            <b-link v-on:click="delExternalSearchParam(externalSearch, idxp)">Del param</b-link>
          </b-card>
        </div>
      </ul>
      <b-link v-on:click="addExternalSearch()">Add</b-link>
    </b-card>

    <b-card class="mb-2">
      <h2>Export</h2>
      <b-button class="mr-1" v-on:click="doExportBookmarks">Export bookmarks</b-button>
      <h2>Import</h2>
      <input class="btn mr-1 btn-secondary" type="file" @change="doImportBookmarks" ref="el" />
    </b-card>
  </b-container>
</template>

<script lang="ts">
import { mapState } from "vuex";

import { Component, Vue } from "vue-property-decorator";
import { TWorkbook, Workbook } from "../src/dxdb/workbook";
import { LocalBookmark, TLocalBookmark } from "../src/dxdb/localBookmark";
import {
  TExternalSearch,
  ExternalSearch,
  ExternalSearchParam
} from "../src/dxdb/externalSearch";
import * as Util from "../src/util";

@Component({
  computed: {
    ...mapState([
      "selectedWorkbookId",
      "workbooks",
      "selectedExternalSearchId",
      "externalSearchs"
    ])
  },
  components: {}
})
export default class Admin extends Vue {
  selectedWorkbookId!: number;
  workbooks!: TWorkbook[];
  externalSearchs!: TExternalSearch[];
  selectedExternalSearchId!: number;

  addDesktopsearchBookmark = `javascript:
title = document.title;
url = window.location.href;
description = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').content : "";
keywords = document.querySelector('meta[name="keywords"]') ? document.querySelector('meta[name="keywords"]').content : "";
hostname = window.location.hostname;
r = {title: title, url: url, description: description, keywords: keywords, hostname: hostname};

rs=JSON.stringify(r);
url = "${window.location.href.replace(
    "#/admin",
    "#/localBookmark/-2"
  )}" + encodeURIComponent(rs);

window.open(url, "_blank");

`;

  mounted() {
    this.$store.state.pageName = "Admin";
  }

  async addExternalSearchParam(externalSearch: TExternalSearch) {
    const w = new ExternalSearchParam();
    w.paramName = "q";
    w.paramValue = "";
    w.paramValueIsSearchText = true;

    externalSearch.externalSearchParams.push(w);

    const e = new ExternalSearch(externalSearch);
    return e.save();
  }

  delExternalSearchParam(externalSearch: TExternalSearch, idxp: number) {
    externalSearch.externalSearchParams.splice(idxp, 1);
    const w = new ExternalSearch(externalSearch);
    return w.save();
  }

  async deleteWorkbook(workbook: TWorkbook, idx: number) {
    await LocalBookmark.deleteByWorkbookId(Number(workbook.id));

    const w = new Workbook(workbook);
    await w.delete();

    this.workbooks.splice(idx, 1);
    this.selectedWorkbookId = Number(this.workbooks[0].id);
  }

  async deleteExternalSearch(externalSearch: TExternalSearch, idx: number) {
    const w = new ExternalSearch(externalSearch);
    await w.delete();

    this.externalSearchs.splice(idx, 1);
    this.selectedExternalSearchId = Number(this.externalSearchs[0].id);
  }

  async addExternalSearch() {
    const r = new ExternalSearch(undefined);
    r.name = "new search";
    r.url = "https://domain/search";
    const p = new ExternalSearchParam();
    p.paramName = "q";
    p.paramValueIsSearchText = true;
    r.externalSearchParams = [p];
    r.save();
    this.externalSearchs.push(r);
  }

  async addWorkbook() {
    const w = new Workbook(undefined);
    w.name = "New workbook";
    await w.save();
    this.workbooks.push(w);
  }

  // eslint-disable-next-line
  emitExternalSearchearchPValueIsSearchText(
    externalSearch: TExternalSearch,
    idxp: number,
    event: boolean
  ) {
    externalSearch.externalSearchParams[idxp].paramValueIsSearchText = event;
    if (externalSearch.externalSearchParams[idxp].paramValueIsSearchText) {
      externalSearch.externalSearchParams[idxp].paramValue = "";
    }

    const w = new ExternalSearch(externalSearch);
    return w.save();
  }

  // eslint-disable-next-line
  emitExternalSearchearchParamValue(
    externalSearch: TExternalSearch,
    idxp: number,
    event: string
  ) {
    externalSearch.externalSearchParams[idxp].paramValue = event;
    const w = new ExternalSearch(externalSearch);
    return w.save();
  }

  // eslint-disable-next-line
  emitExternalSearchearchParamName(
    externalSearch: TExternalSearch,
    idxp: number,
    event: string
  ) {
    externalSearch.externalSearchParams[idxp].paramName = event;
    const w = new ExternalSearch(externalSearch);
    return w.save();
  }

  // eslint-disable-next-line
  emitExternalSearchUrl(externalSearch: TExternalSearch, event: any) {
    externalSearch.url = event;
    const w = new ExternalSearch(externalSearch);
    return w.save();
  }

  // eslint-disable-next-line
  emitExternalSearchName(externalSearch: TExternalSearch, event: any) {
    externalSearch.name = event;
    const w = new ExternalSearch(externalSearch);
    return w.save();
  }

  // eslint-disable-next-line
  emitWorkbookName(workbook: TWorkbook, event: any) {
    workbook.name = event.target.value;
    const w = new Workbook(workbook);
    return w.save();
  }

  async doExportBookmarks() {
    const bookmarks = await LocalBookmark.getAllByWorkbookId(
      this.selectedWorkbookId
    );
    Util.downloadFileAsString("workbookBookmarks", JSON.stringify(bookmarks));
  }

  // eslint-disable-next-line
  async doImportBookmarks(target: any) {
    // eslint-disable-next-line
    const el: any = this.$refs.el;
    const str = await Util.readFileAsString(el);

    el.value = "";
    const bookmarks = JSON.parse(str);
    for (let i = 0; i < bookmarks.length; i++) {
      const row: TLocalBookmark = bookmarks[i];
      const newRecord = new LocalBookmark(row);
      delete newRecord.id;
      newRecord.uuid = row.uuid;
      newRecord.workbookId = this.selectedWorkbookId;
      const extsting = await LocalBookmark.getByUuid(newRecord.uuid);

      if (extsting.id) {
        newRecord.id = extsting.id;
        if(newRecord.modifiedDateTime > extsting.modifiedDateTime){
          await newRecord.save();
        }        
      } else {
        await newRecord.save();
      }
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>