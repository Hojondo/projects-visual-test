
// 填入当前页面的ubcid
export const LOGGER_ID = '';
export const getErrorToast = '网络请求超时 请稍后重试';
export const signinActType = 'cny_signin';


// 维护 服装模型 物料 mapping
const ModelItemList = [
    'garland', // 花环
    'shoulderGirdle', // 肩带
    'orangeShirt', // 橘色上衣
    'glasses', // 眼镜
    'fishingPants', // 垂钓裤
    'fishingHat', // 垂钓帽
    'purpleShirt', // 紫色上衣
    'purpleHat', // 紫色帽子
    'duckHat', // 黄鸭帽
    'greenHoodie', // 绿色帽衫
    'dailyGreen', // 日常绿色上衣
    'dailyWhite', // 日常白色上衣
    'sunglasses', // 太阳镜
    'duck', // 鸭子
    'fish', // 鱼
    'basket', // 花篮
    'kettle'// 水壶
];
const ModelItemListMap = ModelItemList.map(it => ({
    [it]: {
        modelName: it,
        modelUrl: `https://matrix-fe.cdn.bcebos.com/act/signin/dragon/${it}.glb`,
        textureUrl: `https://matrix-fe.cdn.bcebos.com/act/signin/dragon/${it}.jpg`
    }
})).reduce((res, cur) => Object.assign(res, cur), {});

export const modelAssetsMapping = {
    2: [
        ModelItemListMap.duckHat,
        ModelItemListMap.greenHoodie
    ],
    3: [
        ModelItemListMap.glasses,
        ModelItemListMap.garland,
        ModelItemListMap.dailyGreen,
    ],
    4: [
        ModelItemListMap.duckHat,
        ModelItemListMap.dailyGreen,
        ModelItemListMap.sunglasses
    ],
    5: [
        ModelItemListMap.purpleHat,
        ModelItemListMap.sunglasses,
        ModelItemListMap.garland,
        ModelItemListMap.dailyWhite,
        ModelItemListMap.kettle
    ],
    6: [
        ModelItemListMap.fishingHat,
        ModelItemListMap.fishingPants
    ],
    7: [
        ModelItemListMap.purpleHat,
        ModelItemListMap.sunglasses,
        ModelItemListMap.dailyWhite,
        ModelItemListMap.duck
    ],
    8: [
        ModelItemListMap.purpleHat,
        ModelItemListMap.purpleShirt
    ],
    9: [
        ModelItemListMap.duckHat,
        ModelItemListMap.dailyWhite,
        ModelItemListMap.sunglasses,
        ModelItemListMap.garland,
        ModelItemListMap.kettle,
    ],
    10: [
        ModelItemListMap.purpleHat,
        ModelItemListMap.dailyGreen,
        ModelItemListMap.garland,
        ModelItemListMap.fish
    ],
    11: [
        ModelItemListMap.glasses,
        ModelItemListMap.dailyWhite,
        ModelItemListMap.fish
    ],
    12: [
        ModelItemListMap.glasses,
        ModelItemListMap.orangeShirt,
        ModelItemListMap.garland,
        ModelItemListMap.shoulderGirdle
    ],
    13: [
        ModelItemListMap.duckHat,
        ModelItemListMap.dailyWhite,
        ModelItemListMap.garland,
        ModelItemListMap.duck
    ],
    14: [
        ModelItemListMap.glasses,
        ModelItemListMap.dailyGreen,
        ModelItemListMap.basket
    ],
    15: [
        ModelItemListMap.duckHat,
        ModelItemListMap.dailyGreen,
        ModelItemListMap.kettle
    ],
};
