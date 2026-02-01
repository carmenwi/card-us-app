"use client";

import { useState, useEffect } from "react";
import { FilterTabs, type FeedTab } from "./filter-tabs";
import { WeeklyChallenge } from "./weekly-challenge";
import { BattleWidget } from "./battle-widget";
import { CardPost } from "./card-post";
import { DiscoverSection } from "./discover-section";
import type { CardRarity } from "@/lib/rarity";

import type { PostComment } from "./card-post";

export interface FeedPost {
  id: string;
  username: string;
  userImage: string;
  cardImage: string;
  rarity: CardRarity;
  title: string;
  description: string;
  stats: { charisma: number; style: number; nature: number; aura: number };
  likes: number;
  comments: number;
  hasAudio?: boolean;
  commentList?: PostComment[];
}

interface FeedContentProps {
  feedPosts: FeedPost[];
}

export function FeedContent({ feedPosts }: FeedContentProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>("Battles");
  const [pendingBattle, setPendingBattle] = useState<any>(null);

  useEffect(() => {
    // Check for pending battle from URL param
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as FeedTab;
    if (tab) {
      setActiveTab(tab);
    }

    // Load pending battle from localStorage
    const battle = localStorage.getItem('cardus-pending-battle');
    if (battle) {
      setPendingBattle(JSON.parse(battle));
      localStorage.removeItem('cardus-pending-battle');
    }
  }, []);

  return (
    <>
      <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "Battles" && (
        <>
          <WeeklyChallenge />
          {pendingBattle && <BattleWidget battleData={pendingBattle} />}
          <BattleWidget />
          {/* Optional: more battle widgets could go here */}
        </>
      )}
      {activeTab === "Cards" && (
        <>
          {feedPosts.map((post) => (
            <CardPost
              key={post.id}
              postId={post.id}
              username={post.username}
              userImage={post.userImage}
              cardImage={post.cardImage}
              rarity={post.rarity}
              title={post.title}
              description={post.description}
              stats={post.stats}
              likes={post.likes}
              comments={post.comments}
              hasAudio={post.hasAudio}
              commentList={post.commentList}
            />
          ))}
        </>
      )}
      {activeTab === "Discover" && <DiscoverSection />}
    </>
  );
}
