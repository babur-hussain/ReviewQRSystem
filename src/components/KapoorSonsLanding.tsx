import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Instagram, Star, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskStatus {
  instagram: boolean;
  review: boolean;
}

const KapoorSonsLanding: React.FC = () => {
  const [tasks, setTasks] = useState<TaskStatus>({ instagram: false, review: false });
  const [showCelebration, setShowCelebration] = useState(false);

  // Load task status from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('kapoor-sons-tasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed);
      if (parsed.instagram && parsed.review) {
        setShowCelebration(true);
      }
    }
  }, []);

  // Save task status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kapoor-sons-tasks', JSON.stringify(tasks));
  }, [tasks]);

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
    window.open('https://www.instagram.com/kapoorandsons_betul/', '_blank');
    
    // Mark as completed after a short delay (simulating user follow)
    setTimeout(() => {
      setTasks(prev => ({ ...prev, instagram: true }));
    }, 2000);
  };

  const handleReviewClick = () => {
    window.open('https://g.page/r/CQ6kGR1I3AInEAE/review', '_blank');
    
    // Mark as completed after a short delay (simulating user review)
    setTimeout(() => {
      setTasks(prev => ({ ...prev, review: true }));
    }, 3000);
  };

  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalTasks = 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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