<template>
  <div class="modal fade" :id="name" style="display: none;">
        <div class="modal-dialog">
            <div class="modal-content ">
                <div class="modal-header" :class="`bg-${estilo}`">
                    <h4 class="modal-title">{{ titulo }}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn" :class="`btn-${estilo}`" data-dismiss="modal" 
                        @click="emitirAlertaClick">{{ botao ? botao : 'Confirmar' }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        titulo: String,
        estilo: String,
        botao: String
    },
    methods: {
        emitirAlertaClick() {
            this.$emit('acao');
        }
    }
}
</script>

<style>

</style>