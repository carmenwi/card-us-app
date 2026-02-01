import { Header } from "@/components/cardus/header";
import { BottomNav } from "@/components/cardus/bottom-nav";
import { TradeCentre } from "@/components/cardus/trade-centre";

export default function TradePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <Header />
        <main className="pb-28 px-4 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              Trade Centre
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              My Offers vs Incoming Trades. Select one of each to exchange.
            </p>
          </div>
          <TradeCentre />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
