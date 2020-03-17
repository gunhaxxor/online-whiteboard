import Vue from 'vue';
import VueRouter from 'vue-router';
import Whiteboard from '@/views/Whiteboard.vue';
import BoardCreator from '@/views/BoardCreator.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/:sessionName',
    name: 'whiteboard',
    component: Whiteboard
  },
  {
    path: '/',
    name: 'boardCreator',
    component: BoardCreator
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
