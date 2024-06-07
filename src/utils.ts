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
