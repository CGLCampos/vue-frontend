<template>
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand-md navbar-light navbar-white">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img
            src="@/assets/biblioteca-logo.png"
            alt="Biblioteca Logo"
            class="brand-image img-circle elevation-3"
            style="opacity: 0.8"
          />
          <span class="brand-text font-weight-light">Biblioteca</span>
        </router-link>

        <!-- Right navbar links -->
        <Transition name="fade" v-show="mostrar">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link :to="{name: 'livros.index'}" class="nav-link">Livros</router-link>
            </li>
            <li class="nav-item" v-if="usuarioEstaLogado && isAdmin">
              <router-link :to="{name: 'alunos.index'}"  class="nav-link">Alunos</router-link>
            </li>
            <li class="nav-item" v-if="usuarioEstaLogado && isAdmin">
              <router-link :to="{name: 'reservas.index'}"  class="nav-link">Reservas</router-link>
            </li>
            <li class="nav-item" v-if="usuarioEstaLogado && isUser">
              <router-link :to="{name: 'alunos.perfil'}"  class="nav-link">Perfil</router-link>
            </li>
            <li class="nav-item" v-if="usuarioEstaLogado">
              <a class="nav-link" data-toggle="modal" data-target="#modal-logout" href="">Sair</a>
            </li>
            <li class="nav-item" v-else>
              <router-link :to="{name: 'login'}" class="nav-link">Entrar</router-link>
            </li>
          </ul>
        </Transition>
      </div>
    </nav>

    <MyModal name="modal-logout" titulo="Deseja realizar logout?" estilo="secondary" @acao="logout" botao="Sair">
      <p>Clique em "Sair" para realizar a ação.</p>
    </MyModal>
    <!-- /.navbar -->
</template>

<script>
import MyModal from "./MyModal.vue"

export default {
  components: { 
    MyModal 
  },
  data() {
    return {
      usuarioEstaLogado: false,
      mostrar: false,
      user: {
        email: "",
        roles: ""
      }
    }
  },
  created() {
    this.$loginService.logged()
      .then(response => {
        this.usuarioEstaLogado = response.data.logged;
        if(response.data.user) {
          this.user = response.data.user;
        }
      })
      .then(() => this.mostrar = true)
      .catch(() => {
        this.mostrar = true;
        this.usuarioEstaLogado = false;
      })
    
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push({name: 'login'})
    }
  },
  computed: {
    isAdmin() {
      return this.user.roles.includes('ADMIN_ROLE');
    },
    isUser() {
      return this.user.roles.includes('USER_ROLE');
    }
  }
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3 ease;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0 ;
  }
</style>