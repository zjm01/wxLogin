<template>
  <div class="wrapper">
     <button @click="goto">跳转</button>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {

    }
  },
  watch:{},
  computed:{},
  methods:{
      goto(){
          this.$router.replace('/personal')
      }
  },
  created(){},
  mounted(){}
}
</script>
<style  scoped>
</style>