import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/api';

type ReviewFormData = {
  token: string;
  name: string;
  email: string;
  mobile: string;
  companyBuilding: string;
  location: string;
  serviceUsed: string;
  review: string;
  profileUrl: string;
};

type InviteResponse = {
  success?: boolean;
  message?: string;
  data?: {
    isSubmitted?: boolean;
    reviewStatus?: string | null;
    customer?: Partial<ReviewFormData>;
  };
};

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleJwtPayload = {
  name?: string;
  email?: string;
  picture?: string;
};

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      type?: 'standard' | 'icon';
      shape?: 'pill' | 'rectangular' | 'circle' | 'square';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      width?: number;
    }
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

type PublicReview = {
  id: string;
  name: string;
  email?: string;
  company?: string;
  location?: string;
  serviceUsed?: string;
  rating: number;
  review: string;
  profileUrl?: string;
  photoUrl?: string;
};

const initialFormData = (token = ''): ReviewFormData => ({
  token,
  name: '',
  email: '',
  mobile: '',
  companyBuilding: '',
  location: '',
  serviceUsed: '',
  review: '',
  profileUrl: '',
});

const GOOGLE_SCRIPT_ID = 'google-identity-services-script';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-500';

const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-600';

const getReviewInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'S';

const getEmailProfileUrl = (email: string, size = 96) => {
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail
    ? `https://unavatar.io/email/${encodeURIComponent(normalizedEmail)}?size=${size}&fallback=false`
    : '';
};

const loadGoogleIdentityScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Google sign-in could not load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google sign-in could not load.'));
    document.head.appendChild(script);
  });

const decodeGoogleCredential = (credential: string): GoogleJwtPayload | null => {
  try {
    const payload = credential.split('.')[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode Google profile:', error);
    return null;
  }
};

const EmailProfileAvatar = ({
  name,
  profileUrl,
  className = 'h-9 w-9',
  initialClassName = 'text-sm',
}: {
  name: string;
  profileUrl?: string;
  className?: string;
  initialClassName?: string;
}) => {
  const [showImage, setShowImage] = useState(Boolean(profileUrl));

  useEffect(() => {
    setShowImage(Boolean(profileUrl));
  }, [profileUrl]);

  if (profileUrl && showImage) {
    return (
      <img
        src={profileUrl}
        alt={`${name || 'Customer'} profile`}
        className={`${className} shrink-0 rounded-full border border-blue-100 object-cover`}
        loading="lazy"
        onError={() => setShowImage(false)}
      />
    );
  }

  return (
    <div className={`${className} ${initialClassName} flex shrink-0 items-center justify-center rounded-full bg-blue-700 font-extrabold text-white`}>
      {getReviewInitial(name)}
    </div>
  );
};

const WriteReview = () => {
  const [searchParams] = useSearchParams();
  const inviteToken = useMemo(
    () => searchParams.get('reviewToken')?.trim() || searchParams.get('token')?.trim() || '',
    [searchParams]
  );
  const [formData, setFormData] = useState<ReviewFormData>(() => initialFormData(inviteToken));
  const [isLoadingInvite, setIsLoadingInvite] = useState(Boolean(inviteToken));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkMessage, setLinkMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(Boolean(inviteToken));
  const [approvedReviews, setApprovedReviews] = useState<PublicReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const isFormReady = !isLoadingInvite && !linkMessage;

  useEffect(() => {
    setFormData(initialFormData(inviteToken));
    setLinkMessage('');
    setIsFormVisible(Boolean(inviteToken));

    if (!inviteToken) {
      setIsLoadingInvite(false);
      return;
    }

    const loadInvite = async () => {
      setIsLoadingInvite(true);

      try {
        const response = await fetch(apiUrl(`/api/reviews/token/${encodeURIComponent(inviteToken)}`));
        const data: InviteResponse = await response.json().catch(() => ({}));

        if (!response.ok || !data?.success) {
          setLinkMessage(data?.message || 'This review link is invalid or expired.');
          return;
        }

        if (data.data?.isSubmitted) {
          setLinkMessage(
            data.data.reviewStatus === 'approved'
              ? 'Your review has already been approved. Thank you for sharing your experience.'
              : 'Your review has already been submitted. Thank you for sharing your experience.'
          );
          return;
        }

        const customer = data.data?.customer || {};
        setFormData((prev) => ({
          ...prev,
          token: inviteToken,
          name: customer.name || '',
          email: customer.email || '',
          mobile: customer.mobile || '',
          companyBuilding: customer.companyBuilding || '',
          location: customer.location || '',
          serviceUsed: customer.serviceUsed || '',
          profileUrl: customer.profileUrl || '',
        }));
      } catch (error) {
        console.error('Failed to load review invite:', error);
        setLinkMessage('We could not load this review link. Please try again later.');
      } finally {
        setIsLoadingInvite(false);
      }
    };

    loadInvite();
  }, [inviteToken]);

  useEffect(() => {
    const loadApprovedReviews = async () => {
      try {
        const response = await fetch(apiUrl('/api/reviews/approved'));
        const data = await response.json().catch(() => null);

        if (response.ok && data?.success && Array.isArray(data.data)) {
          setApprovedReviews(data.data);
        }
      } catch (error) {
        console.error('Failed to load approved reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadApprovedReviews();
  }, []);

  useEffect(() => {
    if (!isFormVisible || !isFormReady || !googleClientId || !googleButtonRef.current) {
      return undefined;
    }

    let isMounted = true;

    loadGoogleIdentityScript()
      .then(() => {
        if (!isMounted || !googleButtonRef.current || !window.google?.accounts?.id) {
          return;
        }

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            const profile = response.credential ? decodeGoogleCredential(response.credential) : null;

            if (!profile?.email) {
              toast({
                title: 'Google Profile Failed',
                description: 'Please try again or enter your Gmail manually.',
                variant: 'destructive',
                duration: 3500,
              });
              return;
            }

            setFormData((prev) => ({
              ...prev,
              name: profile.name || prev.name,
              email: profile.email || prev.email,
              profileUrl: profile.picture || getEmailProfileUrl(profile.email || prev.email),
            }));
            toast({
              title: 'Google Profile Added',
              description: 'Your review will use your Google profile photo.',
              duration: 2500,
            });
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: Math.min(360, googleButtonRef.current.offsetWidth || 320),
        });
      })
      .catch((error) => {
        console.error('Google sign-in failed to load:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [isFormReady, isFormVisible, toast]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'email' ? { profileUrl: getEmailProfileUrl(value) } : {}),
    }));
  };

  const validateForm = () => {
    if (!isFormReady) {
      toast({
        title: 'Review Form Unavailable',
        description: linkMessage || 'Please wait while we prepare your review form.',
        variant: 'destructive',
        duration: 4000,
      });
      return false;
    }

    if (!formData.name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name.',
        variant: 'destructive',
        duration: 4000,
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast({
        title: 'Email Required',
        description: 'Please enter your Gmail address for the profile photo.',
        variant: 'destructive',
        duration: 4000,
      });
      return false;
    }

    if (!formData.review.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please write your review message.',
        variant: 'destructive',
        duration: 4000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token,
          name: formData.name,
          email: formData.email,
          profileUrl: formData.profileUrl,
          review: formData.review,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Review submission failed. Please try again.');
      }

      const submittedReview = data.data?.id
        ? data.data
        : {
            id: `local-${Date.now()}`,
            name: formData.name.trim(),
            serviceUsed: formData.serviceUsed || 'Website Review',
            rating: 5,
            review: formData.review.trim(),
            profileUrl: formData.profileUrl || getEmailProfileUrl(formData.email),
          };

      setApprovedReviews((prev) => [
        submittedReview,
        ...prev.filter((review) => review.id !== submittedReview.id),
      ].slice(0, 12));
      setIsFormVisible(false);
      setFormData((prev) => ({
        ...initialFormData(inviteToken),
        email: prev.email,
        mobile: prev.mobile,
        companyBuilding: prev.companyBuilding,
        location: prev.location,
        serviceUsed: prev.serviceUsed,
        profileUrl: prev.profileUrl,
      }));
      toast({
        title: 'Review Submitted',
        description: data.message || 'Thank you. Your review is now visible on the website.',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowForm = () => {
    setIsFormVisible(true);
    window.requestAnimationFrame(() => {
      document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <section id="reviews" className="scroll-mt-24 border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto mb-6 max-w-2xl text-center sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Customer Feedback
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Customer <span className="text-blue-700">Reviews</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Genuine feedback from completed Swastik Elevator services and projects.
            </p>
          </motion.div>

          <div className="mb-10 flex justify-center">
            <button
              type="button"
              onClick={handleShowForm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:from-amber-400 hover:to-orange-400"
            >
              <Star className="h-4 w-4 fill-current" />
              <span>Write a Review</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {isFormVisible && (
          <motion.div
            id="review-form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="mx-auto max-w-4xl scroll-mt-24"
          >
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-blue-950/8">
              <div className="flex items-center justify-between gap-4 bg-slate-950 px-5 py-4 text-white sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-slate-950">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Swastik Elevator</p>
                    <h2 className="truncate text-base font-extrabold sm:text-lg">Customer Review Form</h2>
                  </div>
                </div>
                <div className="hidden items-center gap-0.5 text-amber-400 sm:flex" aria-label="Five star review">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>

              {isFormReady ? (
                <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
                  {googleClientId && (
                    <div className="mx-auto flex max-w-2xl justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-3">
                      <div ref={googleButtonRef} className="min-h-10 w-full max-w-[360px]" />
                    </div>
                  )}

                  <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-emerald-800">
                    <EmailProfileAvatar name={formData.name} profileUrl={formData.profileUrl} className="h-12 w-12" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-950">
                        {formData.name || 'Verified customer'}
                      </p>
                      <p className="text-xs font-semibold text-emerald-800">
                        {formData.profileUrl ? 'Profile linked with your service email.' : 'Ready to submit your review.'}
                      </p>
                    </div>
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                  </div>

                  <div className="mx-auto max-w-2xl space-y-4">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={!isFormReady}
                          className={`${fieldClass} pl-10`}
                          placeholder="Your name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Gmail *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={!isFormReady}
                          className={`${fieldClass} pl-10`}
                          placeholder="yourname@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="review" className={labelClass}>
                          Message *
                        </label>
                        <p className="text-xs font-medium text-slate-400">{formData.review.length}/1200</p>
                      </div>
                      <textarea
                        id="review"
                        name="review"
                        value={formData.review}
                        onChange={handleInputChange}
                        rows={4}
                        maxLength={1200}
                        required
                        disabled={!isFormReady}
                        className={`${fieldClass} min-h-32 resize-none`}
                        placeholder="Apna experience yahan likhiye..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-slate-500">Your review will appear on the home page after submission.</p>
                    <button
                      type="submit"
                      disabled={!isFormReady || isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:from-amber-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-5 py-8 text-center sm:px-8 sm:py-10">
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-lg ${
                      isLoadingInvite ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {isLoadingInvite ? <Loader2 className="h-6 w-6 animate-spin" /> : <AlertTriangle className="h-6 w-6" />}
                  </div>
                  <h2 className="mt-4 text-lg font-extrabold text-slate-950">
                    {isLoadingInvite ? 'Preparing your review form' : 'Your secure review link is needed'}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                    {isLoadingInvite
                      ? 'We are loading your completed-service details.'
                      : linkMessage || 'Please use the unique review link sent to your registered email after service completion.'}
                  </p>
                  {!isLoadingInvite && (
                    <Link
                      to="/contact"
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      <span>Need help?</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          )}

          <div className="mt-8 sm:mt-10">
            {isLoadingReviews ? (
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`review-placeholder-${index}`}
                    className="h-56 animate-pulse rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-6 h-3 rounded bg-slate-200" />
                    <div className="mt-3 h-3 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-slate-200" />
                    <div className="mt-8 h-8 w-32 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : approvedReviews.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approvedReviews.map((review) => {
                  const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));

                  return (
                    <article
                      key={review.id}
                      className="flex min-h-72 flex-col items-center rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                    >
                      <EmailProfileAvatar
                        name={review.name}
                        profileUrl={review.profileUrl || review.photoUrl}
                        className="h-20 w-20"
                        initialClassName="text-2xl"
                      />

                      <p className="mt-6 flex-1 text-base leading-7 text-slate-700">&ldquo;{review.review}&rdquo;</p>

                      <div className="mt-4 flex gap-0.5 text-amber-400" aria-label={`${rating} star rating`}>
                        {Array.from({ length: rating }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-current" />
                        ))}
                      </div>

                      <p className="mt-5 max-w-full truncate text-lg font-extrabold text-slate-950">{review.name}</p>
                      <p className="mt-1 max-w-full truncate text-sm text-slate-500">
                        {review.serviceUsed || 'Verified Service Customer'}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto mt-8 max-w-2xl border-y border-slate-200 bg-white px-6 py-9 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <h3 className="mt-3 text-base font-extrabold text-slate-950">Customer feedback is coming soon</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Approved reviews from completed services will appear here.
                </p>
              </div>
            )}

          </div>
        </div>
    </section>
  );
};

export default WriteReview;
