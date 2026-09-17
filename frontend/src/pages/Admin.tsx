import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  ImageIcon,
  LayoutDashboard,
  Link2,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquareQuote,
  Palette,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Shield,
  Star,
  Trash2,
  Upload,
  User,
  Wrench,
  X,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/api';
import {
  activeItems,
  defaultSiteContent,
  mergeSiteContent,
  resolveMediaUrl,
  type GalleryItem,
  type SiteContent,
  type WebsiteProject,
  type WebsiteService,
} from '@/lib/siteContent';

type AdminUser = {
  name?: string;
  username?: string;
  email?: string;
};

type ServiceRequest = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  message?: string;
  status: 'pending' | 'in_progress' | 'completed';
  reviewEmailStatus?: 'not_sent' | 'sent' | 'queued' | 'failed';
  reviewRequestedAt?: string | null;
  reviewSubmittedAt?: string | null;
  createdAt?: string;
};

type ReviewItem = {
  _id: string;
  name: string;
  email?: string;
  mobile?: string;
  companyBuilding?: string;
  location?: string;
  serviceUsed?: string;
  rating: number;
  review: string;
  profileUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string | null;
  createdAt?: string;
};

type AdminSection =
  | 'overview'
  | 'branding'
  | 'contact'
  | 'hero'
  | 'about'
  | 'services'
  | 'projects'
  | 'gallery'
  | 'testimonials'
  | 'footer'
  | 'seo'
  | 'requests';

type TestimonialForm = {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  companyBuilding: string;
  location: string;
  serviceUsed: string;
  rating: number;
  review: string;
  profileUrl: string;
  status: ReviewItem['status'];
};

const sectionItems: Array<{ id: AdminSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'hero', label: 'Hero Banner', icon: ImageIcon },
  { id: 'about', label: 'About Us', icon: FileText },
  { id: 'services', label: 'Website Services', icon: Settings },
  { id: 'projects', label: 'Projects', icon: Wrench },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { id: 'footer', label: 'Footer', icon: Link2 },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'requests', label: 'Service Requests', icon: Send },
];

const statusLabels: Record<ServiceRequest['status'], string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const reviewStatusLabels: Record<ReviewItem['status'], string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const statusBadgeClass: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  in_progress: 'border-blue-200 bg-blue-50 text-blue-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  sent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  queued: 'border-blue-200 bg-blue-50 text-blue-700',
  failed: 'border-rose-200 bg-rose-50 text-rose-700',
  not_sent: 'border-slate-200 bg-slate-50 text-slate-600',
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100';

const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500';
const adminTokenStorageKey = 'adminToken';

const blankTestimonial: TestimonialForm = {
  name: '',
  email: '',
  mobile: '',
  companyBuilding: '',
  location: '',
  serviceUsed: 'Website Review',
  rating: 5,
  review: '',
  profileUrl: '',
  status: 'approved',
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const toLines = (items: string[] = []) => items.join('\n');
const fromLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const getAuthHeaders = (token: string, json = false) => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  Authorization: `Bearer ${token}`,
});

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = () => reject(new Error('Unable to read this image.'));
    reader.readAsDataURL(file);
  });

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  </label>
);

const TextArea = ({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`${inputClass} resize-y`}
    />
  </label>
);

const ImageField = ({
  label,
  value,
  onChange,
  onUpload,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
  compact?: boolean;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const previewUrl = resolveMediaUrl(value);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await onUpload(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'md:grid-cols-[180px_1fr]'}`}>
        <div className="flex min-h-32 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
          {previewUrl ? (
            <img src={previewUrl} alt={`${label} preview`} className="h-full max-h-44 w-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-slate-400" />
          )}
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
            placeholder="Image URL or uploaded media path"
          />
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-extrabold text-blue-700 transition-colors hover:bg-blue-100">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/x-icon"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const Panel = ({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const Admin = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [draft, setDraft] = useState<SiteContent>(defaultSiteContent);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [reviewFilter, setReviewFilter] = useState<'all' | ReviewItem['status']>('all');
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(blankTestimonial);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [busyAction, setBusyAction] = useState('');
  const { toast } = useToast();

  const isLoggedIn = Boolean(token);

  const metrics = useMemo(
    () => ({
      editableServices: activeItems(draft.services).length,
      projects: activeItems(draft.projects).length,
      gallery: activeItems(draft.galleryImages).length,
      requests: services.length,
      completed: services.filter((service) => service.status === 'completed').length,
      pendingReviews: reviews.filter((review) => review.status === 'pending').length,
      approvedReviews: reviews.filter((review) => review.status === 'approved').length,
    }),
    [draft.galleryImages, draft.projects, draft.services, reviews, services]
  );

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'all') return reviews;
    return reviews.filter((review) => review.status === reviewFilter);
  }, [reviewFilter, reviews]);

  const loadDashboard = useCallback(
    async (authToken = token) => {
      if (!authToken) return;

      setIsLoadingDashboard(true);

      try {
        const [profileResponse, contentResponse, servicesResponse, reviewsResponse] = await Promise.all([
          fetch(apiUrl('/api/admin/profile'), { headers: getAuthHeaders(authToken) }),
          fetch(apiUrl('/api/site-content')),
          fetch(apiUrl('/api/services'), { headers: getAuthHeaders(authToken) }),
          fetch(apiUrl('/api/reviews/admin'), { headers: getAuthHeaders(authToken) }),
        ]);

        if ([profileResponse, servicesResponse, reviewsResponse].some((response) => response.status === 401)) {
          sessionStorage.removeItem(adminTokenStorageKey);
          localStorage.removeItem(adminTokenStorageKey);
          setToken('');
          setAdmin(null);
          toast({
            title: 'Session Expired',
            description: 'Please sign in again.',
            variant: 'destructive',
            duration: 4000,
          });
          return;
        }

        if (!profileResponse.ok || !contentResponse.ok || !servicesResponse.ok || !reviewsResponse.ok) {
          throw new Error('Failed to load admin dashboard data.');
        }

        const profileData = await profileResponse.json().catch(() => null);
        const contentData = await contentResponse.json().catch(() => null);
        const servicesData = await servicesResponse.json().catch(() => []);
        const reviewsData = await reviewsResponse.json().catch(() => null);

        setAdmin(profileData?.admin || null);
        setDraft(mergeSiteContent(defaultSiteContent, contentData?.data?.content));
        setServices(Array.isArray(servicesData) ? servicesData : servicesData?.data || []);
        setReviews(Array.isArray(reviewsData?.data) ? reviewsData.data : []);
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
        toast({
          title: 'Dashboard Load Failed',
          description: error instanceof Error ? error.message : 'Please check the backend connection.',
          variant: 'destructive',
          duration: 5000,
        });
      } finally {
        setIsLoadingDashboard(false);
      }
    },
    [toast, token]
  );

  useEffect(() => {
    if (token) {
      loadDashboard(token);
    }
  }, [loadDashboard, token]);

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (isLoggingIn) return;

    const loginKey = loginData.username.trim();
    if (!loginKey || !loginData.password) {
      toast({
        title: 'Login Failed',
        description: 'Please enter your username/email and password.',
        variant: 'destructive',
        duration: 3500,
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [loginKey.includes('@') ? 'email' : 'username']: loginKey,
          password: loginData.password,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.token) {
        throw new Error(data?.message || 'Invalid username or password.');
      }

      sessionStorage.setItem(adminTokenStorageKey, data.token);
      localStorage.removeItem(adminTokenStorageKey);
      setIsLoadingDashboard(true);
      setToken(data.token);
      setAdmin(data.admin || null);
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin dashboard.',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(adminTokenStorageKey);
    localStorage.removeItem(adminTokenStorageKey);
    setToken('');
    setAdmin(null);
    setServices([]);
    setReviews([]);
    setLoginData({ username: '', password: '' });
  };

  const uploadImage = async (file: File) => {
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: 'Image Too Large',
        description: 'Please upload an image up to 3 MB.',
        variant: 'destructive',
        duration: 4000,
      });
      return '';
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const response = await fetch(apiUrl('/api/site-content/upload'), {
        method: 'POST',
        headers: getAuthHeaders(token, true),
        body: JSON.stringify({
          fileName: file.name,
          dataUrl,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Image upload failed.');
      }

      toast({
        title: 'Image Uploaded',
        description: 'Preview updated. Publish changes to update the website.',
        duration: 2500,
      });

      return data.data?.url || '';
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Please try another image.',
        variant: 'destructive',
        duration: 4500,
      });
      return '';
    }
  };

  const saveSiteContent = async () => {
    if (isSavingContent) return;

    setIsSavingContent(true);

    try {
      const response = await fetch(apiUrl('/api/site-content'), {
        method: 'PUT',
        headers: getAuthHeaders(token, true),
        body: JSON.stringify({ content: draft }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to publish website content.');
      }

      setDraft(mergeSiteContent(defaultSiteContent, data.data?.content));
      toast({
        title: 'Website Updated',
        description: 'Published changes are now available on the live website.',
        duration: 3500,
      });
    } catch (error) {
      toast({
        title: 'Publish Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSavingContent(false);
    }
  };

  const confirmAction = (message: string) => window.confirm(message);

  const updateServiceStatus = async (service: ServiceRequest, status: ServiceRequest['status']) => {
    if (service.status === status || busyAction) return;

    setBusyAction(`service-${service._id}-${status}`);

    try {
      const response = await fetch(apiUrl(`/api/services/${service._id}`), {
        method: 'PUT',
        headers: getAuthHeaders(token, true),
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Service status update failed.');
      }

      const updatedService = data.data?.service || data.service;
      if (updatedService) {
        setServices((prev) => prev.map((item) => (item._id === service._id ? updatedService : item)));
      }

      toast({
        title: 'Service Updated',
        description:
          status === 'completed'
            ? `Marked completed. Review email ${data.data?.reviewRequest?.emailStatus || 'processed'}.`
            : `Status changed to ${statusLabels[status]}.`,
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
        duration: 4500,
      });
    } finally {
      setBusyAction('');
    }
  };

  const updateReviewStatus = async (review: ReviewItem, status: ReviewItem['status']) => {
    if (review.status === status || busyAction) return;

    setBusyAction(`review-${review._id}-${status}`);

    try {
      const response = await fetch(apiUrl(`/api/reviews/admin/${review._id}/status`), {
        method: 'PATCH',
        headers: getAuthHeaders(token, true),
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Review update failed.');
      }

      setReviews((prev) => prev.map((item) => (item._id === review._id ? data.data : item)));
      toast({
        title: 'Review Updated',
        description: `Review moved to ${reviewStatusLabels[status]}.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Review Update Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
        duration: 4500,
      });
    } finally {
      setBusyAction('');
    }
  };

  const saveTestimonial = async (event: FormEvent) => {
    event.preventDefault();

    if (!testimonialForm.name.trim() || !testimonialForm.review.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Name and review are required.',
        variant: 'destructive',
        duration: 3500,
      });
      return;
    }

    const isEditing = Boolean(testimonialForm._id);
    setBusyAction('testimonial-save');

    try {
      const response = await fetch(
        apiUrl(isEditing ? `/api/reviews/admin/${testimonialForm._id}` : '/api/reviews/admin'),
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: getAuthHeaders(token, true),
          body: JSON.stringify(testimonialForm),
        }
      );

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to save testimonial.');
      }

      setReviews((prev) =>
        isEditing
          ? prev.map((review) => (review._id === data.data._id ? data.data : review))
          : [data.data, ...prev]
      );
      setTestimonialForm(blankTestimonial);
      toast({
        title: isEditing ? 'Testimonial Updated' : 'Testimonial Added',
        description: 'Approved testimonials appear on the live website.',
        duration: 3500,
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
        duration: 4500,
      });
    } finally {
      setBusyAction('');
    }
  };

  const deleteTestimonial = async (review: ReviewItem) => {
    if (!confirmAction(`Delete testimonial from ${review.name}?`)) return;

    setBusyAction(`review-delete-${review._id}`);

    try {
      const response = await fetch(apiUrl(`/api/reviews/admin/${review._id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to delete testimonial.');
      }

      setReviews((prev) => prev.filter((item) => item._id !== review._id));
      toast({
        title: 'Testimonial Deleted',
        description: 'The testimonial was removed from admin records.',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
        duration: 4500,
      });
    } finally {
      setBusyAction('');
    }
  };

  const addPhone = () =>
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: [...prev.contact.phones, { label: 'New Phone', value: '', note: '' }],
      },
    }));

  const updatePhone = (index: number, patch: Partial<SiteContent['contact']['phones'][number]>) =>
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: prev.contact.phones.map((phone, phoneIndex) =>
          phoneIndex === index ? { ...phone, ...patch } : phone
        ),
      },
    }));

  const deletePhone = (index: number) => {
    if (!confirmAction('Delete this phone number?')) return;
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: prev.contact.phones.filter((_, phoneIndex) => phoneIndex !== index),
      },
    }));
  };

  const addEmail = () =>
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        emails: [...prev.contact.emails, { label: 'Email', value: '' }],
      },
    }));

  const updateEmail = (index: number, patch: Partial<SiteContent['contact']['emails'][number]>) =>
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        emails: prev.contact.emails.map((email, emailIndex) =>
          emailIndex === index ? { ...email, ...patch } : email
        ),
      },
    }));

  const deleteEmail = (index: number) => {
    if (!confirmAction('Delete this email address?')) return;
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        emails: prev.contact.emails.filter((_, emailIndex) => emailIndex !== index),
      },
    }));
  };

  const updateServiceItem = (index: number, patch: Partial<WebsiteService>) =>
    setDraft((prev) => ({
      ...prev,
      services: prev.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, ...patch } : service
      ),
    }));

  const addServiceItem = () =>
    setDraft((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: makeId('service'),
          icon: 'Settings',
          title: 'New Service',
          short: 'Short service label',
          description: '',
          features: [],
          imageUrl: '',
          accent: 'from-blue-600 to-sky-500',
          active: true,
          sortOrder: prev.services.length + 1,
        },
      ],
    }));

  const deleteServiceItem = (index: number) => {
    if (!confirmAction('Delete this website service?')) return;
    setDraft((prev) => ({
      ...prev,
      services: prev.services.filter((_, serviceIndex) => serviceIndex !== index),
    }));
  };

  const updateProjectItem = (index: number, patch: Partial<WebsiteProject>) =>
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, ...patch } : project
      ),
    }));

  const addProjectItem = () =>
    setDraft((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: makeId('project'),
          title: 'New Project',
          location: '',
          type: 'Residential',
          year: new Date().getFullYear().toString(),
          description: '',
          details: '',
          features: [],
          images: [],
          client: '',
          active: true,
          sortOrder: prev.projects.length + 1,
        },
      ],
    }));

  const deleteProjectItem = (index: number) => {
    if (!confirmAction('Delete this project?')) return;
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
  };

  const updateGalleryItem = (index: number, patch: Partial<GalleryItem>) =>
    setDraft((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));

  const addGalleryItem = () =>
    setDraft((prev) => ({
      ...prev,
      galleryImages: [
        ...prev.galleryImages,
        {
          id: makeId('gallery'),
          title: 'New Gallery Image',
          category: 'installation',
          categoryLabel: 'Installation',
          imageUrl: '',
          location: '',
          description: '',
          features: [],
          active: true,
          sortOrder: prev.galleryImages.length + 1,
        },
      ],
    }));

  const deleteGalleryItem = (index: number) => {
    if (!confirmAction('Delete this gallery image?')) return;
    setDraft((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Website Services', value: metrics.editableServices, icon: Settings },
          { label: 'Projects', value: metrics.projects, icon: Wrench },
          { label: 'Gallery Images', value: metrics.gallery, icon: ImageIcon },
          { label: 'Approved Reviews', value: metrics.approvedReviews, icon: Star },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
              <item.icon className="h-5 w-5 text-blue-700" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>

      <Panel title="Website Snapshot" description="Current public identity and high-priority contact data.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand</p>
            <p className="mt-2 text-xl font-extrabold text-slate-950">{draft.identity.brandName}</p>
            <p className="text-sm text-slate-500">{draft.identity.companyName}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Contact</p>
            <p className="mt-2 text-sm font-bold text-slate-950">{draft.contact.phones[0]?.value || 'Not set'}</p>
            <p className="text-sm text-slate-500">{draft.contact.emails[0]?.value || 'Not set'}</p>
          </div>
        </div>
      </Panel>
    </div>
  );

  const renderBranding = () => (
    <Panel title="Branding" description="Control the website logo, favicon, company name, and public brand text.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Field
          label="Website Brand Name"
          value={draft.identity.brandName}
          onChange={(value) => setDraft((prev) => ({ ...prev, identity: { ...prev.identity, brandName: value } }))}
        />
        <Field
          label="Company Name"
          value={draft.identity.companyName}
          onChange={(value) => setDraft((prev) => ({ ...prev, identity: { ...prev.identity, companyName: value } }))}
        />
        <div className="lg:col-span-2">
          <Field
            label="Unit / Tagline Label"
            value={draft.identity.unitLabel}
            onChange={(value) => setDraft((prev) => ({ ...prev, identity: { ...prev.identity, unitLabel: value } }))}
          />
        </div>
        <ImageField
          label="Website Logo"
          value={draft.identity.logoUrl}
          onChange={(value) => setDraft((prev) => ({ ...prev, identity: { ...prev.identity, logoUrl: value } }))}
          onUpload={uploadImage}
        />
        <ImageField
          label="Favicon"
          value={draft.identity.faviconUrl}
          onChange={(value) => setDraft((prev) => ({ ...prev, identity: { ...prev.identity, faviconUrl: value } }))}
          onUpload={uploadImage}
        />
      </div>
    </Panel>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <Panel
        title="Phone Numbers"
        description="The first phone is used as the primary call and emergency number."
        action={
          <button type="button" onClick={addPhone} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-extrabold text-white">
            <Plus className="h-4 w-4" />
            Add Phone
          </button>
        }
      >
        <div className="space-y-3">
          {draft.contact.phones.map((phone, index) => (
            <div key={`${phone.label}-${index}`} className="grid gap-3 rounded-lg border border-slate-200 p-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <Field label="Label" value={phone.label} onChange={(value) => updatePhone(index, { label: value })} />
              <Field label="Phone" value={phone.value} onChange={(value) => updatePhone(index, { value })} />
              <Field label="Note" value={phone.note || ''} onChange={(value) => updatePhone(index, { note: value })} />
              <button
                type="button"
                onClick={() => deletePhone(index)}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-rose-700"
                title="Delete phone"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Emails"
        action={
          <button type="button" onClick={addEmail} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-extrabold text-white">
            <Plus className="h-4 w-4" />
            Add Email
          </button>
        }
      >
        <div className="space-y-3">
          {draft.contact.emails.map((email, index) => (
            <div key={`${email.label}-${index}`} className="grid gap-3 rounded-lg border border-slate-200 p-3 lg:grid-cols-[1fr_1fr_auto]">
              <Field label="Label" value={email.label} onChange={(value) => updateEmail(index, { label: value })} />
              <Field label="Email" value={email.value} onChange={(value) => updateEmail(index, { value })} />
              <button
                type="button"
                onClick={() => deleteEmail(index)}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-rose-700"
                title="Delete email"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Address, WhatsApp, and Maps">
        <div className="grid gap-5 lg:grid-cols-2">
          <TextArea
            label="Address Lines"
            value={toLines(draft.contact.addressLines)}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, addressLines: fromLines(value) },
              }))
            }
          />
          <TextArea
            label="Business Hours"
            value={toLines(draft.contact.businessHours)}
            onChange={(value) =>
              setDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, businessHours: fromLines(value) },
              }))
            }
          />
          <Field
            label="WhatsApp Number"
            value={draft.contact.whatsappNumber}
            onChange={(value) => setDraft((prev) => ({ ...prev, contact: { ...prev.contact, whatsappNumber: value } }))}
          />
          <Field
            label="Top Bar Response Text"
            value={draft.contact.responseText}
            onChange={(value) => setDraft((prev) => ({ ...prev, contact: { ...prev.contact, responseText: value } }))}
          />
          <div className="lg:col-span-2">
            <TextArea
              label="WhatsApp Message"
              value={draft.contact.whatsappMessage}
              onChange={(value) => setDraft((prev) => ({ ...prev, contact: { ...prev.contact, whatsappMessage: value } }))}
            />
          </div>
          <Field
            label="Google Maps Link"
            value={draft.contact.mapUrl}
            onChange={(value) => setDraft((prev) => ({ ...prev, contact: { ...prev.contact, mapUrl: value } }))}
          />
          <Field
            label="Google Maps Embed URL"
            value={draft.contact.mapEmbedUrl}
            onChange={(value) => setDraft((prev) => ({ ...prev, contact: { ...prev.contact, mapEmbedUrl: value } }))}
          />
        </div>
      </Panel>
    </div>
  );

  const renderHero = () => (
    <Panel title="Hero Banner" description="Controls the main home page banner and call-to-action buttons.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Field
          label="Badge"
          value={draft.hero.badge}
          onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, badge: value } }))}
        />
        <Field
          label="Primary CTA Text"
          value={draft.hero.primaryCtaText}
          onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaText: value } }))}
        />
        <div className="lg:col-span-2">
          <Field
            label="Hero Title"
            value={draft.hero.title}
            onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, title: value } }))}
          />
        </div>
        <div className="lg:col-span-2">
          <TextArea
            label="Hero Subtitle"
            value={draft.hero.subtitle}
            onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: value } }))}
          />
        </div>
        <Field
          label="Primary CTA Link"
          value={draft.hero.primaryCtaLink}
          onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaLink: value } }))}
        />
        <Field
          label="Secondary CTA Text"
          value={draft.hero.secondaryCtaText}
          onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaText: value } }))}
        />
        <Field
          label="Secondary CTA Link"
          value={draft.hero.secondaryCtaLink}
          onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaLink: value } }))}
        />
        <div className="lg:col-span-2">
          <ImageField
            label="Hero Image"
            value={draft.hero.imageUrl}
            onChange={(value) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, imageUrl: value } }))}
            onUpload={uploadImage}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Hero Stats</h3>
          <button
            type="button"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                hero: { ...prev.hero, stats: [...prev.hero.stats, { value: '100+', label: 'New Stat' }] },
              }))
            }
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Stat
          </button>
        </div>
        {draft.hero.stats.map((stat, index) => (
          <div key={`${stat.value}-${index}`} className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto]">
            <Field
              label="Value"
              value={stat.value}
              onChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    stats: prev.hero.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, value } : item)),
                  },
                }))
              }
            />
            <Field
              label="Label"
              value={stat.label}
              onChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    stats: prev.hero.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, label: value } : item)),
                  },
                }))
              }
            />
            <button
              type="button"
              onClick={() => {
                if (!confirmAction('Delete this hero stat?')) return;
                setDraft((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, stats: prev.hero.stats.filter((_, itemIndex) => itemIndex !== index) },
                }));
              }}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-rose-700"
              title="Delete stat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );

  const renderAbout = () => (
    <Panel title="About Us Content" description="Edit the main about page copy and image.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Field
          label="Badge"
          value={draft.about.badge}
          onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, badge: value } }))}
        />
        <Field
          label="Title"
          value={draft.about.title}
          onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, title: value } }))}
        />
        <div className="lg:col-span-2">
          <TextArea
            label="Subtitle"
            value={draft.about.subtitle}
            onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, subtitle: value } }))}
          />
        </div>
        <div className="lg:col-span-2">
          <ImageField
            label="About Image"
            value={draft.about.imageUrl}
            onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, imageUrl: value } }))}
            onUpload={uploadImage}
          />
        </div>
        <div className="lg:col-span-2">
          <Field
            label="Story Title"
            value={draft.about.storyTitle}
            onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, storyTitle: value } }))}
          />
        </div>
        <div className="lg:col-span-2">
          <TextArea
            label="Story Paragraphs"
            value={toLines(draft.about.storyParagraphs)}
            onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, storyParagraphs: fromLines(value) } }))}
            rows={7}
          />
        </div>
        <Field
          label="Mission Title"
          value={draft.about.missionTitle}
          onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, missionTitle: value } }))}
        />
        <Field
          label="Values Title"
          value={draft.about.valuesTitle}
          onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, valuesTitle: value } }))}
        />
        <TextArea
          label="Mission Text"
          value={draft.about.missionText}
          onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, missionText: value } }))}
        />
        <TextArea
          label="Values Text"
          value={draft.about.valuesText}
          onChange={(value) => setDraft((prev) => ({ ...prev, about: { ...prev.about, valuesText: value } }))}
        />
      </div>
    </Panel>
  );

  const renderServices = () => (
    <Panel
      title="Website Services"
      description="Add, edit, delete, and reorder the service catalog shown on the website."
      action={
        <button type="button" onClick={addServiceItem} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-extrabold text-white">
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      }
    >
      <div className="space-y-4">
        {draft.services.map((service, index) => (
          <div key={service.id || index} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-slate-900">{service.title || 'Untitled Service'}</p>
                <p className="text-xs text-slate-500">{service.active === false ? 'Hidden from website' : 'Visible on website'}</p>
              </div>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={service.active !== false}
                    onChange={(event) => updateServiceItem(index, { active: event.target.checked })}
                  />
                  Visible
                </label>
                <button
                  type="button"
                  onClick={() => deleteServiceItem(index)}
                  className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-rose-700"
                  title="Delete service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Title" value={service.title} onChange={(value) => updateServiceItem(index, { title: value })} />
              <Field label="Short Label" value={service.short} onChange={(value) => updateServiceItem(index, { short: value })} />
              <Field label="Icon" value={service.icon || 'Settings'} onChange={(value) => updateServiceItem(index, { icon: value })} />
              <Field label="Sort Order" type="number" value={service.sortOrder || index + 1} onChange={(value) => updateServiceItem(index, { sortOrder: Number(value) || index + 1 })} />
              <Field label="Accent Classes" value={service.accent || ''} onChange={(value) => updateServiceItem(index, { accent: value })} />
              <div className="lg:col-span-2">
                <TextArea label="Description" value={service.description} onChange={(value) => updateServiceItem(index, { description: value })} />
              </div>
              <div className="lg:col-span-2">
                <TextArea
                  label="Features"
                  value={toLines(service.features)}
                  onChange={(value) => updateServiceItem(index, { features: fromLines(value) })}
                  rows={5}
                />
              </div>
              <div className="lg:col-span-2">
                <ImageField
                  label="Service Image"
                  value={service.imageUrl}
                  onChange={(value) => updateServiceItem(index, { imageUrl: value })}
                  onUpload={uploadImage}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );

  const renderProjects = () => (
    <Panel
      title="Projects"
      description="Manage portfolio projects and their image galleries."
      action={
        <button type="button" onClick={addProjectItem} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-extrabold text-white">
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      }
    >
      <div className="space-y-4">
        {draft.projects.map((project, index) => (
          <div key={project.id || index} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-slate-900">{project.title || 'Untitled Project'}</p>
                <p className="text-xs text-slate-500">{project.location || 'Location not set'}</p>
              </div>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={project.active !== false}
                    onChange={(event) => updateProjectItem(index, { active: event.target.checked })}
                  />
                  Visible
                </label>
                <button
                  type="button"
                  onClick={() => deleteProjectItem(index)}
                  className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-rose-700"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Title" value={project.title} onChange={(value) => updateProjectItem(index, { title: value })} />
              <Field label="Client" value={project.client} onChange={(value) => updateProjectItem(index, { client: value })} />
              <Field label="Location" value={project.location} onChange={(value) => updateProjectItem(index, { location: value })} />
              <Field label="Type" value={project.type} onChange={(value) => updateProjectItem(index, { type: value })} />
              <Field label="Year" value={project.year} onChange={(value) => updateProjectItem(index, { year: value })} />
              <Field label="Sort Order" type="number" value={project.sortOrder || index + 1} onChange={(value) => updateProjectItem(index, { sortOrder: Number(value) || index + 1 })} />
              <div className="lg:col-span-2">
                <TextArea label="Card Description" value={project.description} onChange={(value) => updateProjectItem(index, { description: value })} />
              </div>
              <div className="lg:col-span-2">
                <TextArea label="Project Details" value={project.details} onChange={(value) => updateProjectItem(index, { details: value })} rows={5} />
              </div>
              <div className="lg:col-span-2">
                <TextArea
                  label="Features"
                  value={toLines(project.features)}
                  onChange={(value) => updateProjectItem(index, { features: fromLines(value) })}
                  rows={5}
                />
              </div>
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={labelClass}>Project Images</span>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700">
                    <Upload className="h-4 w-4" />
                    Add Image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const url = await uploadImage(file);
                        if (url) {
                          updateProjectItem(index, { images: [...project.images, url] });
                        }
                        event.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {project.images.map((image, imageIndex) => (
                    <div key={`${image}-${imageIndex}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      <img src={resolveMediaUrl(image)} alt={`${project.title} ${imageIndex + 1}`} className="h-32 w-full object-cover" />
                      <div className="flex gap-2 p-2">
                        <input
                          value={image}
                          onChange={(event) =>
                            updateProjectItem(index, {
                              images: project.images.map((item, itemIndex) => (itemIndex === imageIndex ? event.target.value : item)),
                            })
                          }
                          className={`${inputClass} py-2 text-xs`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirmAction('Delete this project image?')) return;
                            updateProjectItem(index, { images: project.images.filter((_, itemIndex) => itemIndex !== imageIndex) });
                          }}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2 text-rose-700"
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );

  const renderGallery = () => (
    <Panel
      title="Gallery Images"
      description="Manage gallery photos, categories, and descriptions."
      action={
        <button type="button" onClick={addGalleryItem} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-extrabold text-white">
          <Plus className="h-4 w-4" />
          Add Image
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {draft.galleryImages.map((item, index) => (
          <div key={item.id || index} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-slate-900">{item.title || 'Untitled Image'}</p>
                <p className="text-xs text-slate-500">{item.categoryLabel || item.category}</p>
              </div>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={item.active !== false}
                    onChange={(event) => updateGalleryItem(index, { active: event.target.checked })}
                  />
                  Visible
                </label>
                <button
                  type="button"
                  onClick={() => deleteGalleryItem(index)}
                  className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-rose-700"
                  title="Delete gallery image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <ImageField
                label="Gallery Image"
                value={item.imageUrl}
                onChange={(value) => updateGalleryItem(index, { imageUrl: value })}
                onUpload={uploadImage}
                compact
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title" value={item.title} onChange={(value) => updateGalleryItem(index, { title: value })} />
                <Field label="Location" value={item.location} onChange={(value) => updateGalleryItem(index, { location: value })} />
                <Field label="Category Key" value={item.category} onChange={(value) => updateGalleryItem(index, { category: value })} />
                <Field label="Category Label" value={item.categoryLabel} onChange={(value) => updateGalleryItem(index, { categoryLabel: value })} />
                <Field label="Sort Order" type="number" value={item.sortOrder || index + 1} onChange={(value) => updateGalleryItem(index, { sortOrder: Number(value) || index + 1 })} />
              </div>
              <TextArea label="Description" value={item.description} onChange={(value) => updateGalleryItem(index, { description: value })} />
              <TextArea label="Features" value={toLines(item.features)} onChange={(value) => updateGalleryItem(index, { features: fromLines(value) })} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );

  const renderTestimonials = () => (
    <div className="space-y-6">
      <Panel title={testimonialForm._id ? 'Edit Testimonial' : 'Add Testimonial'} description="Approved testimonials appear in the customer reviews section.">
        <form onSubmit={saveTestimonial} className="grid gap-4 lg:grid-cols-2">
          <Field label="Customer Name" value={testimonialForm.name} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, name: value }))} />
          <Field label="Email" value={testimonialForm.email} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, email: value }))} />
          <Field label="Mobile" value={testimonialForm.mobile} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, mobile: value }))} />
          <Field label="Company / Building" value={testimonialForm.companyBuilding} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, companyBuilding: value }))} />
          <Field label="Location" value={testimonialForm.location} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, location: value }))} />
          <Field label="Service Used" value={testimonialForm.serviceUsed} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, serviceUsed: value }))} />
          <Field label="Rating" type="number" value={testimonialForm.rating} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, rating: Number(value) || 5 }))} />
          <label className="block">
            <span className={labelClass}>Status</span>
            <select
              value={testimonialForm.status}
              onChange={(event) => setTestimonialForm((prev) => ({ ...prev, status: event.target.value as ReviewItem['status'] }))}
              className={inputClass}
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <div className="lg:col-span-2">
            <ImageField
              label="Profile Image"
              value={testimonialForm.profileUrl}
              onChange={(value) => setTestimonialForm((prev) => ({ ...prev, profileUrl: value }))}
              onUpload={uploadImage}
            />
          </div>
          <div className="lg:col-span-2">
            <TextArea label="Review" value={testimonialForm.review} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, review: value }))} rows={5} />
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <button
              type="submit"
              disabled={busyAction === 'testimonial-save'}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {busyAction === 'testimonial-save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {testimonialForm._id ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
            {testimonialForm._id && (
              <button
                type="button"
                onClick={() => setTestimonialForm(blankTestimonial)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="Review Moderation" description="Approve, reject, edit, or delete Google-style website testimonials.">
        <div className="mb-4 grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setReviewFilter(filter)}
              className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition-all ${
                reviewFilter === filter ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        {filteredReviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-500">
            No testimonials found.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredReviews.map((review) => (
              <article key={review._id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    {review.profileUrl ? (
                      <img src={resolveMediaUrl(review.profileUrl)} alt={`${review.name} profile`} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 font-extrabold text-white">
                        {review.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-slate-950">{review.name}</h3>
                      <p className="truncate text-xs font-semibold text-blue-700">{review.serviceUsed || 'Website Review'}</p>
                      <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${statusBadgeClass[review.status]}`}>
                    {reviewStatusLabels[review.status]}
                  </span>
                </div>
                <div className="mt-3 flex text-amber-400">
                  {Array.from({ length: Math.max(1, Math.min(5, Number(review.rating) || 5)) }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">&ldquo;{review.review}&rdquo;</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(['approved', 'pending', 'rejected'] as ReviewItem['status'][]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateReviewStatus(review, status)}
                      disabled={busyAction === `review-${review._id}-${status}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 disabled:opacity-60"
                    >
                      {busyAction === `review-${review._id}-${status}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      {reviewStatusLabels[status]}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setTestimonialForm({
                        _id: review._id,
                        name: review.name || '',
                        email: review.email || '',
                        mobile: review.mobile || '',
                        companyBuilding: review.companyBuilding || '',
                        location: review.location || '',
                        serviceUsed: review.serviceUsed || 'Website Review',
                        rating: review.rating || 5,
                        review: review.review || '',
                        profileUrl: review.profileUrl || '',
                        status: review.status,
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTestimonial(review)}
                    disabled={busyAction === `review-delete-${review._id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700 disabled:opacity-60"
                  >
                    {busyAction === `review-delete-${review._id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );

  const renderFooter = () => (
    <Panel title="Footer Content" description="Edit footer summary, copyright, note, and quick links.">
      <div className="space-y-5">
        <TextArea
          label="Footer Description"
          value={draft.footer.description}
          onChange={(value) => setDraft((prev) => ({ ...prev, footer: { ...prev.footer, description: value } }))}
        />
        <Field
          label="Copyright"
          value={draft.footer.copyright}
          onChange={(value) => setDraft((prev) => ({ ...prev, footer: { ...prev.footer, copyright: value } }))}
        />
        <Field
          label="Bottom Note"
          value={draft.footer.bottomNote}
          onChange={(value) => setDraft((prev) => ({ ...prev, footer: { ...prev.footer, bottomNote: value } }))}
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Quick Links</h3>
            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  footer: {
                    ...prev.footer,
                    quickLinks: [...prev.footer.quickLinks, { label: 'New Link', url: '/' }],
                  },
                }))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>
          {draft.footer.quickLinks.map((link, index) => (
            <div key={`${link.label}-${index}`} className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto]">
              <Field
                label="Label"
                value={link.label}
                onChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      quickLinks: prev.footer.quickLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, label: value } : item)),
                    },
                  }))
                }
              />
              <Field
                label="URL"
                value={link.url}
                onChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      quickLinks: prev.footer.quickLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, url: value } : item)),
                    },
                  }))
                }
              />
              <button
                type="button"
                onClick={() => {
                  if (!confirmAction('Delete this quick link?')) return;
                  setDraft((prev) => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      quickLinks: prev.footer.quickLinks.filter((_, itemIndex) => itemIndex !== index),
                    },
                  }));
                }}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-rose-700"
                title="Delete link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );

  const renderSeo = () => {
    const paths = ['/', '/about', '/services', '/projects', '/gallery', '/contact'];

    return (
      <Panel title="SEO Settings" description="Edit title, description, and keywords used in browser and search metadata.">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field
              label="Default SEO Title"
              value={draft.seo.defaultTitle}
              onChange={(value) => setDraft((prev) => ({ ...prev, seo: { ...prev.seo, defaultTitle: value } }))}
            />
            <Field
              label="Default Keywords"
              value={draft.seo.defaultKeywords}
              onChange={(value) => setDraft((prev) => ({ ...prev, seo: { ...prev.seo, defaultKeywords: value } }))}
            />
            <div className="lg:col-span-2">
              <TextArea
                label="Default Description"
                value={draft.seo.defaultDescription}
                onChange={(value) => setDraft((prev) => ({ ...prev, seo: { ...prev.seo, defaultDescription: value } }))}
              />
            </div>
          </div>

          {paths.map((path) => {
            const page = draft.seo.pages[path] || { title: '', description: '', keywords: '' };

            return (
              <div key={path} className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-4 text-sm font-extrabold text-slate-950">{path === '/' ? 'Home' : path}</h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field
                    label="Title"
                    value={page.title}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          pages: { ...prev.seo.pages, [path]: { ...page, title: value } },
                        },
                      }))
                    }
                  />
                  <Field
                    label="Keywords"
                    value={page.keywords || ''}
                    onChange={(value) =>
                      setDraft((prev) => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          pages: { ...prev.seo.pages, [path]: { ...page, keywords: value } },
                        },
                      }))
                    }
                  />
                  <div className="lg:col-span-2">
                    <TextArea
                      label="Description"
                      value={page.description}
                      onChange={(value) =>
                        setDraft((prev) => ({
                          ...prev,
                          seo: {
                            ...prev.seo,
                            pages: { ...prev.seo.pages, [path]: { ...page, description: value } },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    );
  };

  const renderRequests = () => (
    <Panel title="Service Requests" description="Operational requests from the public service form. Mark completed to trigger review email flow.">
      {services.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-500">
          No service requests found.
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <article key={service._id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-950">{service.name}</h3>
                    <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${statusBadgeClass[service.status]}`}>
                      {statusLabels[service.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-blue-700">{service.serviceType}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.message || 'No service notes added.'}</p>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                  {(['pending', 'in_progress', 'completed'] as ServiceRequest['status'][]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={busyAction === `service-${service._id}-${status}`}
                      onClick={() => updateServiceStatus(service, status)}
                      className={`rounded-lg px-3 py-2 text-[11px] font-extrabold transition-all ${
                        service.status === status ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-600 hover:text-blue-700'
                      } disabled:opacity-60`}
                    >
                      {busyAction === `service-${service._id}-${status}` ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 md:grid-cols-4">
                <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-blue-600" />{service.email}</span>
                <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-blue-600" />{service.phone}</span>
                <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-blue-600" />{service.address}</span>
                <span className="flex items-center gap-2"><Send className="h-3.5 w-3.5 text-blue-600" />Review: {service.reviewEmailStatus || 'not_sent'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </Panel>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'branding':
        return renderBranding();
      case 'contact':
        return renderContact();
      case 'hero':
        return renderHero();
      case 'about':
        return renderAbout();
      case 'services':
        return renderServices();
      case 'projects':
        return renderProjects();
      case 'gallery':
        return renderGallery();
      case 'testimonials':
        return renderTestimonials();
      case 'footer':
        return renderFooter();
      case 'seo':
        return renderSeo();
      case 'requests':
        return renderRequests();
      default:
        return renderOverview();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="hidden bg-slate-950 p-10 text-white lg:block">
              <div className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Shield className="h-4 w-4" />
                Secure Admin Portal
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight">
                Manage live website content without touching code.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Update branding, contact details, banners, gallery, projects, services, testimonials, footer, and SEO from one protected dashboard.
              </p>
            </div>
            <div className="p-7 text-slate-950 sm:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-amber-500 text-white">
                  <Shield className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-extrabold">Admin Login</h2>
                <p className="mt-2 text-sm text-slate-500">Sign in to manage website content.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="username" className={labelClass}>Username or Email</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      required
                      className={`${inputClass} pl-10`}
                      placeholder="Enter username or email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className={`${inputClass} pl-10 pr-11`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 rounded-lg p-1 text-slate-400 hover:text-slate-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-colors hover:from-amber-400 hover:to-orange-400 disabled:opacity-60"
                >
                  {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                First-time setup?{' '}
                <Link to="/admin/register" className="font-bold text-blue-700 hover:text-blue-800">
                  Create the initial admin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-800 bg-slate-950 text-white transition-transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="text-sm font-extrabold">Admin Panel</p>
            <p className="text-xs text-slate-400">{admin?.name || admin?.username || 'Admin'}</p>
          </div>
          <button type="button" onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-2 text-slate-400 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
          {sectionItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                  isActive ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {isSidebarOpen && <button type="button" aria-label="Close sidebar" className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setIsSidebarOpen(true)} className="rounded-lg border border-slate-200 p-2 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Swastik Website Control</p>
                <h1 className="text-xl font-extrabold text-slate-950">{sectionItems.find((item) => item.id === activeSection)?.label || 'Dashboard'}</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadDashboard()}
                disabled={isLoadingDashboard}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-700 disabled:opacity-60"
              >
                {isLoadingDashboard ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </button>
              <button
                type="button"
                onClick={saveSiteContent}
                disabled={isSavingContent}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-extrabold text-white disabled:opacity-60"
              >
                {isSavingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Publish Changes
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-xs font-extrabold text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {isLoadingDashboard ? (
            <div className="flex min-h-[50vh] items-center justify-center rounded-lg border border-slate-200 bg-white">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-700" />
                <p className="mt-4 text-sm font-bold text-slate-600">Loading admin dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {activeSection !== 'overview' && activeSection !== 'requests' && activeSection !== 'testimonials' && (
                <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>Edits are saved as a draft in this browser until you click Publish Changes.</p>
                </div>
              )}
              {renderActiveSection()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
