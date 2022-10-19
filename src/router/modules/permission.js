
import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permission',
  meta: {
    id: 'permissions'
  },
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/permission'),

    meta: {
      title: '权限管理', icon: 'lock'
    }
  }]
}

