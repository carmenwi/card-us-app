import { Header } from "@/components/cardus/header";
import { BottomNav } from "@/components/cardus/bottom-nav";
import { CreateCardForm } from "@/components/cardus/create-card-form";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <Header />
        <main className="pb-28 px-4 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              Create Card
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a photo and the AI will analyze your aura to generate the card.
            </p>
          </div>
          <CreateCardForm />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
