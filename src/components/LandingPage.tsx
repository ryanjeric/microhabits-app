import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    "Track up to 3 daily habits for free",
    "Simple one-tap daily check-ins",
    "Track your streaks and build consistency",
    "Clean, minimalist interface",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            MicroHabits
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Build consistency with small daily habits
          </p>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-8 py-6 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MicroHabits. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
