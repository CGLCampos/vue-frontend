<template>
<div v-show="logged">
    <AcessoNegado v-if="acessoEstaNegado" />
    <PageLayout v-else titulo="Alunos">
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item"><router-link :to="{name: 'alunos.index'}">Alunos</router-link></li>
            <li class="breadcrumb-item active">Detalhes</li>
        </template>

        <template #conteudo>
            <MyCard titulo="Detalhes do aluno:" estilo="card-primary">
                <template #tools>
                    <MyButton v-if="isAdmin && mostrar"
                        estilo="bg-light btn-tool"
                        icone="edit"
                        titulo="Editar Aluno"
                        @acao="editarAluno(aluno.id)"
                    />
                </template>

                <template #content>
                    <MyAlert :erro="true" :alert="true" :message="msgErro" v-if="msgErro" />
                    <table class="table table-bordered table-hover" v-if="mostrar">
                        <tbody>
                            <tr>
                                <th class="col-3">Nome:</th>
                                <td>{{aluno.nome}}</td>
                            </tr>
                            <tr>
                                <th>Turma:</th>
                                <td>{{aluno.turma}}</td> 
                            </tr>
                            <tr>
                                <th>Data de Nascimento:</th>
                                <td>{{aluno.data_nascimento}}</td>
                            </tr>
                            <tr>
                                <th>E-mail:</th>
                                <td>{{aluno.user.email}}</td>
                            </tr>
                        </tbody>
                    </table>
                </template>

                <template #footer>
                    <MyButton 
                        :estilo="`btn-secondary ${mostrar ? '' : 'float-right'}`"
                        rotulo="Voltar"
                        titulo="Voltar"
                        @acao="() => {this.$router.push({name: 'alunos.index'})}"
                    />
                    <MyButton v-if="mostrar"
                        estilo="btn-primary float-right"
                        rotulo="nova reserva"
                        titulo="Nova Reserva"
                        @acao="reservar()"
                    />
                </template>
            </MyCard>

            <MyCard titulo="Reservas do aluno" icone="book-open" estilo="card-secondary" v-if="temReservas">
                <template #tools>
                </template>

                <template #content>
                    <!-- <div class="alert alert-danger" role="alert" v-if="msgErroDisponivel">
                        This is a danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
                    </div> -->
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Data Reserva</th>
                                <th class="col-8">Livros</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="reserva in aluno.reservas" :key="reserva.id" :class="`reserva-${reserva.id}`" >
                                <td>{{ reserva.data_reserva }}</td>
                                <td>
                                    <div v-for="reservado in reserva.livros_reservados" :key="reservado.id">
                                        <router-link :to="{ name: 'livros.show', params: { id: reservado.livro.id }}" v-if="reservado.devolvido"
                                            :title="`Ver ${reservado.livro.titulo}`" class="text-body d-block">
                                            <i class="fas fa-book"></i>
                                            <span class="icon-text sublinhar">
                                                Devolvido ({{reservado.data_devolucao}}): 
                                                <strong>{{reservado.livro.titulo}}</strong>
                                            </span>
                                        </router-link>
                                        <router-link :to="{ name: 'livros.show', params: { id: reservado.livro.id }}" v-else
                                            :title="`Ver ${reservado.livro.titulo}`" class="text-primary d-block">
                                            <i class="fas fa-book"></i>
                                            <span class="icon-text sublinhar">
                                                Reservado: <strong>{{reservado.livro.titulo}}</strong>
                                            </span>
                                        </router-link>
                                    </div>
                                </td>
                                <td>
                                    <div class="btn-group btn-block">
                                        <MyButton
                                            estilo="btn-outline-success btn-sm"
                                            icone="book-open"
                                            rotulo="ver reserva"
                                            titulo="Ver Reserva"
                                            @acao="verReserva(reserva.id)"
                                        />

                                        <MyButton v-if="!reserva.finalizado && isAdmin"
                                            estilo="btn-outline-danger btn-sm"
                                            rotulo="finalizar"
                                            titulo="Finalizar reserva"
                                            @acao="finalizarReserva(reserva.id)"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>

                <template #footer>
                    <!-- <MyPagination :paginate="reservasReservados" :info="true" v-if="paginateReservado" 
                        @mudarPagina="atualizarPagina($event, 'reservado')" /> -->
                </template>
            </MyCard>
        </template>
    </PageLayout>
</div>
</template>

<script>
import PageLayout from '@/components/layouts/PageLayout.vue'
import MyCard from '@/components/shared/MyCard.vue'
import AlunoService from '@/services/AlunoService'
import MyButton from '@/components/shared/MyButton.vue'
import AcessoNegado from '@/components/layouts/AcessoNegado.vue'
import MyAlert from '@/components/shared/MyAlert.vue'


export default {
    data() {
        return {
            logged: false,
            user: {
                roles: []
            },
            acessoEstaNegado: true,

            aluno: {
                user: {},
                reservas: []
            },
            temReservas: false,
            msgErro: "",
            mostrar: false
        }
    },
    props: {
        id: Number,
        acao: String
    },
    components: {
        PageLayout,
        MyCard,
        MyButton,
        AcessoNegado,
        MyAlert
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

                this.service = new AlunoService(this.$http);

                if(this.acao === 'perfil') {
                    if(this.isAdmin) {
                        return;
                    }
                    this.acessoEstaNegado = false;
                    
                    this.service.buscarPerfil()
                        .then(response => {
                            this.aluno = response.data;
                            this.temReservas = this.aluno.reservas.length > 0;
                        })
                        .catch((erro) => {
                            this.msgErro = erro.message
                        });
                } else {
                    if(!this.isAdmin) {
                        return
                    }
                    this.acessoEstaNegado = false;

                    this.service.buscar(this.id)
                        .then(response => {
                            this.aluno = response.data;
                            this.temReservas = this.aluno.reservas.length > 0;
                        })
                        .then(() => this.mostrar = true)
                        .catch((erro) => {
                            switch (erro.response.status) {
                                case 404: 
                                    this.msgErro = erro.response.data.erro;
                                    break;

                                default:
                                    console.log(erro)
                                    this.msgErro = "Ocorreu um erro ao buscar os dados do livro";
                                    break;
                            }
                        });
                }
        });
    },
    methods: {
        verReserva(id) {
            this.$router.push({name: 'reservas.show', params: {id}})
        },
        editarAluno(id) {
            this.$router.push({name: 'alunos.edit', params: {id}})
        },
        reservar() {
            this.$router.push({name: 'reservas.create'})
        },
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('ADMIN_ROLE');
        }
    }
}
</script>

<style>

</style>
