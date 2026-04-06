# Downloada Tool

## Overview

"Downloada Tool" — a mobile video & audio toolkit built with Expo (React Native). pnpm workspace monorepo with TypeScript.

## Artifacts

- **Mobile app**: `artifacts/downloada-tool` — Expo app with 8 tools
- **API Server**: `artifacts/api-server` — Express 5 backend (currently unused by mobile)

## Mobile App Tools

1. Video Downloader (YouTube, TikTok, etc.)
2. Audio Extractor (MP3)
3. Video Converter (MP3/MP4/AVI/MOV/WEBM/GIF)
4. Video Cutter (trim start/end)
5. Video Compressor
6. Merge Videos
7. Add Subtitles
8. Thumbnail Downloader

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Mobile**: Expo Router, React Native, AsyncStorage
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
