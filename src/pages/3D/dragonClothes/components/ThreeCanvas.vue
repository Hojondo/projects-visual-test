<template>
    <canvas
        ref="threeRef" class="canvas-dom"
    ></canvas>
</template>

<script>
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
// import NWorker from 'worker-loader!./three.worker.js';
import {modelAssetsMapping} from '../const';
import {RectAreaLightUniformsLib} from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
// import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

import {TransformControls} from 'three/examples/jsm/controls/TransformControls.js';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';


const loader = new GLTFLoader();
const loadGlb = url => new Promise((resolve, reject) => {
    loader.load(url, function (gltf) {
        resolve(gltf);
    });
});
const textureLoader = new THREE.TextureLoader();

const eyePointY = 155; // 龙 眼睛对齐位置

export default {
    name: 'ThreeCanvas',
    props: {
        selectedId: {
            type: Number,
            required: true,
        }
    },
    components: {

    },
    data() {
        return {
            renderer: undefined,
            camera: undefined,
            scene: undefined,
            transformControls: undefined,
            meshGroup: undefined, // 全部模型文件组
            clothesGroup: undefined, // 装扮组 包含服装、帽子等，用于切换服装时清空

            bodyMeshID: undefined, // 奶龙身体模型唯一ID 存储
            bodyMixer: undefined, // 奶龙身体mixer
            bodyCallAction: undefined, // 奶龙身体 打招呼动作
            activeClothingMixers: [], // 激活的服装打招呼动作 mixer 集合[]
            activeClothingActions: [], // 激活的服装打招呼动作 actions 集合[]

            clothesCache: {}, // 装扮cache。颗粒度以模型本身为准
            // interface ClothesCache {
            //     [modelName:string]: {clothingModel, clothingMixer, clothingAction}
            // }
        };
    },

    watch: {
        selectedId(newValue, oldValue) {
            if (this.activeClothingMixers?.length) {
                for (const mixer of this.activeClothingMixers) {
                    mixer.stopAllAction();
                }
                this.activeClothingMixers = [];
                this.activeClothingActions = [];
            }

            this.clothesGroup && this.clothesGroup.clear();
            this.clothingChanged(newValue);
        }
    },

    mounted() {
        this.initCanvas();
    },

    unmounted() {
        this.renderer && this.renderer.dispose();
    },

    methods: {
        initCanvas() {
            const canvas = this.$refs.threeRef;
            const supportGL2 = canvas.getContext('webgl2');
            if (!supportGL2) {
                this.$emit('checkSupportGL2', false);
                this.$destroy();
                return;
            }
            // 兜底，命中3D组件情况下 最长 3s 后隐藏loading页
            setTimeout(() => {
                this.$emit('checkSupportGL2', true);
            }, 3000);

            // 开始执行canvas初始化逻辑
            const canvasRatio = canvas.clientWidth / canvas.clientHeight;

            // renderer
            const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(1240, 1240 / canvasRatio, false);
            renderer.shadowMap.enabled = true;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            // renderer.toneMapping = THREE.ACESFilmicToneMapping;
            // renderer.toneMappingExposure = 1;
            this.renderer = renderer;


            // scene
            const scene = new THREE.Scene();
            RectAreaLightUniformsLib.init();
            this.scene = scene;

            // camera
            const camera = new THREE.PerspectiveCamera(15, canvasRatio, 850, 3100);
            this.camera = camera;
            camera.position.set(0, eyePointY, 1000);
            camera.lookAt(0, eyePointY / 3 * 2, 0);

            // 环境光
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
            scene.add(ambientLight);

            // 面光
            // 龙右前方
            const rectLight1 = new THREE.RectAreaLight(0xffffff, 1, 65.6859, 200);
            rectLight1.position.set(-100.0199, 112.7446, 180);
            rectLight1.rotateY(-Math.PI / 2);
            scene.add(rectLight1);
            // 龙背后
            const rectLight2 = new THREE.RectAreaLight(0xffffff, 1, 319.2589, 308.7156);
            rectLight2.position.set(3.5933, 114.3575, -86.7889);
            rectLight2.rotateY(Math.PI);
            scene.add(rectLight2);
            // 龙左胳膊
            const rectLight3 = new THREE.RectAreaLight(0xffffff, 0.5, 65.6859, 200);
            rectLight3.position.set(182.0199, 112.7446, 30.6789);
            rectLight3.rotateY(Math.PI / 2);
            scene.add(rectLight3);

            // const rectLightHelper = new RectAreaLightHelper(rectLight1);
            // scene.add(rectLightHelper);
            // const rectLightHelper2 = new RectAreaLightHelper(rectLight2);
            // scene.add(rectLightHelper2);

            // 天空盒 穹顶光 HDR环境贴图
            const rgbeLoader = new RGBELoader();
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            // pmremGenerator.compileEquirectangularShader();
            pmremGenerator.compileCubemapShader();
            rgbeLoader.load('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/sky_1.hdr', texture => {
                texture.mapping = THREE.EquirectangularReflectionMapping;

                const renderTarget = pmremGenerator.fromEquirectangular(texture).texture;

                scene.environment = renderTarget;

                // 释放资源
                texture.dispose();
                pmremGenerator.dispose();
            });
            // const pmremGenerator = new THREE.PMREMGenerator(renderer);
            // pmremGenerator.compileCubemapShader();
            // // pmremGenerator.compileEquirectangularShader();
            // const worker = new Worker('http://hzt.bcc-szzj.baidu.com:8087/static/n/matrixapp/three.worker.worker.worker.js');
            // worker.postMessage({type: 'loadHDR'});
            // worker.onmessage = e => {
            //     const data = e.data;
            //     if (data.type === 'loadHDR') {
            //         const texture = new THREE.DataTexture().copy(data.texture);
            //         texture.mapping = THREE.EquirectangularReflectionMapping;
            //         const renderTarget = pmremGenerator.fromEquirectangular(texture).texture;
            //         // const renderTarget = pmremGenerator.fromCubemap(texture).texture;
            //         scene.environment = renderTarget;
            //         // 释放资源
            //         texture.dispose();
            //         pmremGenerator.dispose();
            //     }
            // };


            // group
            const meshGroup = new THREE.Group();
            meshGroup.rotateY(Math.PI / 4); // 龙 初始旋转角度
            const dragonRotationMixer = new THREE.AnimationMixer(meshGroup);
            const dragonRotationKeyframe = new THREE.VectorKeyframeTrack(
                '.rotation[y]',
                // [0, 0.5, 1.5, 2],
                // [0, -Math.PI / 4, Math.PI / 4, 0]
                [0, 0.5],
                [Math.PI / 4, 0]
            );
            const dragonRotationClip = new THREE.AnimationClip('Rotation', 1, [dragonRotationKeyframe]);
            const dragonRotationAction = dragonRotationMixer.clipAction(dragonRotationClip);
            dragonRotationAction.setLoop(1, 1);
            dragonRotationAction.clampWhenFinished = true;


            scene.add(meshGroup);
            this.meshGroup = meshGroup;

            const clothesGroup = new THREE.Group();
            clothesGroup.layers.set(10);
            this.clothesGroup = clothesGroup;
            meshGroup.add(clothesGroup);


            // 控制器
            const transformControls = new TransformControls(camera, renderer.domElement);
            this.transformControls = transformControls;
            transformControls.attach(meshGroup);
            transformControls.setMode('rotate');
            transformControls.scale = new THREE.Vector3(100, 900, 1);
            transformControls.visible = false;
            transformControls.showX = false;
            transformControls.showZ = false;
            transformControls.position.y = eyePointY / 3 * 2;
            scene.add(transformControls);
            // const orbitControls = new OrbitControls(camera, renderer.domElement);
            // orbitControls.target.set(0, eyePointY / 3 * 2, 0);


            // 帧，定义渲染循环
            const clock = new THREE.Clock();
            const animate = () => {
                requestAnimationFrame(animate);

                const delta = clock.getDelta();
                dragonRotationMixer.update(delta);
                this.bodyMixer?.update(delta);
                if (this.activeClothingMixers?.length) {
                    for (const mixer of this.activeClothingMixers) {
                        mixer.update(delta);
                    }
                }

                renderer.render(scene, camera);
            };

            // 加载裸龙
            Promise.all([
                loadGlb('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/blinkModel.glb'),
                loadGlb('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/body.glb')
            ]).then(async models => {
                const [blinkFile, bodyFile] = models;
                const blinkAnimationsData = blinkFile.animations;
                const callAnimationsData = bodyFile.animations;

                // 从模型1 收集眨眼动画相关数据
                let morphTargetInfo = {};
                let morphGeometryInfo = {};
                const blinkModel = blinkFile.scene;
                blinkModel.traverse(obj => {
                    if (obj.isMesh) {
                        morphTargetInfo = {
                            morphTargetDictionary: obj.morphTargetDictionary,
                            morphTargetInfluences: obj.morphTargetInfluences
                        };
                        morphGeometryInfo = {
                            morphAttributes: obj.geometry.morphAttributes,
                            morphTargetsRelative: obj.geometry.morphTargetsRelative
                        };
                    }
                });

                // 处理模型2 身体模型
                const textureUrl = 'https://matrix-fe.cdn.bcebos.com/act/signin/dragon/body.jpg';
                const {model} = await this.handleModelLoad(1, bodyFile, textureUrl);
                model.traverse(async obj => {
                    if (!obj.isMesh) {
                        return;
                    }
                    const bodyMixer = new THREE.AnimationMixer(obj);
                    this.bodyMixer = bodyMixer;

                    // 覆盖 眨眼 相关形变数据
                    obj.morphTargetDictionary = morphTargetInfo.morphTargetDictionary;
                    obj.morphTargetInfluences = morphTargetInfo.morphTargetInfluences;
                    obj.geometry.morphAttributes = morphGeometryInfo.morphAttributes;
                    obj.geometry.morphTargetsRelative = morphGeometryInfo.morphTargetsRelative;

                    for (const clipData of blinkAnimationsData) {
                        clipData.tracks.forEach(track => track.name = `${obj.name}.morphTargetInfluences`);
                        const bodyBlinkAction = bodyMixer.clipAction(clipData);
                        bodyBlinkAction.play(); // 开始眨眼循环
                    }
                    for (const clipData of callAnimationsData) {
                        const bodyCallAction = bodyMixer.clipAction(clipData);
                        bodyCallAction.setLoop(1, 1);
                        this.bodyCallAction = bodyCallAction; // 存储招手动作
                    }

                    // body添加进场景
                    this.meshGroup && this.meshGroup.add(model);

                    // 加载相应衣服
                    await this.clothingChanged(this.selectedId);
                    this.$emit('checkSupportGL2', true);
                    animate();
                    dragonRotationAction.play(); // 开始龙旋转
                });
            });

        },

        async handleModelLoad(clothingID, {scene = null, animations = null}, textureUrl) {

            const model = scene;
            const isBody = clothingID === 1;

            return new Promise((resolve, reject) => {
                model.traverse(obj => {
                    if (obj.isMesh) {
                        obj.castShadow = true;

                        textureLoader.load(textureUrl, mapImg => {
                            mapImg.colorSpace = THREE.SRGBColorSpace, // isBody ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
                            mapImg.flipY = false;

                            obj.material = new THREE.MeshStandardMaterial({
                                // depthWrite: false, // isBody ? false : true,
                                color: isBody ? new THREE.Color('hsl(32,90%,90%)') : 0xffffff,
                                map: mapImg,
                                side: THREE.DoubleSide, // isBody ? THREE.FrontSide : THREE.DoubleSide,
                                roughness: 0.75,
                                metalness: 0,
                                envMapIntensity: 0.8, // isBody ? 0.8 : 1.5,
                            });

                            if (isBody) { // 身体模型直接透传下一层逻辑处理
                                model.renderOrder = 0;
                                resolve({model});
                            }
                            else { // 衣服模型
                                const clothingItem = {
                                    model,
                                };
                                model.renderOrder = 1;
                                this.clothesGroup && this.clothesGroup.add(model);
                                // 动画
                                if (animations[0]) {
                                    const mixer = new THREE.AnimationMixer(model);
                                    const clothingAct = mixer.clipAction(animations[0]);
                                    clothingAct.setLoop(1, 1);

                                    clothingItem.mixer = mixer;
                                    clothingItem.action = clothingAct;
                                }

                                // 透传
                                resolve(clothingItem);
                            }
                        });
                    }
                });
            });
        },

        async clothingChanged(selectedId) {
            // 异步过程中禁止再次点切换，防止多套衣服叠加
            this.$emit('updateIfIsLoadingClothes', true);
            this.bodyCallAction.stop(); // 停止身体动作，保持动作同步


            // 异步请求资源
            const loadClothingPromise = async clothingfile => {
                const {modelName, modelUrl, textureUrl} = clothingfile;
                if (!modelUrl || !textureUrl) {
                    return;
                }
                // 优先从缓存取
                if (this.clothesCache[modelName]) {
                    const {clothingModel, clothingMixer, clothingAction} = this.clothesCache[modelName];
                    this.clothesGroup && this.clothesGroup.add(clothingModel);
                    clothingMixer && this.activeClothingMixers.push(clothingMixer);
                    clothingAction && this.activeClothingActions.push(clothingAction);
                }
                else {
                    // 区分modelUrl 后缀
                    const isGlb = modelUrl.endsWith('.glb');
                    // const isJson = modelUrl.endsWith('.json');
                    if (!isGlb) {
                        return;
                    }

                    // 加载模型
                    const file = await loadGlb(modelUrl);
                    const {model, mixer, action} = await this.handleModelLoad(selectedId, file, textureUrl);
                    mixer && this.activeClothingMixers.push(mixer);
                    action && this.activeClothingActions.push(action);

                    // 缓存衣服 & 动画
                    this.clothesCache[modelName] = {
                        clothingModel: model,
                        clothingMixer: mixer,
                        clothingAction: action,
                    };
                }
            };
            const matchPalyact = modelAssetsMapping[selectedId] || [];
            await Promise.all(matchPalyact.map(clothingfile => (loadClothingPromise(clothingfile))));
            // 执行招手动画
            this.bodyCallAction.reset();
            this.bodyCallAction.play();
            for (const clothesAct of this.activeClothingActions) {
                clothesAct.reset();
                clothesAct.play();
            }
            this.$emit('updateIfIsLoadingClothes', false);
        },
    }
};
</script>

<style lang="scss" scoped>
@import '../../../bsass/core/mixin.scss';

.canvas-dom {
    position: relative;
    width: 100%;
    height: 100%;
}

</style>
