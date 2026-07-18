import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Trash2, Loader2, Search, Plus, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MUMBAI_ZONES } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function AdminCampaigns() {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Create Camp States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [location, setLocation] = useState('');
  const [campZone, setCampZone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState('100');
  const [description, setDescription] = useState('');
  
  // Extended fields
  const [campImage, setCampImage] = useState<File | null>(null);
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [bloodGroupsNeeded, setBloodGroupsNeeded] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  
  const [creating, setCreating] = useState(false);

  // Edit Camp States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCampId, setEditingCampId] = useState<number | null>(null);
  
  const [editName, setEditName] = useState('');
  const [editOrganizer, setEditOrganizer] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCampZone, setEditCampZone] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editSlots, setEditSlots] = useState('100');
  const [editDescription, setEditDescription] = useState('');
  const [editGoogleMapsLink, setEditGoogleMapsLink] = useState('');
  const [editContactPerson, setEditContactPerson] = useState('');
  const [editContactNumber, setEditContactNumber] = useState('');
  const [editBloodGroupsNeeded, setEditBloodGroupsNeeded] = useState('');
  const [editRegistrationLink, setEditRegistrationLink] = useState('');
  const [editStatus, setEditStatus] = useState('upcoming');
  const [editCampImage, setEditCampImage] = useState<File | null>(null);
  const [editCurrentImageUrl, setEditCurrentImageUrl] = useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  
  const [updating, setUpdating] = useState(false);

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !organizer || !location || !campZone || !date || !time) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }
    setCreating(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('organizer', organizer);
    formData.append('location', location);
    formData.append('zone', campZone);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('slots', slots);
    formData.append('description', description);
    formData.append('status', 'upcoming');
    formData.append('google_maps_link', googleMapsLink);
    formData.append('contact_person', contactPerson);
    formData.append('contact_number', contactNumber);
    formData.append('blood_groups_needed', bloodGroupsNeeded);
    formData.append('registration_link', registrationLink);
    
    if (campImage) {
      formData.append('image', campImage);
    }

    fetch('/api/camps/', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create camp');
        return res.json();
      })
      .then(() => {
        toast({
          title: '✅ Camp Created',
          description: `Blood camp "${name}" has been organized and is now live.`,
        });
        setAddModalOpen(false);
        // Clear fields
        setName('');
        setOrganizer('');
        setLocation('');
        setCampZone('');
        setDate('');
        setTime('');
        setSlots('100');
        setDescription('');
        setCampImage(null);
        setGoogleMapsLink('');
        setContactPerson('');
        setContactNumber('');
        setBloodGroupsNeeded('');
        setRegistrationLink('');
        // Reload list
        fetchCamps();
        setCreating(false);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: 'Could not create blood camp. Please try again.',
        });
        setCreating(false);
      });
  };

  const startEditCamp = (camp: any) => {
    setEditingCampId(camp.id);
    setEditName(camp.name || '');
    setEditOrganizer(camp.organizer || '');
    setEditLocation(camp.location || '');
    setEditCampZone(camp.zone || '');
    setEditDate(camp.date || '');
    setEditTime(camp.time || '');
    setEditSlots(String(camp.slots || 100));
    setEditDescription(camp.description || '');
    setEditGoogleMapsLink(camp.google_maps_link || '');
    setEditContactPerson(camp.contact_person || '');
    setEditContactNumber(camp.contact_number || '');
    setEditBloodGroupsNeeded(camp.blood_groups_needed || '');
    setEditRegistrationLink(camp.registration_link || '');
    setEditStatus(camp.status || 'upcoming');
    setEditCampImage(null);
    setEditCurrentImageUrl(camp.image || null);
    setRemoveCurrentImage(false);
    setEditModalOpen(true);
  };

  const handleUpdateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editOrganizer || !editLocation || !editCampZone || !editDate || !editTime) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }
    setUpdating(true);

    const formData = new FormData();
    formData.append('name', editName);
    formData.append('organizer', editOrganizer);
    formData.append('location', editLocation);
    formData.append('zone', editCampZone);
    formData.append('date', editDate);
    formData.append('time', editTime);
    formData.append('slots', editSlots);
    formData.append('description', editDescription);
    formData.append('status', editStatus);
    formData.append('google_maps_link', editGoogleMapsLink);
    formData.append('contact_person', editContactPerson);
    formData.append('contact_number', editContactNumber);
    formData.append('blood_groups_needed', editBloodGroupsNeeded);
    formData.append('registration_link', editRegistrationLink);

    if (editCampImage) {
      formData.append('image', editCampImage);
    } else if (removeCurrentImage) {
      formData.append('image', '');
    }

    fetch(`/api/camps/${editingCampId}/`, {
      method: 'PUT',
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update camp');
        return res.json();
      })
      .then(() => {
        toast({
          title: '✅ Camp Updated',
          description: `Blood camp "${editName}" changes have been saved.`,
        });
        setEditModalOpen(false);
        fetchCamps();
        setUpdating(false);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update the blood camp.',
        });
        setUpdating(false);
      });
  };

  // Filter States
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const fetchCamps = () => {
    fetch('/api/camps/')
      .then(res => res.json())
      .then(data => {
        setCamps(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCamps();
    const interval = setInterval(fetchCamps, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = camps.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.organizer || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesZone = zone === 'ALL' || c.zone === zone;
    const matchesStatus = status === 'ALL' || c.status === status;

    return matchesSearch && matchesZone && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setActionId(id);
    fetch(`/api/camps/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'upcoming' })
    })
      .then(res => {
        if (!res.ok) throw new Error('Approval failed');
        return res.json();
      })
      .then(updated => {
        toast({
          title: "Campaign Approved",
          description: `Successfully activated campaign drive: ${updated.name}`,
        });
        setCamps(prev => prev.map(c => c.id === id ? updated : c));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not approve campaign drive.",
        });
        setActionId(null);
      });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this campaign drive?")) return;
    setActionId(id);
    fetch(`/api/camps/${id}/`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        toast({
          title: "Campaign Deleted",
          description: "The campaign drive has been deleted.",
        });
        setCamps(prev => prev.filter(c => c.id !== id));
        setActionId(null);
      })
      .catch(err => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: "Could not delete campaign drive.",
        });
        setActionId(null);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <div className="text-sm text-muted-foreground mt-0.5">
            Showing {filtered.length} of {camps.length} campaigns
          </div>
        </div>
        
        {/* Create Camp Dialog Modal */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-destructive hover:bg-destructive/90 text-white font-medium">
              <Plus className="h-4 w-4" /> Create Camp
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-left">Organize Blood Camp</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCamp} className="space-y-4 pt-4 text-left">
              <div>
                <Label htmlFor="camp-name">Camp Name *</Label>
                <Input 
                  id="camp-name" 
                  placeholder="e.g. Mega Blood Drive" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="camp-organizer">Organizer *</Label>
                <Input 
                  id="camp-organizer" 
                  placeholder="e.g. Rotary Club" 
                  value={organizer} 
                  onChange={e => setOrganizer(e.target.value)} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="camp-location">Location Address *</Label>
                  <Input 
                    id="camp-location" 
                    placeholder="e.g. Community Center" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label>Area / Zone *</Label>
                  <Select value={campZone} onValueChange={setCampZone} required>
                    <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                    <SelectContent>
                      {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="camp-date">Date *</Label>
                  <Input 
                    id="camp-date" 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="camp-time">Time Range *</Label>
                  <Input 
                    id="camp-time" 
                    placeholder="e.g. 9:00 AM - 5:00 PM" 
                    value={time} 
                    onChange={e => setTime(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="camp-slots">Maximum Slots Capacity</Label>
                <Input 
                  id="camp-slots" 
                  type="number" 
                  value={slots} 
                  onChange={e => setSlots(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="camp-desc">Description</Label>
                <Textarea 
                  id="camp-desc" 
                  placeholder="Details about the blood camp drive..." 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="camp-image">Camp Banner / Image</Label>
                <Input 
                  id="camp-image" 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setCampImage(files[0]);
                    }
                  }} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="camp-contact-person">Contact Person</Label>
                  <Input 
                    id="camp-contact-person" 
                    placeholder="e.g. Rahul Sharma" 
                    value={contactPerson} 
                    onChange={e => setContactPerson(e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="camp-contact-number">Contact Number</Label>
                  <Input 
                    id="camp-contact-number" 
                    placeholder="e.g. 9876543210" 
                    value={contactNumber} 
                    onChange={e => setContactNumber(e.target.value)} 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="camp-blood-groups">Blood Groups Urgently Needed</Label>
                <Input 
                  id="camp-blood-groups" 
                  placeholder="e.g. O-, A+, B-" 
                  value={bloodGroupsNeeded} 
                  onChange={e => setBloodGroupsNeeded(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="camp-maps-link">Google Maps Location Link</Label>
                <Input 
                  id="camp-maps-link" 
                  placeholder="https://maps.google.com/..." 
                  value={googleMapsLink} 
                  onChange={e => setGoogleMapsLink(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="camp-reg-link">External Registration Link (Optional)</Label>
                <Input 
                  id="camp-reg-link" 
                  placeholder="https://docs.google.com/forms/..." 
                  value={registrationLink} 
                  onChange={e => setRegistrationLink(e.target.value)} 
                />
              </div>
              <Button type="submit" className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-white font-medium" disabled={creating}>
                {creating ? <><Loader2 className="h-4 w-4 animate-spin" /> Organizing...</> : <><CheckCircle className="h-4 w-4" /> Save &amp; Publish Camp</>}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Camp Dialog Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-left">Edit Blood Camp</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateCamp} className="space-y-4 pt-4 text-left">
              <div>
                <Label htmlFor="edit-camp-name">Camp Name *</Label>
                <Input 
                  id="edit-camp-name" 
                  placeholder="e.g. Mega Blood Drive" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-camp-organizer">Organizer *</Label>
                <Input 
                  id="edit-camp-organizer" 
                  placeholder="e.g. Rotary Club" 
                  value={editOrganizer} 
                  onChange={e => setEditOrganizer(e.target.value)} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-camp-location">Location Address *</Label>
                  <Input 
                    id="edit-camp-location" 
                    placeholder="e.g. Community Center" 
                    value={editLocation} 
                    onChange={e => setEditLocation(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label>Area / Zone *</Label>
                  <Select value={editCampZone} onValueChange={setEditCampZone} required>
                    <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                    <SelectContent>
                      {MUMBAI_ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-camp-date">Date *</Label>
                  <Input 
                    id="edit-camp-date" 
                    type="date" 
                    value={editDate} 
                    onChange={e => setEditDate(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-camp-time">Time Range *</Label>
                  <Input 
                    id="edit-camp-time" 
                    placeholder="e.g. 9:00 AM - 5:00 PM" 
                    value={editTime} 
                    onChange={e => setEditTime(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-camp-slots">Maximum Slots Capacity</Label>
                <Input 
                  id="edit-camp-slots" 
                  type="number" 
                  value={editSlots} 
                  onChange={e => setEditSlots(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="edit-camp-desc">Description</Label>
                <Textarea 
                  id="edit-camp-desc" 
                  placeholder="Details about the blood camp drive..." 
                  value={editDescription} 
                  onChange={e => setEditDescription(e.target.value)} 
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus} required>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-camp-image">Camp Banner / Image</Label>
                {editCurrentImageUrl && !removeCurrentImage && (
                  <div className="mb-2 flex items-center justify-between p-2 bg-slate-50 border rounded-md">
                    <span className="text-xs truncate max-w-[200px]">Current Image: {editCurrentImageUrl.split('/').pop()}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 text-xs px-2 h-7"
                      onClick={() => setRemoveCurrentImage(true)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                
                {(!editCurrentImageUrl || removeCurrentImage) ? (
                  <Input 
                    id="edit-camp-image" 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setEditCampImage(files[0]);
                      }
                    }} 
                  />
                ) : (
                  <p className="text-[10px] text-muted-foreground">Remove the current image to upload a new one.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-camp-contact-person">Contact Person</Label>
                  <Input 
                    id="edit-camp-contact-person" 
                    placeholder="e.g. Rahul Sharma" 
                    value={editContactPerson} 
                    onChange={e => setEditContactPerson(e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-camp-contact-number">Contact Number</Label>
                  <Input 
                    id="edit-camp-contact-number" 
                    placeholder="e.g. 9876543210" 
                    value={editContactNumber} 
                    onChange={e => setEditContactNumber(e.target.value)} 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-camp-blood-groups">Blood Groups Urgently Needed</Label>
                <Input 
                  id="edit-camp-blood-groups" 
                  placeholder="e.g. O-, A+, B-" 
                  value={editBloodGroupsNeeded} 
                  onChange={e => setEditBloodGroupsNeeded(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="edit-camp-maps-link">Google Maps Location Link</Label>
                <Input 
                  id="edit-camp-maps-link" 
                  placeholder="https://maps.google.com/..." 
                  value={editGoogleMapsLink} 
                  onChange={e => setEditGoogleMapsLink(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="edit-camp-reg-link">External Registration Link (Optional)</Label>
                <Input 
                  id="edit-camp-reg-link" 
                  placeholder="https://docs.google.com/forms/..." 
                  value={editRegistrationLink} 
                  onChange={e => setEditRegistrationLink(e.target.value)} 
                />
              </div>
              <Button type="submit" className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-white font-medium" disabled={updating}>
                {updating ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><CheckCircle className="h-4 w-4" /> Save Changes</>}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters row */}
      <div className="grid gap-4 md:grid-cols-3 bg-card p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search camp, organizer, location..." 
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div>
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger>
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Zones</SelectItem>
              {MUMBAI_ZONES.map((z) => (
                <SelectItem key={z} value={z}>{z}</SelectItem>
              ))}
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
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
                    <TableHead>Campaign</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Slots</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No matching campaigns found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c) => {
                      const booked = c.slots_booked !== undefined ? c.slots_booked : c.slotsBooked || 0;
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            <div>{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.time}</div>
                          </TableCell>
                          <TableCell>{c.organizer}</TableCell>
                          <TableCell>
                            <div>{c.location}</div>
                            <div className="text-xs text-muted-foreground">{c.zone}</div>
                          </TableCell>
                          <TableCell>{c.date}</TableCell>
                          <TableCell>{booked}/{c.slots}</TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'upcoming' ? 'default' : 'secondary'}>
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Approve"
                                disabled={c.status === 'upcoming' || c.status === 'completed' || actionId === c.id}
                                onClick={() => handleApprove(c.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-success" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Edit"
                                disabled={actionId === c.id}
                                onClick={() => startEditCamp(c)}
                              >
                                <Edit className="h-4 w-4 text-primary" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                title="Delete"
                                disabled={actionId === c.id}
                                onClick={() => handleDelete(c.id)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
