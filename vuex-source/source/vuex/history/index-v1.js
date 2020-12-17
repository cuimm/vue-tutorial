let Vue

class Store {
  constructor(options) {
    let {state, getters, mutations, actions} = options
    this.getters = {}
    this.mutations = {}
    this.actions = {}

    this._vm = Store.reactiveState(state)

    if (getters) {
      forEach(getters, (getterName, getterFn) => {
        Object.defineProperty(this.getters, getterName, {
          get: () => {
            return getterFn(this.state)
          }
        })
      })
    }
    if (mutations) {
      forEach(mutations, (mutationName, mutationFn) => {
        this.mutations[mutationName] = () => {
          mutationFn.call(this, state)
        }
      })
    }
    if (actions) {
      forEach(actions, (actionName, actionFn) => {
        this.actions[actionName] = () => {
          actionFn.call(this, this)
        }
      })
    }

    /**
     * 此处定义的commit方法是Store自身的私有方法（function Store() { this.commit = function() { ... } }）
     * 方法调用的时候会沿着原型链进行查找，先从自身上的方法查找，找不到沿着原型链查找
     * 这样的话，通过Store实例解构出来的commit方法，直接调用的话this也是Store实例（new store = new Store(); let {commit} = store; commit();）
     */
    let {commit, dispatch} = this
    this.commit = type => {
      commit.call(this, type)
    }
    this.dispatch = type => {
      dispatch.call(this, type)
    }
  }

  /**
   * 拦截state属性的访问：外界访问state属性时，会调用_vm.state，实现数据双向绑定
   */
  get state() {
    return this._vm.state
  }

  // 此处的commit是Store原型上的方法（Store.prototype.commit = function() { ... }）
  commit(type) {
    this.mutations[type]()
  }

  dispatch(type) {
    this.actions[type]()
  }

  /**
   * 处理state
   * 通过 new Vue({data: {...}}) 处理的data会增加get和set属性，可以实现双向数据绑定（数据变化会刷新视图）
   * vuex的核心是借助了Vue的实例，因为Vue的实例数据变化，变化会刷新试图
   */
  static reactiveState(state) {
    return new Vue({
      data: {
        state
      },
    })
  }
}

function forEach(obj, callback) {
  Object.keys(obj).forEach(item => callback(item, obj[item]))
}

/**
 * 安装vuex插件
 * 全局混入：在beforeCreate钩子中，给每个子组件增加$store实例，该实例是根组件中传入的store
 * 怎么判断是否是根组件？vue组件是从根节点开始渲染的，父 -> 子 -> 孙，vue实例的$options上如果有store参数则为根组件
 * 子组件怎么获取store实例？取父级组件$parent上$store
 * @param _Vue
 */
function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    },
  })
}

export default {
  install,
  Store,
}
