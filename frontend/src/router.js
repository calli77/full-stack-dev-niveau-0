import { createRouter, createWebHistory } from 'vue-router';
import NewsList from './views/NewsList.vue';
import NewsDetailPage from './views/NewsDetail.vue';

const routes = [
  {
    path: '/',
    name: 'NewsList',
    component: NewsList,
  },
  {
    path: '/news-detail/:id',
    name: 'NewsDetail',
    component: NewsDetailPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;