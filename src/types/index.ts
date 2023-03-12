export type LightType = 'AmbientLight' | 'DirectionalLight' | 'HemisphereLight' | 'PointLight' | 'SpotLight'
export const LightName: Record<LightType, string> = {
    'AmbientLight': '环境光',
    'DirectionalLight': '定向光',
    'HemisphereLight': '半球光',
    'PointLight': '点光',
    'SpotLight': '聚光'
}
export interface LightSettings {
    visible: boolean,
    type: LightType,
    intensity: number,
    color?: string,
    position?: number[],
    skyColor?: string,
    groundColor?: string,
    angle?: number,
    light: null | Record<any, any>,
}

export interface AmbientLightSettings extends LightSettings {
}
export interface DirectionalLightSettings extends LightSettings {
    position: number[],
}
export interface HemisphereLightSettings extends LightSettings {
    skyColor: string,
    groundColor: string,
}
export interface PointLightSettings extends LightSettings {
    distance: number,
    position: number[],

}
export interface SpotLightSettings extends LightSettings {
    angle: number,
    position: number[],
    distance: number,

}
export interface GltfType {
    animations: [],
    asset: Object,
    cameras: [],
    parser: Object,
    scene: Object,
    scenes: [],
    userData: Object
}