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
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="space-y-4 p-4">
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
                                                a: ({ href, children }) => (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary underline hover:text-primary/80 inline-flex items-center gap-1"
                                                    >
                                                        {children}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                            <polyline points="15 3 21 3 21 9"></polyline>
                                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                                        </svg>
                                                    </a>
                                                ),
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
            <form onSubmit={onSubmit} className="flex gap-2 p-4 border-t bg-background sticky bottom-0">
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