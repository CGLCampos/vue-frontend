<template>
<div v-show="logged">
    <AcessoNegado v-if="!isAdmin" />
    <PageLayout v-else titulo="Alunos">
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item active">Alunos</li>
        </template>

        <template #conteudo>
            <MyCard titulo="Alunos cadastrados" icone="user-graduate" estilo="card-primary responsive-table" >
                <template #tools>
                    <MyButton
                        estilo="bg-light btn-tool"
                        icone="plus"
                        rotulo="cadastrar novo aluno"
                        titulo="Cadastrar novo Aluno"
                        @acao="() => {this.$router.push({name:'alunos.create'})}"
                    />
                </template>

                <template #content>
                    <MyAlert :erro="true" :alert="true" :message="msgErro" v-if="msgErro" />
                    <MyAlert :alert="true" :message="msgSucesso" v-if="msgSucesso" />
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th class="col-4">Nome</th>
                                <th class="col-4">E-mail</th>
                                <th class="col-1">Turma</th>
                                <th class="col-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="aluno in alunos.data" :key="aluno.id" :class="`aluno-${aluno.id}`">
                                <td>{{ aluno.nome }}</td>
                                <td>{{ aluno.user.email }}</td>
                                <td>{{ aluno.turma }}</td>
                                <td>
                                    <div class="btn-group btn-block">
                                        <MyButton
                                            estilo="btn-outline-primary btn-sm"
                                            rotulo="ver aluno"
                                            titulo="Ver aluno"
                                            @acao="verDetalhes(aluno.id)"
                                        />

                                        <MyButton
                                            estilo="btn-outline-secondary"
                                            icone="edit"
                                            titulo="Editar aluno"
                                            @acao="editarAluno(aluno.id)"
                                        />

                                        <button type="button" 
                                            class="btn btn-outline-danger" title="Excluir Aluno"
                                            data-toggle="modal" 
                                            :data-target="`#modal-excluir-${aluno.id}`">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="modais">
                        <MyModal v-for="aluno in alunos.data" :key="aluno.id" @acao="excluirAluno(aluno.id)"
                            :name="`modal-excluir-${aluno.id}`" estilo="danger" titulo="Confirmar exclusão do aluno?">
                            <p>
                                Essa operação não pode ser revertida, 
                                tem certeza que realmente deseja excluir: 
                                <strong>"{{aluno.nome}}"</strong>?
                            </p>
                            <p>Clique em "Confirmar" para realizar a ação.</p>
                        </MyModal>
                    </div>
                </template>

                <template #footer>
                    <MyPagination :paginate="alunos" :info="true" v-if="paginate" 
                        @mudarPagina="atualizarPagina($event)" />
                </template>
            </MyCard>
        </template>
    </PageLayout>
</div>
</template>

<script>
import AcessoNegado from '@/components/layouts/AcessoNegado.vue';
import AlunoService from "@/services/AlunoService.js"
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
            temErroDisponiveis: true,
            alunos: {},
            paginate: false,
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
        MyAlert,
        AcessoNegado
    },
    created() {
        this.$loginService.logged()
            .then(response => {
                if(!response.data.logged) {
                    this.$router.replace({name: 'login', params: {titulo: "Faça login para acessar o conteúdo"}})
                    return;
                }

                this.logged = response.data.logged;
                
                this.user = response.data.user
                if(!this.isAdmin)  {
                    return;
                }

                this.service = new AlunoService(this.$http);

                this.service.paginate(this.page, this.per_page)
                    .then((res) => this.alunos = res.data)
                    .then(() => this.paginate = true)
                    .catch((err) => console.log(err));
            });
    },
    methods: {
        atualizarPagina($event) {
            this.service.paginate($event.page, this.per_page)
                .then((res) => this.alunos = res.data)
                .then(() => this.paginate = false)
                .then(() => this.page = $event.page)
                .then(() => this.paginate = true)
                .catch((erro) => {
                    console.log(erro)
                    this.msgErro = erro.message
                });
        },
        verDetalhes(id) {
            this.$router.push({name: 'alunos.show', params: {id}})
        },
        editarAluno(id) {
            this.$router.push({name: 'alunos.edit', params: {id}})
        },
        excluirAluno(id) {
            this.service.excluir(id)
                .then(response => console.log(response))
                .then(() => {
                    this.alunos.data = this.alunos.data.filter(aluno => aluno.id != id);
                    this.msgSucesso = "Aluno excluido com sucesso";

                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    setTimeout(() => {
                        this.msgSucesso = "";
                    }, 3000);
                })
                .then(() => this.atualizarPagina({page: this.page}))
                .catch(erro => {
                    switch (erro.response.status) {
                        case 400:
                            console.log(erro.response.data)
                            this.msgErro = erro.response.data.erro;
                            break;

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