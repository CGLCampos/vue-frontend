<template>
    <PageLayout titulo="Acesso Negado">
        <template #conteudo>
            <MyCard titulo="Autorização necessária" estilo="card-danger">
                <template #content>
                    <div class="text-danger" role="alert" >
                        <p >
                            <i class="fa fa-ban mr-1"></i>
                            Você não tem autorização para acessar esta página.
                        </p>
                    </div>
                </template>
                <template #footer>
                    <MyButton
                        estilo="btn-secondary float-right"
                        rotulo="Voltar para home"
                        @acao="() => {this.$router.replace({name: 'home'})}"
                    />
                </template>
            </MyCard>
        </template>
    </PageLayout>
</template>

<script>
import MyButton from '../shared/MyButton.vue'
import MyCard from '../shared/MyCard.vue'
import PageLayout from './PageLayout.vue'

export default {
    components: {
        PageLayout, MyCard, MyButton
    },

}
</script>

<style>

</style>