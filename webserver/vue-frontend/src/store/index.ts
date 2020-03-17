import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    brushStrokes: Array<any>(),
    isSessionOwner: false,
    sessionName: ''
  },
  mutations: {
    setBrushStrokes(state, brushStrokes) {
      state.brushStrokes = brushStrokes.slice();
    },
    setSessionName(state, sessionName) {
      state.sessionName = sessionName;
    },
    setIsSessionOwner(state, isOwner) {
      state.isSessionOwner = isOwner;
    }
  },
  actions: {},
  modules: {}
});
