<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </div>
    <div>
      <button @click="doAdd">add</button>
    </div>
    <div>
      <button @click="doAddAsync">addAsync</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    doAdd() {
      this.$store.commit('add')
    },
    doAddAsync() {
      this.$store.dispatch('add')
    }
  },
}
</script>
