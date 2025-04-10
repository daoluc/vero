import { ChatInterface } from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-background">
      <header className="py-4 border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">Vero</h1>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
