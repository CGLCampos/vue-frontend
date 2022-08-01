<template>
<div v-show="logged">
    <AcessoNegado v-if="!isAdmin" />
    <PageLayout titulo="Reservas">
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item active">Reservas</li>
        </template>

        <template #conteudo>
            <MyCard titulo="Reservas em aberto" icone="book" estilo="card-primary" >
                <template #tools>
                    <MyButton
                        estilo="bg-light btn-tool"
                        icone="plus"
                        rotulo="cadastrar novo reserva"
                        titulo="Cadastrar novo reserva"
                        @acao="() => {this.$router.push({name:'reservas.create'})}"
                    />
                </template>

                <template #content>
                    <MyAlert :erro="true" :alert="true" :message="msgErro" v-if="msgErro" />
                    <MyAlert :alert="true" :message="msgSucesso" v-if="msgSucesso" />
                    <table id="example2" class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Data da reserva</th>
                                <th>Aluno</th>
                                <th class="col-6">Livros</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="reserva in reservasAbertas.data" :key="reserva.id" :class="`reserva-${reserva.id}`" >
                                <td>{{ reserva.data_reserva }}</td>
                                <td>
                                    <router-link :to="{ name: 'alunos.show', params: { id: reserva.aluno.id }}" title="Ver aluno" class="text-body">
                                        <i class="fas fa-user-graduate mr-2"></i>
                                        <strong class="icon-text sublinhar">{{reserva.aluno.nome}}</strong>
                                    </router-link>
                                </td>
                                <td>
                                    <div v-for="reservado in reserva.livros_reservados" :key="reservado.id">
                                        <router-link :to="{ name: 'livros.show', params: { id: reservado.livro.id }}" v-if="reservado.devolvido"
                                            :title="`Ver ${reservado.livro.titulo}`" class="text-body d-block">
                                            <i class="fas fa-book mr-2"></i>
                                            <span class="icon-text sublinhar">
                                                Devolvido ({{reservado.data_devolucao}}): 
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
                                <td>
                                    <div class="btn-group btn-block">
                                        <MyButton
                                            estilo="btn-outline-success btn-sm"
                                            icone="book-open"
                                            rotulo="ver reserva"
                                            titulo="Ver Reserva"
                                            @acao="verDetalhes(reserva.id)"
                                        />

                                        <button type="button" 
                                                class="btn btn-outline-primary btn-sm" 
                                                data-toggle="modal" 
                                                :data-target="`#modal-finalizar-${reserva.id}`">
                                                <strong class="text-uppercase">finalizar</strong>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-for="reserva in reservasAbertas.data" :key="reserva.id"  class="modais">
                        <MyModal v-for="reserva in reservasAbertas.data" :key="reserva.id" @acao="finalizarReserva(reserva.id)"
                            :name="`modal-finalizar-${reserva.id}`" estilo="primary" titulo="Confirmar finalização do reserva?">
                            <p>Essa operação não pode ser revertida.</p>
                            <p>
                                Todos os livros dessa reserva serão listados como <strong>devolvidos</strong>.
                                Tem certeza que realmente deseja <strong>finalizar</strong> a reserva
                            </p>
                            <p>Clique em "<strong>Confirmar</strong>" para realizar a ação.</p>
                        </MyModal>
                    </div>
                </template>

                <template #footer>
                    <MyPagination :paginate="reservasAbertas" :info="true" v-if="paginateAbertas" 
                        @mudarPagina="atualizarPagina($event, 'abertas')" />
                </template>
            </MyCard>

            <MyCard titulo="Reservas finalizadas" icone="book-open" estilo="card-secondary collapsed-card" >
                <template #tools>
                    <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Minimizar/Maximizar"> 
                        <i class="fas fa-plus"></i>
                    </button>
                </template>

                <template #content>

                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Data de finalização</th>
                                <th>Aluno</th>
                                <th class="col-6">Livros</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="reserva in reservasFinalizadas.data" :key="reserva.id" :class="`reserva-${reserva.id}`" >
                                <td>{{reserva.data_finalizacao}}</td>
                                <td>
                                    <a :to="{ name: 'alunos.show', params: { id: reserva.aluno.id }}" title="Ver aluno" class="text-body">
                                        <i class="fas fa-user-graduate mr-2"></i>
                                        <strong class="icon-text sublinhar">{{reserva.aluno.nome}}</strong>
                                    </a>
                                </td>
                                <td>
                                    <div v-for="reservado in reserva.livros_reservados" :key="reservado.id">
                                        <router-link :to="{ name: 'livros.show', params: { id: reservado.livro.id }}" v-if="reservado.devolvido"
                                            :title="`Ver ${reservado.livro.titulo}`" class="text-body d-block">
                                            <i class="fas fa-book mr-2"></i>
                                            <span class="icon-text sublinhar">
                                                Devolvido ({{reservado.data_devolucao}}): 
                                                <strong>{{reservado.livro.titulo}}</strong>
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
                                            @acao="verDetalhes(reserva.id)"
                                        />

                                        <button type="button" 
                                                class="btn btn-outline-danger btn-sm" 
                                                data-toggle="modal" 
                                                :data-target="`#modal-excluir-${reserva.id}`">
                                                <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="modais">
                        <MyModal v-for="reserva in reservasFinalizadas.data" :key="reserva.id" @acao="excluirReserva(reserva.id)"
                            :name="`modal-excluir-${reserva.id}`" estilo="danger" titulo="Confirmar exclusão do reserva?">
                            <p>
                                Essa operação não pode ser revertida, 
                                tem certeza que realmente deseja excluir: 
                                <strong>"{{reserva.titulo}}"</strong>?
                            </p>
                            <p>Clique em "Confirmar" para realizar a ação.</p>
                        </MyModal>
                    </div>
                </template>

                <template #footer>
                    <MyPagination :paginate="reservasFinalizadas" :info="true" v-if="paginateFinalizadas" 
                        @mudarPagina="atualizarPagina($event, 'reservado')" />
                </template>
            </MyCard>
        </template>
    </PageLayout>
</div>
</template>

<script>
import ReservaService from "@/services/ReservaService.js"
import PageLayout from  "@/components/layouts/PageLayout.vue";
import MyCard from "@/components/shared/MyCard.vue";
import MyButton from "@/components/shared/MyButton.vue";
import MyPagination from  "@/components/shared/MyPagination.vue";
import MyModal from '@/components/shared/MyModal.vue';
import MyAlert from '@/components/shared/MyAlert.vue';
import AcessoNegado from '@/components/layouts/AcessoNegado.vue';

export default {
    name: "App",
    data() {
        return {
            logged: false,
            user: {
                roles: []
            },
            negado: true,

            msgSucesso: "",
            msgErro: "",
            temErroDisponiveis: true,
            reservasAbertas: {},
            paginateAbertas: false,
            reservasFinalizadas: {},
            paginateFinalizadas: false,
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
                this.user = response.data.user;
                if(!this.isAdmin)  {
                    return;
                }

                this.service = new ReservaService(this.$http);

                this.service.listarAbertas(this.page, this.per_page)
                    .then((response) => {
                        this.reservasAbertas = response.data;

                        this.reservasAbertas.data.sort(function(a,b) {
                            var partsA = a.data_reserva.split('/');
                            var partsB = b.data_reserva.split('/');
                            // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
                            // January - 0, February - 1, etc.
                            var myDateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
                            var myDateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);

                            let resultado = myDateB - myDateA

                            return resultado == 0 ? -1 : resultado;
                        });
                    })
                    .then(() => this.paginateAbertas = true)
                    .catch((err) => console.log(err));

                this.service.listarFinalizadas(this.page, this.per_page)
                    .then((response) => {
                        this.reservasFinalizadas = response.data

                        this.reservasFinalizadas.data.sort(function(a,b) {
                            var partsA = a.data_finalizacao.split('/');
                            var partsB = b.data_finalizacao.split('/');

                            var myDateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
                            var myDateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);

                            let resultado = myDateB - myDateA

                            return resultado == 0 ? -1 : resultado;
                        });
                    })
                    .then(() => this.paginateFinalizadas = true)
                    .catch((err) => console.log(err));
            });
    },
    methods: {
        atualizarPagina($event, name) {
            if(name == 'abertas'){
                this.service.listarAbertas($event.page, this.per_page)
                    .then((res) => this.reservasAbertas = res.data)
                    .then(() => this.paginateAbertas = false)
                    .then(() => this.paginateAbertas = true)
                    .then(() => this.page = $event.page)
                    .catch((erro) => {
                        console.log(erro)
                        this.emitirMensagemErro(erro.message);
                    });

            } else if(name == 'finalizadas') {
                this.service.listarFinalizadas($event.page, this.per_page)
                    .then((res) => this.reservasFinalizadas = res.data)
                    .then(() => this.paginateFinalizadas = false)
                    .then(() => this.paginateFinalizadas = true)
                    .then(() => this.page = $event.page)
                    .catch((erro) => {
                        console.log(erro)
                        this.emitirMensagemErro(erro.message);
                    });
            }
        },
        verDetalhes(id) {
            this.$router.push({name: 'reservas.show', params: {id}})
        },
        finalizarReserva(id) {
            this.service.devolver(id)
                .then(() => {
                    this.service.finalizar(id)
                        .then(() => {
                            this.reservasAbertas.data = this.reservasAbertas.data.filter(reserva => reserva.id != id);
                            this.emitirMensagemSucesso("Reserva finalizada com sucesso");
                        })
                    .then(() => this.atualizarPagina({page: this.page}, 'finalizadas'))
                    .catch(erro => {
                        switch (erro.response.status) {
                            case 401:
                                console.log(erro.response.data)
                                this.emitirMensagemErro(erro.response.data.erro);
                                break;
                        
                            default:
                                console.log(erro)
                                this.emitirMensagemErro("Ocorreu um erro ao tentar realizar a ação.");
                                break;
                        }
                    });
                })
                .catch(erro => {
                    console.log(erro);
                    this.emitirMensagemErro("Ocorreu um erro ao tentar realizar a ação.");
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                });
                
        },
        excluirReserva(id) {
            this.service.excluir(id)
                .then(() => {
                    this.reservasFinalizadas.data = this.reservasFinalizadas.data.filter(reserva => reserva.id != id);
                    this.emitirMensagemSucesso("Reserva excluida com sucesso")
                })
                .then(() => this.atualizarPagina({page: this.page}, 'finalizadas'))
                .catch(erro => {
                    switch (erro.response.status) {
                        case 401:
                            console.log(erro.response.data)
                            this.emitirMensagemErro(erro.response.data.erro);
                            break;
                    
                        default:
                            console.log(erro)
                            this.emitirMensagemErro("Ocorreu um erro ao tentar realizar a ação.");
                            break;
                    }
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                });
        },
        emitirMensagemSucesso(msg) {
            this.msgSucesso = msg;

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            setTimeout(() => {
                this.msgSucesso = "";
            }, 3000);
        },
        emitirMensagemErro(msg) {
            this.msgErro = msg;

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            setTimeout(() => {
                this.msgErro = "";
            }, 3000);
        },
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('ADMIN_ROLE');
        }
    }
};
</script>

<style>

.sublinhar:hover {
    text-decoration: underline;
}

td {
    vertical-align: middle !important;
}

</style>