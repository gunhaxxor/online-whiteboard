import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    brushStrokes: Array<any>()
  },
  mutations: {
    setBrushStrokes(state, brushStrokes) {
      state.brushStrokes = brushStrokes.slice();
    }
  },
  actions: {},
  modules: {}
});
