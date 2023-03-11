<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from 'vue';
const props = defineProps<{
    intensity: number,
    color: string,
    position: number[],
    distance: number,
    enabled: boolean
}>()

// console.log(props);
const emit = defineEmits(['update:intensity', 'update:color', 'update:position', 'update:distance','update:enabled','handleDel'])
const intensity = computed({
    get() {
        return props.intensity
    },
    set(value) {
        emit('update:intensity', value)
    }
})
const distance = computed({
    get() {
        return props.distance
    },
    set(value) {
        emit('update:distance', value)
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
        return props.position[0]
    },
    set(value) {
        emit('update:position', [value, props.position[1], props.position[2]])
    }
})
const y = computed({
    get() {
        return props.position[1]
    },
    set(value) {
        emit('update:position', [props.position[0], value, props.position[2]])
    }
})
const z = computed({
    get() {
        return props.position[2]
    },
    set(value) {
        emit('update:position', [props.position[0], props.position[1], value])
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
</script>

<template>
    <div class="dl">
          <el-button class="del" type="danger" @click="emit('handleDel')">×</el-button>
        <el-row :gutter="10" justify="space-between" :align="'middle'">
            <el-col :span="16">
                <h2>点光</h2>
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
                <span>距离：</span>
            </el-col>
            <el-col :span="20"> <el-slider v-model="distance" :step="1" :max="500" :min="0" show-input />
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
        -webkit-text-fill-color:transparent;
        -webkit-background-clip:text;
        background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
    }
    .del {
        display: none;
        position: absolute;
        justify-content: center;
        align-items: center;
        padding: 0;
        z-index: 1;
        right:20px;
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
