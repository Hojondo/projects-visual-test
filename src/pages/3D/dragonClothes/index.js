
/**
 * @file 奶龙3D换装页
 * @author huzhentao@baidu.com
 */

import Base from '../Base.ssr.vue';
import NaiLongView from './NaiLongView.vue';
const GROUP_ID = 'common'; // spy平台默认性能监控 group


const render = Base.getRenderAction(NaiLongView, GROUP_ID);
if (!V_SSR) {
    window.render = render;
}

export default render;

