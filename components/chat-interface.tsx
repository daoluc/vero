"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

export function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        maxSteps: 5,
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(e);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto p-4">
            <div className="flex-1 p-4 mb-4">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-4 ${message.role !== "user" ? "flex-row" : "flex-row-reverse"
                                    }`}
                            >
                                <div
                                    className={`rounded-lg p-4 ${message.role === "assistant"
                                        ? "bg-muted"
                                        : message.role === "system"
                                            ? "bg-muted/50 italic"
                                            : "bg-primary text-primary-foreground"
                                        }`}
                                >
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                                code: ({ children }) => <code className="bg-muted-foreground/10 px-1 py-0.5 rounded text-sm">{children}</code>,
                                                pre: ({ children }) => <pre className="bg-muted-foreground/10 p-2 rounded mb-2 overflow-x-auto">{children}</pre>,
                                                blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/20 pl-4 italic mb-2">{children}</blockquote>,
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
} 