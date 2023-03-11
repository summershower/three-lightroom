<script setup lang="ts">
import { ref, onMounted, reactive, watch, watchEffect, unref } from 'vue';
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import M from '../public/model/cat7.0.gltf?url'
import DirectLightController from './components/DirectLightController.vue'
import PointLightController from './components/PointLightController.vue';
import SpotLightController from './components/SpotLightController.vue';


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

const ambientLight = reactive({
  color: 'rgba(54, 57, 54, 1)',
  intensity: 1,
})
let ambientLightObject
const defaultDirectLight = {
  enabled: true,
  type: 'DirectLight',
  rotation: [0, 0, 0],
  intensity: 0.5,
  color: 'rgba(255, 255, 255, 1)',
  light: null,
  entity: null,
  enableShadow: false,
  shadowBias: 1,
  shadowNearPlane: 0.1,
  shadowNormalBias: 0.1,
  shadowStrength: 1.0,

}
const defaultPointLight = {
  enabled: true,
  type: 'PointLight',
  position: [120, 50, 0],
  distance: 260,
  intensity: 0.5,
  color: 'rgba(255, 255, 255, 1)',
  light: null,
  entity: null,
}
const defaultSpotLight = {
  enabled: true,
  type: 'SpotLight',
  position: [61, -22, 167],
  rotation: [105, 230, 0],
  penumbra: 7,
  angle: 8,
  distance: 260,
  intensity: 1.5,
  color: 'rgba(255, 255, 255, 1)',
  light: null,
  entity: null,
}
const lights = reactive([


])
function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    initScene(e.dataTransfer.files[0]);
  }

}
onMounted(() => {
  initScene()
})

function reRenderLight() {
  for (let i = 0; i < lights.length; i++) {
    if (lights[i].light) {
      scene.remove(lights[i].light)
    }
    let light
    if (lights[i].type === 'DirectLight') {

      light = new THREE.DirectionalLight();
      scene.add(light);
    } else if (lights[i].type === 'PointLight') {
      light = new THREE.PointLight();
      scene.add(light);
    } else if (lights[i].type === 'SpotLight') {
      light = new THREE.DirectionalLight();
      scene.add(light);
    }
    lights[i].light = light;
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
  loader.load('/cat7.0.gltf', function (gltf) {
    console.log(gltf);

    ambientLightObject = new THREE.AmbientLight();
    scene.add(ambientLightObject);


    // const pointLight = new THREE.PointLight("rgba(255,255,255,1)", .3)
    // pointLight.position.set(60, 111, 189)
    // pointLight.castShadow = true;

    // const directionalLight = new THREE.DirectionalLight("rgba(255,255,255,1)", 0.62);
    // directionalLight.position.set(183.6, 29.15, 41.835)
    // scene.add(pointLight);

    reRenderLight()

    scene.add(gltf.scene);
    const mixer = new THREE.AnimationMixer(scene);
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
    // console.log(current.light);

    if (current.light) {
      // console.log(current.light, '.asd', ...current.rotation);

      current.light.intensity = current.intensity;
      current.light.color = (new THREE.Color(current.color));

      // current.light.shadowType = 3;

      switch (current.type) {
        case 'DirectLight':
          current.light.position.set(new THREE.Vector3(...current.rotation))
          break;
        case 'PointLight':
          current.light.distance = current.distance;
          current.light.position.set(new THREE.Vector3(...current.position))

          break;
        case 'SpotLight':
          current.light.distance = current.distance;
          current.light.angle = Math.PI / current.angle;
          current.light.penumbra = Math.PI / current.penumbra;
          current.entity.transform.setPosition(...current.position)
          current.entity.transform.setRotation(...current.rotation)
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

watchEffect(() => {
  const { intensity = 0, color = 'rgba(255,255,255,1)' } = ambientLight;
  if (scene && ambientLightObject) {
    console.log(ambientLightObject);
    ambientLightObject.intensity = intensity;
    ambientLightObject.color = new THREE.Color(color);
    // scene.ambientLight.diffuseIntensity = intensity;
    // scene.ambientLight.diffuseSolidColor.set(color)
    // if (isGotStorage.value) {
    //   localStorage.setItem('ambient', JSON.stringify(ambientLight))
    // }
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
const options = [defaultDirectLight, defaultPointLight, defaultSpotLight]
const selectValue = ref('DirectLight')

function handleAdd() {
  const newLight = JSON.parse(JSON.stringify([defaultDirectLight, defaultPointLight, defaultSpotLight].find(v => v.type === selectValue.value)))
  lights.push(newLight)
  reRenderLight();
}
function del(index) {
  scene.remove(lights[index].light);
  lights.splice(index, 1)
}
</script>

<template>
  <div class="container">
    <div class="model">
      <!-- <div class="drag" @drop.prevent="handleDrop" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave"
                                        @dragenter.prevent="handleDragEnter" v-if="!hasModel">
                                        <div class="mask" v-show="isDragging"> </div>
                                        拖动模型到此
                                      </div> -->
      <div class="bg">
        <div class="box" ref="boxRef"></div>
      </div>
    </div>
    <div class="controller">
      <div class="header">

        <el-select v-model="selectValue" class="m-2" placeholder="选择光源" size="large">
          <el-option v-for="item in options" :key="item.type" :label="item.type" :value="item.type" />
        </el-select>


        <el-button type="primary" @click="handleAdd">增加</el-button>
      </div>

      <AmbientLightController v-model:intensity="ambientLight.intensity" v-model:color="ambientLight.color" />
      <template v-for="(item, index) in lights">
        <DirectLightController v-model:enabled="item.enabled" v-model:intensity="item.intensity"
          v-model:color="item.color" v-model:rotation="item.rotation" v-model:enableShadow="item.enableShadow"
          v-model:shadowBias="item.shadowBias" v-model:shadowNormalBias="item.shadowNormalBias"
          v-model:shadowNearPlane="item.shadowNearPlane" v-model:shadowStrength="item.shadowStrength"
          v-if="item.type === 'DirectLight'" @handleDel="del(index)" />
        <PointLightController v-model:enabled="item.enabled" v-model:intensity="item.intensity"
          v-model:distance="item.distance" v-model:color="item.color" v-model:position="item.position"
          v-if="item.type === 'PointLight'" @handleDel="del(index)" />
        <SpotLightController v-model:enabled="item.enabled" v-model:intensity="item.intensity"
          v-model:distance="item.distance" v-model:penumbra="item.penumbra" v-model:angle="item.angle"
          v-model:color="item.color" v-model:position="item.position" v-model:rotation="item.rotation"
          v-if="item.type === 'SpotLight'" @handleDel="del(index)" />
      </template>
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
