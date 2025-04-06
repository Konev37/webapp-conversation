import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')

  try {
    const { data }: any = await client.getConversationMessages(user, conversationId as string)
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  } catch (error: any) {
    console.error('获取会话消息失败:', error)

    // 返回适当的错误响应，而不是让服务器崩溃
    return NextResponse.json({
      data: [],
      error: error.message || '获取会话消息失败'
    }, {
      status: error.status || 500,
      headers: setSession(sessionId)
    })
  }
}
