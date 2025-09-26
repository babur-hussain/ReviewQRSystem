import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Instagram, Star, ExternalLink, Moon, Sun } from 'lucide-react';
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

const KapoorSonsLanding: React.FC = () => {
  const [tasks, setTasks] = useState<TaskStatus>({ instagram: false, review: false });
  const [showCelebration, setShowCelebration] = useState(false);
  const [taskTimestamps, setTaskTimestamps] = useState<TaskTimestamp>({ instagram: null, review: null });
  const [taskWarnings, setTaskWarnings] = useState<TaskWarning>({ instagram: false, review: false });
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  }, []);

  // Save task status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kapoor-sons-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save timestamps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kapoor-sons-timestamps', JSON.stringify(taskTimestamps));
  }, [taskTimestamps]);

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
              disabled={tasks.instagram}
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
              disabled={tasks.review}
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
      </motion.div>
    </div>
  );
};

export default KapoorSonsLanding;