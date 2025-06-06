<template> 
    <div id="app" :style="{width:width+'px',height:height+'px'}">
        <land></land>
        <piple-group></piple-group>
        <bird></bird>
        <panel></panel>
        <music></music>
    </div>
</template>

<script>
    import Config from './config.js'
    import Game from './game.js'
</script>