"use client";

interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  title,
  subtitle,
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
          <div className="mt-3 h-1 w-16 bg-navy rounded" />
        </div>
        {children}
      </div>
    </section>
  );
}
