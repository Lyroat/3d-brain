# 3D Brain Explorer

交互式 3D 脑结构探索网页，基于真实 MRI 数据构建，支持 40 个脑区的可视化和交互。

**在线体验：** https://3d-brain-kappa.vercel.app

## 功能

- 40 个独立脑区，基于 FreeSurfer Desikan-Killiany 图谱
- 真实非对称脑沟回（左右半球来自独立 MRI 数据）
- 鼠标旋转/缩放/点击选中脑区
- 悬停高亮 + 选中时其他区域半透明
- 爆炸视图（滑块控制各脑区沿质心展开）
- 4 层级树形目录导航（大脑→皮质→脑叶→具体区域）
- 右侧信息面板显示脑区中文名、描述、功能标签

## 脑区覆盖

| 大类 | 结构 |
|------|------|
| 额叶 | DLPFC、内侧前额叶、眶额皮质、额极、布洛卡区(VLPFC)、初级运动皮质、前运动/SMA、前扣带 |
| 顶叶 | 初级体感、顶上小叶、角回、缘上回、TPJ、楔前叶、后扣带 |
| 颞叶 | 颞上/中/下回、颞横回(A1)、颞极、梭状回、内嗅皮层、海马旁回 |
| 枕叶 | V1(距状裂)、楔叶、外侧枕叶、舌回 |
| 岛叶 | 岛叶皮质 |
| 基底神经节 | 尾状核、壳核、苍白球、伏隔核 |
| 边缘系统 | 海马体、杏仁核 |
| 间脑 | 丘脑、下丘脑 |
| 脑干 | 脑干、黑质 |
| 小脑 | 小脑皮质 |
| 白质 | 胼胝体 |

## 技术栈

- **框架**: Next.js 16 + TypeScript
- **3D 引擎**: React Three Fiber + @react-three/drei
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **模型数据**: Brainder.org FreeSurfer DK Atlas (CC BY-SA 3.0)
- **部署**: Vercel

## 本地开发

```bash
npm install
npm run dev
```

## 重建脑模型

如需从源数据重建 GLB 模型：

```bash
# 下载原始 OBJ（需要网络，约 11MB）
mkdir -p .tmp-brain-meshes
curl -fSL -o .tmp-brain-meshes/pial_DK_obj.tar.bz2 \
  "https://s3.us-east-2.amazonaws.com/brainder/software/brain4blender/smallfiles/pial_DK_obj.tar.bz2"
curl -fSL -o .tmp-brain-meshes/subcortical_obj.tar.bz2 \
  "https://s3.us-east-2.amazonaws.com/brainder/software/brain4blender/smallfiles/subcortical_obj.tar.bz2"

# 解压
cd .tmp-brain-meshes
mkdir -p pial_DK_obj subcortical_obj
tar -xjf pial_DK_obj.tar.bz2 -C pial_DK_obj
tar -xjf subcortical_obj.tar.bz2 -C subcortical_obj
cd ..

# 生成 GLB
node scripts/build-brain-glb.mjs
```

## 项目结构

```
3d-brain/
├── src/
│   ├── app/              # Next.js 页面和布局
│   ├── components/       # React 组件（3D场景、信息面板、控制面板）
│   └── store/            # Zustand 状态管理 + 脑区数据
├── public/
│   └── models/           # GLB 模型和脑区元数据 JSON
├── scripts/
│   └── build-brain-glb.mjs  # OBJ → GLB 转换流水线
└── package.json
```

## 数据来源

脑网格数据来自 [Brainder.org - Brain for Blender](https://brainder.org/research/brain-for-blender/)，基于真实 MRI 扫描经 FreeSurfer 处理后分区导出，采用 CC BY-SA 3.0 许可证。

## License

MIT
