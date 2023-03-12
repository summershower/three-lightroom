<script setup lang="ts">
import { ref, onMounted, reactive, watch, watchEffect, unref } from 'vue';
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import M from '../public/model/cat7.0.gltf?url'
import LightController from './components/LightController.vue';
import { LightName, LightSettings, GltfType, AmbientLightSettings, DirectionalLightSettings, HemisphereLightSettings, PointLightSettings, SpotLightSettings } from './types';

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const isDragging = ref(false);
const hasModel = ref(false);
const boxRef = ref();

function handleDragEnter(e: DragEvent) {
  isDragging.value = true;

}
function handleDragLeave(e: DragEvent) {
  isDragging.value = false;
}

function handleDragOver(e: DragEvent) { }

const defaultAmbientLightSetting = {
  visible: true,
  type: 'AmbientLight',
  name: '环境光',
  color: 'rgb(255,255,255)',
  intensity: 1,
  light: null
}
const defaultDirectLight = {
  visible: true,
  type: 'DirectionalLight',
  name: '定向光',

  position: [0, 1, 0],
  intensity: 1,
  color: 'rgba(255, 255, 255)',
  light: null,
}
const defaultHemisphereLight = {
  visible: true,
  type: 'HemisphereLight',
  name: '半球光',
  intensity: 1,
  skyColor: 'rgb(255,255,255)',
  groundColor: 'rgb(255,255,255)',
  light: null,
}
const defaultPointLight = {
  visible: true,
  type: 'PointLight',
  name: '点光',
  position: [120, 50, 0],
  distance: 0,
  intensity: 1,
  color: 'rgba(255, 255, 255)',
  light: null,
}
const defaultSpotLight = {
  visible: true,
  type: 'SpotLight',
  name: '聚光',
  position: [61, -22, 167],
  angle: Math.PI / 3,
  distance: 0,
  intensity: 1,
  color: 'rgba(255, 255, 255)',
  light: null,
}
const lights = reactive<LightSettings[]>([])
function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    // initScene(e.dataTransfer.files[0]);
  }

}


function renderLight() {
  for (let i = 0; i < lights.length; i++) {
    if (lights[i].light) {
      (lights[i] as any).light.removeFromParent()
    }
    if (!lights[i].visible) { continue }
    let light
    switch (lights[i].type) {
      case 'AmbientLight':
        light = new THREE.AmbientLight(lights[i].color, lights[i].intensity);
        break;
      case 'DirectionalLight':
        light = new THREE.DirectionalLight(lights[i].color, lights[i].intensity);
        break;
      case 'HemisphereLight':
        light = new THREE.HemisphereLight(lights[i].skyColor, lights[i].groundColor, lights[i].intensity);
        break;
      case 'PointLight':
        light = new THREE.PointLight(lights[i].color, lights[i].intensity, 0);
        break;
      case 'SpotLight':
        light = new THREE.SpotLight(lights[i].color, lights[i].intensity, 0, lights[i].angle);

        break;
      default:
        break;
    }
    scene.add(light)
    lights[i].light = light
  }
}


function initScene() {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(600, 600);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  boxRef.value.appendChild(renderer.domElement);
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/');
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader)
  loader.load('/cat7.0.gltf', function (gltf: GltfType) {
    renderLight()
    scene.add(gltf.scene);
    const mixer = new THREE.AnimationMixer(scene);
    console.log(gltf.cameras[0]);

    mixer.clipAction(gltf.animations[0]).play()
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta()
      renderer.render(scene, gltf.cameras[0]);
      
      mixer.update(delta)
    }
    animate()
  }, undefined, function (error) {
    console.error(error);
  });

  hasModel.value = true;
}
const isGotStorage = ref(false);
watchEffect(() => {
  // return
  for (let i = 0; i < lights.length; i++) {
    const current = lights[i];
    if (current.light) {
      current.light.visible = current.visible;
      current.light.intensity = current.intensity;
      switch (current.type) {
        case 'AmbientLight':
          current.light.color = (new THREE.Color(current.color));
          break;
        case 'DirectionalLight':
          current.light.color = (new THREE.Color(current.color));
          current.light.position.set(...(current as DirectionalLightSettings).position)
          break;
        case 'HemisphereLight':
          current.light.color = (new THREE.Color(current.skyColor));
          current.light.groundColor = (new THREE.Color(current.groundColor));
          break;
        case 'PointLight':
          current.light.color = (new THREE.Color(current.color));
          current.light.position.set(...(current as PointLightSettings).position)
          break;
        case 'SpotLight':
          current.light.color = (new THREE.Color(current.color));
          current.light.angle = (current as SpotLightSettings).angle;
          current.light.position.set(...(current as SpotLightSettings).position)
          break;
        default:
          break
      }
    }
  }
  if (isGotStorage.value) {
    localStorage.setItem('lights', JSON.stringify(lights.map(v => {
      return {
        ...v,
        light: null,
        entity: null
      }
    })))
  }

})
function getStorage() {
  const storageLights = JSON.parse(localStorage.getItem('lights') || '[]')
  lights.push(...storageLights)
  const storageAmbient = JSON.parse(localStorage.getItem('ambient') || "{}");
  if (storageAmbient?.color) {
    ambientLight.color = storageAmbient.color
  }
  if (storageAmbient?.intensity) {
    ambientLight.intensity = storageAmbient.intensity
  }
  isGotStorage.value = true;
}
const options = [defaultAmbientLightSetting, defaultDirectLight, defaultHemisphereLight, defaultPointLight, defaultSpotLight]
const selectValue = ref('AmbientLight')

function handleAdd() {
  const newLight = JSON.parse(JSON.stringify(options.find(v => v.type === selectValue.value)))
  lights.push(newLight)
  renderLight();
  console.log(scene.children);

}
function del(index: number) {
  (lights[index] as any).light.removeFromParent()
  lights.splice(index, 1);
  console.log(scene.children);

}
onMounted(() => {
  initScene()
})
</script>

<template>
  <div class="container">
    <div class="model">
      <div class="drag" @drop.prevent="handleDrop" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave"
        @dragenter.prevent="handleDragEnter" v-if="!hasModel">
        <div class="mask" v-show="isDragging"> </div>
        拖动模型到此
      </div>
      <div class="bg">
        <div class="box" ref="boxRef"></div>
      </div>
    </div>
    <div class="controller">
      <div class="header">
        <el-select v-model="selectValue" class="m-2" placeholder="选择光源" size="large">
          <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type" />
        </el-select>
        <el-button type="primary" @click="handleAdd">增加</el-button>
      </div>
      <LightController :type="item.type" v-for="(item, index) in lights" :key="index" v-model:angle="item.angle"
        v-model:color="item.color" v-model:skyColor="item.skyColor" v-model:position="item.position"
        v-model:groundColor="item.groundColor" v-model:intensity="item.intensity" v-model:visible="item.visible"
        @handleDel="del(index)" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100vw;
  height: 100vh;
  background: #181818;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;

  .header {
    padding: 10px 20px 10px;
    display: flex;
    align-items: center;
    background: rgba(35, 35, 35, 0.54);
    border-radius: 10px;

    button {
      margin: 0 10px;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

  .model {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .drag {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80%;
      height: 80%;
      color: #666;
      font-size: 52px;
      border-radius: 10px;
      border: 10px dashed #666;

      .mask {
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #4e8fda65;
        border-radius: 5px;
        pointer-events: none;
      }
    }

    .bg {
      position: relative;
      width: 375px;
      height: 1624px;
      background: url('/bg.jpg') center /100% no-repeat;

      .box {
        position: absolute;
        left: 50%;
        top: 500px;
        transform: translateX(-50%);
      }
    }
  }

  .controller {
    width: 470px;
    height: 95vh;
    overflow-y: scroll;
    background: rgba(255, 255, 255, .7);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, .2);
    border-radius: 10px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
