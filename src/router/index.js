import { createRouter, createWebHistory } from 'vue-router'
import MyLogin from '@/views/MyLogin.vue'
import LivroIndex from '@/views/livros/LivroIndex.vue'
import LivroForm from '@/views/livros/LivroForm.vue'
import LivroShow from '@/views/livros/LivroShow.vue'
import AlunoIndex from '@/views/alunos/AlunoIndex.vue'
import AlunoForm from '@/views/alunos/AlunoForm.vue'
import AlunoShow from '@/views/alunos/AlunoShow.vue'
import ReservaIndex from '@/views/reservas/ReservaIndex.vue'
import ReservaForm from '@/views/reservas/ReservaForm.vue'
import ReservaShow from '@/views/reservas/ReservaShow.vue'
import ErroPage from '@/views/ErroPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: MyLogin,
    props: route => ({
      titulo: route.params.titulo
    })
  },
  {
    path: '/',
    name: 'home',
    component: LivroIndex
  },

// ----------------------------- LIVROS -----------------------------

  {
    path: '/livros',
    name: 'livros.index',
    component: LivroIndex
  },
  {
    path: '/livros/cadastrar',
    name: 'livros.create',
    component: LivroForm,
    props: () => ({
      acao: 'create'
    })
  },
  {
    path: '/livros/editar/:id',
    name: 'livros.edit',
    component: LivroForm,
    props: route => ({
      id: parseInt(route.params.id),
      acao: 'edit'
    })
  },
  {
    path: '/livros/detalhes/:id',
    name: 'livros.show',
    component: LivroShow,
    props: route => ({id: parseInt(route.params.id)})
  },

// ----------------------------- ALUNOS -----------------------------

  {
    path: '/alunos',
    name: 'alunos.index',
    component: AlunoIndex
  },
  {
    path: '/alunos/perfil',
    name: 'alunos.perfil',
    component: AlunoShow,
    props: () => ({
      acao: 'perfil'
    })
  },
  {
    path: '/alunos/cadastrar',
    name: 'alunos.create',
    component: AlunoForm,
    props: () => ({
      acao: 'create'
    })
  },
  {
    path: '/alunos/editar/:id',
    name: 'alunos.edit',
    component: AlunoForm,
    props: route => ({
      id: parseInt(route.params.id),
      acao: 'edit'
    })
  },
  {
    path: '/alunos/detalhes/:id',
    name: 'alunos.show',
    component: AlunoShow,
    props: route => ({
      id: parseInt(route.params.id),
      acao: 'show'
    })
  },

// ----------------------------- RESERVAS -----------------------------

  {
    path: '/reservas',
    name: 'reservas.index',
    component: ReservaIndex
  },
  {
    path: '/reservas/cadastrar/:id?',
    name: 'reservas.create',
    component: ReservaForm,
    props: route => ({id: parseInt(route.params.id)})
  },
  {
    path: '/reservas/detalhes/:id',
    name: 'reservas.show',
    component: ReservaShow,
    props: route => ({id: parseInt(route.params.id)})
  },
  {
    path: '/erro',
    name: 'erro',
    component: ErroPage,
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: NotFoundPage,
  },
  { 
    path: '/:pathMatch(.*)*', 
    component: NotFoundPage 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
