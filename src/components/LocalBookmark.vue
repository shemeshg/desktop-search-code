<template>
  <b-container fluid>
    <b-form ref="form1">
      <p>
        <b-badge variant="success" v-if="feelLucy" v-on:click="doToggleLucky()">Feel lucky</b-badge>
        <b-badge variant v-if="!feelLucy" v-on:click="doToggleLucky()">Feel lucky</b-badge>&nbsp; |        
        <b-badge variant="success" v-if="localBookmark.isFreetextTagsOnly" 
          v-on:click="localBookmark.isFreetextTagsOnly = Number( !localBookmark.isFreetextTagsOnly )">Fulltext tags only</b-badge>
        <b-badge variant v-if="!localBookmark.isFreetextTagsOnly" 
          v-on:click="localBookmark.isFreetextTagsOnly = Number( !localBookmark.isFreetextTagsOnly )">Fulltext tags only</b-badge>&nbsp; |        
        <b-icon
          icon="heart-fill"
          variant="success"
          v-if="isFavorite"
          v-on:click="doToggleFavorite()"
        ></b-icon>
        <b-icon icon="heart" variant v-if="!isFavorite" v-on:click="doToggleFavorite()"></b-icon>
      </p>
      <b-form-group label="Header:">
        <b-form-input v-model="localBookmark.header" required></b-form-input>
      </b-form-group>
      <b-form-group label="Url:">
        <b-form-input v-model="localBookmark.url" required></b-form-input>
      </b-form-group>
      <b-form-group label="Text:">
        <b-form-textarea v-model="localBookmark.text" rows="2" max-rows="6"></b-form-textarea>
      </b-form-group>

      <b-form-group label="Tags (Enter delimited):">
        <b-form-textarea v-model="tags" rows="2" max-rows="6" required></b-form-textarea>
      </b-form-group>
    </b-form>

    <b-card class="mb-2">
      <b-link v-on:click="doAddSublink">Add sublink</b-link>
      <b-form ref="form2">
        <b-form-row v-for="(item, idx) in sublinks" :key="item.uuid">
          <b-form-group label="Header:" class="mb-2 mr-sm-2 mb-sm-0">
            <b-form-input v-model="item.header" required></b-form-input>
          </b-form-group>
          <b-form-group label="Url:" class="mb-2 mr-sm-2 mb-sm-0">
            <b-form-input v-model="item.url" required></b-form-input>
          </b-form-group>
          <b-form-group label="Text:" class="mb-2 mr-sm-2 mb-sm-0">
            <b-form-input v-model="item.text"></b-form-input>
          </b-form-group>
          <b-form-group label=" " class="mb-2 mr-sm-2 mb-sm-0">
            <br />
            <b-link v-on:click="doDelSublink(idx)">Delete</b-link>
          </b-form-group>
        </b-form-row>
      </b-form>
    </b-card>

    <b-button class="mr-1" v-on:click="doSave">Save</b-button>
    <b-button class="mr-1" v-on:click="doDelete">Delete</b-button>
  </b-container>
</template>

<script lang="ts">
import { LocalBookmark as LocalBookmarkClass } from "../src/dxdb/localBookmark";
import { SubLink } from "../src/genericSearchResult";

import {
  defineComponent,
  inject,
  ComputedRef,
  computed,
  ref,
  Ref,
  onMounted,
  getCurrentInstance,
} from "@vue/composition-api";

export default defineComponent({
    props: {
    id: {
      type: String,
      required: true
    }
    }
  ,
  setup(props) {
    const root = getCurrentInstance()
    
    // eslint-disable-next-line
    const store: any = inject("vuex-store");
    // eslint-disable-next-line
    const router: any = inject("router");

    const selectedWorkbookId: ComputedRef<number> = computed(() => {
      return store.state.workbooks;
    });


  const localBookmark = ref(new LocalBookmarkClass(undefined));
  const tags = ref("");
  const feelLucy = ref(false);
  const sublinks: Ref<SubLink[]> = ref([]);
  const isFavorite = ref(false);

  const doToggleLucky = ()=> {
    feelLucy.value = !feelLucy.value;
  }

  const doToggleFavorite = () =>{
    isFavorite.value= !isFavorite.value;
  }

  onMounted(()=> {
    store.state.pageName = "Edit bookmarks";
  })

  const doDelSublink = (idx: number) => {
    sublinks.value.splice(idx, 1);
  }

  const doAddSublink = ()=> {
    const s = new SubLink();
    s.header = "";
    s.url = "";
    s.text = "";
    sublinks.value.push(s);
  }

  const  doDelete = async () => {
    if (props.id.substr(0, 2) === "-2") {

        window.close();

      router.replace({
        name: "Home",
      });      

      return;
    }

    const id = parseInt(props.id);
    if (id >= 0) {
      await LocalBookmarkClass.deleteById(id);
    }
    router.back();
  }

  const doSave = async () => {
    // eslint-disable-next-line
    const refs: any = root?.refs;
    if (!refs.form1.checkValidity() || !refs.form2.checkValidity()) {
      refs.form1.reportValidity();
      refs.form2.reportValidity();
      return;
    }
    await localBookmark.value.moveToWorkbook(selectedWorkbookId.value);

    const elms = tags.value.split("\n");
    localBookmark.value.tags = [];
    localBookmark.value.relatedSubject = !feelLucy;
    localBookmark.value.isFavorite = isFavorite ? 1 : 0;
    

    elms.forEach((e: string) => {
      if (!(e === "")) {
        localBookmark.value.tags.push(e.toLowerCase().trim());
      }
    });
    await localBookmark.value.save();

    if (props.id.substr(0, 2) === "-2") {

      window.close();

      router.replace({
        name: "Home",
      });  
    } else {
      router.back();
    }
  }

  const  created = async() => {
    let id = -1;
    if (props.id.substr(0, 2) === "-2") {
      const parsed = JSON.parse(decodeURIComponent(props.id.substr(2)));

      localBookmark.value.header = parsed.title;
      localBookmark.value.text = parsed.description;
      localBookmark.value.url = parsed.url;

      let parsedAry = parsed.keywords.split(",");
      parsedAry.push(parsed.hostname);
      parsedAry = parsedAry.map((row: string) => {
        return row.trim();
      });
      parsedAry = parsedAry.filter((row: string) => {
        return row !== "";
      });

      tags.value = parsedAry.join("\n");
    } else {
      id = parseInt(props.id);
    }

    if (id > 0) {
      const t = await LocalBookmarkClass.getById(id);
      localBookmark.value = new LocalBookmarkClass(t);
      tags.value = localBookmark.value.tags.join("\n");
      feelLucy.value = !localBookmark.value.relatedSubject;
      isFavorite.value = Boolean(localBookmark.value.isFavorite);
    }
    sublinks.value = localBookmark.value.sublinks;    
  }

  return {selectedWorkbookId,
        localBookmark,
        tags,
        feelLucy, 
        sublinks,
        isFavorite,
        doToggleLucky,
        doToggleFavorite,
        doDelSublink,
        doAddSublink,
        doDelete,
        doSave,
        created,
        }
}
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>