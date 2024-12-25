import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'register', component: () => import('pages/StudentRegistration.vue') },
      { path: 'understudy', component: () => import('pages/UnderStudyRegistration.vue') },
      { path: 'understudy-list', component: () => import('pages/UnderStudyList.vue') },
      { path: 'inactivestudy-list', component: () => import('pages/InactiveStudyList.vue') },
      { path: 'personel', component: () => import('pages/PersonnelRegistration.vue') },
      { path: 'student-list', component: () => import('pages/StudentList.vue') },
      { path: 'personnel-list', component: () => import('pages/PersonnelList.vue') },
      { path: 'planlama', component: () => import('pages/CalenderPage.vue') },
      { path: 'classes', component: () => import('pages/ClassPage.vue') },
      { path: 'classes-list', component: () => import('pages/ClassroomPage.vue') },
      { path: 'service-list', component: () => import('pages/ServiceList.vue') }

    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
