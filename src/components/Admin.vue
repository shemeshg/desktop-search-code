<template>
  <b-container fluid>
    <h2>Manual Sync</h2>
    <p>
      <b-link v-on:click="dropboxSync">Dropbox Sync</b-link>
    </p>
    <h2>
      Chrome extention: drag link to chrome bookmarks bar, not required for
      mobile (implemented via share api)
    </h2>
    <a v-bind:href="addDesktopsearchBookmark">Add Bookmark</a>
    <h2>Workbooks</h2>
    <b-card class="mb-2">
      <b-link v-on:click="addWorkbook()">Add</b-link>
      <ul>
        <li
          v-for="(workbook, idx) in workbooks"
          :key="workbook.uuid"
          class="mb-2"
        >
          <b-form-input
            :value="workbook.name"
            @change="emitWorkbookName(workbook, $event)"
          ></b-form-input>

          <span>
            <b-link
              v-if="workbooks.length !== 1"
              v-on:click="deleteWorkbook(workbook, idx)"
              >Del</b-link
            >
            &nbsp;<span v-if="workbooks.length !== 1">|</span>
            <b-link v-on:click="purgeWorkbook(workbook)">Purge</b-link>&nbsp;|
            <b-badge
              variant="success"
              v-if="workbook.isExport"
              v-on:click="doToggleExport(workbook)"
              >Export</b-badge
            >
            <b-badge
              variant
              v-if="!workbook.isExport"
              v-on:click="doToggleExport(workbook)"
              >Export</b-badge
            >
          </span>
        </li>
      </ul>
    </b-card>

    <h2>External search</h2>
    <b-card class="mb-2">
      <ul>
        <div
          v-for="(externalSearch, idx) in externalSearchs"
          :key="externalSearch.uuid"
        >
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
            <b-link v-on:click="deleteExternalSearch(externalSearch, idx)"
              >Del</b-link
            >&nbsp;|
          </span>
          <b-link v-on:click="addExternalSearchParam(externalSearch)"
            >Add param</b-link
          >
          <b-card
            v-for="(
              externalSearchParam, idxp
            ) in externalSearch.externalSearchParams"
            :key="externalSearchParam.uuid"
          >
            <b-form-row>
              <b-form-group label="Param:" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input
                  :value="externalSearchParam.paramName"
                  @change="
                    emitExternalSearchearchParamName(
                      externalSearch,
                      idxp,
                      $event
                    )
                  "
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Val:" class="mb-2 mr-sm-2 mb-sm-0">
                <b-input-group prepend="is search param">
                  <b-input-group-append is-text>
                    <b-form-checkbox
                      switch
                      class="mr-n2 mb-n1"
                      v-model="externalSearchParam.paramValueIsSearchText"
                      @change="
                        emitExternalSearchearchPValueIsSearchText(
                          externalSearch,
                          idxp,
                          $event
                        )
                      "
                    >
                      <span class="sr-only"></span>
                    </b-form-checkbox>
                    <b-form-input
                      class="ml-2"
                      v-if="!externalSearchParam.paramValueIsSearchText"
                      :value="externalSearchParam.paramValue"
                      @change="
                        emitExternalSearchearchParamValue(
                          externalSearch,
                          idxp,
                          $event
                        )
                      "
                    ></b-form-input>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-form-row>
            <b-link v-on:click="delExternalSearchParam(externalSearch, idxp)"
              >Del param</b-link
            >
          </b-card>
        </div>
      </ul>
      <b-link v-on:click="addExternalSearch()">Add</b-link>
    </b-card>

    <b-card class="mb-2">
      <h2>Export</h2>
      <b-button class="mr-1" v-on:click="doExportBookmarks">Export</b-button>
      <h2>Import</h2>
      <input
        class="btn mr-1 btn-secondary"
        type="file"
        @change="doImportBookmarks"
        ref="el"
      />
    </b-card>
  </b-container>
</template>

<script lang="ts">
import { TWorkbook, Workbook } from "../src/dxdb/workbook";
import { LocalBookmark } from "../src/dxdb/localBookmark";
import {
  TExternalSearch,
  ExternalSearch,
  ExternalSearchParam,
} from "../src/dxdb/externalSearch";
import * as Util from "../src/util";

import {
  defineComponent,
  onMounted,
  inject,
  computed,
  ComputedRef,
} from "@vue/composition-api";

export default defineComponent({
  setup(prps, { root }) {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const router: any = inject("router");

    const workbooks: ComputedRef<TWorkbook[]> = computed(() => {
      return store.state.workbooks;
    });
    const externalSearchs: ComputedRef<TExternalSearch[]> = computed(() => {
      return store.state.externalSearchs;
    });


    const addDesktopsearchBookmark = `javascript:
title = document.title;
url = window.location.href;
description = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').content : "";
keywords = document.querySelector('meta[name="keywords"]') ? document.querySelector('meta[name="keywords"]').content : "";
hostname = window.location.hostname;
r = {title: title, url: url, description: description, keywords: keywords, hostname: hostname};

rs=JSON.stringify(r);
url = "${window.location.href.replace(
      "/admin",
      "/localBookmark/-2"
    )}" + encodeURIComponent(rs);

window.open(url, "_blank");

`;

    onMounted(() => {
      store.state.pageName = "Admin";
    });

    const dropboxSync = () => {
      router.replace({
        name: "dropboxsync",
      });
    };

    const addExternalSearchParam = async (externalSearch: TExternalSearch) => {
      const w = new ExternalSearchParam();
      w.paramName = "q";
      w.paramValue = "";
      w.paramValueIsSearchText = true;

      externalSearch.externalSearchParams.push(w);

      const e = new ExternalSearch(externalSearch);
      return e.save();
    };

    const delExternalSearchParam = (
      externalSearch: TExternalSearch,
      idxp: number
    ) => {
      externalSearch.externalSearchParams.splice(idxp, 1);
      const w = new ExternalSearch(externalSearch);
      return w.save();
    };

    const doToggleExport = async (workbook: TWorkbook) => {
      workbook.isExport = workbook.isExport ? 0 : 1;
      const w = new Workbook(workbook);
      await w.save();
    };

    const deleteWorkbook = async (workbook: TWorkbook, idx: number) => {
      await LocalBookmark.deleteByWorkbookId(Number(workbook.id));

      const w = new Workbook(workbook);
      await w.delete();

      workbooks.value.splice(idx, 1);
      store.commit("emitSelectedWorkbookId", Number(workbooks.value[0].id));
    };

    const purgeWorkbook = async (workbook: TWorkbook) => {
      await LocalBookmark.purgeByWorkbookId(Number(workbook.id));
    };

    const deleteExternalSearch = async (
      externalSearch: TExternalSearch,
      idx: number
    ) => {
      const w = new ExternalSearch(externalSearch);
      await w.delete();

      externalSearchs.value.splice(idx, 1);
      store.state.selectedExternalSearchId = Number(
        externalSearchs.value[0].id
      );
    };

    const addExternalSearch = async () => {
      const r = new ExternalSearch(undefined);
      r.name = "new search";
      r.url = "https://domain/search";
      const p = new ExternalSearchParam();
      p.paramName = "q";
      p.paramValueIsSearchText = true;
      r.externalSearchParams = [p];
      r.save();
      externalSearchs.value.push(r);
    };

    const addWorkbook = async () => {
      const w = new Workbook(undefined);
      w.name = "New workbook";
      await w.save();
      workbooks.value.push(w);
    };

    // eslint-disable-next-line
    const emitExternalSearchearchPValueIsSearchText = (
      externalSearch: TExternalSearch,
      idxp: number,
      event: boolean
    ) => {
      externalSearch.externalSearchParams[idxp].paramValueIsSearchText = event;
      if (externalSearch.externalSearchParams[idxp].paramValueIsSearchText) {
        externalSearch.externalSearchParams[idxp].paramValue = "";
      }

      const w = new ExternalSearch(externalSearch);
      return w.save();
    };

    // eslint-disable-next-line
    const emitExternalSearchearchParamValue = (
      externalSearch: TExternalSearch,
      idxp: number,
      event: string
    ) => {
      externalSearch.externalSearchParams[idxp].paramValue = event;
      const w = new ExternalSearch(externalSearch);
      return w.save();
    };

    // eslint-disable-next-line
    const emitExternalSearchearchParamName = (
      externalSearch: TExternalSearch,
      idxp: number,
      event: string
    ) => {
      externalSearch.externalSearchParams[idxp].paramName = event;
      const w = new ExternalSearch(externalSearch);
      return w.save();
    };

    
    const emitExternalSearchUrl = (
      externalSearch: TExternalSearch,
      // eslint-disable-next-line
      event: any
    ) => {
      externalSearch.url = event;
      const w = new ExternalSearch(externalSearch);
      return w.save();
    };

    // eslint-disable-next-line
    const emitExternalSearchName = (
      externalSearch: TExternalSearch,
      // eslint-disable-next-line
      event: any
    ) => {
      externalSearch.name = event;
      const w = new ExternalSearch(externalSearch);
      return w.save();
    };

    // eslint-disable-next-line
    const emitWorkbookName = (workbook: TWorkbook, event: string) => {
      workbook.name = event;
      const w = new Workbook(workbook);
      return w.save();
    };

    const doExportBookmarks = async () => {
      const ret = await Util.doExport();

      Util.downloadFileAsString("workbookBookmarks", ret);
    };

    // eslint-disable-next-line
    const doImportBookmarks = async (target: any) => {
      // eslint-disable-next-line
      const el: any = root.$refs.el;
      const str = await Util.readFileAsString(el);

      el.value = "";

      await Util.doImport(str);
    };
    return {
      workbooks,
      externalSearchs,
      addDesktopsearchBookmark,
      dropboxSync,
      addExternalSearchParam,
      delExternalSearchParam,
      doToggleExport,
      deleteWorkbook,
      purgeWorkbook,
      deleteExternalSearch,
      addExternalSearch,
      addWorkbook,
      emitExternalSearchearchPValueIsSearchText,
      emitExternalSearchearchParamValue,
      emitExternalSearchearchParamName,
      emitExternalSearchUrl,
      emitExternalSearchName,
      emitWorkbookName,
      doExportBookmarks,
      doImportBookmarks,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>