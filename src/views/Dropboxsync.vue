<template>
  <div>
    <Dropboxsync   />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import Dropboxsync from '@/components/Dropboxsync.vue'


export default defineComponent({
  components: {
    Dropboxsync,
  },
})
</script>