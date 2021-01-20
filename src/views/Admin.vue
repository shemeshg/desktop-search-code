<template>
  <div class="home">
    <Admin/>
  </div>
</template>

<script>
// @ is an alias to /src
import Admin from '@/components/Admin.vue'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: {
    Admin
  }
})
</script>
