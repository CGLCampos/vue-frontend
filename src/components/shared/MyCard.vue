<template>
    <!-- SLOTS: #tools #content #footer -->
    <div class="card" :class="estilo">
        <div class="card-header">
            <h3 class="card-title">
                <i v-if="icone" class="fa"  :class="`fa-${icone} mr-2`"></i>
                {{ titulo }}
            </h3>
            <div class="card-tools">
                <slot name="tools"></slot>
            </div>
        </div>
        <!-- /.card-header -->
        <div class="card-body" :class="estiloBody">
            <slot name="content"></slot>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
    </div>
    <!-- /.card -->
</template>

<script>
export default {
    props: {
        titulo: String,
        icone: String,
        estilo: String,
        estiloBody: String
    }
}
</script>

<style>

</style>