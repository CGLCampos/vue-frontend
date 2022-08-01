<template>
<div v-show="logged">
    <PageLayout titulo="Livros">
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item"><router-link :to="{name: 'livros.index'}">Livros</router-link></li>
            <li class="breadcrumb-item active">Detalhes</li>
        </template>

        <template #conteudo>
            <MyCard titulo="Detalhes do livro:" estilo="card-primary">
                <template #tools>
                    <MyButton v-if="isAdmin && mostrar"
                        estilo="bg-light btn-tool"
                        icone="edit"
                        titulo="Editar Livro"
                        @acao="editarLivro(livro.id)"
                    />
                </template>
    
                <template #content>
                    <MyAlert :erro="true" :alert="true" :message="msgErro" v-if="msgErro" />
                    <table class="table table-bordered table-hover" v-if="mostrar">
                        <tbody>
                            <tr>
                                <th class="col-3">Titulo:</th>
                                <td>{{livro.titulo}}</td>
                            </tr>
                            <tr>
                                <th>Autor:</th>
                                <td>{{livro.autor}}</td> 
                            </tr>
                            <tr>
                                <th>Editora:</th>
                                <td>{{livro.editora}}</td>
                            </tr>
                            <tr>
                                <th>Data de Publicação:</th>
                                <td>{{livro.data_publicacao}}</td>
                            </tr>
                            <tr>
                                <th>Idioma</th>
                                <td>{{livro.idioma}}</td>
                            </tr>
                            <tr>
                                <th>Categoria</th>
                                <td>{{livro.categoria.nome}}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td v-if="livro.reservado"><strong class="text-success reservado">RESERVADO</strong></td>
                                <td v-else><strong>NÃO RESERVADO</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </template>

                <template #footer>
                    <MyButton
                        estilo="btn-secondary float-right"
                        rotulo="Voltar"
                        titulo="Voltar"
                        @acao="() => {this.$router.push({name: 'livros.index'})}"
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
            msgErro: "",
            mostrar: false,

            livro: {
                categoria: {}
            },
        }
    },
    props: {
        id: {type: Number, required: true}
    },
    components: {
        PageLayout,
        MyCard,
        MyButton,
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

                this.service = new LivroService(this.$http);

                this.service.buscar(this.id)
                    .then(response => this.livro = response.data)
                    .then(() => this.mostrar = true)
                    .catch(erro => {
                        switch (erro.response.status) {
                            case 401: 
                                this.msgErro = erro.response.data.erro;
                                break;

                            case 404: 
                                this.msgErro = erro.response.data.erro;
                                break;

                            default:
                                console.log(erro)
                                this.msgErro = "Ocorreu um erro ao buscar os dados do livro";
                                break;
                        }
                    });
            });
    },
    methods: {
        editarLivro(id) {
            this.$router.push({name: 'livros.edit', params: {id}})
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
