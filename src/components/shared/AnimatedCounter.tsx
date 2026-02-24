import { useState, useEffect, useRef } from 'react';
import { Text, type TextProps } from '@chakra-ui/react';

interface AnimatedCounterProps extends TextProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '', ...props }: AnimatedCounterProps) {
  // Start with target so pre-rendered HTML shows the real value (not "0")
  const [count, setCount] = useState(target);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [hasAnimated, target, duration]);

  return (
    <Text ref={ref} {...props}>
      {prefix}{count}{suffix}
    </Text>
  );
}
