<template>
    <b-form-select v-model="selectedWorkbookId" @change="emitSelectedWorkbookId">
      <b-form-select-option 
        v-for="option in workbooks"
        v-bind:key="option.uuid"
        v-bind:value="option.id"
        :selected="option.id == selectedWorkbookId"
      >{{ option.name }}</b-form-select-option>
    </b-form-select>

</template>
<script lang="ts">
import { mapState } from "vuex";

import { Component, Vue } from "vue-property-decorator";
import { Workbook } from "../src/dxdb/workbook";

@Component({
  computed: {
    ...mapState(["selectedWorkbookId", "workbooks"])
  }
})
export default class SelectDefaultWorkbook extends Vue {
  selectedWorkbookId!: number;
  workbooks!: Workbook[];

  // eslint-disable-next-line
  emitSelectedWorkbookId(e: number) {
      this.$store.commit("emitSelectedWorkbookId", e);    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>