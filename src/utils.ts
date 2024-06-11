export async function importAll(r: any) {
  const images: Record<string, string> = {};
  const keys = Object.keys(r);
  for (const key of keys) {
    const imageName = key.replace(/.*\//g, "").replace(/\.\w+$/, ""); // 提取文件名
    const image = await r[key](); // 使用 await 动态导入图片
    images[imageName] = image.default; // 将图片默认导出路径存储在对象中
  }
  return images;
}


// 预加载一些 非mounted请求的大资源
export const preloadSrc = (src: string) => new Promise((resolve, reject) => {
  const r = new XMLHttpRequest();
  r.responseType = 'blob';
  r.open('GET', src);
  r.onload = function () {
      resolve(URL.createObjectURL(r.response));
  };
  r.onerror = function () {
      reject(new Error('error'));
  };

  r.send();
});