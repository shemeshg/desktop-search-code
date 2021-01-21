<template>
  <b-form-select :value="selectedWorkbookId" @change="emitSelectedWorkbookId">
    <b-form-select-option
      v-for="option in workbooks"
      v-bind:key="option.uuid"
      v-bind:value="option.id"
      :selected="option.id == selectedWorkbookId"
      >{{ option.name }}</b-form-select-option
    >
  </b-form-select>
</template>
<script lang="ts">
import { TWorkbook } from "../src/dxdb/workbook";

import {
  defineComponent,
  inject,
  computed,
  ComputedRef,
} from "@vue/composition-api";

export default defineComponent({
  setup() {
    // eslint-disable-next-line
    const store: any = inject("vuex-store");

    const selectedWorkbookId: ComputedRef<number> = computed(() => {
      return store.state.workbooks;
    });

    const workbooks: ComputedRef<TWorkbook[]> = computed(() => {
      return store.state.workbooks;
    });

    // eslint-disable-next-line
    const emitSelectedWorkbookId = (e: number) => {
      store.commit("emitSelectedWorkbookId", e);
    };

    return { selectedWorkbookId, workbooks, emitSelectedWorkbookId };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>