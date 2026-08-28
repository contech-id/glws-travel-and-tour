const fs = require('fs');
const appPath = 'd:/TOUR AND TRAVEL/frontend/src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// Insert the component call
code = code.replace(
  '<GoogleBusinessSection />\n        </>',
  '<GoogleBusinessSection />\n          <CTASection />\n        </>'
);

// Append the CTASection component
const ctaComponent = `
function CTASection() {
  return (
    <section className="px-6 py-10 md:px-18 pb-20">
      <div className="mx-auto max-w-[80rem]">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-secondary/80 px-6 py-16 text-center text-white md:px-12 md:py-20 shadow-xl">
          {/* Bubbles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl mix-blend-overlay"></div>
            <div className="absolute top-1/2 -right-32 h-96 w-96 -translate-y-1/2 rounded-full bg-secondary/30 blur-3xl mix-blend-overlay"></div>
            <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-white/15 blur-2xl mix-blend-overlay"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-[48rem]" data-aos="zoom-in">
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-tight tracking-[-0.04em]">
              Siap Merencanakan Liburan dan Perjalanan Impian Anda?
            </h2>
            <p className="mx-auto mt-5 max-w-[38rem] text-sm leading-relaxed text-white/90 md:text-base">
              Konsultasikan rencana perjalanan Anda secara gratis dan dapatkan rekomendasi paket wisata atau ibadah yang paling sesuai dengan kebutuhan Anda.
            </p>
            
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-primary transition-transform hover:scale-105 sm:w-auto shadow-lg"
              >
                Konsultasi Gratis <ArrowRight size={16} />
              </a>
              <a
                href="https://wa.me/6281330663930"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-8 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-[#20bd5a] sm:w-auto shadow-lg"
              >
                <MessageCircle size={18} /> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
`;

if (!code.includes('function CTASection()')) {
  code += ctaComponent;
}

fs.writeFileSync(appPath, code);
console.log('CTASection added successfully.');
