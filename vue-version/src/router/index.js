import Vue from 'vue';
import Router from 'vue-router';
import AveragePrincipal from '@/components/AveragePrincipal';
import AverageInterest from '@/components/AverageInterest';
import Compare from '@/components/Compare';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AveragePrincipal',
      component: AveragePrincipal,
    },
    {
      path: '/AverageInterest',
      name: 'AverageInterest',
      component: AverageInterest,
    },
    {
      path: '/Compare',
      name: 'Compare',
      component: Compare,
    },
  ],
});
