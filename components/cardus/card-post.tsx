"use client";

import {
  Volume2,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  X,
  Sparkles,
  Sword,
  ArrowRightLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  type CardRarity,
  RARITY_STYLES,
  RARITY_LABELS,
  FRAME_GRADIENT,
  FRAME_PADDING,
} from "@/lib/rarity";
import { loadProfileData } from "@/lib/profile-data";
import { FlippableCard, type CardStatsData } from "./flippable-card";
import { useCardStore } from "@/context/card-store";

export interface PostComment {
  id: string;
  username: string;
  text: string;
  time: string;
}

interface CardPostProps {
  postId: string;
  username: string;
  userImage: string;
  cardImage: string;
  rarity: CardRarity;
  likes: number;
  comments: number;
  hasAudio?: boolean;
  commentList?: PostComment[];
  title?: string;
  description?: string;
  stats?: {
    charisma: number;
    style: number;
    nature: number;
    aura: number;
  };
}

/** Same aspect as card display. */
const CARD_ASPECT = "aspect-[3/4]";

export function CardPost({
  postId,
  username,
  userImage,
  cardImage,
  rarity,
  likes,
  comments,
  hasAudio = false,
  commentList: initialComments = [],
  title = "Unknown Card",
  description = "No description",
  stats = { charisma: 50, style: 50, nature: 50, aura: 0 },
}: CardPostProps) {
  const { addCardToCollection } = useCardStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showCommentPanel, setShowCommentPanel] = useState(false);
  const [commentsList, setCommentsList] = useState<PostComment[]>(initialComments);
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [userCards, setUserCards] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUsername(loadProfileData().username);
    }
  }, []);

  useEffect(() => {
    if ((showBattleModal || showTradeModal) && typeof window !== "undefined") {
      const cardStore = localStorage.getItem("cardus-store");
      if (cardStore) {
        const store = JSON.parse(cardStore);
        // Flatten all cards from all collections
        const allCards: any[] = [];
        if (store.savedCardsByCollection) {
          Object.values(store.savedCardsByCollection).forEach((cards: any) => {
            if (Array.isArray(cards)) {
              allCards.push(...cards);
            }
          });
        }
        setUserCards(allCards);
      }
    }
  }, [showBattleModal, showTradeModal]);

  const style = RARITY_STYLES[rarity];
  const frameGradient = FRAME_GRADIENT[rarity];
  const totalComments = commentsList.length;

  const cardData: CardStatsData = {
    title,
    stats,
    description,
    rarity,
    cardImage,
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleAddComment = () => {
    const text = newCommentText.trim();
    if (!text || !currentUsername) return;
    setCommentsList((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        username: currentUsername,
        text,
        time: "now",
      },
    ]);
    setNewCommentText("");
  };

  return (
    <article className="mx-4 mb-4 bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-0.5 rounded-full bg-gradient-to-br", style.ring)}>
            <img
              src={userImage || "/placeholder.svg"}
              alt={username}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-card"
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{username}</p>
            <p className="text-xs text-muted-foreground">Just dropped a new card</p>
          </div>
        </div>
        <button
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Card with programmatic frame (thicker border) */}
      <div className={cn("mx-4 rounded-2xl", FRAME_PADDING, frameGradient)}>
        <div className="relative">
          <FlippableCard data={cardData} className={cn("rounded-[10px]", CARD_ASPECT)} size="lg" />
        </div>
      </div>

      {/* Comment panel — slide-out or inline */}
      {showCommentPanel && (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-muted/80 dark:bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Comments</span>
            <button
              type="button"
              onClick={() => setShowCommentPanel(false)}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Close comments"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground">No comments yet.</p>
            ) : (
              commentsList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setExpandedCommentId(expandedCommentId === c.id ? null : c.id)
                  }
                  className="w-full text-left block rounded-lg px-3 py-2 hover:bg-background/50 transition-colors"
                >
                  <p className="text-sm text-foreground">{c.text}</p>
                  {expandedCommentId === c.id && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {c.username} · {c.time}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              type="button"
              onClick={handleAddComment}
              disabled={!newCommentText.trim()}
              className="p-2 rounded-xl bg-[#8B5CF6] text-white disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Send comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {/* Aura button */}
            <button
              className="flex items-center gap-1.5 group"
              aria-label="View aura"
            >
              <Sparkles className="w-6 h-6 text-foreground group-hover:text-[#8B5CF6] transition-colors" />
            </button>
            {/* Comments button */}
            <button
              onClick={() => setShowCommentPanel(true)}
              className="flex items-center gap-1.5 group"
              aria-label="Comments"
            >
              <MessageCircle className="w-6 h-6 text-foreground group-hover:text-[#3B82F6] transition-colors" />
            </button>
            {/* Trade button */}
            <button
              onClick={() => setShowTradeModal(true)}
              className="flex items-center gap-1.5 group"
              aria-label="Trade card"
            >
              <ArrowRightLeft className="w-6 h-6 text-foreground group-hover:text-green-500 transition-colors" />
            </button>
            {/* Battle button */}
            <button
              onClick={() => setShowBattleModal(true)}
              className="flex items-center gap-1.5 group"
              aria-label="Challenge to battle"
            >
              <Sword className="w-6 h-6 text-foreground group-hover:text-orange-500 transition-colors" />
            </button>
          </div>
        </div>

        <p className="text-sm font-semibold text-foreground">
          {likeCount.toLocaleString("en-US")} aura points
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Posted by {username}
        </p>
      </div>

      {/* Battle Modal */}
      {showBattleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl border border-border shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Choose Your Card</h3>
              <button
                onClick={() => setShowBattleModal(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
              {userCards.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  You don't have any cards yet. Create a card first!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {userCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        // Store battle data
                        const battleData = {
                          id: `battle-${Date.now()}`,
                          titleA: card.title,
                          titleB: title,
                          cardA: {
                            photo: card.imagePreview,
                            rarity: card.rarity,
                            username: currentUsername,
                            title: card.title,
                            description: card.description,
                            stats: card.stats,
                          },
                          cardB: {
                            photo: cardImage,
                            rarity: rarity,
                            username: username,
                            title: title,
                            description: description,
                            stats: stats,
                          },
                        };
                        localStorage.setItem('cardus-pending-battle', JSON.stringify(battleData));
                        // Redirect to feed with battles tab
                        setShowBattleModal(false);
                        window.location.href = '/?tab=Battles';
                      }}
                      className="group relative rounded-xl overflow-hidden hover:ring-2 hover:ring-[#8B5CF6] transition-all"
                    >
                      <div className="aspect-[3/4] relative">
                        <img
                          src={card.imagePreview}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs font-bold text-white truncate">{card.title}</p>
                          <p className="text-[10px] text-white/80">{card.rarity}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl border border-border shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Send Trade Offer</h3>
              <button
                onClick={() => setShowTradeModal(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
              {userCards.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  You don't have any cards yet. Create a card first!
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {userCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        // Simulate trade accepted - add opponent's card to user's collection
                        const newCard = {
                          id: `card-${Date.now()}`,
                          imagePreview: cardImage,
                          title: title,
                          description: description,
                          stats: stats,
                          rarity: rarity,
                          hasAudio: hasAudio,
                          tradeFrom: username,
                          tradeDate: Date.now(),
                        };
                        
                        // Add card to Trades collection using card store
                        addCardToCollection("Trades", newCard);
                        
                        // Store accepted trade notification
                        const notification = {
                          type: "trade-accepted",
                          message: `✅ Trade accepted! You received "${title}" from ${username}!`,
                          timestamp: Date.now(),
                        };
                        localStorage.setItem("cardus-last-notification", JSON.stringify(notification));
                        
                        // Dispatch custom event to trigger notification in header
                        window.dispatchEvent(new CustomEvent("tradeAccepted", { detail: notification }));
                        
                        setShowTradeModal(false);
                      }}
                      className="group relative rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
                    >
                      <div className="aspect-[3/4] relative">
                        <img
                          src={card.imagePreview}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs font-bold text-white truncate">{card.title}</p>
                          <p className="text-[10px] text-white/80">{card.rarity}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
