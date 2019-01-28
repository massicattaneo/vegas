<template>
    <table>
        {{#each name}}
        <tr>
            <td>{{this}}</td>
        </tr>
        {{/each}}
    </table>
</template>

<script>
    export default function (form) {

    }


</script>

<style lang="scss">
.& table {}
</style>
