<template>
<div v-show="logged">
    <AcessoNegado v-if="!isAdmin" />
    <PageLayout v-else :titulo="acao === 'create' ? 'Cadastrar novo livro' : 'Editar livro'">
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item"><router-link :to="{name: 'livros.index'}">Livros</router-link></li>
            <li class="breadcrumb-item active" v-if="acao === 'create'">Cadastrar</li>
            <li class="breadcrumb-item active" v-else>Editar</li>
        </template>
        <template #conteudo>
            <MyCard titulo="Informe os dados do livro:" estilo="card-primary">
                <template #content>
                    <MyAlert :erro="true" :alert="true" :message="erro.erro" v-if="erro.erro" />
                    <form v-else>
                        <div class="row">
                            <div class="col-9">
                                <div class="form-group">
                                    <label for="titulo">Título:</label>
                                    <input class="form-control" type="text" v-model="livro.titulo" id="titulo">
                                    <div class="text-danger mt-1" v-if="erro.titulo">
                                        <i class="fas fa-ban mr-1"></i>
                                        <span>{{erro.titulo[0]}}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-3">
                                <div class="form-group">
                                    <label>Selecione a categoria</label>
                                    <select class="form-control select-state select-categoria" @change="categoriaSelecionada($event)">
                                        <option v-if="acao === 'edit'" :value="livro.categoria.id">{{livro.categoria.nome}}</option>
                                        <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                                            {{categoria.nome}}
                                        </option>
                                    </select>
                                    <div class="text-danger mt-1" v-if="erro.categoria_id">
                                        <i class="fas fa-ban mr-1"></i>
                                        <span>{{erro.categoria_id[0]}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="autor">Autor:</label>
                            <input class="form-control" type="text" v-model="livro.autor" id="autor">
                            <div class="text-danger mt-1" v-if="erro.autor">
                                <i class="fas fa-ban mr-1"></i>
                                <span>{{erro.autor[0]}}</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="editora">Editora:</label>
                            <input class="form-control" type="text" v-model="livro.editora" id="editora">
                            <div class="text-danger mt-1" v-if="erro.editora">
                                <i class="fas fa-ban mr-1"></i>
                                <span>{{erro.editora[0]}}</span>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="data-publicacao">Data de publicação: (ex: 01/2010)</label>
                                    <input class="form-control" type="text" v-model="livro.data_publicacao" id="data_publicacao">
                                    <div class="text-danger mt-1" v-if="erro.data_publicacao">
                                        <i class="fas fa-ban mr-1"></i>
                                        <span>{{erro.data_publicacao[0]}}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="form-group">
                                    <label for="idioma">Idioma:</label>
                                    <input list="browsers" class="form-control" v-model="livro.idioma" id="idioma">
                                    <datalist id="browsers">
                                        <option value="Português" />
                                        <option value="Inglês" />
                                        <option value="Espanhol" />
                                    </datalist>
                                    <div class="text-danger mt-1" v-if="erro.idioma">
                                        <i class="fas fa-ban mr-1"></i>
                                        <span>{{erro.idioma[0]}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </template>

                <template #footer>
                    <MyButton
                        :estilo="'btn-secondary ' + (erro.erro ? 'float-right' : '')"
                        rotulo="Voltar"
                        titulo="Voltar"
                        @acao="() => {this.$router.push({name: 'livros.index'})}"
                    />
                    <div class="d-inline" v-if="!erro.erro">
                        <MyButton v-if="acao === 'create'"
                            estilo="btn-primary float-right"
                            rotulo="Cadastrar"
                            titulo="Cadastrar Livro"
                            @acao="cadastrar()"
                        />
                        <MyButton v-else
                            estilo="btn-primary float-right"
                            rotulo="Editar"
                            titulo="Editar Livro"
                            @acao="editar()"
                        />
                    </div>
                </template>
            </MyCard>
        </template>
    </PageLayout>
</div>
</template>

<script>
import AcessoNegado from '@/components/layouts/AcessoNegado.vue'
import PageLayout from '@/components/layouts/PageLayout.vue'
import MyCard from '@/components/shared/MyCard.vue'
import LivroService from '@/services/LivroService'

import MyButton from '@/components/shared/MyButton.vue'
import MyAlert from '@/components/shared/MyAlert.vue'

export default {
    data() {
        return {
            logged: false,
            user: {
                roles: []
            },
            
            livro: {
                titulo: "",
                autor: "",
                editora: "",
                data_publicacao: "",
                idioma: "",
                categoria: {},
                categoria_id: 1
            },
            erro: {
                erro: "",
                titulo: "",
                autor: "",
                editora: "",
                data_publicacao: "",
                idioma: "",
                categoria_id: ""
            },
            categorias: {}
        }
    },
    components: {
        PageLayout,
        MyCard,
        MyButton,
        AcessoNegado,
        MyAlert
    },
    props: {
        id: Number,
        acao: String
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

                this.service = new LivroService(this.$http);
        
                this.service.listarCategorias()
                    .then(response => this.categorias = response.data)
                    .catch(erro => {
                        switch (erro.response.status) {
                            case 401: 
                                this.erro = {erro: erro.response.data.erro};
                                break;
        
                            default:
                                console.log(erro)
                                this.erro = {erro: "Ocorreu um erro ao buscar os dados dos alunos"};
                                break;
                        }
                    });
        
                if(this.acao === 'edit') {
                    this.service.buscar(this.id)
                        .then(response => this.livro = response.data)
                        .then(livro => {
                            this.categorias = this.categorias.filter(categoria => categoria.id != livro.categoria.id);
                            this.livro.categoria_id = livro.categoria.id;
                        })
                        .catch(erro => {
                            switch (erro.response.status) {
                                case 404:
                                    console.log(erro.response.data)
                                    this.erro = erro.response.data;
                                    break;
        
                                case 500:
                                    console.log(erro)
                                    this.erro = {erro: "Erro ao buscar dados, o livro informado não existe."};
                                    break;
                            
                                default:
                                    console.log(erro)
                                    break;
                            }
                        });

                }   

            })
            .catch(() => {
                this.$router.push({name:'erro'});
            });

    },
    methods: {
        cadastrar() {
            this.service.cadastrar(this.livro)
                .then(response => this.$router.push({
                    name:'livros.show', 
                    params: {
                        id: response.data.id
                    }
                }))
                .catch(erro => {
                    switch (erro.response.status) {
                        case 422:
                            this.erro = erro.response.data;
                            break;
                    
                        default:
                            console.log(erro)
                            break;
                    }
                });
        },
        editar() {
            this.service.editar(this.id, this.livro)
                .then(() => this.$router.push({
                    name:'livros.show', 
                    params: {
                        id: this.id
                    }
                }))
                .catch((erro) => {
                    switch (erro.response.status) {
                        case 422:
                            this.erro = erro.response.data;
                            break;
                    
                        default:
                            console.log(erro)
                            break;
                    }
                });
        },
        categoriaSelecionada($event) {
            this.livro.categoria_id = $event.target.value;
        }
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