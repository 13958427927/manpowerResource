
import Layout from '@/layout'
export default {
  path: '/social',
  name: 'social',
  component: Layout,
  meta: {
    id: 'social_securitys'
  },
  children: [{
    path: '',
    component: () => import('@/views/social'),

    meta: {
      title: '社保', icon: 'table'
    }
  }]
}

