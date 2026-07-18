import { useState, useEffect } from 'react';
import { 
  Heart, MessageSquare, Plus, AlertCircle, Quote, 
  Sparkles, Filter, Loader2, Calendar, CheckCircle, RefreshCw,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { BLOOD_GROUPS } from '@/lib/mock-data';

// Define structure matching backend
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

// Predefined Category Info for display
const CATEGORIES = [
  { value: 'all', label: 'All Posts', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
  { value: 'experience', label: 'Experiences', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { value: 'story', label: 'Stories', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400' },
  { value: 'feeling', label: 'Feelings', color: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400' },
  { value: 'motivation', label: 'Motivation', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400' },
  { value: 'campaign', label: 'Campaigns', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400' },
];

const categoryLabels: Record<string, string> = {
  experience: 'Experience',
  story: 'Donor Story',
  feeling: 'Feelings',
  motivation: 'Motivation',
  campaign: 'Awareness Campaign',
};

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering & Dialog states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>(() => {
    const saved = localStorage.getItem('liked_posts');
    return saved ? JSON.parse(saved) : [];
  });

  // Form Fields
  const [authorName, setAuthorName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('none');
  const [postCategory, setPostCategory] = useState('experience');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load Posts entirely from backend API
      const postsRes = await fetch('/api/community-posts/');
      if (!postsRes.ok) throw new Error('Could not retrieve posts from community service');
      const postsData = await postsRes.json();
      
      // Support both flat array and standard paginated response formats
      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else if (postsData.results && Array.isArray(postsData.results)) {
        setPosts(postsData.results);
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      console.error("API error fetching community posts:", err);
      setError(err.message || 'Failed to fetch community posts. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLike = async (postId: number) => {
    const isAlreadyLiked = likedPosts.includes(postId);
    const previousPosts = [...posts];
    const previousLikedPosts = [...likedPosts];

    // Optimistic Update
    const updatedLikes = isAlreadyLiked
      ? likedPosts.filter(id => id !== postId)
      : [...likedPosts, postId];

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes_count: Math.max(0, post.likes_count + (isAlreadyLiked ? -1 : 1)) } 
        : post
    ));
    setLikedPosts(updatedLikes);
    localStorage.setItem('liked_posts', JSON.stringify(updatedLikes));

    try {
      const res = await fetch(`/api/community-posts/${postId}/like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to update like');
      }
      
      const data = await res.json();
      // Sync exact likes count with DB response
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes_count: data.likes_count } : post
      ));
    } catch (err: any) {
      console.error("Failed to update like status:", err);
      
      // Rollback immediately
      setPosts(previousPosts);
      setLikedPosts(previousLikedPosts);
      localStorage.setItem('liked_posts', JSON.stringify(previousLikedPosts));

      toast({
        title: isAlreadyLiked ? "Unlike Failed" : "Like Failed",
        description: err.message || "Failed to update like status on the server. Reverted.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (post: CommunityPost) => {
    const shareUrl = `${window.location.origin}/community/post/${post.id}`;
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
        console.error("Failed to copy link:", err);
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy link to clipboard.",
        });
      });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (postContent.trim().length < 10) {
      toast({
        title: "Post Content Too Short",
        description: "Please share a few more thoughts (minimum 10 characters).",
        variant: "destructive"
      });
      return;
    }

    if (postContent.trim().length > 1000) {
      toast({
        title: "Post Content Too Long",
        description: "Please limit your post to 1000 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      author_name: authorName.trim() || 'Anonymous',
      blood_group: bloodGroup === 'none' ? null : bloodGroup,
      category: postCategory,
      title: postTitle.trim() || null,
      content: postContent.trim()
    };

    try {
      const res = await fetch('/api/community-posts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        const message = Object.values(errorData).flat().join(" ") || "Failed to create post.";
        throw new Error(message);
      }

      toast({
        title: "Submission Received!",
        description: "Thank you for sharing! Your post will be visible after admin review.",
        className: "bg-emerald-50 border-emerald-200 text-emerald-800"
      });

      resetForm();
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Submission Failed",
        description: err.message || "Failed to submit post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAuthorName('');
    setBloodGroup('none');
    setPostCategory('experience');
    setPostTitle('');
    setPostContent('');
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

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

  return (
    <div className="py-8 min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container max-w-6xl">
        
        {/* Banner with gradient text */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-indigo-700 text-white p-8 md:p-12 mb-10 shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10 scale-150">
            <Quote className="h-64 w-64" />
          </div>
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3 w-3 animate-pulse" /> Community Corner
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Shared Feelings, <br/>Saved Lives in Mumbai.
            </h1>
            <p className="text-sm md:text-base text-white/95 font-medium italic">
              "Every blood donor is a lifesaver. Your courage and generosity keep our community beating."
            </p>
            
            <div className="pt-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90 font-semibold gap-2 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="h-5 w-5" /> Share Your Story
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleCreatePost}>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Sparkles className="h-5 w-5 text-rose-500" /> Share Your Feelings
                      </DialogTitle>
                      <DialogDescription>
                        Inspire the Mumbai community by posting your blood donation experience or a motivating message.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="author-name">Your Name</Label>
                          <Input 
                            id="author-name"
                            placeholder="Anonymous"
                            value={authorName}
                            onChange={e => setAuthorName(e.target.value)}
                            maxLength={50}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="blood-group">Blood Group</Label>
                          <Select value={bloodGroup} onValueChange={setBloodGroup}>
                            <SelectTrigger id="blood-group">
                              <SelectValue placeholder="Optional" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Prefer not to say</SelectItem>
                              {BLOOD_GROUPS.map(bg => (
                                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Category *</Label>
                        <Select value={postCategory} onValueChange={setPostCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="experience">Experience Sharing</SelectItem>
                            <SelectItem value="story">Personal Story</SelectItem>
                            <SelectItem value="feeling">Donor Feelings</SelectItem>
                            <SelectItem value="motivation">Motivation</SelectItem>
                            <SelectItem value="campaign">Awareness Campaign</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="post-title">Title</Label>
                        <Input 
                          id="post-title"
                          placeholder="Give your story a title"
                          value={postTitle}
                          onChange={e => setPostTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="post-content">Your Message *</Label>
                        <Textarea 
                          id="post-content"
                          placeholder="What did it feel like to donate? Why is blood donation important to you? (10 - 1000 characters)"
                          rows={4}
                          value={postContent}
                          onChange={e => setPostContent(e.target.value)}
                          required
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Min 10 characters</span>
                          <span className={postContent.length > 1000 ? 'text-red-500 font-medium' : ''}>
                            {postContent.length}/1000
                          </span>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" /> Publish Post
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Filter Bar with Category Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-8">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold">
            <Filter className="h-4 w-4" /> Filter Feed:
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                    isActive 
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-105' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100/85'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="flex flex-col justify-between overflow-hidden border shadow-sm bg-white dark:bg-slate-900/60 p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                </div>
                <div className="border-t pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-3.5 w-16 rounded-md" />
                      <Skeleton className="h-3 w-10 mt-1 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-12 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State with Retry */}
        {!loading && error && (
          <div className="text-center py-16 bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-red-200 dark:border-red-900/50 p-8 max-w-xl mx-auto space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Connection Failed</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {error}
            </p>
            <Button onClick={loadData} className="bg-rose-600 hover:bg-rose-700 text-white gap-2">
              <RefreshCw className="h-4 w-4" /> Retry Connection
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed p-8">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No posts in this category</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Be the first to share your feelings or motivational stories with other donors in Mumbai!
            </p>
            <Button className="mt-4 bg-rose-600 hover:bg-rose-700 text-white gap-2" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Share Your Story
            </Button>
          </div>
        )}

        {/* Main Community Feed Grid */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              const categoryDetails = CATEGORIES.find(c => c.value === post.category);
              
              return (
                <Card 
                  key={post.id} 
                  className="flex flex-col justify-between overflow-hidden border shadow-sm bg-white dark:bg-slate-900/60 backdrop-blur-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      
                      {/* Header with category badge and date */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge className={`${categoryDetails?.color || ''} border font-medium px-2.5 py-0.5 shadow-none rounded-md`}>
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(post.created_at)}
                        </span>
                      </div>

                      {/* Title & Content */}
                      <div>
                        {post.title && (
                          <h3 className="font-extrabold text-lg leading-snug text-slate-800 dark:text-slate-100 mb-2">
                            {post.title}
                          </h3>
                        )}
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal italic">
                          "{post.content}"
                        </p>
                      </div>
                    </div>

                    {/* Footer elements: author info and like button */}
                    <div className="border-t pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border text-slate-700 dark:text-slate-300 font-bold text-xs">
                          {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {post.author_name || 'Anonymous'}
                          </div>
                          {post.blood_group && (
                            <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-900/40">
                              Group: {post.blood_group}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Like button with micro-animation */}
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 border ${
                            isLiked
                              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50 scale-105'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'
                          }`}
                          aria-label="Like post"
                        >
                          <Heart 
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                            }`} 
                          />
                          <span>{post.likes_count}</span>
                        </button>

                        {/* Share button */}
                        <button
                          onClick={() => handleShare(post)}
                          className="flex items-center justify-center rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-rose-600 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 transition-colors"
                          aria-label="Share post"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
