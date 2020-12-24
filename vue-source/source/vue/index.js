import {query} from './utils/dom'
import {initState} from './observe'
import Watcher from './observe/watcher'
import {h, render, patch} from './vdom'

function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = options;
  initState(vm);
  // 挂载
  if (vm.$options.el) {
    vm.$mount();
  }
};

Vue.prototype.$mount = function () {
  let vm = this;
  let el = vm.$options.el;
  el = vm.$el = query(el);
  const updateComponent = () => {
    vm._update(vm._render());
  };

  new Watcher(vm, updateComponent);
};

/**
 * 视图渲染
 * @param vnode 要渲染的虚拟节点
 * @private
 */
Vue.prototype._update = function (vnode) {
  const vm = this;
  const el = vm.$el;
  if (!vm.preVnode) {
    vm.preVnode = vnode; // 保留第一次渲染的vnode节点，用于下次渲染进行虚拟节点的patch比对
    render(vnode, el); // 渲染虚拟节点，将虚拟节点插入到el中
  } else {
    vm.$el = patch(vm.preVnode, vnode); // vue更新 -> 调用patch进行节点的比对
  }
};

Vue.prototype._render = function() {
  const vm = this;
  const render = this.$options.render;  // 用户提供的render函数
  return render.call(vm, h);  // 让用户提供的render方法执行生成vnode。将render中的this指向当前vue实例，并传入h方法（h方法的功能是生成vnode）
};

Vue.prototype.$watch = function (expr, callback, options) {
  const vm = this;
  new Watcher(vm, expr, callback, options);
};

export default Vue;
