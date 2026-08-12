# DAYFLOW · 智慧任务仪表盘

> 一个面向年轻规划者的个人任务工作区：把任务、日程、复盘和 AI 助手放在同一个轻量的工作流里。

[在线预览](https://qwqsu.github.io/Intelligent-Task-Dashboard/)

## 项目亮点

- **平面而有温度的视觉系统**：纸张底色、深墨侧栏、苔绿主色、珊瑚提醒色；去掉渐变按钮、毛玻璃和满屏大圆角卡片，强调信息层级与阅读节奏。
- **今日工作台**：仪表盘集中展示今日完成度、待办任务、近期日程、天气状态和任务统计。
- **任务收集与筛选**：支持搜索、优先级筛选、优先级/截止时间/创建时间排序，以及“今天 / 逾期”范围筛选。
- **日程规划**：月历查看、选中日期详情、回到今天、双击日期创建日程，并校验结束时间必须晚于开始时间。
- **复盘视图**：状态分布、优先级分布、完成趋势和逾期任务指标；已完成任务会记录 `completedAt`，趋势不再误用创建时间。
- **AI 助手**：通过自然语言创建任务或日程；前端会校验结构化指令，支持 `Ctrl/Cmd + Enter` 发送，并在 API 不可用时保留当前对话。
- **可配置工作区**：亮色/暗色主题、标准/紧凑布局、通知偏好和头像设置；任务与日程有本地持久化兜底。
- **响应式布局**：桌面侧栏、移动端底部导航，任务工具栏与日历在小屏幕上自动重排。

## 技术栈

### 前端

| 技术 | 用途 |
| --- | --- |
| [Vue 3](https://vuejs.org/) | Composition API 与组件化 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Vite](https://vitejs.dev/) | 开发服务器与构建 |
| [Pinia](https://pinia.vuejs.org/) | 全局状态和持久化 |
| [Vue Router](https://router.vuejs.org/) | 页面路由与登录守卫 |
| [Element Plus](https://element-plus.org/) | 基础表单与交互组件 |
| [ECharts](https://echarts.apache.org/) | 统计图表 |
| [Axios](https://axios-http.com/) | API 请求 |
| [Day.js](https://day.js.org/) | 本地日期、逾期与趋势计算 |

### 后端

| 技术 | 用途 |
| --- | --- |
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | REST API 服务 |
| [DeepSeek API](https://www.deepseek.com/) | AI 对话与结构化操作解析 |
| JSON 文件 | 轻量任务/日程持久化，便于本地演示 |
| CORS + dotenv | 跨域配置与环境变量管理 |

## 项目结构

```text
智慧任务仪表盘/
├─ Intelligent-Task-Dashboard/           # 前端 Vue 3 + Vite
│  ├─ src/api/                            # 任务、日程、AI 请求封装
│  ├─ src/components/                     # Dashboard、Tasks、Calendar、Analytics 等组件
│  ├─ src/store/                          # Pinia 状态、持久化和业务派生数据
│  ├─ src/views/                          # 仪表盘、任务、日程、复盘、助手、设置、登录
│  ├─ src/router/                         # 动态路由与登录守卫
│  ├─ src/assets/main.css                 # Dayflow 全局视觉变量与响应式样式
│  ├─ DESIGN.md                           # 视觉与交互说明
│  └─ .env.example                        # 前端环境变量示例
└─ Intelligent-Task-Dashboard-server/    # Node.js + Express
   ├─ data/tasks.json                     # 演示任务数据
   ├─ data/events.json                    # 演示日程数据
   ├─ server.js                           # API 与 AI 接口
   └─ .env.example                        # 后端环境变量示例
```

## 预览

<img width="1280" height="636" alt="PixPin_2026-08-12_14-37-56" src="https://github.com/user-attachments/assets/e3eef231-bac9-43c9-be55-fa786fe9a27b" />
<img width="1280" height="636" alt="PixPin_2026-08-12_14-39-04" src="https://github.com/user-attachments/assets/68b0074f-4534-4734-8b4a-a983a04d9922" />
<img width="1280" height="636" alt="PixPin_2026-08-12_14-39-35" src="https://github.com/user-attachments/assets/848365dd-54d2-46fe-bee5-511c9a7057d2" />
<img width="1280" height="636" alt="PixPin_2026-08-12_14-40-04" src="https://github.com/user-attachments/assets/d3a1e079-47a2-4920-8d87-a4cd32bcf8f6" />
<img width="1280" height="636" alt="PixPin_2026-08-12_14-40-18" src="https://github.com/user-attachments/assets/ea05505c-bf71-466b-810d-5258a653d00b" />




## 本地运行

### 1. 启动后端

```bash
cd Intelligent-Task-Dashboard-server
npm install
copy .env.example .env       # Windows；macOS/Linux 可使用 cp
# 在 .env 中填写 DEEPSEEK_API_KEY（不使用 AI 功能时可暂不填写）
npm run dev
# API 默认运行在 http://localhost:3000
```

### 2. 启动前端

```bash
cd Intelligent-Task-Dashboard
npm install
copy .env.example .env       # Windows；macOS/Linux 可使用 cp
npm run dev
# 浏览器访问 http://localhost:5173
```

如果前端使用 `http://127.0.0.1:5173` 打开，后端也已在开发环境 CORS 白名单中支持该地址。

## 常用命令

在 `Intelligent-Task-Dashboard` 目录中执行：

```bash
npm run dev          # 启动前端开发服务器
npm run type-check   # Vue + TypeScript 类型检查
npm run build        # 类型检查并构建生产包
npm run preview      # 预览生产构建
```

在 `Intelligent-Task-Dashboard-server` 目录中执行：

```bash
npm run dev          # nodemon 开发模式
npm start            # Node.js 生产模式
```

## 环境变量

前端 `.env`：

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AI_API_BASE_URL=http://localhost:3000/api
```

后端 `.env`：

```env
DEEPSEEK_API_KEY=your_api_key_here
PORT=3000
```

## 演示账号

- 用户名：`admin`
- 密码：`123456`

项目内置的演示任务和日程围绕“作品集、学习、运动、复盘”组织，方便直接打开页面展示完整状态、今天筛选和日历事件。真实使用时，任务和日程会优先从后端加载，接口暂时不可用时保留本地数据。

## AI 操作流程

用户输入会连同任务/日程上下文发送给后端 AI 接口。后端返回普通回复和可选的结构化指令，前端解析指令后调用对应 Store：

```text
自然语言输入
  -> 后端携带上下文请求 DeepSeek
  -> 返回文字回复 + create_task/create_event 指令
  -> 前端校验字段和时间关系
  -> 调用任务/日程 API 并刷新工作区
```

支持的结构化操作：

| 指令 | 示例 |
| --- | --- |
| `create_task` | “明天提醒我整理作品集，设为高优先级” |
| `create_event` | “周五晚上七点安排一小时复盘” |

