<template>
  <div>{{id}}</div>
</template>

<script>
export default {
  data() {
    return {};
  },

  props:{
     id:{
        type:Number
     }
  },

  components: {},

  computed: {
   //  id() {
   //    return this.$route.params.id;
   //  },
  },

  methods: {},
};
</script>
<style lang='css'>
</style>