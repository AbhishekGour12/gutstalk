"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiX, FiChevronLeft, FiChevronRight, 
  FiUser, FiMail, FiPhone, FiCheckCircle, FiCreditCard, FiLogIn 
} from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { availabilityAPI } from '../lib/availablity';
import { bookingAPI } from '../lib/booking';
import { paymentAPI } from '../lib/payment';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const ScheduleCallModal = ({ isOpen, onClose, productName, productPrice = 249 }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState('calendar');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [address, setAddress] = useState({ name: '', email: '', phone: '' });
  const [availableDates, setAvailableDates] = useState([]);
  const router = useRouter();
  const user = useSelector(state => state.auth.user);
  const socketRef = useRef(null);

  // Fixed consultation price for this modal (₹99 offer)
  const CONSULTATION_PRICE = 99;
  const isLoggedIn = !!user;

  // Pre-fill address from logged-in user
  useEffect(() => {
    if (user && step === 'form') {
      setAddress({
        name: user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, step]);

  // Initialize socket connection when modal opens
  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
        transports: ['websocket'],
        autoConnect: true
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      socketRef.current.on('slot-booked', (data) => {
        if (selectedDate && format(selectedDate, 'yyyy-MM-dd') === data.date) {
          loadSlotsForDate(selectedDate);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen, selectedDate]);

  // Load Razorpay script once
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch MCQs on mount
  useEffect(() => {
    if (isOpen) {
      bookingAPI.getMCQs().then(setMcqs).catch(console.error);
    }
  }, [isOpen]);

  // Fetch slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadSlotsForDate(selectedDate);
    }
  }, [selectedDate]);

  // On modal open, set today as selected date and load its slots
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setSelectedDate(today);
      setSelectedSlot(null);
      setStep('calendar');
      setAnswers({});
      loadSlotsForDate(today);
      loadAvailableDates();
    }
  }, [isOpen]);

  const loadSlotsForDate = async (date) => {
    setLoadingSlots(true);
    try {
      const res = await availabilityAPI.getSlots(format(date, 'yyyy-MM-dd'));
      setSlots(res.slots || []);
    } catch (err) {
      toast.error('Failed to load slots');
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadAvailableDates = async () => {
    try {
      const res = await availabilityAPI.getAvailableDates();
      setAvailableDates(res.dates || []);
    } catch (err) {
      console.error('Failed to load available dates');
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep('payment');
  };

  const handleRazorpayPayment = async () => {
    if (typeof window === "undefined" || !window.Razorpay) {
      toast.error("Payment gateway is still loading. Please wait.");
      return;
    }

    // Fixed amount: ₹99 (no discount applied)
    const amountToPay = CONSULTATION_PRICE * 100; // 9900 paise

    setPaymentLoading(true);
    try {
      const rpOrder = await paymentAPI.createOrder({
        amount: amountToPay,
        phone: address.phone || user?.phone || '9999999999'
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: rpOrder.amount,
        currency: "INR",
        order_id: rpOrder.id,
        name: "GutTalks",
        description: `Consultation: ${productName}`,
        remember_customer: true,
        modal: {
          ondismiss: () => setPaymentLoading(false),
          handleback: true,
          backdropclose: false,
          zIndex: 999999,
          confirm_close: true,
          animation: true,
          escape: false
        },
        config: {
          display: {
            blocks: {
              utp: { name: "UPI Apps", instruments: [{ method: 'upi' }] },
              bank: { name: "Cards & NetBanking", instruments: [{ method: 'card' }, { method: 'netbanking' }] }
            },
            sequence: ['block.utp', 'block.bank'],
            preferences: { show_default_blocks: true }
          }
        },
        retry: { enabled: true, max_count: 3 },
        prefill: {
          name: address.name || user?.name || '',
          email: address.email || user?.email || '',
          contact: address.phone || user?.phone || '',
          method: 'upi'
        },
        theme: { color: "#18606D" },
        handler: async (response) => {
          try {
            const verify = await paymentAPI.verifyPayment(response);
            if (verify.success) {
              const booking = await bookingAPI.initiateBooking({
                date: selectedDate,
                startTime: selectedSlot.start,
                endTime: selectedSlot.end,
                price: CONSULTATION_PRICE,
                paymentDetails: response,
                userDetails: {
                  name: address.name || user?.name,
                  email: address.email || user?.email,
                  phone: address.phone || user?.phone
                }
              });
              setBookingId(booking.bookingId);
              setStep('form');
              toast.success('Payment successful! Please complete your details.');
            } else {
              toast.error("Payment Verification Failed");
              setStep('calendar');
            }
          } catch (err) {
            toast.error("Verification Error");
            setStep('calendar');
          } finally {
            setPaymentLoading(false);
          }
        }
      };
      const rz = new window.Razorpay(options);
      rz.on('payment.failed', (response) => {
        toast.error("Payment Failed: " + response.error.description);
        setPaymentLoading(false);
        setStep('calendar');
      });
      rz.open();
    } catch (err) {
      toast.error(err.message);
      setPaymentLoading(false);
      setStep('calendar');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone')
    };
    setAddress(userData);
    await bookingAPI.updateBooking(bookingId, userData);
    setStep('mcq');
  };

  const handleMcqSubmit = async () => {
    const answerArray = Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, answer: ans }));
    await bookingAPI.submitMCQs(bookingId, answerArray);
    toast.success('Thank you! Your consultation is confirmed. You will receive a meeting link via email.');
    onClose();
    router.push('/dashboard');
  };

  const handleLoginRedirect = () => {
    // Store current URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    router.push('/login');
    onClose(); // close modal while redirecting
  };

  // Helper to check if a date has available slots
  const hasAvailableSlots = (date) => {
    return availableDates.some(d => isSameDay(new Date(d), date));
  };

  if (!isOpen) return null;

  // Show offer banner for non-logged-in users (before any step)
  if (!isLoggedIn) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCreditCard className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A4D3E] mb-2">Special Offer!</h3>
              <p className="text-[#64748B] mb-3">
                Get this consultation for only <span className="text-[#18606D] font-bold text-xl">₹99</span>
              </p>
              <p className="text-sm text-[#64748B] mb-6">
                (Regular price: ₹{productPrice})
              </p>
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <FiLogIn /> Login / Sign up to Claim
              </button>
             
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Logged-in users see the full modal with ₹99 price
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with progress indicator */}
          <div className="p-5 border-b border-[#D9EEF2] bg-gradient-to-r from-[#F4FAFB] to-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1A4D3E]">Schedule Your Consultation</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white transition-colors">
                <FiX size={20} className="text-[#64748B]" />
              </button>
            </div>
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {['calendar', 'payment', 'form', 'mcq'].map((s, idx) => {
                const isActive = step === s;
                const isCompleted = ['payment', 'form', 'mcq'].includes(step) && idx < ['calendar', 'payment', 'form', 'mcq'].indexOf(step);
                return (
                  <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isActive ? 'bg-[#18606D] text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-[#E8F4F7] text-[#64748B]'
                    }`}>
                      {idx + 1}
                    </div>
                    {idx < 3 && <div className={`w-12 h-0.5 mx-1 ${isCompleted ? 'bg-green-500' : 'bg-[#E8F4F7]'}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-full">
            {/* Calendar Section */}
            <div className="md:w-1/2 p-5 border-r border-[#D9EEF2] bg-[#F4FAFB]">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <button 
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-[#F4FAFB] rounded-full transition"
                  >
                    <FiChevronLeft className="text-[#18606D]" />
                  </button>
                  <span className="font-semibold text-[#1A4D3E]">{format(currentMonth, 'MMMM yyyy')}</span>
                  <button 
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-[#F4FAFB] rounded-full transition"
                  >
                    <FiChevronRight className="text-[#18606D]" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-3">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-[#64748B] font-medium py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }).map(day => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const hasSlots = hasAvailableSlots(day);
                    const isTodayDate = isToday(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        className={`
                          relative p-2 rounded-full text-sm transition-all
                          ${isSelected ? 'bg-[#18606D] text-white shadow-md' : ''}
                          ${!isSelected && hasSlots ? 'bg-[#E8F4F7] text-[#18606D] font-medium' : ''}
                          ${!isSelected && !hasSlots && !isTodayDate ? 'text-[#64748B] hover:bg-[#F4FAFB]' : ''}
                          ${isTodayDate && !isSelected && !hasSlots ? 'border border-[#18606D] text-[#18606D]' : ''}
                        `}
                      >
                        {format(day, 'd')}
                        {hasSlots && !isSelected && (
                          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-center text-[#64748B] mt-4">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span> Available slots
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="md:w-1/2 p-4">
              {step === 'calendar' && (
                <>
                  <h3 className="font-semibold mb-3">Available Slots</h3>
                  {loadingSlots ? (
                    <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18606D]"></div></div>
                  ) : slots.length === 0 ? (
                    <p className="text-center text-[#64748B] py-8">No slots available for this date.</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {slots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!slot.isAvailable}
                          className={`w-full p-3 rounded-xl border text-left transition ${
                            slot.isAvailable 
                              ? 'hover:bg-[#F4FAFB] border-[#D9EEF2] cursor-pointer' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <FiClock className="inline mr-2" /> {slot.start} – {slot.end}
                            </div>
                            {!slot.isAvailable && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Booked</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 'payment' && (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-br from-[#F4FAFB] to-white rounded-xl p-6 mb-6">
                    <FiCreditCard className="text-5xl text-[#18606D] mx-auto mb-3" />
                    <p className="text-lg font-semibold text-[#1A4D3E]">Consultation Fee</p>
                    <p className="text-3xl font-bold text-[#18606D] mt-2">₹{CONSULTATION_PRICE}</p>
                    <p className="text-sm text-green-600 mt-1">Special offer price for you!</p>
                  </div>
                  <button 
                    onClick={handleRazorpayPayment} 
                    disabled={paymentLoading}
                    className="bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {paymentLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : (
                      `Pay ₹${CONSULTATION_PRICE}`
                    )}
                  </button>
                </div>
              )}

              {step === 'form' && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h3 className="font-semibold text-lg text-[#1A4D3E] mb-4">Your Details</h3>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]" />
                    <input name="name" defaultValue={address.name} placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none" />
                  </div>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]" />
                    <input name="email" type="email" defaultValue={address.email} placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none" />
                  </div>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]" />
                    <input name="phone" defaultValue={address.phone} placeholder="Phone Number" required className="w-full pl-10 pr-4 py-3 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white py-3 rounded-xl font-semibold mt-4">Continue to Questions</button>
                </form>
              )}

              {step === 'mcq' && (
                <div>
                  <h3 className="font-semibold text-lg text-[#1A4D3E] mb-4">Health Assessment</h3>
                  <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                    {mcqs.map((q, idx) => (
                      <div key={q._id} className="bg-[#F4FAFB] p-4 rounded-xl">
                        <p className="font-medium text-[#1A4D3E] mb-3">{idx+1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map(opt => (
                            <label key={opt} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition">
                              <input 
                                type="radio" 
                                name={`q_${q._id}`} 
                                value={opt} 
                                onChange={() => setAnswers({...answers, [q._id]: opt})}
                                className="w-4 h-4 text-[#18606D]"
                              />
                              <span className="text-[#64748B]">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleMcqSubmit} 
                    disabled={Object.keys(answers).length !== mcqs.length}
                    className="w-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white py-3 rounded-xl font-semibold mt-5 disabled:opacity-50"
                  >
                    <FiCheckCircle className="inline mr-2" /> Submit & Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScheduleCallModal;