"use client";
import { useState } from "react";
import { PlatformCard } from "@/components/PlatformCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Music2, Search, X, TrendingUp } from "lucide-react";

interface AccountCard {
  id: string;
  platform: "tiktok" | "youtube" | "instagram";
  username: string;
  profilePhoto: string;
  totalViews: number;
  contentItems: Array<{
    id: string;
    thumbnail: string;
    title: string;
    views: number;
    publishedAt: string;
  }>;
  isPinned: boolean;
  loading: boolean;
  error?: string;
}

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "tiktok" | "youtube" | "instagram"
  >("tiktok");
  const [searchUsername, setSearchUsername] = useState("");
  const [cards, setCards] = useState<AccountCard[]>([]);
  const [searching, setSearching] = useState(false);

  const generateMockData = (platform: string, username: string) => {
    const baseViews = Math.floor(Math.random() * 50000000) + 10000000;
    const contentCount = 5;

    return {
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      totalViews: baseViews,
      contentItems: Array.from({ length: contentCount }, (_, i) => ({
        id: `${platform}-${username}-${i}-${Date.now()}`,
        thumbnail: `https://picsum.photos/seed/${username}-${platform}-${i}-${Date.now()}/400/400`,
        title: `${
          platform === "tiktok"
            ? "Viral"
            : platform === "youtube"
            ? "Amazing"
            : "Beautiful"
        } content from @${username} #${i + 1}`,
        views: Math.floor(Math.random() * 5000000) + 100000,
        publishedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })),
    };
  };

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;

    const cardId = `${selectedPlatform}-${searchUsername}-${Date.now()}`;
    const newCard: AccountCard = {
      id: cardId,
      platform: selectedPlatform,
      username: searchUsername,
      profilePhoto: "",
      totalViews: 0,
      contentItems: [],
      isPinned: false,
      loading: true,
    };

    setCards((prev) => [newCard, ...prev]);
    setSearching(true);
    setSearchUsername("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockData = generateMockData(selectedPlatform, searchUsername);

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, ...mockData, loading: false } : card
      )
    );
    setSearching(false);
  };

  const handleRemoveCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleRefreshCard = async (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, loading: true } : c))
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockData = generateMockData(card.platform, card.username);

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...mockData, loading: false } : c))
    );
  };

  const handleTogglePin = (id: string) => {
    setCards((prev) => {
      const updated = prev.map((card) =>
        card.id === id ? { ...card, isPinned: !card.isPinned } : card
      );
      return updated.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchUsername.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Social Views Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6">
        <div className="space-y-4">
          <h2 className="font-bold">Search Social Media Accounts</h2>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <Select
              value={selectedPlatform}
              onValueChange={(value: any) => setSelectedPlatform(value)}
            >
              <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tiktok">
                  <div className="flex items-center gap-2">
                    <Music2 className="h-4 w-4 text-[#FE2C55]" />
                    <span>TikTok</span>
                  </div>
                </SelectItem>
                <SelectItem value="youtube">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="#FF0000"
                        className="h-4 w-4"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <span>YouTube</span>
                  </div>
                </SelectItem>
                <SelectItem value="instagram">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="url(#instagram-gradient)"
                        className="h-4 w-4"
                      >
                        <defs>
                          <linearGradient
                            id="instagram-gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#F58529" />
                            <stop offset="50%" stopColor="#DD2A7B" />
                            <stop offset="100%" stopColor="#8134AF" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <span>Instagram</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Input
                placeholder="Enter username or channel"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-9 pr-10 rounded-xl"
              />
              {searchUsername && (
                <button
                  onClick={() => setSearchUsername("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={!searchUsername.trim() || searching}
              className="h-9 rounded-xl px-8 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in-0 duration-500">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No accounts yet</h3>
            <p className="text-muted-foreground max-w-md">
              Select a platform, enter a username or channel, and click Search
              to start monitoring social media analytics
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => (
              <PlatformCard
                key={card.id}
                id={card.id}
                platform={card.platform}
                username={card.username}
                profilePhoto={card.profilePhoto}
                totalViews={card.totalViews}
                contentItems={card.contentItems}
                loading={card.loading}
                error={card.error}
                isPinned={card.isPinned}
                onRemove={() => handleRemoveCard(card.id)}
                onRefresh={() => handleRefreshCard(card.id)}
                onTogglePin={() => handleTogglePin(card.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
