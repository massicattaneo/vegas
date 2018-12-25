<template>
    <button type="button" onclick="this.form.message('((message))')">
        ((label))
    </button>
</template>

<script>
    function MyButton(form) {
        form.message = function (msg) {
            alert(msg)
        };
    }
</script>

<style lang="scss">
    .& button {

    }
</style>
