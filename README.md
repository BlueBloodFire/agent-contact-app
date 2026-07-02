# AI Agent Contact App

[中文文档](./README.zh-CN.md)

`ai-agent-contact-app` is the mobile-style frontend of the AI Agent Contact product.

It connects to the `ai-agent-contact` backend and provides login, agent switching, conversation browsing, chat interaction, and model settings in a lightweight app-like experience.

## What It Is

This repository is not a static demo page.

It is the **app-style interaction layer** of the product, designed for:

- mobile-oriented interface structure
- lightweight customer service workflows
- fast experience validation for AI customer service scenarios

## Core Experience

### Login and Identity State

- Login screen
- Local auth state persistence
- Logout flow

### Agent Selection

- Show available agent list
- Switch between different agents
- Support different business entry roles

### Conversations and Chat

- Create new sessions
- Browse historical sessions
- Open a single chat session
- Run multi-turn conversations with AI customer service agents
- Render user messages and AI replies

### Model Settings

- Configure model settings per agent
- Support `baseUrl`, `apiKey`, and `model`

### App Pages

- Home
- Business
- Profile
- Settings

## Typical Use Cases

- Build a mobile-style AI customer service prototype
- Demonstrate multi-agent AI customer service on an app-like interface
- Let business teams compare different agent and model behaviors quickly
- Run internal pilot versions for support workflow validation

## Who It Is For

- Product managers who need to demo AI customer service on a mobile-style UI
- Operations teams validating entry flow, greeting logic, and service path design
- Customer support teams testing AI-assisted support interactions
- Designers reviewing how an app-style AI customer service product lands in real code
- Internal innovation teams running low-cost pilot experiments

## Main Screens

- `LoginScreen`
- `HomeScreen`
- `ChatsScreen`
- `ChatScreen`
- `AgentsScreen`
- `BizScreen`
- `ProfileScreen`
- `SettingsScreen`

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- Tailwind CSS
- react-markdown

## Quick Start

### Requirements

- Node.js
- npm
- a running `ai-agent-contact` backend

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Backend Dependency

This frontend depends on:

- `ai-agent-contact`

Make sure the backend APIs are available before running the app.

## Recommended Pairing

Use this repository together with:

- [`ai-agent-contact`](https://github.com/BlueBloodFire/agent-contact-server)
- [`ai-agent-contact-client`](https://github.com/BlueBloodFire/agent-contact-client)

## License

Licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.
