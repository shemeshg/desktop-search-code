<template>
  <select @input="emitSelectedExternalSearchId">
    <option
      v-for="option in externalSearchs"
      v-bind:key="option.uuid"
      v-bind:value="option.id"
      :selected="option.id == selectedExternalSearchId"
    >
      {{ option.name }}
    </option>
  </select>
</template>
<script lang="ts">
import { TExternalSearch } from "../src/dxdb/externalSearch";

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

    const selectedExternalSearchId: ComputedRef<number> = computed(() => {
      return store.state.selectedExternalSearchId;
    });

    const externalSearchs: ComputedRef<TExternalSearch[]> = computed(() => {
      return store.state.externalSearchs;
    });

    // eslint-disable-next-line
    const emitSelectedExternalSearchId = (e: any) => {
      store.commit("emitSelectedExternalSearchId", Number(e.target.value));
    };

    return {
      selectedExternalSearchId,
      externalSearchs,
      emitSelectedExternalSearchId,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>