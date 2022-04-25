<template>
  <div>
    <nav class="nav">
      <Topnav :browserwidth="browserwidth"></Topnav>
    </nav>
    <main class="ContentMenu">
      <ContentMenu :browserwidth="browserwidth"></ContentMenu>
    </main>
  </div>
</template>

<script>
import Topnav from "@/components/Nav/Topnav.vue";
import ContentMenu from "@/components/main/ContentMenu.vue";
export default {
  name: "IndexCotents",
  data() {
    return {};
  },
  props: {
    browserwidth: {
      type: Number,
      required: true,
    },
  },

  components: {
    Topnav,
    ContentMenu,
  },

  computed: {},

  methods: {},
};
</script>
<style lang='css'>
</style>