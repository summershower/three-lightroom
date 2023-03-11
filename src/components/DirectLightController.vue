<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from 'vue';
const props = defineProps<{
    intensity: number,
    color: string,
    rotation: number[],
    enabled: boolean,
    enableShadow: boolean,
    shadowBias: number,
    shadowNormalBias: number,
    shadowNearPlane: number,
    shadowStrength: number,
}>()

console.log(props);
const emit = defineEmits(['update:intensity', 'update:color', 'update:rotation', 'update:enabled', 'handleDel', 'update:enableShadow', 'update:shadowBias', 'update:shadowNormalBias', 'update:shadowNearPlane', 'update:shadowStrength'])
const intensity = computed({
    get() {
        return props.intensity
    },
    set(value) {
        emit('update:intensity', value)
    }
})
const color = computed({
    get() {
        return props.color
    },
    set(value) {
        emit('update:color', value)
    }
})
const x = computed({
    get() {
        return props.rotation[0]
    },
    set(value) {
        emit('update:rotation', [value, props.rotation[1], props.rotation[2]])
    }
})
const y = computed({
    get() {
        return props.rotation[1]
    },
    set(value) {
        emit('update:rotation', [props.rotation[0], value, props.rotation[2]])
    }
})
const z = computed({
    get() {
        return props.rotation[2]
    },
    set(value) {
        emit('update:rotation', [props.rotation[0], props.rotation[1], value])
    }
})
const enabled = computed({
    get() {
        return props.enabled
    },
    set(value) {
        emit('update:enabled', value)
    }
})
const enableShadow = computed({
    get() {
        return props.enableShadow
    },
    set(value) {
        emit('update:enableShadow', value)
    }
})
const shadowBias = computed({
    get() {
        return props.shadowBias
    },
    set(value) {
        emit('update:shadowBias', value)
    }
})
const shadowNormalBias = computed({
    get() {
        return props.shadowNormalBias
    },
    set(value) {
        emit('update:shadowNormalBias', value)
    }
})
const shadowNearPlane = computed({
    get() {
        return props.shadowNearPlane
    },
    set(value) {
        emit('update:shadowNearPlane', value)
    }
})
const shadowStrength = computed({
    get() {
        return props.shadowStrength
    },
    set(value) {
        emit('update:shadowStrength', value)
    }
})
</script>

<template>
    <div class="dl">
        <el-button class="del" type="danger" @click="emit('handleDel')">×</el-button>
        <el-row :gutter="10" justify="space-between" :align="'middle'">
            <el-col :span="16">
                <h2>方向光</h2>
            </el-col>
            <el-col :span="3">
                <el-switch v-model="enabled" />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="4">
                <span>强度：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="intensity" :step="0.01" :max="5" :min="0" show-input />
            </el-col>

        </el-row>
        <el-row :gutter="10">
            <el-col :span="4">
                <span>颜色：</span>
            </el-col>
            <el-col :span="20"> <el-color-picker v-model="color" />
            </el-col>

        </el-row>
        <el-row :gutter="10">
            <el-col :span="4">
                <span>X：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="x" :step="1" :max="360" :min="-360" show-input />
            </el-col>

        </el-row>
        <el-row :gutter="10">
            <el-col :span="4">
                <span>Y：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="y" :step="1" :max="360" :min="-360" show-input />
            </el-col>

        </el-row>
        <el-row :gutter="10">
            <el-col :span="4">
                <span>Z：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="z" :step="1" :max="360" :min="-360" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="24">
                <span>阴影开关：</span>
                <el-switch v-model="enableShadow" />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="7">
                <span>阴影偏移：</span>
            </el-col>
            <el-col :span="17"> <el-slider v-model="shadowBias" :step="0.1" :max="10" :min="-10" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="7">
                <span>阴影法向偏移：</span>
            </el-col>
            <el-col :span="17"> <el-slider v-model="shadowNormalBias" :step="0.1" :max="10" :min="-10" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="7">
                <span>阴影近裁面</span>
            </el-col>
            <el-col :span="17"> <el-slider v-model="shadowNearPlane" :step="0.1" :max="10" :min="-10" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="7">
                <span>阴影强度：</span>
            </el-col>
            <el-col :span="17"> <el-slider v-model="shadowStrength" :step="0.1" :max="5" :min="0" show-input />
            </el-col>
        </el-row>

    </div>
</template>

<style lang="less" scoped>
.dl {
    position: relative;
    padding: 10px 20px;
    margin: 20px auto;
    width: 450px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    background: #FFF;
    box-sizing: border-box;
    color: #333;

    &:hover {
        .del {
            display: flex;
        }
    }

    h2 {
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        background-image: linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%);
    }

    .del {
        display: none;
        position: absolute;
        justify-content: center;
        align-items: center;
        padding: 0;
        z-index: 1;
        right: 20px;
        top: 10px;
        width: 20px;
        height: 20px;
        color: white;
        font-size: 20px;
        border-radius: 50%;
        transition: all .3s ease;
    }
}
</style>
