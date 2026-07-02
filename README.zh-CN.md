# AI Agent Contact App

[English](./README.md)

`ai-agent-contact-app` 是 AI Agent Contact 产品的 App 风格前端。

它通过对接 `ai-agent-contact` 后端，提供登录、智能体切换、会话浏览、聊天交互和模型设置等能力，强调轻量、移动端风格的产品体验。

## 项目定位

这个仓库不是静态演示页。

它是产品的 **App 风格交互层**，更适合：

- 移动端取向的界面结构
- 轻量化客服业务流程
- 快速验证 AI 客服产品体验

## 核心体验

### 登录与身份状态

- 登录页
- 本地登录态持久化
- 退出登录流程

### 智能体选择

- 展示可用智能体列表
- 在不同智能体之间切换
- 支持不同业务入口角色

### 会话与聊天

- 创建新会话
- 浏览历史会话
- 打开单个聊天会话
- 与 AI 客服智能体进行多轮对话
- 展示用户消息与 AI 回复

### 模型设置

- 按智能体配置模型参数
- 支持 `baseUrl`、`apiKey`、`model`

### App 页面

- 首页
- 业务页
- 个人中心
- 设置页

## 典型使用场景

- 搭建移动端风格的 AI 客服产品原型
- 演示多智能体 AI 客服在 App 界面中的交互体验
- 让业务团队快速对比不同智能体和模型效果
- 作为内部试用版本验证客服流程

## 适合谁使用

- 产品经理：需要演示移动端 / App 风格的 AI 客服体验
- 运营团队：验证入口、欢迎语、服务流程和转化链路
- 客服团队：测试 AI 客服在真实业务问答中的表现
- 设计师：查看 App 风格产品在真实代码中的落地效果
- 创新团队：以较低成本完成试点验证

## 主要页面

- `LoginScreen`
- `HomeScreen`
- `ChatsScreen`
- `ChatScreen`
- `AgentsScreen`
- `BizScreen`
- `ProfileScreen`
- `SettingsScreen`

## 技术栈

- React 19
- TypeScript
- Vite
- Zustand
- Tailwind CSS
- react-markdown

## 快速启动

### 环境要求

- Node.js
- npm
- 已启动的 `ai-agent-contact` 后端

### 安装

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

## 后端依赖

本项目依赖：

- `ai-agent-contact`

启动前需要确保后端接口可以正常访问。

## 搭配使用

建议配合以下仓库一起使用：

- [`ai-agent-contact`](https://github.com/BlueBloodFire/agent-contact-server)
- [`ai-agent-contact-client`](https://github.com/BlueBloodFire/agent-contact-client)
