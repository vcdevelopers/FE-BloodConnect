import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2, Search, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOOD_GROUPS } from '@/lib/mock-data';

const statusColor = { 
  pending: 'secondary' as const, 
  approved: 'default' as const, 
  rejected: 'destructive' as const 
};

const categoryLabels: Record<string, string> = {
  experience: 'Experience',
  story: 'Donor Story',
  feeling: 'Feelings',
  motivation: 'Motivation',
  campaign: 'Awareness Campaign',
};

export default function AdminCommunityPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const { toast } = useToast();

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const fetchPosts = () => {
    fetch('/api/community-posts/moderation-list/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data.results && Array.isArray(data.results)) {
          setPosts(data.results);
        } else {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = posts.filter(p => {
    const matchesSearch = 
      (p.author_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.content || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'ALL' || p.category === category;
    const matchesStatus = status === 'ALL' || p.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleUpdateStatus = (id: number, newStatus: 'approved' | 'rejected') => {
    setActionId(id);
    fetch(`/api/community-posts/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error('Status update failed');
        return res.json();
      })
      .then(updated => {
        toast({
          title: `Post ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
          description: `Successfully updated post by ${updated.author_name} to ${newStatus}.`,
        });
        setPosts(prev => prev.map(p => p.id === id ? updated : p));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: `Could not update post status to ${newStatus}.`,
        });
        setActionId(null);
      });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this post?")) return;
    setActionId(id);
    fetch(`/api/community-posts/${id}/`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Deletion failed');
        toast({
          title: "Post Deleted",
          description: "The community post has been permanently deleted.",
        });
        setPosts(prev => prev.filter(p => p.id !== id));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not delete community post.",
        });
        setActionId(null);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Community Posts Moderation</h2>
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {posts.length} posts
        </div>
      </div>

      {/* Filters row */}
      <div className="grid gap-4 md:grid-cols-3 bg-card p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search author, title, content..." 
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="feeling">Feeling</SelectItem>
              <SelectItem value="motivation">Motivation</SelectItem>
              <SelectItem value="campaign">Awareness Campaign</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Title & Content</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No community posts found matching the filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-semibold">{p.author_name}</TableCell>
                        <TableCell>
                          {p.blood_group ? <Badge variant="outline">{p.blood_group}</Badge> : <span className="text-muted-foreground text-xs">-</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {categoryLabels[p.category] || p.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="space-y-1">
                            {p.title && <div className="font-semibold text-sm">{p.title}</div>}
                            <div className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
                              "{p.content}"
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{p.likes_count}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">
                          {formatDate(p.created_at)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColor[p.status as keyof typeof statusColor] || 'secondary'}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Approve"
                              className="hover:bg-green-500/10"
                              disabled={p.status === 'approved' || actionId === p.id}
                              onClick={() => handleUpdateStatus(p.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Reject"
                              className="hover:bg-destructive/10"
                              disabled={p.status === 'rejected' || actionId === p.id}
                              onClick={() => handleUpdateStatus(p.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Delete"
                              className="hover:bg-destructive/10"
                              disabled={actionId === p.id}
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
