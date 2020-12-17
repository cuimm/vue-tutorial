<template>
  <div class="home">
    <HelloWorld msg="Hi, cuimm"/>
    <div>count: {{$store.state.count}}</div>
    <div>iCount: {{$store.getters.iCount}}</div>
    <div>fullName: {{$store.getters.fullName}}</div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  created() {
    console.log('$store', this.$store);
  },
}
</script>
