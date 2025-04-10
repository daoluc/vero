import { ChatInterface } from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col bg-background">
      <header className="py-4 border-b bg-background z-10">
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
