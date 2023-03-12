<script setup lang="ts">
import { computed } from 'vue';
import { LightType, LightName } from '../types';
const props = defineProps<{
    type: LightType,
    intensity: number,
    visible: boolean,
    color?: string,
    position?: number[],
    skyColor?: string,
    groundColor?: string,
    angle?: number,
}>()

const emit = defineEmits(['update:intensity', 'update:color', 'update:position', 'update:skyColor', 'update:groundColor', 'update:angle', 'update:visible', 'handleDel'])
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
const visible = computed({
    get() {
        return props.visible
    },
    set(value) {
        emit('update:visible', value)
    }
})
const x = computed({
    get() {
        return props.position?.[0] || 0
    },
    set(value) {
        const newPosition = [value, props.position?.[1] || 1, props.position?.[2] || 0]
        emit('update:position', newPosition)
    }
})
const y = computed({
    get() {
        return props.position?.[1] || 1
    },
    set(value) {
        const newPosition = [props.position?.[0] || 0, value, props.position?.[2] || 0]

        emit('update:position', newPosition)
    }
})
const z = computed({
    get() {
        return props.position?.[2] || 0
    },
    set(value) {
        const newPosition = [props.position?.[0] || 0, props.position?.[1] || 1, value]
        emit('update:position', newPosition)
    }
})
const skyColor = computed({
    get() {
        return props.skyColor
    },
    set(value) {
        emit('update:skyColor', value)
    }
})
const groundColor = computed({
    get() {
        return props.groundColor
    },
    set(value) {
        emit('update:groundColor', value)
    }
})
const angle = computed({
    get() {
        return props.angle
    },
    set(value) {
        emit('update:angle', value)
    }
})
</script>

<template>
    <div class="dl">
        <el-button class="del" type="danger" @click="emit('handleDel')">×</el-button>
        <el-row :gutter="10" justify="space-between" :align="'middle'">
            <el-col :span="16">
                <h2 :class="props.type">{{ LightName[props.type] }}</h2>
            </el-col>
            <el-col :span="3">
                <el-switch v-model="visible" />
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="4">
                <span>强度：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="intensity" :step="0.01" :max="5" :min="0" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="props.color">
            <el-col :span="4">
                <span>颜色：</span>
            </el-col>
            <el-col :span="20"> <el-color-picker v-model="color" />
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="props.skyColor">
            <el-col :span="4">
                <span>天空色：</span>
            </el-col>
            <el-col :span="20"> <el-color-picker v-model="skyColor" />
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="props.groundColor">
            <el-col :span="4">
                <span>地面色：</span>
            </el-col>
            <el-col :span="20"> <el-color-picker v-model="groundColor" />
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="props.angle">
            <el-col :span="4">
                <span>角度：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="angle" :step="0.01" :max="1.56" :min="0" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="props.position">
            <el-col :span="4">
                <span>X：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="x" :step="0.1" :max="720" :min="-720" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="props.position">
            <el-col :span="4">
                <span>Y：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="y" :step="0.1" :max="720" :min="-720" show-input />
            </el-col>
        </el-row>
        <el-row :gutter="10" v-if="props.position">
            <el-col :span="4">
                <span>Z：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="z" :step="0.1" :max="720" :min="-720" show-input />
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
        &.AmbientLight {
          
            background-image: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);

        }
        &.DirectionalLight {
            background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
        }
        &.HemisphereLight {
            background-image: linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%);
        }
        &.PointLight {
            background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
        }
        &.SpotLight {
            background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
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
