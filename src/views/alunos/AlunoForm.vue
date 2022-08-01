<template>
    <AcessoNegado v-if="logged && !isAdmin" />
    <PageLayout v-else>
        <template #links>
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">Home</router-link></li>
            <li class="breadcrumb-item"><router-link :to="{ name: 'alunos.index'}">Alunos</router-link></li>
            <li class="breadcrumb-item active" v-if="acao === 'create'">Cadastrar</li>
            <li class="breadcrumb-item active" v-else>Editar</li>
        </template>
        <template #conteudo>
            <form>
                <MyCard titulo="Informe os dados:" icone="user-graduate" estilo="card-primary">
                    <template #content>
                        <MyAlert :erro="true" :alert="true" :message="erro.erro" v-if="erro.erro" />
                        <div v-else>
                            <div class="form-group">
                                <label for="nome">Nome:</label>
                                <input class="form-control" type="text" v-model="aluno.nome" id="nome">
                                <MyAlert v-if="v$.aluno.nome.$error" :message="v$.aluno.nome.$errors[0].$message" :erro="true" />
                                <MyAlert :erro="true" :message="erro.nome[0]" v-if="erro.nome" />
                            </div>

                            <div class="row">
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="data_nascimento">Data de nascimento: (ex: 01/01/2010)</label>
                                        <input class="form-control" type="text"  v-model="aluno.data_nascimento" id="data_nascimento">
                                        <MyAlert v-if="v$.aluno.data_nascimento.$error" :message="v$.aluno.data_nascimento.$errors[0].$message" :erro="true" />
                                        <MyAlert :erro="true" :message="erro.data_nascimento[0]" v-if="erro.data_nascimento" />
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="turma">Turma: (ex: 1-A)</label>
                                        <input class="form-control" type="text"  v-model="aluno.turma" id="turma">
                                        <MyAlert v-if="v$.aluno.turma.$error" :message="v$.aluno.turma.$errors[0].$message" :erro="true" />
                                        <MyAlert :erro="true" :message="erro.turma[0]" v-if="erro.turma" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <MyButton  v-if="erro.erro"
                            estilo="btn-secondary float-right"
                            rotulo="Voltar"
                            titulo="Voltar"
                            @acao="() => {this.$router.push({name: 'alunos.index'})}"
                        />

                        <div v-else>
                            <div v-if="acao === 'edit'">
                                <MyButton
                                    estilo="btn-secondary"
                                    rotulo="Voltar"
                                    titulo="Voltar"
                                    @acao="() => {this.$router.push({name: 'alunos.index'})}"
                                />
                                <MyButton
                                    estilo="btn-primary float-right"
                                    rotulo="Editar"
                                    titulo="Editar aluno"
                                    @acao="editar()"
                                />
                            </div>
                        </div>
                    </template>
                </MyCard>
                <MyCard titulo="Informe os dados da conta" icone="user" v-if="acao === 'create' && !erro.erro">
                    <template #content>
                        <div class="form-group">
                            <label for="email">E-mail:</label>
                            <input class="form-control" type="email" v-model="aluno.email" id="email">
                            <MyAlert v-if="v$.aluno.email.$error" :message="v$.aluno.email.$errors[0].$message" :erro="true" />
                            <MyAlert :erro="true" :message="erro.email[0]" v-if="erro.email" />
                        </div>

                        <div class="form-group">
                            <label for="senha">Senha:</label>
                            <input class="form-control" type="password" v-model="aluno.senha" id="senha">
                            <MyAlert v-if="v$.aluno.senha.$error" :message="v$.aluno.senha.$errors[0].$message" :erro="true" />
                            <MyAlert :erro="true" :message="erro.senha[0]" v-if="erro.senha" />
                        </div>

                        <div class="form-group">
                            <label for="senha_confirmation">Confirme sua senha:</label>
                            <input class="form-control" type="password"  v-model="aluno.senha_confirmation" id="senha_confirmation">
                            <MyAlert v-if="v$.aluno.senha_confirmation.$error" :message="v$.aluno.senha_confirmation.$errors[0].$message" :erro="true" />
                        </div>
                    </template>

                    <template #footer>
                        <MyButton
                            :estilo="'btn-secondary ' + (erro.erro ? 'float-right' : '')"
                            rotulo="Voltar"
                            titulo="Voltar"
                            @acao="() => {this.$router.push({name: 'alunos.index'})}"
                        />
                        <MyButton v-if="!erro.erro"
                            estilo="btn-primary float-right"
                            rotulo="Cadastrar"
                            titulo="Cadastrar aluno"
                            @acao="cadastrar()"
                        />
                    </template>
                </MyCard>
            </form>
        </template>
    </PageLayout>
</template>

<script>
import PageLayout from '@/components/layouts/PageLayout.vue'
import MyCard from '@/components/shared/MyCard.vue'
import AlunoService from '@/services/AlunoService'
import MyButton from '@/components/shared/MyButton.vue'
import MyAlert from '@/components/shared/MyAlert.vue'
import AcessoNegado from '@/components/layouts/AcessoNegado.vue'
import useValidate from '@vuelidate/core'
import { helpers, required, email, sameAs, minLength } from '@vuelidate/validators'

export default {
    data() {
        return {
            v$: useValidate(),
            logged: false,
            user: {
                roles: []
            },
            aluno: {
                nome: "",
                data_nascimento: "",
                turma: "",
                email: "",
                senha: "",
                senha_confirmation: ""
            },
            erro: {
                erro: "",
                nome: "",
                data_nascimento: "",
                turma: "",
                email: "",
                senha: "",
            },
            categorias: {},
            messages: {
                required: 'Esse campo é obrigatório e não pode estar em branco.',
                email: 'O e-mail inserido é inválido.',
                minLength: 'Deve conter pelo menos 6 caracteres.',
                sameAs: 'A confirmação deve ser igual.'
            }
        }
    },
    validations() {
        return {
            aluno: {
                nome: { 
                    required: helpers.withMessage(this.messages.required, required)
                },
                data_nascimento: { 
                    required: helpers.withMessage(this.messages.required, required)
                },
                turma: { 
                    required: helpers.withMessage(this.messages.required, required)
                },
                email: { 
                    required: helpers.withMessage(this.messages.required, required),
                    email: helpers.withMessage(this.messages.email, email),
                },
                senha: { 
                    required: helpers.withMessage(this.messages.required, required),
                    minLength: helpers.withMessage(this.messages.minLength, minLength(6))
                },
                senha_confirmation: { 
                    required: helpers.withMessage(this.messages.required, required),
                    sameAs: helpers.withMessage(this.messages.sameAs, sameAs(this.aluno.senha))
                }
            }
        }
    },
    components: {
        PageLayout,
        MyCard,
        MyButton,
        MyAlert,
        AcessoNegado, 
    },
    props: {
        id: Number,
        acao: String
    },
    created() {
        this.$loginService.logged()
            .then(response => {
                if(response.data.logged) {
                    this.logged = response.data.logged;
                    this.user = response.data.user
                }

                this.service = new AlunoService(this.$http);

                if(this.acao === 'edit') {
                    if(!response.data.logged){
                        this.$router.replace({name: 'login', params: {titulo: "Faça login para acessar o conteúdo"}})
                        return;
                    }

                    if(!this.isAdmin) {
                        return;
                    }

                    this.buscarAluno();
                }
            })
            .catch(() => {
                this.emitirMensagemErro("Ocorreu um erro ao tentar buscar os dados.");
            });
    },
    computed: {
        isAdmin() {
            return this.user.roles.includes('ADMIN_ROLE');
        }
    },
    methods: {
        cadastrar() {
            this.v$.$validate();
            if(!this.v$.$error) {
                this.service.cadastrar(this.aluno)
                    .then(response => this.$router.push({
                        name:'alunos.show', 
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
            } 
        },
        buscarAluno() {
            this.service.buscar(this.id)
                .then(response => this.aluno = response.data)
                .catch(erro => {
                    switch (erro.response.status) {
                        case 404:
                            this.emitirMensagemErro(erro.response.data.erro);
                            break;

                        case 500:
                            console.log(erro)
                            this.emitirMensagemErro("Erro ao buscar dados, o aluno informado não existe.");
                            break;
                    
                        default:
                            console.log(erro)
                            break;
                    }
                });
        },
        editar() {
            this.v$.$validate();
            if(this.v$.$errors.length <= 3) {
                this.service.editar(this.id, this.aluno)
                    .then(() => this.$router.push({
                        name:'alunos.show', 
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
            }
        },
        emitirMensagemErro(msg) {
            this.erro.erro = msg;

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            setTimeout(() => {
                this.erro.erro = "";
            }, 3000);
        },
    },
}
</script>

<style>

</style>