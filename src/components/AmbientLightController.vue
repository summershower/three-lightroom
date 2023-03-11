<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
    intensity: number,
    color: string,
}>()

const emit = defineEmits(['update:intensity', 'update:color',])
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
</script>

<template>
    <div class="dl">
      
        <el-row :gutter="10" justify="space-between" :align="'middle'">
            <el-col :span="16">
                <h2>环境光</h2>
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
            <el-col :span="20"> <el-color-picker v-model="color"  />
            </el-col>
        </el-row>
    </div>
</template>

<style lang="less" scoped>
.dl {
    padding: 10px 20px;
    margin: 20px auto;
    width: 450px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    background: #FFF;
    box-sizing: border-box;
    color: #333;

    h2 {
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);
    }
}
</style>
