import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const startState: {
  brushStrokes: any[][];
  isSessionOwner: false;
  sessionName: '';
} = {
  brushStrokes: [],
  isSessionOwner: false,
  sessionName: ''
};

export default new Vuex.Store({
  state: startState,
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
