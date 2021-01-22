<template>
  <b-container fluid>
    <b-form-radio-group
      v-model.number="searchType"
      name="searchtype"
      size="sm"
      @change="searchTypeChange($event)"
    >
      <b-form-radio value="0">Tags</b-form-radio>
      <b-form-radio value="1">Fulltext</b-form-radio>
      <b-badge
        variant="success"
        v-if="isFavoritesOnly && searchType === 1"
        v-on:click="isFavoritesOnly = !isFavoritesOnly"
        >Favorites only</b-badge
      >
      <b-badge
        variant
        v-if="!isFavoritesOnly && searchType === 1"
        v-on:click="isFavoritesOnly = !isFavoritesOnly"
        >Favorites only</b-badge
      >
    </b-form-radio-group>
    
    <b-row>
     
      <b-col sm>
        <b-form-input
          type="text"
          :placeholder="getSearchPlaceholder"
          v-model="searchText"
          v-bind:style="{ direction: dirStyle }"
          autofocus
          ref="searchTextRef"
        ></b-form-input>
      </b-col> 

      <b-col lg>
        <div class="input-group mb-2">
          <b-button class="mr-1" v-on:click="doSearch">
            <b-icon-search></b-icon-search>
          </b-button>
          <b-button class="mr-1" v-on:click="doRedirect" size="sm">
            <b-icon-search></b-icon-search>
            <b-icon-box-arrow-in-up-right></b-icon-box-arrow-in-up-right>
          </b-button>
          <div class="input-group-prepend">
            <b-button class="mr-0" v-on:click="doExternal">
              <b-icon-box-arrow-in-up-right></b-icon-box-arrow-in-up-right>
            </b-button>
            <SelectDefaultExternalSearch
              class="custom-select"
              style="width: 170px"
            />
          </div>
        </div>
      </b-col>
    
    </b-row>

    <b-input-group size="sm" prepend="Local" class="mt-2">
      <b-input-group-append is-text>
        <b-form-checkbox
          switch
          class="mr-n2 mb-n1"
          v-model="isSearchLocal"
          @change="isSearchLocalChange($event)"
        >
          <span class="sr-only"></span>
        </b-form-checkbox>
      </b-input-group-append>
    </b-input-group>
    <b-card v-if="isSearchLocal">
      <b-link v-on:click="addNewBookmark()">Add new bookmark</b-link>|
      <b-link v-on:click="doMoveResultToWorkbook()"
        >Move results to workbook</b-link
      >
      <select v-model="movetoWorkbookId">
        <option
          v-for="option in workbooks"
          v-bind:key="option.uuid"
          v-bind:value="option.id"
        >
          {{ option.name }}
        </option>
      </select>
      &nbsp; |
      <b-badge
        variant="success"
        v-if="showTags"
        v-on:click="showTags = !showTags"
        >Hide tags</b-badge
      >
      <b-badge variant v-if="!showTags" v-on:click="showTags = !showTags"
        >Show tags</b-badge
      >

      <LocalBookmarkListItems
        :searchResult="searchLocalResult"
        :showTags="showTags"
      />See also:
      <b-link
        v-for="str in seeAlso"
        v-on:click="setSearchInputAndSearch(str)"
        v-bind:key="str"
        >{{ str }},</b-link
      >
    </b-card>

    <b-input-group size="sm" prepend="Internet" class="mt-2">
      <b-input-group-append is-text>
        <b-form-checkbox
          switch
          class="mr-n2 mb-n1"
          v-model="isSearchInternet"
          @change="isSearchInternetChange($event)"
        >
          <span class="sr-only"></span>
        </b-form-checkbox>
      </b-input-group-append>
    </b-input-group>
    <b-card v-if="isSearchInternet">
      <p>
        {{ cachedDate }}
        <b-link
          v-on:click="doRefresh(cashedDbRowId)"
          v-if="cashedDbRowId !== -1"
          >Refresh</b-link
        >
      </p>

      <ul>
        <li v-for="item in searchResult" :key="item.uuid">
          <b-link v-bind:href="item.url">{{ item.header }}</b-link>
          <div>{{ item.url }}</div>
          <p>
            {{ item.text }}
            <br v-if="item.text" />
            <b-link v-on:click="addBookmarkFromItem(item)">Add bookmark</b-link>
          </p>
        </li>
      </ul> </b-card
    >&nbsp;
  </b-container>
</template>

<script lang="ts">
import { searchEngine } from "../src/SearchEngine";
import { LocalBookmark } from "../src/dxdb/localBookmark";
import { CashedSearch } from "../src/dxdb/cashedSearch";
import { GenericSearchResult } from "../src/genericSearchResult";

import LocalBookmarkListItems from "./LocalBookmarkListItems.vue";
import SelectDefaultExternalSearch from "./SelectDefaultExternalSearch.vue";

import {
  defineComponent,
  inject,
  computed,
  ComputedRef,
  ref,
  Ref,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from "@vue/composition-api";

import { TWorkbook } from "../src/dxdb/workbook";
import { applicationConfig, SearchTypes } from "../src/ApplicationConfig";

export default defineComponent({
  components: {
    LocalBookmarkListItems,
    SelectDefaultExternalSearch,
  },
  setup() {
    const root = getCurrentInstance();
    const showTags = ref(false);

    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const router: any = inject("router");

    const selectedWorkbookId: ComputedRef<number> = computed(() => {
      return store.state.selectedWorkbookId;
    });

    const workbooks: ComputedRef<TWorkbook[]> = computed(() => {
      return store.state.workbooks;
    });

    const isSearchLocal = ref(applicationConfig.isHomeSearchLocal);
    const isSearchInternet = ref(applicationConfig.isHomeSearchInternet);
    const searchType = ref(0);
    const isFavoritesOnly = ref(false);

    const movetoWorkbookId = ref(1);

    const searchText = ref("");
    const cachedDate = ref("");
    const cashedDbRowId = ref(-1);
    const searchTextForResult = ref("");
    const seeAlso: Ref<string[]> = ref([]);

    const searchResult: Ref<GenericSearchResult[]> = ref([]);
    const searchLocalResult: Ref<GenericSearchResult[]> = ref([]);

    const doClear = () => {
      searchText.value = "";
      cachedDate.value = "";
      cashedDbRowId.value = -1;
      searchTextForResult.value = "";
      seeAlso.value = [];

      searchResult.value = [];
      searchLocalResult.value = [];
    };

    const doExternal = () => {
      searchEngine.doExternalSearch(searchText.value);
    };

    const isBogScreen = () => {
      return screen.width > 480 && screen.height > 480;
    };

    const focusSearchText = () => {
      if (isBogScreen()) {
        // eslint-disable-next-line        
        const el: any = root?.refs.searchTextRef;
        el.$el.focus();
      }
    };

    const searchLocalFulltext = async (
      onlyFavorites: boolean,
      searchText: string
    ) => {
      const selectedWorkbookId = applicationConfig.load().defaultWorkbookId;
      searchLocalResult.value = await LocalBookmark.fullTextSearch(
        searchText,
        onlyFavorites,
        selectedWorkbookId
      );
      
      seeAlso.value = [];

      if (searchText) {
        const seeAlsoL = await LocalBookmark.relatedTags(
          searchText,
          selectedWorkbookId
        );

        seeAlso.value = seeAlsoL.splice(0, 20);
      }
    };

    const searchLocalTags = async (searchText: string) => {
      const selectedWorkbookId = applicationConfig.load().defaultWorkbookId;
      const searchExp = searchText + ' or "' + searchText + '"';
      searchLocalResult.value = await LocalBookmark.tagSearch(
        searchExp,
        selectedWorkbookId
      );

      const seeAlsoL = await LocalBookmark.relatedTags(
        searchText,
        selectedWorkbookId
      );

      seeAlso.value = seeAlsoL.splice(0, 20);
    };

    const doSearch = async () => {
      focusSearchText();
      const searchTextS = searchText.value.toLowerCase().trim();

      if (!searchTextS) {
        if (searchType.value === SearchTypes.FULLTEXT) {
          doClear();
          await searchLocalFulltext(isFavoritesOnly.value, searchText.value);
        }
        return;
      }

      searchResult.value = [];
      try {
        if (isSearchInternet) {
          const r = await searchEngine.getResult(searchText.value);
          searchTextForResult.value = searchText.value;
          searchResult.value = r.data;
          cachedDate.value = new Date(r.dbRow.dateTime).toString();
          cashedDbRowId.value = r.dbRow.id ?? -1;
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }

      searchLocalResult.value = [];

      if (isSearchLocal) {
        if (searchType.value === SearchTypes.TAGS) {
          await searchLocalTags(searchText.value);
        } else {
          await searchLocalFulltext(isFavoritesOnly.value, searchText.value);
        }
      }
    };

    const doRedirect = async () => {
      if (!searchText) {
        return;
      }
      await doSearch();
      if (
        searchLocalResult.value.length > 0 &&
        searchLocalResult.value.filter((row) => {
          return !row.relatedSubject;
        }).length === 1 &&
        !searchLocalResult.value[0].relatedSubject
      ) {
        const url = searchLocalResult.value[0].url;
        doClear();
        window.location.href = url;
        return;
      }

      if (
        searchResult.value.length > 0 &&
        !searchResult.value[0].relatedSubject
      ) {
        const url = searchResult.value[0].url;
        doClear();
        window.location.href = url;
        return;
      }
    };

    const doKeypressParse = (e: KeyboardEvent) => {
      if (e.ctrlKey === true && e.code === "Enter") {
        doRedirect();
      } else if (e.altKey === true && e.code === "Enter") {
        doExternal();
      } else if (e.code === "Enter") {
        doSearch();
      }
    };

    onUnmounted(() => {
      window.removeEventListener("keypress", doKeypressParse);
    });

    onMounted(() => {
      searchType.value = applicationConfig.searchType;
      store.state.pageName = "Home";
      window.removeEventListener("keypress", doKeypressParse);
      window.addEventListener("keypress", doKeypressParse);

      if (
        Object.prototype.hasOwnProperty.call(router.app.$root.$route.query, "q")
      ) {
        searchText.value = router.app.$root.$route.query.q.toString();
        if (
          Object.prototype.hasOwnProperty.call(
            router.app.$root.$route.query,
            "r"
          )
        ) {
          router.push(router.app.$route.path)
          return doRedirect();
        } else {
          router.push(router.app.$route.path)
          return doSearch();
        }
      }
    });

    const getSearchPlaceholder = computed(() => {
      if (searchType.value === SearchTypes.TAGS) {
        return "Tag search like a or (b and c)";
      }
      return "Fulltext JS Regexp, empty = all";
    });

    const isSearchLocalChange = (val: boolean) => {
      applicationConfig.isHomeSearchLocal = val;
      applicationConfig.save();
    };

    const isSearchInternetChange = (val: boolean) => {
      applicationConfig.isHomeSearchInternet = val;
      applicationConfig.save();
    };

    const searchTypeChange = (val: number) => {
      applicationConfig.searchType = Number(val);
      applicationConfig.save();
    };

    const doMoveResultToWorkbook = async () => {
      for (let i = 0; i < searchLocalResult.value.length; i++) {
        const r = await LocalBookmark.getByUuid(
          searchLocalResult.value[i].uuid
        );
        await r.moveToWorkbook(movetoWorkbookId.value);
      }
      doClear();
    };

    const doRefresh = async (cashedDbRowId: number) => {
      await CashedSearch.deleteById(cashedDbRowId);
      doSearch();
    };

    const setSearchInputAndSearch = (str: string) => {
      searchText.value = str;
      return doSearch();
    };

    const addBookmarkFromItem = async (item: GenericSearchResult) => {
      const id = await LocalBookmark.addBookmarkFromGenericItem(
        item,
        searchTextForResult.value,
        selectedWorkbookId.value
      );
      router.push({ name: "localBookmark", params: { id: id.toString() } });
    };

    const addNewBookmark = () => {
      router.push({ name: "localBookmark", params: { id: "-1" } });
    };

    const dirStyle = computed(() => {
      const rtlChars =
          "\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC",
        rtlDirCheck = new RegExp("^[^" + rtlChars + "]*?[" + rtlChars + "]");

      if (rtlDirCheck.test(searchText.value)) {
        return "rtl";
      }
      return "";
    });

    return {
      showTags,
      selectedWorkbookId,
      workbooks,
      isSearchLocal,
      isSearchInternet,
      searchType,
      isFavoritesOnly,
      movetoWorkbookId,
      searchText,
      cachedDate,
      cashedDbRowId,
      searchTextForResult,
      seeAlso,
      searchResult,
      searchLocalResult,
      doKeypressParse,
      doExternal,
      doRedirect,
      doClear,
      searchTypeChange,
      isSearchInternetChange,
      isSearchLocalChange,
      getSearchPlaceholder,
      doMoveResultToWorkbook,
      doRefresh,
      doSearch,
      focusSearchText,
      setSearchInputAndSearch,
      addBookmarkFromItem,
      addNewBookmark,
      dirStyle,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped lang="scss">
</style>
