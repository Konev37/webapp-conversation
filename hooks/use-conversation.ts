import { useState } from 'react'
import produce from 'immer'
import { useGetState } from 'ahooks'
import type { ConversationItem } from '@/types/app'

export const storageConversationIdKey = 'conversationIdInfo'

type ConversationInfoType = Omit<ConversationItem, 'inputs' | 'id'>
function useConversation() {
  const [conversationList, setConversationList] = useState<ConversationItem[]>([])
  const [currConversationId, doSetCurrConversationId, getCurrConversationId] = useGetState<string>('-1')

  // 添加内存存储备份
  const memoryStorage = new Map()

  // when set conversation id, we do not have set appId
  const setCurrConversationId = (id: string, appId: string, isSetToLocalStroge = true, newConversationName = '') => {
    doSetCurrConversationId(id)
    if (isSetToLocalStroge && id !== '-1') {
      try {
        // 尝试使用localStorage
        const conversationIdInfo = globalThis.localStorage?.getItem(storageConversationIdKey)
          ? JSON.parse(globalThis.localStorage?.getItem(storageConversationIdKey) || '')
          : {}
        conversationIdInfo[appId] = id
        globalThis.localStorage?.setItem(storageConversationIdKey, JSON.stringify(conversationIdInfo))
      } catch (e) {
        // localStorage失败，使用内存存储
        console.warn('localStorage写入失败，使用内存存储', appId, id)
        memoryStorage.set(appId, id)
      }
    }
  }

  const getConversationIdFromStorage = (appId: string) => {
    try {
      const conversationIdInfo = globalThis.localStorage?.getItem(storageConversationIdKey)
        ? JSON.parse(globalThis.localStorage?.getItem(storageConversationIdKey) || '')
        : {}
      return conversationIdInfo[appId]
    } catch (e) {
      console.warn('无法访问localStorage，使用内存存储')
      return memoryStorage.get(appId) || null // 返回null表示没有找到有效会话
    }
  }

  const isNewConversation = currConversationId === '-1'
  // input can be updated by user
  const [newConversationInputs, setNewConversationInputs] = useState<Record<string, any> | null>(null)
  const resetNewConversationInputs = () => {
    if (!newConversationInputs)
      return
    setNewConversationInputs(produce(newConversationInputs, (draft) => {
      Object.keys(draft).forEach((key) => {
        draft[key] = ''
      })
    }))
  }
  const [existConversationInputs, setExistConversationInputs] = useState<Record<string, any> | null>(null)
  const currInputs = isNewConversation ? newConversationInputs : existConversationInputs
  const setCurrInputs = isNewConversation ? setNewConversationInputs : setExistConversationInputs

  // info is muted
  const [newConversationInfo, setNewConversationInfo] = useState<ConversationInfoType | null>(null)
  const [existConversationInfo, setExistConversationInfo] = useState<ConversationInfoType | null>(null)
  const currConversationInfo = isNewConversation ? newConversationInfo : existConversationInfo

  return {
    conversationList,
    setConversationList,
    currConversationId,
    getCurrConversationId,
    setCurrConversationId,
    getConversationIdFromStorage,
    isNewConversation,
    currInputs,
    newConversationInputs,
    existConversationInputs,
    resetNewConversationInputs,
    setCurrInputs,
    currConversationInfo,
    setNewConversationInfo,
    setExistConversationInfo,
  }
}

export default useConversation
