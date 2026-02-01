import { Header } from "@/components/cardus/header";
import { BottomNav } from "@/components/cardus/bottom-nav";
import { ShopFrames } from "@/components/cardus/shop-frames";
import { ShopStickers } from "@/components/cardus/shop-stickers";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <Header />
        <main className="pb-28 px-4 py-6">
          {/* Shop title — Clean Apple + Aura vibe */}
          <div className="mb-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              Shop
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Custom frames and stickers. Currency: Aura Points.
            </p>
          </div>

          {/* Card Frames — purchasable frames (Neon, Glitch, Retro + legend/rare/common/special) */}
          <ShopFrames />

          {/* Stickers for battle reactions */}
          <ShopStickers />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
