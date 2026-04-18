// app/product/[slug]/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  User,
  ShoppingCart,
  Minus,
  Plus,
  CheckCircle,
  MessageCircle,
  Calendar,
  Phone,
  FileText,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search,
  Utensils,
  ClipboardList,
  Users,
  Shield,
  Award,
  Zap,
  MapPin,
  ThumbsUp,
} from "lucide-react";
import { ProductApi } from "../../lib/ProductApi";
import {useCart} from "../../context/CartContext";
import ScheduleCallModal from "../../components/ScheduleCallModal";
// -------------------- Helper Components --------------------

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#F4FAFB] via-white to-[#E8F4F7]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl aspect-square"></div>
          <div className="flex gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

// Star Rating Component
const StarRating = ({ rating, reviewCount, size = 16 }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
    <span className="text-sm text-[#64748B]">({reviewCount} reviews)</span>
  </div>
);

// Quantity Selector
const QuantitySelector = ({ quantity, setQuantity, stock }) => (
  <div className="flex items-center gap-3 border border-[#D9EEF2] rounded-xl px-4 py-2 bg-white shadow-sm">
    <button
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      className="p-1 hover:bg-[#F4FAFB] rounded-lg transition"
    >
      <Minus size={16} className="text-[#18606D]" />
    </button>
    <span className="w-8 text-center font-medium text-[#1A4D3E]">{quantity}</span>
    <button
      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
      className="p-1 hover:bg-[#F4FAFB] rounded-lg transition"
    >
      <Plus size={16} className="text-[#18606D]" />
    </button>
  </div>
);

// Auto icon mapping for benefits
const getBenefitIcon = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("diagnosis") || lower.includes("severity")) return <Search size={20} />;
  if (lower.includes("nutrition") || lower.includes("supplement")) return <Utensils size={20} />;
  if (lower.includes("plan") || lower.includes("personalised")) return <ClipboardList size={20} />;
  if (lower.includes("expert") || lower.includes("certified")) return <Users size={20} />;
  if (lower.includes("solution") || lower.includes("clear")) return <CheckCircle size={20} />;
  if (lower.includes("eliminate") || lower.includes("dysbiosis")) return <Shield size={20} />;
  return <Zap size={20} />;
};

// Auto icon for What to Expect
const getWhatToExpectIcon = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("consult")) return <Users size={20} />;
  if (lower.includes("solution")) return <CheckCircle size={20} />;
  if (lower.includes("eliminate")) return <Shield size={20} />;
  return <ThumbsUp size={20} />;
};

// Extract highlights from description (split by "|")
const extractHighlights = (description) => {
  if (!description) return [];
  const parts = description.split("|").map((p) => p.trim());
  return parts.filter((p) => p.length > 0 && p.length < 100);
};

// -------------------- Main Component --------------------
export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [toast, setToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const {addToCart} = useCart();
  const heroRef = useRef(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Mock reviews with rating breakdown
  const mockReviews = [
    {
      name: "Max Kushnir",
      role: "Chief Scientist",
      rating: 5,
      comment:
        "I had been experiencing frequent diarrhoea and felt lost. My session was so helpful – she pinpointed possible triggers and gave me the right guidance. I feel more in control now.",
    },
    {
      name: "Sunita Agarwal",
      rating: 5,
      comment:
        "My low energy and sluggish digestion were affecting my work. Gargi’s insights were invaluable—she suggested minor dietary shifts that have proven efficient.",
    },
    {
      name: "Reshma Choudhary",
      rating: 5,
      comment:
        "Indigestion and constipation were my biggest struggles. Gargi helped me understand why and provided a structured plan with simple diet changes.",
    },
    {
      name: "Harinder Singh",
      rating: 5,
      comment:
        "Bloating had become a daily struggle. My consultation was a game-changer! He explained the root cause and gave me a solid plan.",
    },
    {
      name: "Gulshan Mirza",
      rating: 5,
      comment:
        "Fatigue and gut issues had me feeling low. The consultation helped me understand the root cause, and food suggestions were easy to follow.",
    },
  ];

  // Rating breakdown (mock)
  const ratingBreakdown = {
    5: 68,
    4: 20,
    3: 8,
    2: 3,
    1: 1,
  };

  useEffect(() => {
    if (slug) fetchProduct();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  const handleScroll = () => {
    if (window.scrollY > 300) setShowScrollTop(true);
    else setShowScrollTop(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await ProductApi.getProductBySlug(slug);
      setProduct(res.product);
      if (res.product.imageUrls?.length) setMainImage(res.product.imageUrls[0]);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const buyNow = () => alert("Proceed to checkout");
  const chooseSlot = () => alert("Booking page – select your consultation slot");
  const toggleWishlist = () => setIsWishlisted(!isWishlisted);
 const shareProduct = async () => {
  const shareUrl = `${window.location.origin}/product/${slug}`;
  
  const shareData = {
    title: `${product?.name} | GutsTalks`,
    text: `✨ ${product?.name} ✨\n⭐ ${product?.rating}★ \n💰 ₹${product?.discountedPrice || product?.price}\n📦 Free Shipping`,
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Product link copied! The image will appear when you paste it in WhatsApp, Facebook, etc.");
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  }
};

  const whatsappShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  if (loading) return <SkeletonLoader />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const isConsultation = product.productType === "consultation";
  const highlights = extractHighlights(product.description);
  const hasBenefits = product.benefits && product.benefits.length > 0;
// ADD THIS FUNCTION
  const HandleAddToCart = async () => {
    if (!product || isConsultation) return;
    await addToCart(product._id, quantity);
    setToast(`${product.name} added to cart`);
    setTimeout(() => setToast(null), 2500);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAFB] via-white to-[#E8F4F7]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* ========== HERO SECTION ========== */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-[#D9EEF2] aspect-square group">
              {mainImage && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API}${mainImage}`}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              )}
              {/* Floating discount badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
              </div>
              {/* Floating duration badge for consultation */}
              {isConsultation && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-[#18606D] shadow-md flex items-center gap-1">
                  <Clock size={12} /> {product.consultationDuration}
                </div>
              )}
            </div>
            {product.imageUrls?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    onMouseOver={() => setMainImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === img
                        ? "border-[#18606D] shadow-md"
                        : "border-[#D9EEF2] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API}${img}`}
                      alt={`Thumb ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info (Sticky on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:sticky md:top-24 h-fit"
          >
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A]">{product.name}</h1>
              <div className="flex gap-2">
               
                <button
                  onClick={shareProduct}
                  className="p-2 rounded-full bg-white shadow-md border border-[#D9EEF2] hover:shadow-lg transition"
                >
                  <Share2 size={20} className="text-[#18606D]" />
                </button>
              </div>
            </div>
            <p className="text-[#18606D] text-sm mt-2">{product.shortDescription}</p>
            <div className="mt-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#18606D]">₹{product.salePrice}</span>
              <span className="text-sm text-[#94A3B8] line-through">₹{product.originalPrice}</span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">{product.taxNote}</p>

            {/* Highlights chips from description */}
            {highlights.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {highlights.map((h, idx) => (
                  <span key={idx} className="bg-[#E8F4F7] text-[#18606D] px-3 py-1 rounded-full text-xs font-medium">
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Consultation specific info */}
            {isConsultation && (
              <div className="mt-4 space-y-2 bg-[#F4FAFB] p-4 rounded-xl">
                <div className="flex items-center gap-2 text-[#1A4D3E]">
                  <Clock size={18} className="text-[#18606D]" />
                  <span className="text-sm">Duration: {product.consultationDuration}</span>
                </div>
                <div className="flex items-center gap-2 text-[#1A4D3E]">
                  <User size={18} className="text-[#18606D]" />
                  <span className="text-sm">Expert: {product.expertName || "Senior Gut Health Expert"}</span>
                </div>
              </div>
            )}

            {/* Program specific info */}
            {!isConsultation && (
              <div className="mt-4">
                <p className="text-sm text-[#64748B]">
                  Stock:{" "}
                  <span
                    className={`font-semibold ${
                      product.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
                  </span>
                </p>
                {product.stock > 0 && product.stock < 10 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Only {product.stock} left in stock – order soon
                  </p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              {isConsultation ? (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition transform hover:scale-[1.02]"
                >
                  <Calendar size={18} /> Choose Your Slot
                </button>
              ) : (
                <>
                  <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
                  <button
                    onClick={HandleAddToCart}
                    className="flex-1 py-3 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button
                    onClick={HandleAddToCart}
                    className="py-3 px-6 border border-[#18606D] text-[#18606D] rounded-xl font-semibold hover:bg-[#18606D] hover:text-white transition"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
            {isConsultation && (
              <p className="text-xs text-[#64748B] mt-3 text-center">Limited slots available today</p>
            )}
          </motion.div>
        </div>

        {/* ========== BENEFITS / KEY HIGHLIGHTS SECTION ========== */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">
            {hasBenefits ? "Why Choose This Program?" : "Key Highlights"}
          </h2>
          {hasBenefits ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -12px rgba(0,0,0,0.1)" }}
                  className="bg-white rounded-xl p-5 shadow-md border border-[#D9EEF2] transition"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E8F4F7] flex items-center justify-center mb-3 text-[#18606D]">
                    {getBenefitIcon(benefit)}
                  </div>
                  <h3 className="font-bold text-[#1A4D3E]">{benefit}</h3>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {highlights.map((h, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-[#D9EEF2] px-5 py-2 rounded-full text-sm font-medium text-[#18606D] shadow-sm"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ========== WHAT TO EXPECT SECTION (Premium) ========== */}
        {product.whatToExpect?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">What to Expect</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.whatToExpect.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -12px rgba(24,96,109,0.2)" }}
                  className="bg-gradient-to-br from-white to-[#F4FAFB] rounded-2xl p-6 text-center shadow-md border border-[#D9EEF2]"
                >
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#18606D] to-[#2A7F8F] opacity-10"></div>
                    <div className="relative w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#18606D] border border-[#D9EEF2]">
                      {getWhatToExpectIcon(item.title)}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#18606D] text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#1A4D3E]">{item.title}</h3>
                  <p className="text-sm text-[#64748B] mt-2">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ========== EXPERT SECTION (only for consultation) ========== */}
        {isConsultation && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-[#18606D] to-[#2A7F8F] rounded-2xl p-8 text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt={product.expertName || "Expert"}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 rounded-full p-1 shadow-md">
                    <Award size={16} className="text-white" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold">{product.expertName || "Senior Gut Health Expert"}</h3>
                  <p className="text-[#CFE8EC]">Certified Gut Health Specialist</p>
                  <p className="mt-2 text-sm opacity-90">
                    Over 10+ years of experience in clinical nutrition and gut microbiome research, helping thousands
                    reverse chronic digestive issues.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <CheckCircle size={14} /> Verified Expert
                    <span className="mx-1">•</span>
                    <ThumbsUp size={14} /> 98% Patient Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== REVIEWS SECTION with Rating Breakdown ========== */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Customer Reviews</h2>
          <div className="bg-white rounded-2xl shadow-md border border-[#D9EEF2] p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Rating Summary */}
              <div className="md:w-1/3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="text-5xl font-bold text-[#1A4D3E]">{product.rating}</div>
                  <div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          className={`${
                            star <= Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[#64748B]">Based on {product.reviewCount} reviews</p>
                  </div>
                </div>
                {/* Rating breakdown bars */}
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8">{star} ★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${ratingBreakdown[star]}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-[#64748B]">{ratingBreakdown[star]}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right: Review List */}
              <div className="md:w-2/3 space-y-5 max-h-96 overflow-y-auto pr-2">
                {mockReviews.slice(0, 3).map((review, idx) => (
                  <div key={idx} className="border-b border-[#D9EEF2] pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-[#E8F4F7] flex items-center justify-center text-[#18606D] font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A4D3E]">{review.name}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={`${
                                star <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#475569] mt-2">{review.comment}</p>
                  </div>
                ))}
                <button className="text-[#18606D] font-semibold text-sm mt-2 block">Read all reviews →</button>
              </div>
            </div>
          </div>
        </div>

        {/* ========== FAQ SECTION ========== */}
        {product.faqs?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {product.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#D9EEF2] overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#F4FAFB] transition"
                  >
                    <span className="font-semibold text-[#1A4D3E]">{faq.question}</span>
                    {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-4 text-[#64748B] border-t border-[#D9EEF2]"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========== FLOATING ACTION BUTTONS ========== */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={whatsappShare}
          className="w-12 h-12 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition transform"
        >
          <Phone size={22} />
        </button>
        <button
          onClick={shareProduct}
          className="w-12 h-12 rounded-full bg-[#18606D] text-white shadow-lg flex items-center justify-center hover:scale-110 transition transform"
        >
          <Share2 size={20} />
        </button>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white text-[#18606D] shadow-lg flex items-center justify-center hover:scale-110 transition transform border border-[#D9EEF2]"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </div>

      {/* Sticky CTA for mobile (only for program) */}
      {!isConsultation && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#D9EEF2] p-4 shadow-lg z-40">
          <div className="flex gap-3">
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
            <button
              onClick={HandleAddToCart}
              className="flex-1 py-3 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#18606D] text-white px-5 py-3 rounded-full shadow-lg text-sm flex items-center gap-2"
          >
            <CheckCircle size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <ScheduleCallModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} productName={product.name} productPrice={product.salePrice || product.originalPrice}/>
    </div>
  );
}