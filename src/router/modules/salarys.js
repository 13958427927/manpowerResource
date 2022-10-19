
import Layout from '@/layout'
export default {
  path: '/salarys',
  name: 'salarys',
  component: Layout,
  meta: {
    id: 'salarys'
  },
  children: [{
    path: '',
    component: () => import('@/views/salarys'),

    meta: {
      title: '工资', icon: 'money'
    }
  }]
}

