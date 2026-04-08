/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import {
  RefreshCw,
  X,
  Pin,
  Music2,
  Youtube,
  Instagram,
  Eye,
  Calendar,
} from "lucide-react";
import { useState } from "react";

interface ContentItem {
  id: string;
  thumbnail: string;
  title: string;
  views: number;
  publishedAt: string;
}

interface PlatformCardProps {
  id: string;
  platform: "tiktok" | "youtube" | "instagram";
  username?: string;
  profilePhoto?: string;
  totalPosts?: number;
  totalFollowers?: number;
  contentItems?: ContentItem[];
  loading?: boolean;
  error?: string;
  onRemove: () => void;
  onRefresh: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
}

const platformConfig = {
  tiktok: {
    name: "TikTok",
    color: "bg-[#FE2C55]",
    borderColor: "border-[#FE2C55]",
    glowColor: "shadow-[#FE2C55]/30",
    icon: Music2,
  },
  youtube: {
    name: "YouTube",
    color: "bg-[#FF0000]",
    borderColor: "border-[#FF0000]",
    glowColor: "shadow-[#FF0000]/30",
    icon: Youtube,
  },
  instagram: {
    name: "Instagram",
    color: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    borderColor: "border-[#DD2A7B]",
    glowColor: "shadow-[#DD2A7B]/30",
    icon: Instagram,
  },
};

export function PlatformCard({
  id,
  platform,
  username,
  profilePhoto,
  totalPosts,
  totalFollowers,
  contentItems = [],
  loading = false,
  error,
  onRemove,
  onRefresh,
  isPinned = false,
  onTogglePin,
}: PlatformCardProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000000) return `${(views / 1000000000).toFixed(1)}B`;
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:${config.glowColor} animate-in fade-in-0 slide-in-from-bottom-4 duration-500`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.color}`} />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : (
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage src={profilePhoto} alt={username} />
                <AvatarFallback>
                  <Icon className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            )}

            <div className="space-y-1">
              {loading ? (
                <>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </>
              ) : (
                <>
                  <h3 className="font-bold leading-none">@{username}</h3>
                  <Badge
                    variant="secondary"
                    className={`${config.color} text-white border-0`}
                  >
                    {config.name}
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onTogglePin && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onTogglePin}
                className={`h-8 w-8 rounded-lg ${
                  isPinned ? "text-primary" : "text-muted-foreground"
                } hover:text-primary transition-colors`}
              >
                <Pin className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
              </Button>
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onRemove}
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <Alert
            variant="destructive"
            className="animate-in fade-in-0 slide-in-from-top-2"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <>
            <div className="p-6 bg-muted/20 rounded-xl border border-border grid grid-cols-2 gap-4">
              <div>
                <div className="p-6 bg-muted/20 rounded-xl space-y-2">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <div>
                <div className="p-6 bg-muted/20 rounded-xl space-y-2">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="group/item flex gap-3 p-2 rounded-lg hover:bg-muted/30 transition-all cursor-pointer animate-in fade-in-0 slide-in-from-left-2"
                >
                  <Skeleton className="relative h-24 w-full rounded-lg flex-shrink-0" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="p-6 bg-muted/20 rounded-xl border border-border grid grid-cols-2 gap-4">
              <div>
                <div className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {formatViews(totalPosts || 0)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Total Posts
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {formatViews(totalFollowers || 0)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Total Followers
                </div>
              </div>
            </div>

            {contentItems && contentItems.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                    Latest Content
                  </h4>
                  <ScrollArea className=" pr-4">
                    <div className="grid grid-cols-3">
                      {contentItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="group/item flex gap-3 p-2 rounded-lg hover:bg-muted/30 transition-all cursor-pointer animate-in fade-in-0 slide-in-from-left-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="relative h-24 w-full rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform group-hover/item:scale-110"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
