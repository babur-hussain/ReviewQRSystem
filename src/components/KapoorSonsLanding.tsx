import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Instagram, Star, ExternalLink, Moon, Sun, X, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskStatus {
  instagram: boolean;
  review: boolean;
}

interface TaskTimestamp {
  instagram: number | null;
  review: number | null;
}

interface TaskWarning {
  instagram: boolean;
  review: boolean;
}

interface ClaimFormData {
  name: string;
  mobile: string;
}

interface OfferStatus {
  claimed: boolean;
  claimTime: number | null;
}

const KapoorSonsLanding: React.FC = () => {
  const [tasks, setTasks] = useState<TaskStatus>({ instagram: false, review: false });
  const [showCelebration, setShowCelebration] = useState(false);
  const [taskTimestamps, setTaskTimestamps] = useState<TaskTimestamp>({ instagram: null, review: null });
  const [taskWarnings, setTaskWarnings] = useState<TaskWarning>({ instagram: false, review: false });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [claimForm, setClaimForm] = useState<ClaimFormData>({ name: '', mobile: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerStatus, setOfferStatus] = useState<OfferStatus>({ claimed: false, claimTime: null });

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('kapoor-sons-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('kapoor-sons-theme', newMode ? 'dark' : 'light');
  };

  // Load task status and timestamps from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('kapoor-sons-tasks');
    const savedTimestamps = localStorage.getItem('kapoor-sons-timestamps');
    const savedOfferStatus = localStorage.getItem('kapoor-sons-offer-status');
    
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed);
      if (parsed.instagram && parsed.review) {
        setShowCelebration(true);
      }
    }
    
    if (savedTimestamps) {
      setTaskTimestamps(JSON.parse(savedTimestamps));
    }

    if (savedOfferStatus) {
      const parsed = JSON.parse(savedOfferStatus);
      setOfferStatus(parsed);
    }
  }, []);

  // Save task status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kapoor-sons-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save timestamps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kapoor-sons-timestamps', JSON.stringify(taskTimestamps));
  }, [taskTimestamps]);

  // Save offer status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kapoor-sons-offer-status', JSON.stringify(offerStatus));
  }, [offerStatus]);

  // Handle page visibility change to detect user return
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to page
        const currentTime = Date.now();
        
        // Check Instagram task
        if (taskTimestamps.instagram && !tasks.instagram) {
          const timeDiff = currentTime - taskTimestamps.instagram;
          if (timeDiff < 5000) {
            // Show warning for quick return
            setTaskWarnings(prev => ({ ...prev, instagram: true }));
            setTimeout(() => {
              setTaskWarnings(prev => ({ ...prev, instagram: false }));
            }, 3000);
          } else {
            // Approve task after 5+ seconds
            setTasks(prev => ({ ...prev, instagram: true }));
            setTaskTimestamps(prev => ({ ...prev, instagram: null }));
          }
        }
        
        // Check Google Review task
        if (taskTimestamps.review && !tasks.review) {
          const timeDiff = currentTime - taskTimestamps.review;
          if (timeDiff < 5000) {
            // Show warning for quick return
            setTaskWarnings(prev => ({ ...prev, review: true }));
            setTimeout(() => {
              setTaskWarnings(prev => ({ ...prev, review: false }));
            }, 3000);
          } else {
            // Approve task after 5+ seconds
            setTasks(prev => ({ ...prev, review: true }));
            setTaskTimestamps(prev => ({ ...prev, review: null }));
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [taskTimestamps, tasks]);

  // Check if both tasks are completed
  useEffect(() => {
    if (tasks.instagram && tasks.review && !showCelebration) {
      setShowCelebration(true);
      // Show offer popup after a short delay
      setTimeout(() => {
        setShowOfferPopup(true);
      }, 2000);
      
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [tasks.instagram, tasks.review, showCelebration]);

  // Check if offer claim period has expired (15 minutes)
  useEffect(() => {
    if (offerStatus.claimed && offerStatus.claimTime) {
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
      const timeSinceClaim = Date.now() - offerStatus.claimTime;
      
      if (timeSinceClaim > fifteenMinutes) {
        setOfferStatus({ claimed: false, claimTime: null });
      }
    }
  }, [offerStatus]);

  const handleInstagramClick = () => {
    if (!tasks.instagram) {
      // Record timestamp when user clicks
      setTaskTimestamps(prev => ({ ...prev, instagram: Date.now() }));
    }
    window.open('https://www.instagram.com/kapoorandsons_betul/', '_blank');
  };

  const handleReviewClick = () => {
    if (!tasks.review) {
      // Record timestamp when user clicks
      setTaskTimestamps(prev => ({ ...prev, review: Date.now() }));
    }
    window.open('https://g.page/r/CQ6kGR1I3AInEAE/review', '_blank');
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimForm.name.trim() || !claimForm.mobile.trim()) return;

    setIsSubmitting(true);
    
    try {
      const data = {
        name: claimForm.name,
        mobile: claimForm.mobile,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };

      // Save data to Google Sheets using a working method
      try {
        // Use a simple service that works with Google Sheets
        const response = await fetch('https://api.sheetmonkey.io/form/vbn1Si636FeeiLRahK7vxv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            mobile: data.mobile,
            timestamp: data.timestamp,
            date: data.date
          })
        });

        if (response.ok) {
          console.log('✅ Data saved to Google Sheets successfully!');
        } else {
          throw new Error('SheetMonkey submission failed');
        }
      } catch (apiError) {
        console.log('API submission failed, data logged for manual entry');
        
        // Log data for manual entry to Google Sheet
        console.log('=== GLASS GUARD CLAIM DATA ===');
        console.log('Name:', data.name);
        console.log('Mobile:', data.mobile);
        console.log('Timestamp:', data.timestamp);
        console.log('Date:', data.date);
        console.log('==============================');
        
        // Show instructions for manual entry
        alert(`Data logged! Please check the browser console (F12) for the claim details to manually add to your Google Sheet.`);
      }

      // Mark as claimed
      setOfferStatus({ claimed: true, claimTime: Date.now() });
      setShowOfferPopup(false);
      setClaimForm({ name: '', mobile: '' });
      
      // Show success message
      alert(`Thank you ${claimForm.name}! Your offer has been claimed. Please visit the Glass Counter to redeem your free glass guard.`);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Still mark as claimed
      setOfferStatus({ claimed: true, claimTime: Date.now() });
      setShowOfferPopup(false);
      setClaimForm({ name: '', mobile: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalTasks = 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background to-secondary">
      {/* Dark Mode Toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className="dark-toggle z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-foreground" />
        )}
      </motion.button>

      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-success/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            Kapoor & Sons
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground text-lg"
          >
            Support us with these quick actions
          </motion.p>
          
          {/* Progress indicator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-muted rounded-full h-2 overflow-hidden"
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(completedCount / totalTasks) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
            />
          </motion.div>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{totalTasks} tasks completed
          </p>
        </div>

        {/* Tasks */}
        <div className="space-y-6">
          {/* Instagram Task */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="task-card relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Instagram className="w-6 h-6 text-pink-500" />
                <h3 className="font-semibold text-lg">Follow on Instagram</h3>
              </div>
              <AnimatePresence>
                {tasks.instagram && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="w-8 h-8 bg-success rounded-full flex items-center justify-center animate-bounce-in"
                  >
                    <Check className="w-5 h-5 text-success-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Follow @kapoorandsons_betul for updates and delicious content!
            </p>
            
            {/* Warning message for Instagram */}
            <AnimatePresence>
              {taskWarnings.instagram && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-600 text-sm font-medium flex items-center space-x-2"
                >
                  <span>⏳</span>
                  <span>Please complete the follow before returning.</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstagramClick}
              className={`w-full flex items-center justify-center space-x-2 ${
                tasks.instagram 
                  ? 'success-button animate-pulse-success' 
                  : 'task-button'
              }`}
            >
              {tasks.instagram ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Followed Successfully!</span>
                </>
              ) : (
                <>
                  <Instagram className="w-5 h-5" />
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Google Review Task */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="task-card relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <h3 className="font-semibold text-lg">Leave a Google Review</h3>
              </div>
              <AnimatePresence>
                {tasks.review && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="w-8 h-8 bg-success rounded-full flex items-center justify-center animate-bounce-in"
                  >
                    <Check className="w-5 h-5 text-success-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Share your experience and help others discover us!
            </p>
            
            {/* Warning message for Google Review */}
            <AnimatePresence>
              {taskWarnings.review && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-600 text-sm font-medium flex items-center space-x-2"
                >
                  <span>⏳</span>
                  <span>Please complete the review before returning.</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReviewClick}
              className={`w-full flex items-center justify-center space-x-2 ${
                tasks.review 
                  ? 'success-button animate-pulse-success' 
                  : 'task-button'
              }`}
            >
              {tasks.review ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Review Submitted!</span>
                </>
              ) : (
                <>
                  <Star className="w-6 h-6" />
                  <span>Leave a Google Review</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Claim Offer Section */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="text-center space-y-4 p-6 bg-gradient-to-br from-primary/10 to-success/10 rounded-2xl border border-primary/20 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-6xl"
              >
                🎁
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                🎉 Congratulations!
              </h2>
              <p className="text-lg font-semibold">
                Upon completion you are eligible for a FREE Glass Guard for your mobile phone.
              </p>
              <p className="text-sm text-muted-foreground">
                Tempered Glass Free & 50% Discount on UV Glass.
              </p>
              
              {!offerStatus.claimed ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOfferPopup(true)}
                  className="task-button flex items-center justify-center space-x-2 mx-auto"
                >
                  <Gift className="w-5 h-5" />
                  <span>Claim Offer</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center space-x-2 text-success font-semibold"
                >
                  <Check className="w-5 h-5" />
                  <span>Offer Claimed Successfully!</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Celebration Message */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="text-center space-y-4 p-6 bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl border border-success/20"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-6xl"
              >
                🎉
              </motion.div>
              <h2 className="celebration-text">
                Thank You for Supporting Kapoor & Sons!
              </h2>
              <p className="text-success font-semibold">
                Both Follow & Review Completed Successfully ✅
              </p>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg text-muted-foreground"
              >
                We truly appreciate your support! 🙏
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offer Popup */}
        <AnimatePresence>
          {showOfferPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowOfferPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-card rounded-2xl p-6 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowOfferPopup(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center mb-6">
                  <Gift className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
                  <p className="text-lg mb-2">Upon completion you are eligible for a FREE Glass Guard for your mobile phone.</p>
                  <p className="text-sm text-muted-foreground">Tempered Glass Free & 50% Discount on UV Glass.</p>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={claimForm.name}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      value={claimForm.mobile}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, mobile: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your mobile number"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !claimForm.name.trim() || !claimForm.mobile.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full task-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Claim Now'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Banner - Show after claim */}
        <AnimatePresence>
          {offerStatus.claimed && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-success text-success-foreground p-4 text-center z-40"
            >
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">✅ Congratulations! Your offer has been claimed. Offer can be redeemed at the Glass Counter.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default KapoorSonsLanding;