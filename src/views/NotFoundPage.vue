<template>
<PageLayout>
    <template #links>
        <li class="breadcrumb-item"><a href="/home">Home</a></li>
        <li class="breadcrumb-item active">404 Error Page</li>
    </template>

    <template #conteudo>
        <div class="error-page">
            <h2 class="headline text-warning">404</h2>
                <div class="error-content">
                    <h3>
                        <i class="fas fa-exclamation-triangle text-warning"></i>
                        Oops! Pagina não encontrada.
                    </h3>
                    <p>Não podemos encontrar a página que você está tentando acessar.</p>
                    <p><a href="/home" >Retornar ao início.</a></p>
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