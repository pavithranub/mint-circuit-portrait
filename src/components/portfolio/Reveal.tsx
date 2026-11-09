import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  children: ReactNode;
};

export function Reveal({ as: Tag = "div", className, delay = 0, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  index,
  label,
  title,
  className,
}: {
  index: string;
  label: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-12 max-w-3xl", className)}>
      <p className="eyebrow mb-4 flex items-center gap-3">
        <span className="text-primary">{index}</span>
        <span className="h-px w-10 bg-border" />
        {label}
      </p>
      <h2 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h2>
    </Reveal>
  );
}
