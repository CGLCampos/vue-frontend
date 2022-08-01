<template>
<div v-show="logged">
    <PageLayout titulo="Nova Reserva">
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item"><router-link :to="{name: 'reservas.index'}">Reservas</router-link></li>
            <li class="breadcrumb-item active">Nova Reserva</li>
        </template>
        <template #conteudo>
            <MyCard titulo="Informe os dados da reserva:" estilo="card-primary">
                <template #content>
                    <MyAlert :erro="true" :message="erro.reservas" v-if="erro.reservas"/>
                    <div>
                        <div class="form-group mt-3">
                            <label>Selecione o aluno:</label>
                            <Select2 
                                v-model="reserva.aluno_id" 
                                :options="listaAlunos"
                                placeholder="Selecione o aluno"
                            />
                            <MyAlert :erro="true" :alert="true" :message="erro.aluno_id[0]" v-if="erro.aluno_id[0]"/>
                        </div>
                        <div class="form-group mt-5">
                            <div class="row">
                                <div class="col-6">
                                    <p v-if="!mostrarLivros">Buscando dados...</p>
                                    <table class="table table-bordered table-hover" v-if="mostrarLivros">
                                        <thead class="bg-primary">
                                            <tr>
                                                <th class="col-6">Livros disponíveis</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="selecionarLivro(livro.id)"
                                                v-for="livro in livrosDisponiveis.data" :key="livro.id" 
                                                :class="livro.selecionado ? 'bg-primary' : ''">
                                                <td>
                                                    <i class="fas fa-book mr-2"></i>
                                                    {{ livro.titulo }}
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="3">
                                                    <MyPagination :paginate="livrosDisponiveis" v-if="paginateLivros && mostrarLivros" 
                                                        @mudarPagina="gerarTabelaLivros($event.page)" />
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div class="col-6">
                                    <p v-if="!mostrarLivros">Buscando dados...</p>
                                    <table class="table table-bordered table-hover" v-if="mostrarLivros">
                                        <thead class="bg-primary">
                                            <tr>
                                                <th>Livros selecionados</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="retirarSelecaoLivro(livro.id)"
                                                v-for="livro in livrosSelecionados" :key="livro.id">
                                                <td>
                                                    <i class="fas fa-book mr-2"></i>
                                                    {{ livro.titulo }}
                                                </td>
                                            </tr>
                                            <tr v-if="livrosSelecionados.length == 0">
                                                <td colspan="3">Nenhum livro foi selecionado</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <MyAlert :erro="true" :alert="true" :message="erro.livros_reservados[0]" v-if="erro.livros_reservados[0]"/>
                                    <MyAlert :erro="true" :alert="true" :message="maximoSelecionado" v-if="maximoSelecionado"/>
                                </div>
                            </div>
                        </div> 
                        <p class="alert alert-warning">
                            <strong class="center">A devolução deve ser feita em até 7 dias.</strong>
                        </p>
                    </div>
                </template>
                <template #footer>
                    <MyButton v-if="!temErro && mostrar"
                        estilo="btn-primary float-right"
                        rotulo="reservar"
                        @acao="reservar"
                    />
                    <MyButton
                        :estilo="'btn-secondary ' + (temErro || !mostrar ? 'float-right' : '')"
                        rotulo="Voltar"
                        @acao="() => {this.$router.push({name: 'reservas.index'})}"
                    />
                </template>
            </MyCard>
        </template>
    </PageLayout>
</div>
</template>

<script>
import PageLayout from '@/components/layouts/PageLayout.vue';
import MyCard from '@/components/shared/MyCard.vue';
import MyPagination from '@/components/shared/MyPagination.vue';
import LivroService from '@/services/LivroService';
import AlunoService from '@/services/AlunoService';
import ReservaService from '@/services/ReservaService';
import MyButton from '@/components/shared/MyButton.vue';
import MyAlert from '@/components/shared/MyAlert.vue';
import Select2 from 'vue3-select2-component';

export default {
    data() {
        return {
            logged: false,
            user: {
                roles: []
            },
            mostrarAlunos: false,
            mostrarLivros: false,

            listaAlunos: [],

            livrosDisponiveis: {},
            paginateLivros: false,
            pageLivros: 1,
            livroInicial: null,
            livrosSelecionados: [],

            per_page: 10,

            reserva: {
                aluno_id: "",
                livros_reservados: []
            },
            erro: {
                reservas: "",
                aluno_id: [],
                livros_reservados: [],
            },
            maximoSelecionado: ""
        }
    },
    components: {
        PageLayout,
        MyCard,
        MyPagination,
        MyButton,
        MyAlert,
        Select2
    },
    props: {
        id: Number
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

                this.service = new ReservaService(this.$http)
                this.alunoService = new AlunoService(this.$http);
                this.livroService = new LivroService(this.$http);

                if(this.isAdmin) {
                    this.gerarTabelaAlunos(this.pageAlunos);
                } else {
                    this.gerarTabelaUsuario();
                }

                if(this.id) {
                    this.livroService.buscar(this.id)
                        .then(response => {
                            response.data.active = true;
                            this.reserva.livros_reservados.push(response.data.id);
                            this.livroInicial = response.data;
                        })
                        .then(() => this.gerarTabelaLivros(this.pageLivros, true))
                        .catch(erro => {
                            if(!erro.response) {
                                console.log(erro)
                                this.erro.livros_reservados = ["Ocorreu um erro ao buscar os dados dos livros"];
                                return;
                            }
                            switch (erro.response.status) {
                                case 401:
                                    this.erro.reservas = erro.response.data.erro;
                                    break;

                                default:
                                    this.erro.livros_reservados = ["Ocorreu um erro ao buscar os dados dos livros"];
                                    break;
                            }
                        })
                } else {
                    this.gerarTabelaLivros(this.pageLivros)
                }
            })
    },
    methods: {
        gerarTabelaAlunos(page) {
            this.alunoService.listar(page, this.per_page)
                .then(response => this.listaAlunos = response.data.map(aluno => {
                    return {id: aluno.id.toString(), text: `${aluno.nome} (Turma ${aluno.turma})`}
                }))
                .then(() => this.mostrarAlunos = true)
                .catch(erro => {
                    if(!erro.response) {
                        console.log(erro)
                        this.erro.aluno_id = ["Ocorreu um erro ao buscar os dados dos alunos"];
                        return;
                    }
                    switch (erro.response.status) {
                        case 401:
                            this.erro.reservas = erro.response.data.erro;
                            break;

                        default:
                            this.erro.aluno_id = ["Ocorreu um erro ao buscar os dados dos alunos"];
                            break;
                    }
                });
        },
        gerarTabelaUsuario() {
            this.alunoService.buscarPerfil()
                .then(response => {
                    this.listaAlunos = [response.data];
                    let aluno = this.listaAlunos[0]
                    this.selecionarAluno(aluno.id);
                })
                .then(() => this.paginateAlunos = false)
                .then(() => this.mostrarAlunos = true)
                .catch(erro => {
                    if(!erro.response) {
                        console.log(erro)
                        this.erro.aluno_id = ["Ocorreu um erro ao buscar os dados dos livros"];
                        return;
                    }
                    switch (erro.response.status) {
                        case 401: 
                            this.erro.reservas = erro.response.data.erro;
                            break;

                        default:
                            this.erro.aluno_id = ["Ocorreu um erro ao buscar os dados"];
                            break;
                    }
                });
        },
        gerarTabelaLivros(page, create) {
            this.livroService.listarDisponiveis(page, this.per_page)
                .then(response => {
                    this.livrosDisponiveis = response.data;
                    this.livrosDisponiveis.data.forEach(livro => {
                        if (this.reserva.livros_reservados.includes(livro.id)) {
                            livro.selecionado = true;
                        } else {
                            livro.selecionado = false;
                        }
                    });
                })
                .then(() => create ? this.gerarLivroInicial() : '')
                .then(() => this.paginateLivros = false)
                .then(() => { 
                    this.paginateLivros = true
                    this.pageLivros = page
                    this.mostrarLivros = true
                })
                .catch(erro => {
                    if(!erro.response) {
                        console.log(erro)
                        this.erro.livros_reservados = ["Ocorreu um erro ao buscar os dados dos livros"];
                        return;
                    }
                    switch (erro.response.status) {
                        case 401:  
                            this.erro.reservas = erro.response.data.erro;
                            break;

                        default:
                            this.erro.livros_reservados = "Ocorreu um erro ao buscar os dados dos livros";
                            break;
                    }
                });
        },
        gerarLivroInicial() {
            this.livrosDisponiveis.data = this.livrosDisponiveis.data.filter(livro => livro.id != this.livroInicial.id)
            this.livrosDisponiveis.data.unshift(this.livroInicial)
        },
        reservar() {
            this.service.cadastrar(this.reserva)
                .then(response => this.$router.push({
                    name:'reservas.show', 
                    params: {
                        id: response.data.id
                    }
                }))
                .catch(erro => {
                    switch (erro.response.status) {
                        case 422:
                            this.erro.aluno_id = 
                                erro.response.data.aluno_id 
                                ? erro.response.data.aluno_id 
                                : "" ;

                            this.erro.livros_reservados = 
                                erro.response.data.livros_reservados 
                                ? erro.response.data.livros_reservados 
                                : "" ;

                            break;
                    
                        default:
                            console.log(erro)
                            break;
                    }
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                });
        },
        selecionarLivro(id) {
            if(this.reserva.livros_reservados.includes(id)) {
                this.retirarSelecaoLivro(id);
                return;
            }
            if(this.livrosSelecionados.length < 3) {
                this.reserva.livros_reservados.push(id);
                this.livrosSelecionados.push(...this.livrosDisponiveis.data.filter(livro => livro.id == id));
                this.livrosDisponiveis.data.forEach(livro => {
                    if(livro.id == id) {
                        livro.selecionado = true
                    }
                })
            } 
            else {
                this.emitirMensagemMaximo();
            }
        },
        retirarSelecaoLivro(id) {
            this.livrosDisponiveis.data.forEach(livro => {
                if (livro.id == id) {
                    livro.selecionado = false
                }
            })
            this.livrosSelecionados = this.livrosSelecionados.filter(livro => livro.id != id)
            this.reserva.livros_reservados = this.reserva.livros_reservados.filter(livro_id => livro_id != id)
            return;
        },
        emitirMensagemMaximo() {
            this.maximoSelecionado = 'É possivel selecionar apenas 3 livros, desmarque um livro para escolher outro';

            setTimeout(() => {
                this.maximoSelecionado = "";
            }, 3000);
        },
    },
    computed: {
        temErro() {
            return Boolean(this.erro.reservas || this.erro.aluno_id > 0 || this.erro.livros_reservados  > 0)
        },
        temErroAluno() {
            return this.erro.aluno_id.length > 0
        },
        isAdmin() {
            return this.user.roles.includes('ADMIN_ROLE');
        },
        mostrar() {
            return Boolean(this.mostrarAlunos && this.mostrarLivros);
        }
    }
}
</script>

<style>
    .table-border {
        border: 1px solid black;
    }
</style>