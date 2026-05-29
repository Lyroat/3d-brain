import { create } from 'zustand';

export interface RegionInfo {
  name: string;
  label: string;
  description: string;
  functions: string[];
}

export const REGION_DATA: Record<string, RegionInfo> = {
  // === 大脑皮质 - 额叶 - 前额叶皮质 ===
  'dlpfc': { name: 'dlpfc', label: '背外侧前额叶（DLPFC）', description: '前额叶皮质的外侧部分，是执行功能的核心区域。参与工作记忆、认知控制、决策规划和注意力调节。', functions: ['工作记忆', '认知控制', '决策规划', '注意力'] },
  'medial-prefrontal': { name: 'medial-prefrontal', label: '内侧前额叶/额上回', description: '前额叶皮质的内侧面，参与自我参照加工、社会认知和默认模式网络活动。', functions: ['自我意识', '社会认知', '内省', '默认模式'] },
  'orbitofrontal': { name: 'orbitofrontal', label: '眶额皮质（OFC）', description: '位于额叶底面，参与情绪调节、奖赏评估和社会行为判断。损伤可导致人格改变。', functions: ['情绪调节', '奖赏评估', '社会判断', '冲动控制'] },
  'frontal-pole': { name: 'frontal-pole', label: '额极', description: '前额叶最前端，参与多任务处理、未来规划、元认知和抽象推理。', functions: ['多任务处理', '未来规划', '元认知', '抽象推理'] },
  'vlpfc': { name: 'vlpfc', label: '腹外侧前额叶/布洛卡区', description: '前额叶皮质的外下部，左侧即布洛卡区，是语言产生的关键区域，负责语言表达和语法处理。', functions: ['语言产生', '语法处理', '言语运动', '认知抑制'] },
  // === 大脑皮质 - 额叶 - 运动皮质 ===
  'primary-motor-cortex': { name: 'primary-motor-cortex', label: '初级运动皮质（M1）', description: '中央前回，直接控制随意运动的执行。按身体部位有序排列（运动小人图）。', functions: ['运动执行', '精细动作', '肌肉控制'] },
  'premotor-sma': { name: 'premotor-sma', label: '前运动区/辅助运动区', description: '位于初级运动皮质前方和内侧，参与运动的规划、准备和协调复杂动作序列。', functions: ['运动规划', '动作序列', '姿势控制', '双侧协调'] },
  // === 大脑皮质 - 额叶 - 扣带 ===
  'anterior-cingulate': { name: 'anterior-cingulate', label: '前扣带皮层（ACC）', description: '连接额叶与边缘系统，参与错误检测、冲突监控、情绪调节和疼痛感知。', functions: ['错误检测', '冲突监控', '情绪调节', '注意力分配'] },

  // === 大脑皮质 - 顶叶 ===
  'primary-somatosensory': { name: 'primary-somatosensory', label: '初级体感皮质（S1）', description: '中央后回，处理来自身体的触觉、温度、疼痛和本体感觉信息。按身体部位有序排列。', functions: ['触觉', '温度感知', '疼痛', '本体感觉'] },
  'superior-parietal': { name: 'superior-parietal', label: '顶上小叶（后顶叶皮质）', description: '参与空间定向、视觉运动整合、注意力转移和手眼协调。背侧视觉通路的关键节点。', functions: ['空间定向', '注意力转移', '手眼协调', '视觉运动'] },
  'inferior-parietal': { name: 'inferior-parietal', label: '角回区域', description: '顶下小叶的后部，多模态感觉整合区域，参与阅读、数学推理和语义加工。', functions: ['阅读', '数学推理', '语义整合', '空间注意'] },
  'supramarginal-gyrus': { name: 'supramarginal-gyrus', label: '缘上回', description: '顶下小叶的前部，参与语音加工、触觉识别和同理心。连接听觉和运动区域。', functions: ['语音加工', '触觉识别', '同理心', '语音工作记忆'] },
  'angular-gyrus': { name: 'angular-gyrus', label: '颞顶联合区（TPJ）', description: '颞上沟后壁区域，参与社会认知（心理理论）、注意力重定向和自我-他人区分。', functions: ['心理理论', '注意力重定向', '自我-他人区分', '语言加工'] },
  'precuneus': { name: 'precuneus', label: '楔前叶', description: '内侧顶叶的核心结构，参与自我意识、情景记忆提取和视觉空间想象。默认模式网络核心节点。', functions: ['自我反思', '情景记忆', '空间想象', '意识'] },
  'posterior-cingulate': { name: 'posterior-cingulate', label: '后扣带皮层（PCC）', description: '默认模式网络的核心枢纽，参与自传体记忆、内部导向思维和价值评估。', functions: ['自传体记忆', '内部思维', '空间导航', '价值评估'] },

  // === 大脑皮质 - 颞叶 ===
  'superior-temporal': { name: 'superior-temporal', label: '颞上回（含韦尼克区）', description: '外侧颞叶上部，左侧后部为韦尼克区（语言理解）。处理听觉和语言信息。', functions: ['语言理解', '听觉处理', '音乐感知', '语音识别'] },
  'middle-temporal': { name: 'middle-temporal', label: '颞中回', description: '外侧颞叶中部，参与语义加工、面部识别和视觉运动感知（含V5/MT区）。', functions: ['语义加工', '视觉运动', '面部处理', '词汇检索'] },
  'inferior-temporal': { name: 'inferior-temporal', label: '颞下回', description: '外侧颞叶下部，腹侧视觉通路的高级区域，参与物体识别和视觉记忆。', functions: ['物体识别', '视觉记忆', '文字识别', '范畴知识'] },
  'transverse-temporal': { name: 'transverse-temporal', label: '颞横回/赫氏回（A1）', description: '初级听觉皮层所在地，位于颞上回上面的横向小回。处理声音的频率、强度和时间特性。', functions: ['初级听觉', '频率分析', '音调感知', '时间编码'] },
  'temporal-pole': { name: 'temporal-pole', label: '颞极', description: '颞叶最前端，参与社会认知、情绪语义、面部-名字关联和语义记忆。', functions: ['社会认知', '情绪语义', '命名', '语义记忆'] },
  'fusiform-gyrus': { name: 'fusiform-gyrus', label: '梭状回（FFA）', description: '内侧颞叶底面，面部识别和物体辨认的关键区域。含梭状面孔区(FFA)和视觉词形区(VWFA)。', functions: ['面部识别', '物体辨认', '文字识别', '颜色处理'] },
  'entorhinal-cortex': { name: 'entorhinal-cortex', label: '内嗅皮层', description: '连接海马体与新皮层的门户，包含网格细胞，是空间导航和记忆编码的关键接口。', functions: ['空间导航', '记忆编码', '网格细胞', '嗅觉整合'] },
  'parahippocampal': { name: 'parahippocampal', label: '海马旁回（PPA）', description: '内侧颞叶的重要结构，含海马旁位置区(PPA)，参与场景识别和空间记忆编码。', functions: ['场景识别', '空间记忆', '情景记忆', '位置编码'] },

  // === 大脑皮质 - 枕叶 ===
  'lateral-occipital': { name: 'lateral-occipital', label: '外侧枕叶（V3/V4/V5）', description: '视觉联合皮层的外侧部分，含多个高级视觉区(V3/V4/V5)，参与物体形状、运动和颜色加工。', functions: ['形状识别', '运动感知', '颜色加工', '物体感知'] },
  'cuneus': { name: 'cuneus', label: '楔叶（V1/V2）', description: '内侧枕叶的上部楔形区域，含初级视觉皮层的上半部，处理下视野的视觉信息。', functions: ['初级视觉', '下视野', '视觉注意', '空间频率'] },
  'pericalcarine': { name: 'pericalcarine', label: '距状裂周围皮质（V1）', description: '距状裂两侧的皮层，即初级视觉皮层(V1/纹状皮层)。所有视觉信息加工的起点。', functions: ['初级视觉', '边缘检测', '方向选择', '对比度'] },
  'lingual-gyrus': { name: 'lingual-gyrus', label: '舌回（V2/V4）', description: '内侧枕叶的下部，视觉联合皮层的一部分，参与颜色加工、视觉记忆和文字编码。', functions: ['颜色处理', '视觉记忆', '文字编码', '视觉想象'] },

  // === 大脑皮质 - 岛叶 ===
  'insular-cortex': { name: 'insular-cortex', label: '岛叶皮质', description: '隐藏在外侧裂深处，参与内感受（感知身体内部状态）、情绪体验、疼痛、味觉和自我意识。前岛叶参与主观情感，后岛叶处理躯体感觉。', functions: ['内感受', '情绪体验', '疼痛感知', '味觉', '自我意识'] },

  // === 基底神经节 ===
  'caudate': { name: 'caudate', label: '尾状核', description: '基底神经节的组成部分，参与运动控制、习惯学习和目标导向行为。', functions: ['运动控制', '习惯学习', '目标导向', '认知灵活性'] },
  'putamen': { name: 'putamen', label: '壳核', description: '基底神经节的核心结构，与尾状核合称纹状体，参与运动学习和执行。', functions: ['运动学习', '运动执行', '强化学习'] },
  'pallidum': { name: 'pallidum', label: '苍白球', description: '基底神经节的输出结构，调节运动的启动和抑制。', functions: ['运动调节', '动作选择', '运动抑制'] },
  'accumbens': { name: 'accumbens', label: '伏隔核', description: '奖赏回路的核心，介导快乐、动机和成瘾行为。属于腹侧纹状体。', functions: ['奖赏处理', '动机', '快乐体验', '成瘾'] },
  'subthalamic-nucleus': { name: 'subthalamic-nucleus', label: '丘脑下核（STN）', description: '位于丘脑腹侧、内囊内侧的小型透镜状核团。在基底神经节间接通路中起关键兴奋性驱动作用，调节运动抑制。深部脑刺激（DBS）治疗帕金森病的主要靶点。', functions: ['运动抑制', '冲动控制', '决策阈值', 'DBS靶点'] },

  // === 边缘系统 ===
  'hippocampus': { name: 'hippocampus', label: '海马体', description: '记忆形成和空间导航的核心结构，将短期记忆转化为长期记忆。含位置细胞。', functions: ['记忆形成', '空间导航', '学习', '情景记忆'] },
  'amygdala': { name: 'amygdala', label: '杏仁核', description: '情绪处理中枢，尤其参与恐惧和威胁检测。也参与情绪记忆的巩固。', functions: ['恐惧处理', '情绪记忆', '威胁检测', '社会情感'] },

  // === 间脑 ===
  'thalamus': { name: 'thalamus', label: '丘脑', description: '感觉信息的中继站（除嗅觉外），将信息传递到大脑皮层相应区域。也参与意识和注意。', functions: ['感觉中继', '运动信号', '意识调节', '注意力'] },
  'hypothalamus': { name: 'hypothalamus', label: '下丘脑', description: '调节内分泌系统、自主神经功能、体温、饥饿、口渴和昼夜节律。虽小却是生命维持的关键。', functions: ['内分泌调节', '体温调控', '饥饿/口渴', '昼夜节律', '情绪反应'] },

  // === 脑干 ===
  'brainstem': { name: 'brainstem', label: '脑干', description: '连接大脑与脊髓的核心结构，控制呼吸、心跳、血压等基本生命功能。由中脑、脑桥和延髓三部分组成。', functions: ['呼吸调控', '心率控制', '觉醒', '反射'] },
  'midbrain': { name: 'midbrain', label: '中脑', description: '脑干最上部，连接间脑与脑桥。包含上丘（视觉反射）、下丘（听觉中继）、黑质、红核等结构。参与眼动控制、听觉视觉反射和运动调节。', functions: ['眼动控制', '视听反射', '运动调节', '觉醒'] },
  'pons': { name: 'pons', label: '脑桥', description: '脑干中部，连接中脑与延髓，是小脑与大脑之间的信息桥梁。包含多个颅神经核，参与呼吸调节、面部感觉和运动。', functions: ['小脑通信', '呼吸调节', '面部运动', '睡眠-觉醒'] },
  'medulla': { name: 'medulla', label: '延髓', description: '脑干最下部，连接脑桥与脊髓。包含心血管中枢、呼吸中枢和呕吐中枢等生命攸关的调控中心。', functions: ['心血管调控', '呼吸节律', '吞咽反射', '呕吐反射'] },
  'substantia-nigra': { name: 'substantia-nigra', label: '黑质', description: '位于中脑腹侧内部，是多巴胺能神经元的主要来源。分为致密部（产生多巴胺）和网状部（运动输出）。退化导致帕金森病。', functions: ['多巴胺分泌', '运动启动', '奖赏信号', '运动抑制'] },

  // === 小脑 ===
  'cerebellum': { name: 'cerebellum', label: '小脑', description: '协调运动、维持平衡，并参与运动学习、认知功能和情绪调节。', functions: ['运动协调', '平衡维持', '运动学习', '认知时序'] },

  // === 白质 ===
  'corpus-callosum': { name: 'corpus-callosum', label: '胼胝体', description: '连接左右大脑半球的最大白质纤维束，约含2亿根轴突。', functions: ['半球间通信', '信息整合', '协调合作'] },
};

// Hierarchical tree structure for navigation
export interface TreeNode {
  id: string;
  label: string;
  regionName?: string; // maps to REGION_DATA key
  children?: TreeNode[];
}

export const BRAIN_TREE: TreeNode[] = [
  {
    id: 'cerebrum', label: '大脑', children: [
      {
        id: 'cerebral-cortex', label: '大脑皮质', children: [
          {
            id: 'frontal-lobe', label: '额叶', children: [
              {
                id: 'prefrontal-cortex', label: '前额叶皮质', children: [
                  { id: 'r-dlpfc', label: '背外侧前额叶（DLPFC）', regionName: 'dlpfc' },
                  { id: 'r-medial-prefrontal', label: '内侧前额叶/额上回', regionName: 'medial-prefrontal' },
                  { id: 'r-orbitofrontal', label: '眶额皮质（OFC）', regionName: 'orbitofrontal' },
                  { id: 'r-frontal-pole', label: '额极', regionName: 'frontal-pole' },
                  { id: 'r-vlpfc', label: '腹外侧前额叶/布洛卡区', regionName: 'vlpfc' },
                ]
              },
              {
                id: 'motor-cortex', label: '运动皮质', children: [
                  { id: 'r-primary-motor-cortex', label: '初级运动皮质（M1）', regionName: 'primary-motor-cortex' },
                  { id: 'r-premotor-sma', label: '前运动区/辅助运动区', regionName: 'premotor-sma' },
                ]
              },
              { id: 'r-anterior-cingulate', label: '前扣带皮层（ACC）', regionName: 'anterior-cingulate' },
            ]
          },
          {
            id: 'parietal-lobe', label: '顶叶', children: [
              {
                id: 'somatosensory-cortex', label: '体感皮质', children: [
                  { id: 'r-primary-somatosensory', label: '初级体感皮质（S1）', regionName: 'primary-somatosensory' },
                ]
              },
              { id: 'r-superior-parietal', label: '顶上小叶（后顶叶皮质）', regionName: 'superior-parietal' },
              {
                id: 'inferior-parietal-lobule', label: '顶下小叶', children: [
                  { id: 'r-inferior-parietal', label: '角回区域', regionName: 'inferior-parietal' },
                  { id: 'r-supramarginal-gyrus', label: '缘上回', regionName: 'supramarginal-gyrus' },
                  { id: 'r-angular-gyrus', label: '颞顶联合区（TPJ）', regionName: 'angular-gyrus' },
                ]
              },
              {
                id: 'medial-parietal', label: '内侧顶叶', children: [
                  { id: 'r-precuneus', label: '楔前叶', regionName: 'precuneus' },
                  { id: 'r-posterior-cingulate', label: '后扣带皮层（PCC）', regionName: 'posterior-cingulate' },
                ]
              },
            ]
          },
          {
            id: 'temporal-lobe', label: '颞叶', children: [
              {
                id: 'lateral-temporal', label: '外侧颞叶', children: [
                  { id: 'r-superior-temporal', label: '颞上回（含韦尼克区）', regionName: 'superior-temporal' },
                  { id: 'r-middle-temporal', label: '颞中回', regionName: 'middle-temporal' },
                  { id: 'r-inferior-temporal', label: '颞下回', regionName: 'inferior-temporal' },
                ]
              },
              {
                id: 'auditory-cortex', label: '听觉皮层', children: [
                  { id: 'r-transverse-temporal', label: '颞横回/赫氏回（A1）', regionName: 'transverse-temporal' },
                ]
              },
              {
                id: 'medial-temporal', label: '内侧颞叶', children: [
                  { id: 'r-fusiform-gyrus', label: '梭状回（FFA）', regionName: 'fusiform-gyrus' },
                  { id: 'r-entorhinal-cortex', label: '内嗅皮层', regionName: 'entorhinal-cortex' },
                  { id: 'r-parahippocampal', label: '海马旁回（PPA）', regionName: 'parahippocampal' },
                ]
              },
              { id: 'r-temporal-pole', label: '颞极', regionName: 'temporal-pole' },
            ]
          },
          {
            id: 'occipital-lobe', label: '枕叶', children: [
              {
                id: 'primary-visual', label: '初级视觉皮层', children: [
                  { id: 'r-pericalcarine', label: '距状裂周围皮质（V1）', regionName: 'pericalcarine' },
                  { id: 'r-cuneus', label: '楔叶（V1/V2）', regionName: 'cuneus' },
                ]
              },
              {
                id: 'visual-association', label: '视觉联合皮层', children: [
                  { id: 'r-lateral-occipital', label: '外侧枕叶（V3/V4/V5）', regionName: 'lateral-occipital' },
                  { id: 'r-lingual-gyrus', label: '舌回（V2/V4）', regionName: 'lingual-gyrus' },
                ]
              },
            ]
          },
          {
            id: 'insular-lobe', label: '岛叶', children: [
              { id: 'r-insular-cortex', label: '岛叶皮质', regionName: 'insular-cortex' },
            ]
          },
        ]
      },
      {
        id: 'basal-ganglia', label: '基底神经节', children: [
          { id: 'r-caudate', label: '尾状核', regionName: 'caudate' },
          { id: 'r-putamen', label: '壳核', regionName: 'putamen' },
          { id: 'r-pallidum', label: '苍白球', regionName: 'pallidum' },
          { id: 'r-accumbens', label: '伏隔核', regionName: 'accumbens' },
          { id: 'r-subthalamic-nucleus', label: '丘脑下核（STN）', regionName: 'subthalamic-nucleus' },
          { id: 'bg-substantia-nigra', label: '黑质', regionName: 'substantia-nigra' },
        ]
      },
      {
        id: 'limbic', label: '边缘系统', children: [
          { id: 'r-hippocampus', label: '海马体', regionName: 'hippocampus' },
          { id: 'r-amygdala', label: '杏仁核', regionName: 'amygdala' },
        ]
      },
      {
        id: 'white-matter', label: '白质纤维', children: [
          { id: 'r-corpus-callosum', label: '胼胝体', regionName: 'corpus-callosum' },
        ]
      },
    ]
  },
  {
    id: 'cerebellum-group', label: '小脑', children: [
      { id: 'r-cerebellum', label: '小脑皮质', regionName: 'cerebellum' },
    ]
  },
  {
    id: 'diencephalon', label: '间脑', children: [
      { id: 'r-thalamus', label: '丘脑', regionName: 'thalamus' },
      { id: 'r-hypothalamus', label: '下丘脑', regionName: 'hypothalamus' },
    ]
  },
  {
    id: 'brainstem-group', label: '脑干', regionName: 'brainstem', children: [
      {
        id: 'midbrain', label: '中脑', regionName: 'midbrain', children: [
          { id: 'r-substantia-nigra', label: '黑质', regionName: 'substantia-nigra' },
        ]
      },
      { id: 'pons', label: '脑桥', regionName: 'pons' },
      { id: 'medulla', label: '延髓', regionName: 'medulla' },
    ]
  },
];

// Collect all leaf regionName values from a tree node and its descendants
export function getDescendantRegions(node: TreeNode): string[] {
  const regions: string[] = [];
  if (node.regionName) regions.push(node.regionName);
  if (node.children) {
    for (const child of node.children) {
      regions.push(...getDescendantRegions(child));
    }
  }
  return regions;
}

// Find a tree node by its id
export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

interface BrainState {
  selectedNodeId: string | null;   // tree node id that was clicked
  hoveredRegion: string | null;    // single region name on 3D hover
  explodeAmount: number;
  expandedNodes: Set<string>;
  setSelectedNodeId: (nodeId: string | null) => void;
  setHoveredRegion: (region: string | null) => void;
  setExplodeAmount: (amount: number) => void;
  toggleNode: (nodeId: string) => void;
}

export const useBrainStore = create<BrainState>((set) => ({
  selectedNodeId: null,
  hoveredRegion: null,
  explodeAmount: 0,
  expandedNodes: new Set(['cerebrum']),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setHoveredRegion: (region) => set({ hoveredRegion: region }),
  setExplodeAmount: (amount) => set({ explodeAmount: amount }),
  toggleNode: (nodeId) => set((state) => {
    const next = new Set(state.expandedNodes);
    if (next.has(nodeId)) next.delete(nodeId);
    else next.add(nodeId);
    return { expandedNodes: next };
  }),
}));

// Hook to get the set of currently highlighted region names
export function useSelectedRegions(): Set<string> {
  const { selectedNodeId } = useBrainStore();
  if (!selectedNodeId) return new Set();
  const node = findNodeById(BRAIN_TREE, selectedNodeId);
  if (!node) return new Set();
  return new Set(getDescendantRegions(node));
}
