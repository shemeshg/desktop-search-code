<template>
  <b-container fluid>
    <b-form ref="form1">
      <p>
        <b-badge variant="success" v-if="feelLucy" v-on:click="doToggleLucky()">Feel lucky</b-badge>
        <b-badge variant v-if="!feelLucy" v-on:click="doToggleLucky()">Feel lucky</b-badge>&nbsp; |
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { LocalBookmark as LocalBookmarkClass } from "../src/dxdb/localBookmark";
import { SubLink } from "../src/genericSearchResult";

import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState(["selectedWorkbookId"]),
  },
})
export default class LocalBookmark extends Vue {
  @Prop() private id!: string;
  selectedWorkbookId!: number;

  localBookmark = new LocalBookmarkClass(undefined);
  tags = "";
  feelLucy = false;
  sublinks: SubLink[] = [];
  isFavorite = false;

  doToggleLucky() {
    this.feelLucy = !this.feelLucy;
  }

  doToggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  mounted() {
    this.$store.state.pageName = "Edit bookmarks";
  }

  doDelSublink(idx: number) {
    this.sublinks.splice(idx, 1);
  }

  doAddSublink() {
    const s = new SubLink();
    s.header = "";
    s.url = "";
    s.text = "";
    this.sublinks.push(s);
  }

  async doDelete() {
    if (this.id.substr(0, 2) === "-2") {

        window.close();

      this.$router.replace({
        name: "Home",
      });      

      return;
    }

    const id = parseInt(this.id);
    if (id >= 0) {
      await LocalBookmarkClass.deleteById(id);
    }
    this.$router.back();
  }

  async doSave() {
    // eslint-disable-next-line
    const refs: any = this.$refs;
    if (!refs.form1.checkValidity() || !refs.form2.checkValidity()) {
      refs.form1.reportValidity();
      refs.form2.reportValidity();
      return;
    }
    await this.localBookmark.moveToWorkbook(this.selectedWorkbookId);

    const elms = this.tags.split("\n");
    this.localBookmark.tags = [];
    this.localBookmark.relatedSubject = !this.feelLucy;
    this.localBookmark.isFavorite = this.isFavorite ? 1 : 0;
    

    elms.forEach((e) => {
      if (!(e === "")) {
        this.localBookmark.tags.push(e.toLowerCase().trim());
      }
    });
    await this.localBookmark.save();

    if (this.id.substr(0, 2) === "-2") {

      window.close();

      this.$router.replace({
        name: "Home",
      });  
    } else {
      this.$router.back();
    }
  }

  async created() {
    let id = -1;
    if (this.id.substr(0, 2) === "-2") {
      const parsed = JSON.parse(decodeURIComponent(this.id.substr(2)));

      this.localBookmark.header = parsed.title;
      this.localBookmark.text = parsed.description;
      this.localBookmark.url = parsed.url;

      let parsedAry = parsed.keywords.split(",");
      parsedAry.push(parsed.hostname);
      parsedAry = parsedAry.map((row: string) => {
        return row.trim();
      });
      parsedAry = parsedAry.filter((row: string) => {
        return row !== "";
      });

      this.tags = parsedAry.join("\n");
    } else {
      id = parseInt(this.id);
    }

    if (id > 0) {
      const t = await LocalBookmarkClass.getById(id);
      this.localBookmark = new LocalBookmarkClass(t);
      this.tags = this.localBookmark.tags.join("\n");
      this.feelLucy = !this.localBookmark.relatedSubject;
      this.isFavorite = Boolean(this.localBookmark.isFavorite);
    }
    this.sublinks = this.localBookmark.sublinks;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>