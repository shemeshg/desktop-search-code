<template>
  <select @input="emitSelectedExternalSearchId">
    <option
      v-for="option in externalSearchs"
      v-bind:key="option.uuid"
      v-bind:value="option.id"
      :selected="option.id == selectedExternalSearchId"
    >{{ option.name }}</option>
  </select>
</template>
<script lang="ts">
import { mapState } from "vuex";

import { Component, Vue } from "vue-property-decorator";
import { TExternalSearch } from "../src/dxdb/externalSearch";

@Component({
  computed: {
    ...mapState(["selectedExternalSearchId", "externalSearchs"])
  }
})
export default class SelectDefaultExternalSearch extends Vue {
  selectedExternalSearchId!: number;
  externalSearchs!: TExternalSearch[];

  // eslint-disable-next-line
  emitSelectedExternalSearchId(e: any) {
    this.$store.commit("emitSelectedExternalSearchId", Number(e.target.value));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>