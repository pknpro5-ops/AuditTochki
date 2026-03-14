'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MESSAGE = 'Здравствуйте! Я AI-консультант по нормативам для общепита. Задайте вопрос о требованиях к помещению, заполнении формы аудита или открытии кафе/ресторана.'

const QUICK_QUESTIONS = [
  'Какие требования к вентиляции?',
  'Как заполнить форму аудита?',
  'Минимальная площадь для кафе',
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen, scrollToBottom])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim().slice(0, 500),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setHasInteracted(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      // Build messages array for API (exclude welcome message)
      const apiMessages = [...messages.filter((m) => m.id !== 'welcome'), userMessage].map(
        (m) => ({ role: m.role, content: m.content })
      )

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
          },
        ])
      } else if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: 'Слишком много сообщений. Подождите немного и попробуйте снова.',
          },
        ])
      } else {
        throw new Error('API error')
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Не удалось получить ответ. Проверьте подключение к интернету и попробуйте ещё раз.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 80) + 'px'
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 hover:brightness-110 transition-all hover:scale-105 flex items-center justify-center animate-scale-in"
          aria-label="Открыть чат с консультантом"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed z-[90] inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px] flex flex-col bg-[var(--background)] sm:rounded-2xl sm:border sm:border-[var(--border)] shadow-2xl animate-slide-up sm:animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--primary)] text-white sm:rounded-t-2xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">AI-Консультант</div>
                <div className="text-xs text-white/70">Нормативы общепита</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Закрыть чат"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[var(--primary)] text-white rounded-2xl rounded-br-sm'
                      : 'bg-[var(--muted)] text-[var(--foreground)] rounded-2xl rounded-bl-sm border border-[var(--border)]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[var(--muted)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="typing-dot w-2 h-2 rounded-full bg-[var(--muted-foreground)]" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-[var(--muted-foreground)]" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-[var(--muted-foreground)]" />
                </div>
              </div>
            )}

            {/* Quick questions */}
            {!hasInteracted && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 py-3 border-t border-[var(--border)] bg-[var(--background)]">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Задайте вопрос..."
                maxLength={500}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors placeholder:text-[var(--muted-foreground)]"
                style={{ maxHeight: '80px' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Отправить"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="mt-1.5 text-[10px] text-[var(--muted-foreground)] text-center">
              AI-ответы носят справочный характер и не заменяют консультацию специалиста
            </div>
          </div>
        </div>
      )}
    </>
  )
}
