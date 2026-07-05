# 智能个人仪表盘

> 基于 Vue 3 + TypeScript 的前后端分离智能任务管理平台，集成 AI 助手、日程管理、数据可视化等功能。

---
## 静态预览：https://qwqsu.github.io/Intelligent-Task-Dashboard/

## 项目预览

| 模块 | 功能 |
|------|------|
| 仪表盘 | 今日任务概览、天气、数据统计 |
| 任务管理 | 增删改查、状态流转、AI 优先级建议 |
| 日程管理 | 日历视图、事件创建与提醒 |
| AI 助手 | 自然语言创建任务/日程、对话分析 |
| 数据可视化 | 任务完成率、时间分布图表 |
| 用户设置 | 主题切换、布局自定义、通知配置 |

---

## 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| [Vue 3](https://vuejs.org/) | 核心框架（Composition API） |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Vite](https://vitejs.dev/) | 构建工具与开发服务器 |
| [Pinia](https://pinia.vuejs.org/) | 状态管理 |
| [Vue Router](https://router.vuejs.org/) | 前端路由 |
| [Axios](https://axios-http.com/) | HTTP 请求 |
| [Element Plus](https://element-plus.org/) | UI 组件库 |
| [ECharts](https://echarts.apache.org/) | 数据可视化图表 |
| [Day.js](https://day.js.org/) | 日期处理 |

### 后端

| 技术 | 用途 |
|------|------|
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | HTTP 服务器 |
| [DeepSeek API](https://www.deepseek.com/) | AI 对话与任务操作（OpenAI 兼容接口） |
| JSON 文件 | 轻量数据持久化（tasks.json / events.json） |
| dotenv | 环境变量管理 |

---

## 文件结构

```
智慧任务仪表盘/
├── 智能任务仪表盘/          # 前端（Vite + Vue 3）
│   ├── src/
│   │   ├── api/             # Axios 请求封装
│   │   │   ├── aiApi.ts     # AI 对话接口（支持 action 指令解析）
│   │   │   ├── taskApi.ts   # 任务 CRUD
│   │   │   └── calendarApi.ts
│   │   ├── components/      # 可复用组件
│   │   │   ├── AI/
│   │   │   │   ├── AIInput.vue          # 对话输入框
│   │   │   │   ├── AISuggestions.vue    # 消息列表 + 快捷提示
│   │   │   │   └── AINotifications.vue
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardHeader.vue
│   │   │   │   ├── TaskSummary.vue
│   │   │   │   ├── CalendarOverview.vue
│   │   │   │   ├── StatsChart.vue
│   │   │   │   └── WeatherWidget.vue
│   │   │   ├── Tasks/
│   │   │   │   ├── TaskList.vue
│   │   │   │   ├── TaskItem.vue
│   │   │   │   ├── TaskForm.vue
│   │   │   │   └── AIPrioritySuggestion.vue
│   │   │   ├── Calendar/
│   │   │   │   ├── CalendarView.vue
│   │   │   │   ├── EventItem.vue
│   │   │   │   └── EventForm.vue
│   │   │   ├── Analytics/
│   │   │   │   ├── LineChart.vue
│   │   │   │   ├── BarChart.vue
│   │   │   │   └── PieChart.vue
│   │   │   └── Settings/
│   │   │       ├── ThemeToggle.vue
│   │   │       ├── LayoutSelector.vue
│   │   │       └── NotificationSettings.vue
│   │   ├── store/           # Pinia 状态管理
│   │   │   ├── taskStore.ts
│   │   │   ├── calendarStore.ts
│   │   │   ├── aiStore.ts
│   │   │   └── userStore.ts
│   │   ├── views/           # 页面级组件
│   │   │   ├── DashboardView.vue
│   │   │   ├── TaskView.vue
│   │   │   ├── CalendarView.vue
│   │   │   ├── AIAssistantView.vue
│   │   │   ├── AnalyticsView.vue
│   │   │   ├── SettingsView.vue
│   │   │   └── LoginView.vue
│   │   ├── router/
│   │   │   └── index.ts
│   │   ├── assets/
│   │   │   └── main.css
│   │   └── main.ts
│   ├── .env                 # 环境变量（VITE_API_BASE_URL 等）
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json
│
└── smart-dashboard-server/  # 后端（Node.js + Express）
    ├── data/
    │   ├── tasks.json        # 任务数据
    │   └── events.json       # 日程数据
    ├── server.js             # 主服务入口（所有路由）
    ├── .env                  # DEEPSEEK_API_KEY、PORT
    ├── .env.example
    └── package.json
```

---

## 路由说明

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 重定向 → `/dashboard` | |
| `/dashboard` | 仪表盘 | 总览页 |
| `/tasks` | 任务管理 | 任务列表与表单 |
| `/calendar` | 日程管理 | 日历与事件 |
| `/ai-assistant` | AI 助手 | 对话式操作 |
| `/analytics` | 数据分析 | 图表统计 |
| `/settings` | 设置 | 主题与偏好 |

---

## 本地运行

### 1. 启动后端

```bash
cd smart-dashboard-server
npm install
# 配置环境变量
cp .env.example .env
# 填入 DEEPSEEK_API_KEY
npm run dev
# 服务运行在 http://localhost:3000
```

### 2. 启动前端

```bash
cd 智能任务仪表盘
npm install
cp .env.example .env
# 确认 VITE_API_BASE_URL=http://localhost:3000/api
npm run dev
# 访问 http://localhost:5173
```

---

## 环境变量

### 前端 `.env`

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AI_API_BASE_URL=http://localhost:3000/api
```

### 后端 `.env`

```env
DEEPSEEK_API_KEY=your_api_key_here
PORT=3000
```

---

## AI 助手工作原理

AI 助手支持自然语言操作，通过后端 Prompt 工程实现结构化指令解析：

```
用户输入 → 发送对话历史 + 任务/日程上下文给 DeepSeek
         → AI 回复纯文本 + 可选的 ```action 指令块
         → 前端解析指令块，调用对应 Store 方法执行操作
         → 右上角弹出通知确认执行结果
```

支持的操作指令：

| 指令 | 触发词示例 |
|------|-----------|
| `create_task` | "安排一个…任务"、"帮我添加…" |
| `create_event` | "创建日程"、"安排会议" |

创建任务时，若用户未指明优先级，AI 会主动询问（高 / 中 / 低）再执行创建。
