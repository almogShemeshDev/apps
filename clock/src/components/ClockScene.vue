<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createClock3D } from '../composables/useClock3D.js'

const props = defineProps({
    hour: { type: Number, default: 3 },
    minute: { type: Number, default: 0 },
    animate: { type: Boolean, default: true },
})
const emit = defineEmits(['pick'])

const container = ref(null)
let scene = null

onMounted(() => {
    scene = createClock3D(container.value)
    scene.setTime(props.hour, props.minute, { animate: false })
    scene.onPick((type, value) => emit('pick', { type, value }))
})

onBeforeUnmount(() => {
    scene?.dispose()
})

watch(
    () => [props.hour, props.minute],
    ([h, m]) => {
        scene?.setTime(h, m, { animate: props.animate })
    }
)

function celebrate() {
    scene?.celebrate()
}
function shake() {
    scene?.shake()
}
function setGlow(type, on) {
    scene?.setGlow(type, on)
}
function setNumberGlow(n, on) {
    scene?.setNumberGlow(n, on)
}
function enableClockScrub(cb) {
    scene?.enableClockScrub(cb)
}
function disableClockScrub() {
    scene?.disableClockScrub()
}
function setTickHighlight(i) {
    scene?.setTickHighlight(i)
}

defineExpose({
    celebrate,
    shake,
    setGlow,
    setNumberGlow,
    enableClockScrub,
    disableClockScrub,
    setTickHighlight,
})
</script>

<template>
    <div ref="container" class="clock-canvas"></div>
</template>

<style scoped>
.clock-canvas {
    width: 100%;
    height: 100%;
}
</style>
