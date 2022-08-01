<template>
    <button class="btn" :class="estilo" :title="titulo" @click.prevent="emitirAlertaClick">
        <i v-if="icone" class="fa" :class="iconeClasses"></i>
        <strong class="text-uppercase">{{ rotulo }}</strong>
    </button>
</template>

<script>
export default {
    props: {
        estilo: String,
        icone: String,
        rotulo: String,
        titulo: String
    },
    computed: {
        iconeClasses() {
            if(this.rotulo) {
                return `fa-${this.icone} mr-2`;
            } else {
                return `fa-${this.icone}`;
            }
            
        }
    },
    methods: {
        emitirAlertaClick() {
            this.$emit('acao');
        }
    }
}
</script>

<style scoped>

</style>