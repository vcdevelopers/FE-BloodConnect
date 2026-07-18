import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, Share2, ArrowLeft, Loader2, AlertCircle, 
  Calendar, Sparkles, Quote, MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { BLOOD_GROUPS } from '@/lib/mock-data';

interface CommunityPost {
  id: number;
  author_name: string;
  blood_group: string | null;
  category: 'experience' | 'story' | 'feeling' | 'motivation' | 'campaign';
  title: string | null;
  content: string;
  likes_count: number;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

const CATEGORY_COLORS: Record<string, string> = {
  experience: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  story: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400',
  feeling: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400',
  motivation: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
  campaign: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400',
};

const categoryLabels: Record<string, string> = {
  experience: 'Experience',
  story: 'Donor Story',
  feeling: 'Feelings',
  motivation: 'Motivation',
  campaign: 'Awareness Campaign',
};

export default function CommunityPostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(() => {
    const saved = localStorage.getItem('liked_posts');
    if (saved && id) {
      const likedIds = JSON.parse(saved);
      return likedIds.includes(Number(id));
    }
    return false;
  });

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError(false);
    
    fetch(`/api/community-posts/${id}/`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Post not found');
        }
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleLike = async () => {
    if (!post) return;

    const previousLiked = liked;
    const previousPost = { ...post };

    // Optimistic Update
    setLiked(!previousLiked);
    setPost(prev => prev ? {
      ...prev,
      likes_count: Math.max(0, prev.likes_count + (previousLiked ? -1 : 1))
    } : null);

    const saved = localStorage.getItem('liked_posts');
    const likedIds: number[] = saved ? JSON.parse(saved) : [];
    const updatedIds = previousLiked
      ? likedIds.filter(x => x !== post.id)
      : [...likedIds, post.id];
    localStorage.setItem('liked_posts', JSON.stringify(updatedIds));

    try {
      const res = await fetch(`/api/community-posts/${post.id}/like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        throw new Error('Failed to update like');
      }
      
      const data = await res.json();
      setPost(prev => prev ? { ...prev, likes_count: data.likes_count } : null);
    } catch (err: any) {
      console.error(err);
      // Rollback
      setLiked(previousLiked);
      setPost(previousPost);
      localStorage.setItem('liked_posts', JSON.stringify(likedIds));
      
      toast({
        title: previousLiked ? "Unlike Failed" : "Like Failed",
        description: "Failed to update like on the server. Reverted.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    const shareUrl = window.location.href;
    const shareTitle = post.title || "Community Post on Mumbai Blood Connect";
    const shareText = `Check out this post by ${post.author_name} on Mumbai Blood Connect: "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully",
          description: "Thank you for spreading the word!",
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Link copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy link to clipboard.",
        });
      });
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  // Loading state skeleton
  if (loading) {
    return (
      <div className="py-12 min-h-[80vh] flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container max-w-2xl px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card className="p-8 border shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="border-t pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16 rounded-full" />
                <Skeleton className="h-9 w-12 rounded-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Error / Post not found state
  if (error || !post) {
    return (
      <div className="py-12 min-h-[80vh] flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container max-w-md px-4 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Post Not Found</h2>
            <p className="text-muted-foreground text-sm">
              The post you are trying to view does not exist, has been removed, or is awaiting moderation.
            </p>
          </div>
          <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white">
            <Link to="/community" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Community Feed
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-[80vh] bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container max-w-2xl px-4">
        
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/community')}
          className="mb-6 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Corner
        </Button>

        {/* Main Post Card */}
        <Card className="overflow-hidden border shadow-lg bg-white dark:bg-slate-900/60 backdrop-blur-md">
          {/* Header decorative band */}
          <div className="h-2 bg-gradient-to-r from-red-500 via-rose-500 to-indigo-500" />
          
          <CardContent className="p-8 space-y-6">
            {/* Metadata (Category & Date) */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Badge className={`${CATEGORY_COLORS[post.category] || ''} border font-medium px-3 py-1 shadow-none rounded-md`}>
                {categoryLabels[post.category] || post.category}
              </Badge>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-slate-400" /> {formatDate(post.created_at)}
              </span>
            </div>

            {/* Title & Message */}
            <div className="space-y-4">
              {post.title && (
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-slate-800 dark:text-slate-100">
                  {post.title}
                </h1>
              )}
              
              <div className="relative">
                <span className="absolute -top-4 -left-3 text-6xl text-slate-100 dark:text-slate-800/40 select-none font-serif">
                  “
                </span>
                <p className="relative z-10 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic whitespace-pre-wrap pl-4 border-l-2 border-rose-500/30">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Footer with Author Details & Interaction Buttons */}
            <div className="border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-extrabold text-sm">
                  {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {post.author_name || 'Anonymous'}
                  </div>
                  {post.blood_group && (
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-900/40">
                      Group: {post.blood_group}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 border ${
                    liked
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50 scale-105 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'
                  }`}
                  aria-label="Like post"
                >
                  <Heart 
                    className={`h-4 w-4 transition-transform duration-300 ${
                      liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                    }`} 
                  />
                  <span>{post.likes_count}</span>
                </button>

                {/* Share Button */}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 py-2 text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/20 dark:hover:border-rose-900/50 transition-all font-semibold gap-1.5 text-slate-500 dark:text-slate-400"
                  aria-label="Share post link"
                >
                  <Share2 className="h-4 w-4" /> Share Post
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
