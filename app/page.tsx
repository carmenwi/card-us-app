import { Header } from "@/components/cardus/header";
import { BottomNav } from "@/components/cardus/bottom-nav";
import { StoriesRail } from "@/components/cardus/stories-rail";
import { FeedContent } from "@/components/cardus/feed-content";

const feedPosts = [
  {
    id: "1",
    username: "@luna_vibes",
    userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    cardImage: "/mock-images/card-photos/cat-sofa.png",
    rarity: "legendary" as const,
    title: "The Midnight Snacker",
    description: "Bro is living his best life on this couch. Aura +1200 for the cozy vibes.",
    stats: { charisma: 92, style: 88, nature: 85, aura: 1200 },
    likes: 12847,
    comments: 342,
    hasAudio: true,
    commentList: [
      { id: "c1", username: "@neon_rider", text: "Cat card supremacy fr", time: "2m" },
      { id: "c2", username: "@sunset_queen", text: "Boosted Luna no cap", time: "5m" },
      { id: "c3", username: "@pasta_lover", text: "This goes hard", time: "12m" },
    ],
  },
  {
    id: "2",
    username: "@neon_rider",
    userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    cardImage: "/mock-images/card-photos/outdoors-excursion.png",
    rarity: "special" as const,
    title: "Outdoor Adventurer",
    description: "POV: You stepped outside and chose life. Aura +850 for the vibes.",
    stats: { charisma: 78, style: 82, nature: 95, aura: 850 },
    likes: 8432,
    comments: 189,
    hasAudio: false,
    commentList: [
      { id: "c4", username: "@luna_vibes", text: "Outdoor vibes only", time: "1h" },
      { id: "c5", username: "@sunset_queen", text: "Need this frame", time: "2h" },
    ],
  },
  {
    id: "3",
    username: "@sunset_queen",
    userImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop",
    cardImage: "/mock-images/card-photos/lake.png",
    rarity: "rare" as const,
    title: "Serene Lake Vibes",
    description: "Bro really touched grass and found peace. Aura +650 for inner harmony.",
    stats: { charisma: 65, style: 70, nature: 92, aura: 650 },
    likes: 4521,
    comments: 98,
    hasAudio: true,
    commentList: [
      { id: "c6", username: "@pasta_lover", text: "Lake day energy", time: "30m" },
    ],
  },
  {
    id: "4",
    username: "@pasta_lover",
    userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    cardImage: "/mock-images/card-photos/pasta.JPG",
    rarity: "common" as const,
    title: "Chef Mode Activated",
    description: "Serving looks and carbs. Aura +200 for the effort.",
    stats: { charisma: 45, style: 55, nature: 40, aura: 200 },
    likes: 892,
    comments: 24,
    hasAudio: false,
    commentList: [
      { id: "c7", username: "@luna_vibes", text: "Pasta night when", time: "3h" },
      { id: "c8", username: "@neon_rider", text: "Chef mode", time: "4h" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <Header />
        <main className="pb-28">
          <StoriesRail />
          <FeedContent feedPosts={feedPosts} />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}