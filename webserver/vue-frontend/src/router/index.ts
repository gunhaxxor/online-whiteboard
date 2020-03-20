import Vue from 'vue';
import VueRouter from 'vue-router';
import Whiteboard from '@/views/Whiteboard.vue';
import BoardCreator from '@/views/BoardCreator.vue';
import BoardChooser from '@/views/BoardChooser.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'boardChooser',
    component: BoardChooser
  },
  {
    path: '/skapa',
    name: 'boardCreator',
    component: BoardCreator
  },
  {
    path: '/:sessionName',
    name: 'whiteboard',
    component: Whiteboard
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
