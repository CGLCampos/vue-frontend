<template>
    <div class="row">
        <div class="col-sm-12 col-md-5" v-if="info">
            <div class="dataTables_info" id="example2_info" >
                {{paginate.total}} itens encontrados. <br>
                Mostrando resultados de {{primeiroItem}} a {{ultimoItem}}.
            </div>
        </div>
        <div :class="{'col-12': !info, 'col-sm-12 col-md-7': info}">
            <div class="dataTables_paginate paging_simple_numbers" >
                <ul class="pagination float-right" >
                    <li class="page-item" :class="{'disabled': estaNaPrimeiraPagina}" >
                        <button href="#" class="page-link" 
                            @click="emitirMudarPagina(1)" >Primeira</button>
                    </li>
                    <li class="page-item">
                        <button href="#" class="page-link" v-if="pre" 
                            @click="emitirMudarPagina(paginaAtual - 2)" >{{ paginaAtual - 2 }}</button>
                    </li>
                    <li class="page-item">
                        <button href="#" class="page-link" v-if="anterior" 
                            @click="emitirMudarPagina(paginaAtual - 1)" >{{ paginaAtual - 1 }}</button>
                    </li>
                    <li class="page-item active" >
                        <button href="#" class="page-link" >{{ paginaAtual }}</button>
                    </li>
                    <li class="page-item">
                        <button href="#" class="page-link" v-if="proxima" 
                            @click="emitirMudarPagina(paginaAtual + 1)" >{{ paginaAtual + 1}}</button>
                    </li>
                    <li class="page-item">
                        <button href="#" class="page-link" v-if="pos" 
                            @click="emitirMudarPagina(paginaAtual + 2)" >{{ paginaAtual + 2}}</button>
                    </li>
                    <li class="page-item" :class="{'disabled': estaNaUltimaPagina}" >
                        <button href="#" class="page-link" 
                            @click="emitirMudarPagina(ultimaPagina)" >Ultima</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            paginaAtual: 1,
            ultimaPagina: 1,
            estaNaPrimeiraPagina: true,
            estaNaUltimaPagina: true,
            pre: false,
            anterior: false,
            proxima: false,
            pos: false,
            primeiroItem: 1,
            ultimoItem: 1,
        }
    },
    props: {
        paginate: Object,
        info: Boolean
    },
    created() {
        this.paginaAtual = this.paginate.current_page;
        this.ultimaPagina = this.paginate.last_page;
        this.estaNaPrimeiraPagina = this.paginaAtual == 1;
        this.estaNaUltimaPagina = this.paginaAtual == this.ultimaPagina;
        this.primeiroItem = (this.paginaAtual - 1) * this.paginate.per_page + 1;
        this.ultimoItem = this.paginaAtual != this.paginate.last_page ? this.paginate.per_page * this.paginaAtual : this.paginate.total;

        if(!this.estaNaPrimeiraPagina) {
            if(this.paginaAtual != 2) {
                this.pre = true;
            }
            this.anterior = true;
        }

        if(!this.estaNaUltimaPagina) {
            if(this.paginaAtual != (this.ultimaPagina - 1)) {
                this.pos = true;
            }
            this.proxima = true;
        }
    },
    methods: {
        emitirMudarPagina(pagina) {
            this.$emit('mudarPagina', {page: pagina});
        }
    }
}
</script>

<style scoped>
    .disabled {
        pointer-events: none;
    }
</style>