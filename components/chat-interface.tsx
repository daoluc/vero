"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
    role: "user" | "assistant" | "thinking";
    content: string;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Add thinking message
        const thinkingMessage: Message = { role: "thinking", content: "Thinking..." };
        setMessages((prev) => [...prev, thinkingMessage]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            // Remove thinking message and add assistant message
            setMessages((prev) => {
                const filteredMessages = prev.filter(msg => msg.role !== "thinking");
                return [...filteredMessages, { role: "assistant", content: data.message }];
            });
        } catch (error) {
            console.error("Error:", error);
            // Remove thinking message and add error message
            setMessages((prev) => {
                const filteredMessages = prev.filter(msg => msg.role !== "thinking");
                return [...filteredMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto p-4">
            <div className="flex-1 p-4 mb-4">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-4 ${message.role != "user" ? "flex-row" : "flex-row-reverse"
                                    }`}
                            >
                                <div
                                    className={`rounded-lg p-4 ${message.role === "assistant"
                                        ? "bg-muted"
                                        : message.role === "thinking"
                                            ? "bg-muted/50 italic"
                                            : "bg-primary text-primary-foreground"
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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