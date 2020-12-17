let Vue

class Store {
  constructor(options) {
    const {state, getters, mutations, actions} = options

    this.getters = Object.create(null)
    this.mutations = Object.create(null)
    this.actions = Object.create(null)

    resetStoreVM(this, state)

    if (getters) {
      forEachValue(getters, (getterFn, getterName) => {
        Object.defineProperty(this.getters, getterName, {
          get: () => {
            return getterFn(state)
          }
        })
      })
    }
    if (mutations) {
      forEachValue(mutations, (mutationFn, mutationName) => {
        this.mutations[mutationName] = () => {
          mutationFn.call(this, state)
        }
      })
    }
    if (actions) {
      forEachValue(actions, (actionFn, actionName) => {
        this.actions[actionName] = () => {
          actionFn.call(this, this)
        }
      })
    }

    // bind commit and dispatch to self
    const {commit, dispatch} = this
    this.commit = type => {
      commit.call(this, type)
    }
    this.dispatch = type => {
      dispatch.call(this, type)
    }
  }

  get state() {
    return this._vm._data.$$state
  }

  commit(type) {
    this.mutations[type]()
  }

  dispatch(type) {
    this.actions[type]()
  }
}

function forEachValue(obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

function resetStoreVM(store, state) {
  store._vm = new Vue({
    data: {
      $$state: state
    }
  })
}

function install(_Vue) {
  Vue = _Vue
  applyMixin(Vue);
}

function applyMixin(Vue) {
  Vue.mixin({
    beforeCreate: vuexInit
  })

  function vuexInit() {
    const options = this.$options
    if (options && options.store) {
      this.$store = options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

function vuexInit() {
  const options = this.$options
  // store injection
  if (options && options.store) {
    this.$store = options.store
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store
  }
}

export default {
  install,
  Store,
}
