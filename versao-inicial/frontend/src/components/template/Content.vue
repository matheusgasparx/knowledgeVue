<template>
    <div class="content">
        <router-view>
            <!-- sempre que selecionar um componente, vai renderizar dentro do router-view -->
        </router-view>
    </div>
</template>

<script> // insere tudo do JS
export default {
    name: 'Content'
}
</script>

<style>
    .content {
        grid-area: content;
        background-color: #efefef;
        padding: 20px;
    }
</style>
