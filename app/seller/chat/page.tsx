'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getUsers, getOrders, getConversation, addMessage, generateId, getMessages } from '@/lib/store'
import type { User, ChatMessage } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SellerChatPage() {
  const { user } = useAuth()
  const [shoppers, setShoppers] = useState<User[]>([])
  const [activeShopper, setActiveShopper] = useState<User | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    // Show shoppers who ordered from this seller
    const orders = getOrders().filter((o) => o.sellerId === user.id)
    const shopperIds = [...new Set(orders.map((o) => o.shopperId))]
    const allUsers = getUsers()
    const s = allUsers.filter((u) => u.role === 'shopper' && shopperIds.includes(u.id))
    // Also include anyone who messaged the seller
    const msgs = getMessages()
    const msgShopperIds = msgs
      .filter((m) => m.receiverId === user.id || m.senderId === user.id)
      .map((m) => (m.senderId === user.id ? m.receiverId : m.senderId))
    const extra = allUsers.filter(
      (u) => u.role === 'shopper' && msgShopperIds.includes(u.id) && !shopperIds.includes(u.id)
    )
    const combined = [...s, ...extra]
    setShoppers(combined)
    if (combined.length > 0 && !activeShopper) setActiveShopper(combined[0])
  }, [user])

  useEffect(() => {
    if (!user || !activeShopper) return
    const load = () => setMessages(getConversation(user.id, activeShopper.id))
    load()
    const interval = setInterval(load, 2000)
    return () => clearInterval(interval)
  }, [user, activeShopper])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !user || !activeShopper) return
    const msg: ChatMessage = {
      id: generateId(),
      senderId: user.id,
      senderName: user.name,
      receiverId: activeShopper.id,
      content: text.trim(),
      createdAt: new Date().toISOString(),
    }
    addMessage(msg)
    setMessages((prev) => [...prev, msg])
    setText('')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">Chat with Customers</h2>

      <div className="flex gap-4 h-[560px]">
        {/* Sidebar */}
        <aside className="w-48 shrink-0 flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Customers</p>
          {shoppers.length === 0 && (
            <p className="text-sm text-muted-foreground">No customers yet.</p>
          )}
          {shoppers.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveShopper(s)}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors w-full',
                activeShopper?.id === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-secondary'
              )}
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate">{s.name}</p>
                {s.course && <p className="text-xs opacity-70">{s.course}</p>}
              </div>
            </button>
          ))}
        </aside>

        {/* Chat window */}
        <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {!activeShopper ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a customer to chat</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-border bg-secondary/50">
                <p className="font-semibold text-sm text-foreground">{activeShopper.name}</p>
                <p className="text-xs text-muted-foreground">{activeShopper.course || 'Shopper'}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No messages yet.</p>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed',
                          isMe
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-secondary text-foreground rounded-bl-sm'
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-border">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!text.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
