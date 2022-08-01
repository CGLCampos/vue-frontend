<template>
<PageLayout titulo="Lista de livros da Biblioteca">
    <template #links>
        <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
        <li class="breadcrumb-item active">Livros</li>
    </template>

    <template #conteudo>
        <MyCard titulo="Livros disponiveis" icone="book" estilo="card-primary" >
            <template #tools>
                <MyButton v-if="isAdmin"
                    estilo="bg-light btn-tool"
                    icone="plus"
                    rotulo="cadastrar novo livro"
                    titulo="Cadastrar novo Livro"
                    @acao="() => {this.$router.push({name:'livros.create'})}"
                />
            </template>

            <template #content>
                <MyAlert :alert="true" :message="msgSucesso" v-if="msgSucesso" />
                <MyAlert :erro="true" :alert="true" :message="msgErro" v-if="msgErro" />
                <p v-else-if="!mostrar">Buscando dados...</p>
                <table id="example2" class="table table-bordered table-hover" v-if="mostrar">
                    <thead>
                        <tr>
                            <th class="col-5">Titulo</th>
                            <th class="col-2">Autor</th>
                            <th class="col-2">Editora</th>
                            <th class="col-3" v-if="logged">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="livro in livrosDisponiveis.data" :key="livro.id" :class="`livro-${livro.id}`">
                            <td>{{ livro.titulo }}</td>
                            <td>{{ livro.autor }}</td>
                            <td>{{ livro.editora }}</td>
                            <td v-if="logged">
                                <div class="btn-group btn-block">
                                    <MyButton
                                        estilo="btn-outline-primary btn-sm"
                                        rotulo="ver livro"
                                        titulo="Ver Livro"
                                        @acao="() => this.$router.push({name: 'livros.show', params: {id: livro.id}})"
                                    />

                                    <MyButton v-if="logged"
                                        estilo="btn-outline-success btn-sm"
                                        rotulo="reservar"
                                        titulo="Reservar Livro"
                                        @acao="() => this.$router.push({name: 'reservas.create', params: {id: livro.id}})"
                                    />

                                    <MyButton v-if="isAdmin"
                                        estilo="btn-outline-secondary"
                                        icone="edit"
                                        titulo="Editar Livro"
                                        @acao="() => this.$router.push({name: 'livros.edit', params: {id: livro.id}})"
                                    />

                                    <button type="button" v-if="isAdmin"
                                        class="btn btn-outline-danger" title="Excluir Livro"
                                        data-toggle="modal" 
                                        :data-target="`#modal-excluir-${livro.id}`">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="modais">
                    <MyModal v-for="livro in livrosDisponiveis.data" :key="livro.id" @acao="excluirLivro(livro.id)"
                        :name="`modal-excluir-${livro.id}`" estilo="danger" titulo="Confirmar exclusão do livro?">
                        <p>
                            Essa operação não pode ser revertida, 
                            tem certeza que realmente deseja excluir: 
                            <strong>"{{livro.titulo}}"</strong>?
                        </p>
                        <p>Clique em "<strong>Confirmar</strong>" para realizar a ação.</p>
                    </MyModal>
                </div>
            </template>

            <template #footer>
                <MyPagination :paginate="livrosDisponiveis" :info="true" v-if="paginateDisponivel" 
                    @mudarPagina="atualizarPagina($event, 'disponivel')" />
            </template>
        </MyCard>

        <MyCard titulo="Livros reservados" icone="book" estilo="card-secondary collapsed-card" v-if="isAdmin">
            <template #tools>
                <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Minimizar/Maximizar"> 
                    <i class="fas fa-plus"></i>
                </button>
            </template>

            <template #content>
                <!-- <div class="alert alert-danger" role="alert" v-if="msgErroDisponivel">
                    This is a danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
                </div> -->
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th class="col-5">Titulo</th>
                            <th class="col-2">Autor</th>
                            <th class="col-2">Editora</th>
                            <th class="col-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="livro in livrosReservados.data" :key="livro.id" :class="`livro-${livro.id}`" >
                            <td>{{ livro.titulo }}</td>
                            <td>{{ livro.autor }}</td>
                            <td>{{ livro.editora }}</td>
                            <td>
                                <div class="btn-group btn-block">
                                    <MyButton
                                        estilo="btn-outline-primary btn-sm"
                                        rotulo="ver livro"
                                        titulo="Ver Livro"
                                        @acao="() => this.$router.push({name: 'livros.show', params: {id: livro.id}})"
                                    />

                                    <MyButton
                                        estilo="btn-outline-success btn-sm"
                                        rotulo="ver reserva"
                                        titulo="Ver Reserva"
                                        @acao="() => this.$router.push({name: 'reservas.show', params: {id: livro.reserva_id}})"
                                    />

                                    <MyButton
                                        estilo="btn-outline-secondary btn-sm"
                                        icone="edit"
                                        titulo="Editar Livro"
                                        @acao="() => this.$router.push({name: 'livros.edit', params: {id: livro.id}})"
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <template #footer>
                <MyPagination :paginate="livrosReservados" :info="true" v-if="paginateReservado" 
                    @mudarPagina="atualizarPagina($event, 'reservado')" />
            </template>
        </MyCard>
    </template>
</PageLayout>
</template>

<script>
import LivroService from "@/services/LivroService.js"
import PageLayout from  "@/components/layouts/PageLayout.vue";
import MyCard from "@/components/shared/MyCard.vue";
import MyButton from "@/components/shared/MyButton.vue";
import MyPagination from  "@/components/shared/MyPagination.vue";
import MyModal from '@/components/shared/MyModal.vue';
import MyAlert from '@/components/shared/MyAlert.vue';

export default {
    name: "App",
    data() {
        return {
            logged: false,
            user: {
                roles: []
            },

            msgSucesso: "",
            msgErro: "",
            msgErroReservadas: "",
            mostrar: false,

            temErroDisponiveis: true,
            livrosDisponiveis: {},
            paginateDisponivel: false,

            livrosReservados: {},
            paginateReservado: false,
            
            per_page: 10,
            page: 1,
        };
    },
    components: {
        PageLayout,
        MyCard,
        MyButton,
        MyPagination,
        MyModal,
        MyAlert
    },
    created() {
        this.$loginService.logged()
            .then(response => {
                if(response.data.logged) {
                    this.logged = response.data.logged;
                    this.user = response.data.user
                }

                this.service = new LivroService(this.$http);

                this.service.listarDisponiveis(this.page, this.per_page)
                    .then(res => this.livrosDisponiveis = res.data)
                    .then(() => this.paginateDisponivel = true)
                    .catch(err => console.log(err));

                this.service.listarReservados(this.page, this.per_page)
                    .then(res => this.livrosReservados = res.data)
                    .then(() => this.paginateReservado = true)
                    .catch(err => console.log(err));

            })
            .then(() => this.mostrar = true)
            .catch(() => {
                this.msgErro = "Ocorreu um erro ao tentar buscar os dados.";
            });
    },
    methods: {
        atualizarPagina($event, name) {
            if(name == 'disponivel'){
                this.service.listarDisponiveis($event.page, this.per_page)
                    .then((res) => this.livrosDisponiveis = res.data)
                    .then(() => this.paginateDisponivel = false)
                    .then(() => this.paginateDisponivel = true)
                    .then(() => this.page = $event.page)
                    .catch((erro) => {
                        console.log(erro)
                        this.msgErro = erro.message
                    });

            } else if(name == 'reservado') {
                this.service.listarReservados($event.page, this.per_page)
                    .then((res) => this.livrosReservados = res.data)
                    .then(() => this.paginateReservado = false)
                    .then(() => this.paginateReservado = true)
                    .then(() => this.page = $event.page)
                    .catch((erro) => {
                        console.log(erro)
                        this.msgErro = erro.message
                    });
            }
        },
        excluirLivro(id) {
            this.service.excluir(id)
                .then(() => {
                    this.livrosDisponiveis.data = this.livrosDisponiveis.data.filter(livro => livro.id != id);
                    this.msgSucesso = "Livro excluido com sucesso";

                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    setTimeout(() => {
                        this.msgSucesso = "";
                    }, 3000);
                })
                .then(() => this.atualizarPagina({page: this.page}, 'disponivel'))
                .catch(erro => {
                    switch (erro.response.status) {
                        case 401:
                            console.log(erro.response.data)
                            this.msgErro = erro.response.data.erro;
                            break;
                    
                        default:
                            console.log(erro)
                            this.msgErro = "Ocorreu um erro ao tentar realizar a ação.";
                            break;
                    }
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                });
            }
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('ADMIN_ROLE');
        }
    }
};
</script>

<style>

</style>