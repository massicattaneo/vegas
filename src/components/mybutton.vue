<script>
    import { calculate } from '../shared';
    import { componentBuilder } from '../../modules/vegas-templates/index';

    export default function ({ parsers }) {
        let counter = 0;
        // this.node.parentNode.innerHTML = componentBuilder(this.template, this.props, parsers);

        this.node.message = (msg, event) => {
            console.log(`${msg}: ${calculate(++counter)}`);
        };
    }
</script>

<template>
    <button type="button" onclick="this.message('{{message}}', event)" class="test">
        <span>{{label}}</span>
    </button>
</template>

<style lang="scss">
    @import "../variables";

    button.& {
        color: $primary-color;
    }

    .& span {
        text-transform: uppercase;
    }
</style>
