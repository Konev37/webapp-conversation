import React, { useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
// import Card from './card'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  onDelete: (id: string) => void
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
  onDelete,
}) => {
  const { t } = useTranslation()
  // 添加状态来跟踪哪个对话正在等待确认删除
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

  // 处理删除点击事件
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡

    if (confirmingDeleteId === id) {
      // 如果已经在确认状态，执行真正的删除操作
      onDelete(id)
      setConfirmingDeleteId(null)
    }
    else {
      // 首次点击，设置为确认状态
      setConfirmingDeleteId(id)
    }
  }

  return (
    <div
      className="shrink-0 flex flex-col overflow-y-auto bg-white pc:w-[244px] tablet:w-[192px] mobile:w-[240px] border-r border-gray-200 tablet:h-[calc(100vh_-_3rem)] mobile:h-screen"
    >
      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 p-4 !pb-0">
          <Button
            onClick={() => { onCurrentIdChange('-1') }}
            className="group block w-full flex-shrink-0 !justify-start !h-9 text-primary-600 items-center text-sm">
            <PencilSquareIcon className="mr-2 h-4 w-4" /> {t('app.chat.newChat')}
          </Button>
        </div>
      )}

      <nav className="mt-4 flex-1 space-y-1 bg-white p-4 !pt-0">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon
            = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          const isConfirmingDelete = confirmingDeleteId === item.id

          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              className={classNames(
                isCurrent
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
                'group flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium cursor-pointer',
              )}
            >
              <div className="flex items-center overflow-hidden">
                <ItemIcon
                  className={classNames(
                    isCurrent
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0',
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </div>

              {isConfirmingDelete ? (
                // 显示确认删除按钮
                <div
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium opacity-100"
                  onClick={e => handleDeleteClick(item.id, e)}
                >
                  {t('app.common.confirmDelete')}
                </div>
              ) : (
                // 显示正常的删除图标
                <TrashIcon
                  className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
                  onClick={e => handleDeleteClick(item.id, e)}
                />
              )}
            </div>
          )
        })}
      </nav>
      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
