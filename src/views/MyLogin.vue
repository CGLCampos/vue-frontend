<template>
  <div class="wrapper" v-if="mostrar">
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
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{name: 'livros.index'}" class="nav-link">Livros</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">
        <div class="container">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">{{ titulo ? titulo : "Login" }}</h1>
            </div>
            <!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
              </ol>
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content-header -->

      <!-- Main content -->
      <div class="content">
        <div class="container">
            <div class="row">
              <div class="col-3">
              </div>
              <div class="col-6">
                <div class="card card-primary">
                  <div class="card-header">
                      <h3 class="card-title">Informe seus dados para acessar</h3>

                      <div class="card-tools">
                          
                      </div>
                  </div>
                  <form method="POST" @submit.prevent="efetuarLogin">
                      <!-- /.card-header -->
                      <div class="card-body">
                          
                          <div class="form-group">
                              <label for="email">E-mail:</label>
                              <input class="form-control" type="email" name="email" id="email" v-model="usuario.email" >
                              <div class="text-danger mt-1" v-if="erro.email">
                                <i class="fas fa-ban mr-1"></i>
                                <span>{{erro.email[0]}}</span>
                              </div>
                          </div>

                          <div class="form-group">
                              <label for="senha">Senha:</label>

                              <div class="input-group">
                                <input type="password" class="form-control" name="senha" id="senha" v-model="usuario.senha">

                                <!-- <div class="input-group-append">
                                    <button type="button" class="btn btn-secondary">Esqueci a senha</button>
                                </div> -->
                              </div>
                            <div class="text-danger mt-1" v-if="erro.senha">
                              <i class="fas fa-ban mr-1"></i>
                              <span>{{erro.senha[0]}}</span>
                            </div>
                          </div>
                      </div>
                      <!-- /.card-body -->

                  <div class="card-footer">
                    <router-link class="btn btn-secondary" type="button" :to="{name: 'alunos.create'}" id="cadastrar-aluno">
                      Cadastrar nova conta
                    </router-link>
                    <input class="btn btn-primary float-right" type="submit" id="loginButton">
                  </div>
                </form>
              </div>
              <!-- /.card -->
            </div>
            <div class="col-3">

            </div>
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
    <MyFooter />
  </div>
  <!-- ./wrapper -->
</template>

<script>
import MyFooter from "@/components/shared/MyFooter.vue";

export default {
  data() {
    return {
      mostrar: false,
      usuario: {
          email: "",
          senha: ""
      },
      erro: {
        email: "",
        senha: ""
      }
    }
  },
  props: {
    titulo: String
  },
  created() {
    this.$loginService.logged()
      .then(response => {
        if(response.data.logged) {
          this.$router.replace({name: 'home'})
          return;
        }
        this.mostrar = true;
      });
  },
  components: {
      MyFooter
  }, 
  methods: {
    efetuarLogin() {
      this.$loginService.login(this.usuario)
        .then(res => {
          localStorage.setItem('token', res.data.access_token)
          this.$router.push({name: 'livros.index'})
        })
        .catch(erro => {
          switch (erro.response.status) {
            case 401:
              this.erro = {email: [erro.response.data.email]};
              break;

            case 422:
              this.erro = erro.response.data;
              break;
        
            default:
              console.log(erro)
              this.erro.email = ["Ocorreu um erro ao tentar realizar a ação"];
              break;
            }
        })
        .catch(() => {
            this.$router.push({name:'erro'});
        });
    }
  }
}
</script>

<style>

</style>