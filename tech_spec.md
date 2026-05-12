# 三角机构 TRPG 角色卡生成器技术文档

## 1. 项目目标

制作一个部署在 Cloudflare Pages 上的纯前端三角机构角色卡生成器。用户通过下拉框选择 A / R / C 三个维度，并填写姓名、代词、问卷答案、人际关系等自由文本。系统自动展示对应规则文本，排版成一份网页版角色卡，并提供导出 PDF 功能。

流程为“前端自行排版 → 按照同样格式，所见即所得导出 PDF”。这样开发难度更低，维护更容易，也更适合后续做自定义样式。

---

## 2. 核心流程来源：官方车卡流程

官方车卡流程可以整理为以下步骤：

1. 选择你的异常体 A
2. 选择你的现实 R
3. 创建你的人际关系
4. 选择你的职能 C
5. 完成你的自我评估
6. 填写入职问卷

工具应当围绕这 6 步设计，而不是直接照搬原 PDF 页面顺序。

---

## 3. 已整理出的规则信息

### 3.1 A：异常体 / 异常共鸣

共有 9 个选项：

| 中文名 | 英文名 | 原书页码 |
|---|---|---:|
| 低语 | Whisper | 60 |
| 目录 | Catalogue | 62 |
| 汲取 | Drain | 64 |
| 时计 | Timepiece | 66 |
| 生长 | Growth | 68 |
| 枪械 | Gun | 70 |
| 梦境 | Dream | 72 |
| 流形 | Manifold | 74 |
| 缺位 | Absence | 76 |

每个 A 选项包含：

- 简介
- 能力 1
- 能力 2
- 能力 3
- 每个能力的触发器
- 每个能力对应资质
- 成功时效果
- 能力增强效果
- 失败时效果
- 能力问题
- 两个回答选项
- 每个回答对应代码
- 特殊问题或提示，部分异常体有，部分为“不适用”

前端展示建议：

- 选择 A 后，自动展示该异常体简介
- 自动生成 3 张“异常能力卡”
- 每张能力卡展示：能力名、触发器、资质、成功、增强、失败、问题、答案选项、代码
- 用户可以选择每个能力问题的答案，用于生成后续代码或记录

---

### 3.2 R：现实身份

共有 9 个选项：

| 中文名 | 英文名 | 原书页码 |
|---|---|---:|
| 看护者 | Caretaker | 80 |
| 日程过载 / 卷王 | Overbooked | 82 |
| 受追猎者 / 被追捕者 | Pursued | 84 |
| 明星 | Star | 86 |
| 挣扎求生 / 底层草根 | Struggling | 88 |
| 新生儿 / 新生 | Newborn | 90 |
| 浪漫主义 / 海王 | Romantic | 92 |
| 支柱 / 顶梁柱 | Backbone | 94 |
| 异类 | Creature | 96 |

每个 R 选项包含：

- 简介
- 特殊项
- 现实触发器
- 触发器效果
- 触发器进度轨名称
- 过载释放
- 过载触发效果
- 入职问卷 1
- 入职问卷 2
- 入职问卷 3
- 人际网络提示
- R 专属问题
- 示例与提示

前端展示建议：

- 选择 R 后，自动展示现实身份简介
- 自动生成现实触发器卡
- 自动生成过载释放卡
- 自动生成 3 个入职问卷题目
- 自动生成 3 个人际关系提示
- 用户填写关系对象、扮演者、描述、连结加成等信息

---

### 3.3 C：职能

共有 9 个选项：

| 中文名 | 英文名 | 原书页码 |
|---|---|---:|
| 公关 | Public Relations | 100 |
| 研发 | R&D | 102 |
| 咖啡师 | Barista | 104 |
| 首席执行官 | CEO | 106 |
| 实习生 | Intern | 108 |
| 掘墓人 | Gravedigger | 110 |
| 接待处 | Receptionist | 112 |
| 热线 | Customer Service | 114 |
| 小丑 | Clown | 116 |

每个 C 选项包含：

- 简介
- 特殊问题，部分职能有，部分为“不适用”
- 特殊内容
- 最高原则
- 最高原则效果
- 授权行为 1
- 授权行为 2
- 授权行为 3
- 初始申领物
- 申领物效果

前端展示建议：

- 选择 C 后，自动展示职能简介
- 自动填写“首要指令 / 最高原则”
- 自动填写 3 条许可行为
- 自动生成初始申领物卡
- 若该 C 有特殊问题，则提示用户填写

---

## 4. 推荐技术栈

### 4.1 前端框架

推荐：

- Vite
- React
- TypeScript
- Tailwind CSS

原因：

- 纯静态前端适合部署到 Cloudflare Pages
- React 组件化适合拆分 A / R / C 卡片
- TypeScript 适合维护复杂 JSON 数据结构
- Tailwind CSS 适合快速复刻官方角色卡的强烈色彩风格

### 4.2 PDF 导出

第一阶段推荐：

- html2canvas
- jsPDF

或直接使用：

- html2pdf.js

第一阶段目标是“能导出可读 PDF”，不是 100% 精确印刷级分页。

第二阶段如需更稳定的分页和印刷效果，可以改为：

- Playwright / Puppeteer 服务端导出
- 或 Cloudflare Workers + 浏览器渲染服务，但这会明显增加复杂度

### 4.3 数据来源

当前 Excel / 文本整理数据应转换为静态 JSON 文件，例如：

```txt
src/data/arc-data.json
```

或拆分为：

```txt
src/data/anomalies.json
src/data/realities.json
src/data/careers.json
```

推荐拆分为三个文件，便于维护。

---

## 5. 数据结构设计

### 5.1 总类型

```ts
export type ArcData = {
  anomalies: Record<string, Anomaly>;
  realities: Record<string, Reality>;
  careers: Record<string, Career>;
};
```

---

### 5.2 A：异常体类型

```ts
export type Anomaly = {
  id: string;
  nameZh: string;
  nameEn: string;
  page: number;
  intro: string;
  abilities: Ability[];
  specialQuestion?: string;
  specialHint?: string;
};

export type Ability = {
  name: string;
  trigger: string;
  quality: QualityName;
  success: string;
  enhancement: string;
  failure: string;
  question: string;
  answers: AbilityAnswer[];
};

export type AbilityAnswer = {
  label: 'a' | 'b';
  text: string;
  code: string;
};
```

---

### 5.3 R：现实身份类型

```ts
export type Reality = {
  id: string;
  nameZh: string;
  nameEn: string;
  page: number;
  intro: string;
  special?: string;
  triggerName: string;
  triggerEffect: string;
  progressTrackName: string;
  overloadReleaseName: string;
  overloadReleaseEffect: string;
  onboardingQuestions: string[];
  relationshipPrompts: RelationshipPrompt[];
  personalQuestion?: string;
  personalQuestionHint?: string;
};

export type RelationshipPrompt = {
  question: string;
  examples?: string[];
};
```

---

### 5.4 C：职能类型

```ts
export type Career = {
  id: string;
  nameZh: string;
  nameEn: string;
  page: number;
  intro: string;
  specialQuestion?: string;
  specialOptions?: string[];
  primeDirective: string;
  primeDirectiveEffect: string;
  authorizedActions: string[];
  initialRequisition: string;
  requisitionEffect: string;
};
```

---

### 5.5 玩家输入类型

```ts
export type CharacterFormState = {
  characterName: string;
  pronouns: string;
  agencyTitle: string;
  agencyRank: string;

  anomalyId: string;
  realityId: string;
  careerId: string;

  abilityAnswers: Record<string, 'a' | 'b'>;

  realitySpecialAnswer?: string;
  careerSpecialAnswer?: string;

  onboardingAnswers: string[];
  selfAssessment: Record<QualityName, number>;

  relationships: RelationshipEntry[];
};

export type RelationshipEntry = {
  prompt: string;
  name: string;
  player?: string;
  description?: string;
  linkBonus?: string;
};
```

---

### 5.6 资质类型

官方卡上有 9 个资质：

```ts
export type QualityName =
  | '专注'
  | '欺瞒'
  | '活力'
  | '共情'
  | '主动'
  | '坚毅'
  | '气场'
  | '专业'
  | '诡秘';
```

---

## 6. 页面信息架构

建议采用“左侧流程导航 + 右侧填写区 + 预览页”的结构。

### 6.1 编辑模式

```txt
Step 1：基础信息
Step 2：选择异常体 A
Step 3：选择现实 R
Step 4：创建人际关系
Step 5：选择职能 C
Step 6：自我评估
Step 7：填写入职问卷
Step 8：预览与导出
```

### 6.2 预览模式

预览模式不是表单，而是“可打印角色卡”。

建议分为 4 页：

#### 第 1 页：角色概览

- 角色姓名
- 人称代词
- 机构头衔
- 机构评级
- A / R / C 三角摘要
- 9 项资质
- 最高原则 / 首要指令
- 许可行为
- 过载释放

#### 第 2 页：异常能力

- 异常体简介
- 能力 1
- 能力 2
- 能力 3
- 每个能力包含触发器、资质、成功、增强、失败、问题与答案

#### 第 3 页：现实身份与人际关系

- 现实身份简介
- 现实触发器
- 触发器效果
- 过载释放
- 3 段人际关系

#### 第 4 页：职能、申领物与入职问卷

- 职能简介
- 最高原则
- 3 条授权行为
- 初始申领物
- 申领物效果
- 入职问卷与玩家回答

---

## 7. 组件设计

### 7.1 应用组件结构

```txt
src/
  app/
    App.tsx
  components/
    Layout.tsx
    Stepper.tsx
    SelectCard.tsx
    TextField.tsx
    TextArea.tsx
    SectionCard.tsx
    PrintableSheet.tsx
    ExportPdfButton.tsx
  features/
    character/
      CharacterBuilder.tsx
      CharacterPreview.tsx
      CharacterContext.tsx
      useCharacterForm.ts
    anomaly/
      AnomalySelector.tsx
      AnomalyAbilityCard.tsx
    reality/
      RealitySelector.tsx
      RelationshipEditor.tsx
      OnboardingQuestions.tsx
    career/
      CareerSelector.tsx
      CareerDirectiveCard.tsx
    assessment/
      SelfAssessment.tsx
  data/
    anomalies.json
    realities.json
    careers.json
  types/
    arc.ts
  utils/
    exportPdf.ts
    splitText.ts
    storage.ts
```

---

## 8. 状态管理

第一阶段不需要 Redux。

推荐：

- React useState
- React Context
- localStorage 自动保存

### 8.1 自动保存

每次表单状态变化时保存：

```ts
localStorage.setItem('triangle-agency-character', JSON.stringify(formState));
```

进入页面时读取：

```ts
const saved = localStorage.getItem('triangle-agency-character');
```

### 8.2 导入 / 导出 JSON 存档

除了 PDF，建议提供角色存档 JSON：

```txt
导出角色数据 .json
导入角色数据 .json
```

这样玩家可以之后继续编辑。

---

## 9. PDF 导出方案

### 9.1 第一阶段：纯前端导出

安装：

```bash
npm install html2canvas jspdf
```

示例：

```ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportElementToPdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
```

注意：这种方式本质是截图转 PDF，视觉一致性好，但文字不可复制。

---

### 9.2 替代方案：浏览器打印

也可以先实现：

```ts
window.print();
```

配合 CSS：

```css
@media print {
  .no-print {
    display: none;
  }

  .print-page {
    page-break-after: always;
    width: 210mm;
    min-height: 297mm;
  }
}
```

这个方案文字可复制，浏览器兼容性较好，但导出体验取决于用户浏览器。

---

## 10. 样式设计

### 10.1 色彩

建议沿用官方视觉：

```ts
export const arcColors = {
  anomaly: '#1F5EA8', // 蓝
  reality: '#E7A900', // 黄
  career: '#D21F3C', // 红
  ink: '#251744',
  muted: '#6B647C',
  paper: '#FFFFFF',
  softBlue: '#EAF2FB',
  softYellow: '#FFF6DE',
  softRed: '#FDE8ED',
};
```

### 10.2 页面尺寸

打印页建议：

```css
.print-page {
  width: 210mm;
  min-height: 297mm;
  padding: 16mm;
  background: white;
}
```

网页预览可以按 A4 比例居中显示。

---

## 11. 数据转换路线

### 11.1 从 Excel 到 JSON

如果继续使用 Excel 作为源数据，建议写一个脚本：

```txt
scripts/convert-xlsx-to-json.ts
```

职责：

1. 读取 Excel 的 date 表
2. 解析 A 区块
3. 解析 R 区块
4. 解析 C 区块
5. 输出三个 JSON 文件

安装：

```bash
npm install xlsx
npm install -D tsx
```

运行：

```bash
npx tsx scripts/convert-xlsx-to-json.ts
```

### 11.2 更推荐的维护方式

第一版可以人工把现有整理文本转为 JSON。

等工具跑通后，再写 Excel 转换脚本。

原因：

- 现在最重要的是验证产品流程
- Excel 表结构可能有合并单元格和隐藏公式
- 手工整理 JSON 更可控

---

## 12. Cloudflare Pages 部署

### 12.1 创建项目

推荐用 Vite React：

```bash
npm create vite@latest triangle-agency-card -- --template react-ts
cd triangle-agency-card
npm install
npm run dev
```

也可以使用 Cloudflare 官方 C3 创建 React Pages 项目：

```bash
npm create cloudflare@latest -- triangle-agency-card --framework=react --platform=pages
```

### 12.2 Cloudflare Pages 构建配置

在 Cloudflare Pages 中配置：

```txt
Build command: npm run build
Build output directory: dist
```

### 12.3 本地构建

```bash
npm run build
npm run preview
```

### 12.4 Git 部署

推荐流程：

1. 创建 GitHub 仓库
2. 推送代码
3. Cloudflare Pages 连接 GitHub 仓库
4. 设置构建命令和输出目录
5. 自动部署

### 12.5 Wrangler 直接上传

如果不想连接 GitHub，可以用 Direct Upload：

```bash
npm install -D wrangler
npm run build
npx wrangler pages deploy dist --project-name triangle-agency-card
```

---

## 13. Codex 开发任务拆分

可以把任务拆成适合 Codex 一步步完成的小任务。

### 阶段 1：项目骨架

目标：创建可运行的 React + TypeScript + Tailwind 项目。

任务：

1. 初始化 Vite React TS
2. 安装 Tailwind
3. 建立基础目录结构
4. 创建 App 布局
5. 创建假数据并显示

验收标准：

- `npm run dev` 可运行
- 页面能显示标题和基础布局
- 有 A / R / C 三个下拉框

---

### 阶段 2：数据结构

目标：建立正式 JSON 和 TypeScript 类型。

任务：

1. 创建 `types/arc.ts`
2. 创建 `data/anomalies.json`
3. 创建 `data/realities.json`
4. 创建 `data/careers.json`
5. 用 1 个 A、1 个 R、1 个 C 作为样例数据

验收标准：

- 下拉框选项来自 JSON
- 选择后能显示对应简介

---

### 阶段 3：完整 ARC 选择器

目标：实现 A / R / C 三个选择流程。

任务：

1. AnomalySelector
2. RealitySelector
3. CareerSelector
4. 选择卡 UI
5. 自动填充规则文本

验收标准：

- 选择 A 后显示 3 个能力
- 选择 R 后显示现实触发器、过载释放、问卷、人际关系问题
- 选择 C 后显示最高原则、许可行为、初始申领物

---

### 阶段 4：玩家填写表单

目标：允许用户填写个性化内容。

任务：

1. 基础信息表单
2. 能力问题答案选择
3. R 特殊问题填写
4. C 特殊问题填写
5. 入职问卷回答
6. 人际关系填写
7. 自我评估填写

验收标准：

- 所有输入都进入统一 formState
- 切换步骤不会丢失内容

---

### 阶段 5：角色卡预览

目标：把数据排版成可打印角色卡。

任务：

1. CharacterPreview
2. PrintablePage
3. OverviewPage
4. AnomalyPage
5. RealityPage
6. CareerPage
7. Print CSS

验收标准：

- 预览区显示 A4 页面
- 文本可读
- 页面分区清晰

---

### 阶段 6：导出 PDF

目标：实现一键导出。

任务：

1. ExportPdfButton
2. html2canvas + jsPDF 导出
3. 文件名使用角色姓名
4. 增加导出中 loading 状态

验收标准：

- 点击按钮能生成 PDF
- PDF 包含完整预览内容

---

### 阶段 7：本地保存和导入导出

目标：让玩家可以继续编辑。

任务：

1. localStorage 自动保存
2. 清空当前角色
3. 导出 JSON 存档
4. 导入 JSON 存档

验收标准：

- 刷新页面后数据仍在
- 可以导出并重新导入角色

---

### 阶段 8：部署

目标：部署到 Cloudflare Pages。

任务：

1. 添加构建脚本
2. 本地 `npm run build` 通过
3. 上传 GitHub
4. 配置 Cloudflare Pages
5. 测试线上访问和 PDF 导出

验收标准：

- 线上页面可访问
- 线上导出 PDF 可用

---

## 14. Codex Prompt 模板

### 14.1 初始化项目

```txt
请在当前仓库中创建一个 Vite + React + TypeScript 项目，用于开发三角机构 TRPG 角色卡生成器。请安装并配置 Tailwind CSS。建立 src/data、src/types、src/components、src/features、src/utils 目录。先实现一个首页，包含标题“特工入职清单”和 A/R/C 三个选择区域。不要实现 PDF 导出。
```

### 14.2 建立类型和假数据

```txt
请为三角机构角色生成器建立 TypeScript 类型。包括 Anomaly、Ability、Reality、Career、CharacterFormState、RelationshipEntry、QualityName。然后创建 anomalies.json、realities.json、careers.json，每个文件先放一个样例对象。让首页下拉框读取这些 JSON 并显示对应简介。
```

### 14.3 实现 A/R/C 选择

```txt
请实现 A/R/C 三个选择器组件。选择异常体后显示该异常体的 3 个能力卡；选择现实后显示现实触发器、过载释放、入职问卷和人际关系提示；选择职能后显示最高原则、3 条授权行为和初始申领物。请保持组件拆分清晰。
```

### 14.4 实现预览页

```txt
请实现 CharacterPreview，把当前角色表单状态排版成 4 个 A4 打印页：角色概览、异常能力、现实身份与人际关系、职能与入职问卷。请添加 print CSS，使每个 .print-page 在打印时分页。
```

### 14.5 实现 PDF 导出

```txt
请安装并使用 html2canvas 和 jsPDF，实现 ExportPdfButton。点击按钮时，将 CharacterPreview 区域导出为 A4 PDF。导出文件名使用角色姓名；如果没有角色姓名，则使用 triangle-agency-character.pdf。导出期间显示 loading 状态。
```

### 14.6 实现存档功能

```txt
请实现 localStorage 自动保存、清空角色、导出 JSON 存档、导入 JSON 存档功能。导入时需要做基本校验，避免损坏当前状态。
```

---

## 15. MVP 范围

第一版必须有：

- A/R/C 下拉选择
- 自动展示对应规则文本
- 玩家填写姓名、代词、问卷、人际关系
- 角色卡预览
- 导出 PDF
- localStorage 自动保存

第一版可以暂时没有：

- 登录系统
- 云端保存
- 多角色管理
- 官方 PDF 模板填字
- 移动端完美适配
- 复杂分页优化

---

## 16. 风险与注意事项

### 16.1 中文字体

html2canvas 截图导出通常能保留中文显示，但如果改用 jsPDF 直接写文字，需要嵌入中文字体，复杂度会增加。

建议第一版使用“截图式导出”。

### 16.2 长文本分页

ARC 文本很长，可能导致导出时分页截断。

解决方案：

- 每个大模块单独 `.print-page`
- 不要让一个能力卡跨页
- 长文本用更小字号
- 为超长简介提供“展开 / 收起”，导出时使用完整文本或摘要版本

### 16.3 版权与发布范围

如果这是公开发布工具，需要确认规则文本、翻译文本和官方视觉元素的使用权限。

技术上建议：

- 不直接使用官方 PDF 原图
- 页面注明这是非官方辅助工具，除非你拥有授权
- 支持用户自行导入数据包，以降低发布风险

### 16.4 数据维护

建议把数据和程序分离。

未来可以支持：

```txt
上传 data.json
选择规则数据包
导出自己的规则包
```

这样不同译本或房规可以共存。

---

## 17. 推荐开发顺序

最推荐路径：

```txt
1. React 项目骨架
2. 类型定义
3. 用 1 组 A/R/C 假数据跑通流程
4. 完成表单状态
5. 完成预览页
6. 完成 PDF 导出
7. 补全 9+9+9 数据
8. 部署 Cloudflare Pages
9. 优化样式和分页
```

不要一开始就录入全部数据。先用：

- A：时计
- R：海王
- C：研发

跑通完整流程，再补全其他 24 个选项。

---

## 18. 最小可运行版本定义

一个真正可用的 MVP 应该做到：

1. 用户进入页面
2. 填写角色姓名和代词
3. 选择一个 A
4. 选择一个 R
5. 选择一个 C
6. 自动展示所有对应文字
7. 用户填写 3 个入职问卷答案
8. 用户填写 3 段人际关系
9. 点击预览
10. 点击导出 PDF
11. 得到一份能用于跑团的角色卡

这就是第一阶段目标。

---

## 19. 后续扩展方向

第二阶段可以考虑：

- 更接近官方视觉的版式
- 多主题颜色
- 打印友好模式
- 手机端填写，桌面端导出
- 角色 JSON 分享链接
- 多角色管理
- GM 批量导出全队角色
- 自定义 A/R/C 数据包
- 从 Excel 自动转换 JSON
- 重新支持“填入官方 PDF 模板”

---

## 20. 项目一句话说明

这是一个基于前端静态数据的《三角机构》TRPG 角色生成器：用户按照官方“特工入职清单”选择 A / R / C，填写问卷和人际关系，系统自动排版并导出 PDF 角色卡。

