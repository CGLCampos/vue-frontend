<template>
<PageLayout titulo="Erro 500" >
    <template #links>
        <li class="breadcrumb-item"><a href="/home">Home</a></li>
        <li class="breadcrumb-item active">Erro 500</li>
    </template>

    <template #conteudo>
        <div class="error-page">
            <h2 class="headline text-danger">500</h2>
            <div class="error-content">
                <h3>
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    Oops! Algo deu errado.
                </h3>
                <p>Estamos trabalhando para resolver o erro o mais rápido possível.</p>
                <p><router-link :to="{name: 'home'}" >Retornar ao início.</router-link></p>
            </div>
        </div>
    </template>
</PageLayout>
</template>

<script>
import PageLayout from '@/components/layouts/PageLayout.vue'
export default {
  components: { PageLayout },

}
</script>

<style>

</style>