import Vue from 'vue'
import Vuex from '../../../source/vuex'
// import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 100,
    firstName: 'cui',
    lastName: 'mm',
    todos: [
      { id: 1, text: '...1', done: true },
      { id: 2, text: '...2', done: false }
    ],
  },
  getters: {
    iCount(state) {
      return state.count + 10;
    },
    fullName(state) {
      return state.firstName + state.lastName;
    },
    doneTodos(state) {
      return state.todos.filter(todo => todo.done)
    },
  },
  mutations: {
    add(state) {
      state.count += 1
    }
  },
  actions: {
    add({commit}) {
      setTimeout(function () {
        commit('add')
      }, 500)
    }
  },
  modules: {
  }
})
