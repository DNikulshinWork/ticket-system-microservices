import { CreateTicketForm } from "@/features/tickets/create-ticket";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-800">🎫 Ticket System</h1>
        <p className="text-center text-slate-600 mb-8">Next.js → API Gateway (Kafka) → Ticket Service → PostgreSQL</p>
        <CreateTicketForm />
      </div>
    </main>
  );
}