<template>
<div v-show="logged">
    <AcessoNegado v-if="acessoEstaNegado" />
    <PageLayout v-else titulo="Reservas">
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item"><router-link :to="{name: 'reservas.index'}">Reservas</router-link></li>
            <li class="breadcrumb-item active">Detalhes</li>
        </template>

        <template #conteudo>
            <MyCard titulo="Detalhes da reserva:" estilo="card-primary" icone="book-open">
                <template #tools>

                </template>

                <template #content>
                    <div class="alert alert-success" role="alert" v-if="msgSucesso">
                        <i class="fas fa-check mr-1"></i>
                        {{ msgSucesso }}
                    </div>
                    <div class="alert alert-danger" role="alert" v-if="msgErro">
                        <i class="fas fa-ban mr-1"></i>
                        {{ msgErro }}
                    </div>
                    <table class="table table-bordered table-hover" v-else>
                        <tbody v-if="gerarTabela">
                            <tr>
                                <th class="col-3">Data da reserva:</th>
                                <td>{{reserva.data_reserva}}</td>
                            </tr>
                            <tr>
                                <th>Aluno:</th>
                                <td>
                                    <router-link :to="{ name: 'alunos.show', params: { id: reserva.aluno.id }}" title="Ver aluno" class="text-body">
                                        <i class="fas fa-user-graduate mr-2"></i>
                                        <strong class="icon-text sublinhar">{{reserva.aluno.nome}}</strong>
                                    </router-link>
                                </td>
                            </tr>
                            <tr>
                                <th>Reservas:</th>
                                <td>
                                    <div v-for="reservado in reserva.livros_reservados" :key="reservado.id">
                                        <router-link :to="{ name: 'livros.show', params: { id: reservado.livro.id }}" v-if="reservado.devolvido"
                                            :title="`Ver ${reservado.livro.titulo}`" class="text-body d-block">
                                            <i class="fas fa-book mr-2"></i>
                                            <span class="icon-text sublinhar">
                                                Devolvido ({{ reservado.data_devolucao }}): 
                                                <strong>{{reservado.livro.titulo}}</strong>
                                            </span>
                                        </router-link>
                                        <router-link :to="{ name: 'livros.show', params: { id: reservado.livro.id }}" v-else
                                            :title="`Ver ${reservado.livro.titulo}`" class="text-primary d-block">
                                            <i class="fas fa-book mr-2"></i>
                                            <span class="icon-text sublinhar">Reservado: 
                                                <strong>{{reservado.livro.titulo}}</strong>
                                            </span>
                                        </router-link>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Data de finalização:</th>
                                <td v-if="reserva.data_finalizacao">{{reserva.data_finalizacao}}</td>
                                <td v-else><strong>EM ABERTO</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </template>

                <template #footer>
                    <MyButton
                        estilo="btn-secondary float-right"
                        rotulo="Voltar"
                        titulo="Voltar"
                        @acao="() => {this.$router.push({name: 'reservas.index'})}"
                    />
                </template>
            </MyCard>
        </template>
    </PageLayout>
</div>
</template>

<script>
import PageLayout from '@/components/layouts/PageLayout.vue'
import MyCard from '@/components/shared/MyCard.vue'
import ReservaService from '@/services/ReservaService'
import MyButton from '@/components/shared/MyButton.vue'
import AcessoNegado from '@/components/layouts/AcessoNegado.vue'

export default {
    data() {
        return {
            logged: false,
            user: {
                roles: []
            },
            acessoEstaNegado: true,
            
            reserva: {
                aluno: {}
            },
            msgErro: "",
            msgSucesso: "",
            gerarTabela: false
        }
    },
    props: {
        id: {type: Number, required: true}
    },
    components: {
        PageLayout,
        MyCard,
        MyButton,
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
                this.user = response.data.user;

                this.acessoEstaNegado = false;

                this.service = new ReservaService(this.$http);
                this.service.buscar(this.id)
                    .then(response => this.reserva = response.data)
                    .then(() => this.gerarTabela = true)
                    .then(() => this.msgErro = "")
                    .catch(erro => {
                        switch (erro.response.status) {
                            case 401:
                                this.acessoEstaNegado = true;
                                break;

                            case 404:
                                this.msgErro = erro.response.data.erro
                                break;
                        
                            default:
                                console.log(erro)
                                this.msgErro = "Ocorreu um erro ao tentar realizar a ação.";
                                break;
                        }
                    });
                
            });
    },
    methods: {
        editarReserva(id) {
            this.$router.push({name: 'reservas.edit', params: {id}})
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

</style>
