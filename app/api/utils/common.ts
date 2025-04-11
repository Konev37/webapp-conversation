import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL, APP_ID } from '@/config'

export const getInfo = (request: NextRequest) => {
  return {
    sessionId: 'fixed_session', // 固定session ID
    user: 'shuzixiangcun',     // 固定用户标识
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
