import { brandPromises } from "@/lib/data";

const icons: Record<string, React.ReactNode> = {
  comfort: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  quality: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  responsibility: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 3v1m0 16v1m-7.071-2.929l.707-.707m12.728 0l.707.707M3 12h1m16 0h1M5.636 5.636l.707.707m12.728 0l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  design: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
};

export default function BrandPromisesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-14 md:mb-20 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-px bg-pumpkin/60" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              Unsere Werte
            </p>
            <div className="w-8 h-px bg-pumpkin/60" />
          </div>
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
            Was MOSAROMA ausmacht
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {brandPromises.map((promise) => (
            <div key={promise.title} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-pumpkin border border-pumpkin/20 transition-all duration-500 group-hover:bg-pumpkin group-hover:text-white group-hover:border-pumpkin">
                {icons[promise.icon]}
              </div>
              <h3 className="font-heading text-anthracite text-lg font-bold uppercase tracking-[0.08em] mb-3">
                {promise.title}
              </h3>
              <p className="font-body text-text-gray text-sm leading-[1.8] max-w-xs mx-auto">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
