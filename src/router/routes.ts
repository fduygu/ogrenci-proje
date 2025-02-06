import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main' // Ana sayfayı yönlendiriyoruz
  },
  {
    path: '/main',
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
      { path: 'service-list', component: () => import('pages/ServiceList.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'), // 🔥 AuthLayout ekledik!
    children: [
      { path: 'login', component: () => import('pages/LoginPage.vue'), meta: { guestOnly: true } },
      { path: 'forgot-password', component: () => import('pages/ForgotPassword.vue'), meta: { guestOnly: true } },
      { path: 'reset-password/:token', component: () => import('pages/ResetPassword.vue'), meta: { guestOnly: true } }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
