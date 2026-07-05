import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import OpenAI from 'openai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

// 允许前端跨域访问
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json())

// ─── 工具函数：读写 JSON 文件 ───────────────────────────────────────────────

function readData(filename) {
  const path = join(__dirname, 'data', filename)
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function writeData(filename, data) {
  const path = join(__dirname, 'data', filename)
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
}

function nextId(list) {
  return list.length === 0 ? 1 : Math.max(...list.map((item) => item.id)) + 1
}

// ─── 任务 API (/api/tasks) ──────────────────────────────────────────────────

// 获取所有任务
app.get('/api/tasks', (req, res) => {
  res.json(readData('tasks.json'))
})

// 创建任务
app.post('/api/tasks', (req, res) => {
  const tasks = readData('tasks.json')
  const newTask = {
    ...req.body,
    id: nextId(tasks),
    createdAt: new Date().toISOString(),
  }
  tasks.push(newTask)
  writeData('tasks.json', tasks)
  res.status(201).json(newTask)
})

// 更新任务
app.patch('/api/tasks/:id', (req, res) => {
  const tasks = readData('tasks.json')
  const id = Number(req.params.id)
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return res.status(404).json({ message: '任务不存在' })
  tasks[index] = { ...tasks[index], ...req.body, id }
  writeData('tasks.json', tasks)
  res.json(tasks[index])
})

// 删除任务
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readData('tasks.json')
  const id = Number(req.params.id)
  const filtered = tasks.filter((t) => t.id !== id)
  if (filtered.length === tasks.length) return res.status(404).json({ message: '任务不存在' })
  writeData('tasks.json', filtered)
  res.status(204).send()
})

// ─── 日程事件 API (/api/events) ─────────────────────────────────────────────

app.get('/api/events', (req, res) => {
  res.json(readData('events.json'))
})

app.post('/api/events', (req, res) => {
  const events = readData('events.json')
  const newEvent = { ...req.body, id: nextId(events) }
  events.push(newEvent)
  writeData('events.json', events)
  res.status(201).json(newEvent)
})

app.patch('/api/events/:id', (req, res) => {
  const events = readData('events.json')
  const id = Number(req.params.id)
  const index = events.findIndex((e) => e.id === id)
  if (index === -1) return res.status(404).json({ message: '事件不存在' })
  events[index] = { ...events[index], ...req.body, id }
  writeData('events.json', events)
  res.json(events[index])
})

app.delete('/api/events/:id', (req, res) => {
  const events = readData('events.json')
  const id = Number(req.params.id)
  const filtered = events.filter((e) => e.id !== id)
  if (filtered.length === events.length) return res.status(404).json({ message: '事件不存在' })
  writeData('events.json', filtered)
  res.status(204).send()
})

// ─── AI 接口（占位，返回模拟数据）──────────────────────────────────────────
// ─── AI 建议接口 ──────────────────────────────────────────
app.post('/api/ai/suggestions', async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个任务管理助手。根据用户的任务情况，给出3条简短实用的建议（每条不超过30字）。必须以如下JSON格式返回：{"suggestions":["建议1","建议2","建议3"]}',
        },
        {
          role: 'user',
          content: JSON.stringify(req.body),
        },
      ],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content)
    res.json({ suggestions: result.suggestions ?? [] })
  } catch (error) {
    console.error('AI 建议请求失败：', error)
    res.status(500).json({ error: 'AI 服务暂时不可用' })
  }
})

// ─── AI 对话接口 ──────────────────────────────────────────
app.post('/api/ai/messages', async (req, res) => {
  try {
    const dateStr = new Date().toLocaleDateString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
    })
    const { messages, context } = req.body
    let systemContent = `你是一个智能任务仪表盘助手，可以回答用户问题，也可以直接帮用户操作任务和日程。当前日期：${dateStr}。

## 可用操作
当用户要求你"安排"、"创建"、"添加"任务或日程时，你必须在回复末尾附加一个 JSON 操作块，格式如下（在正常回复文字之后另起一行）：

创建任务：
\`\`\`action
{"action":"create_task","payload":{"title":"任务标题","description":"可选描述","priority":"low|medium|high","status":"todo","dueDate":"YYYY-MM-DD或留空字符串"}}
\`\`\`

创建日程：
\`\`\`action
{"action":"create_event","payload":{"title":"事件标题","start":"YYYY-MM-DDTHH:mm:ss","end":"YYYY-MM-DDTHH:mm:ss","description":"可选描述"}}
\`\`\`

## 规则
- **创建任务前必须确认优先级**：如果用户没有明确说明优先级（高/中/低），必须先询问"请问这个任务的优先级是高、中还是低？"，等用户回答后再创建，不得擅自假设
- priority 只能是 low（低）、medium（中）、high（高）之一
- status 固定为 todo
- dueDate 若用户未指定则填空字符串 ""
- 操作块必须是合法 JSON，放在 \`\`\`action 代码块中
- 每次回复最多包含一个操作块
- 非操作类对话正常回答，不附加操作块`

    if (context?.tasks?.length) {
      systemContent += `\n\n用户当前的任务列表：\n${JSON.stringify(context.tasks, null, 2)}`
    }
    if (context?.events?.length) {
      systemContent += `\n\n用户当前的日程列表：\n${JSON.stringify(context.events, null, 2)}`
    }
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemContent },
        ...messages,
      ],
    })

    const rawReply = completion.choices[0].message.content

    // 提取 action 块
    const actionMatch = rawReply.match(/```action\s*([\s\S]*?)```/)
    let action = null
    let reply = rawReply

    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1].trim())
        // 从展示文本中去掉 action 块
        reply = rawReply.replace(/```action[\s\S]*?```/, '').trim()
      } catch {
        // JSON 解析失败就忽略
      }
    }

    res.json({ reply, action })
  } catch (error) {
    console.error('AI 对话请求失败：', error)
    res.status(500).json({ error: 'AI 服务暂时不可用' })
  }
})

// ─── 启动服务器 ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`✅ 后端服务已启动：http://localhost:${PORT}`)
  console.log(`   任务 API：http://localhost:${PORT}/api/tasks`)
  console.log(`   事件 API：http://localhost:${PORT}/api/events`)
})
