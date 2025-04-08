import { ChatInterface } from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <h1 className="text-3xl font-bold text-center">Vero</h1>
        <ChatInterface />
      </div>
    </main>
  );
}
