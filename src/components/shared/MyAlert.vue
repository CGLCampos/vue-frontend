<template>
    <div v-if="alert">
        <div class="alert alert-danger mt-1" v-if="erro">
            <i class="fas fa-ban mr-1"></i>
            <span>{{ message }}</span>
        </div>
        <div class="alert alert-success mt-1" v-else>
            <i class="fas fa-check mr-1"></i>
            <span>{{ message }}</span>
        </div>
    </div>
    <div v-else>
        <div class="text-danger mt-1" v-if="erro">
            <i class="fas fa-ban mr-1"></i>
            <span>{{ message }}</span>
        </div>
        <div class="text-success mt-1" v-else>
            <i class="fas fa-check mr-1"></i>
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        message: String,
        alert: Boolean,
        erro: Boolean
    }
}
</script>
<style>

</style>