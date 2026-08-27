const fs = require('fs');
let code = fs.readFileSync('d:/TOUR AND TRAVEL/frontend/src/App.jsx', 'utf8');

const searchPageComponent = `
function SearchPage({ query, onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  const searchTerm = query ? query.toLowerCase() : '';
  
  // Aggregate data
  let tourMatches = [];
  if (tourData && tourData.packages) {
    tourMatches = tourData.packages.filter(p => 
      p.title.toLowerCase().includes(searchTerm) || 
      p.summary.toLowerCase().includes(searchTerm) || 
      p.location.toLowerCase().includes(searchTerm)
    );
  } else if (tourData && Array.isArray(tourData)) {
     // fallback if tourData is an array
     tourMatches = tourData.filter(p => p.title && p.title.toLowerCase().includes(searchTerm));
  } else if (tourData && tourData.categories) {
     tourData.categories.forEach(c => {
       if (c.packages) {
         const matches = c.packages.filter(p => 
           p.title.toLowerCase().includes(searchTerm) || 
           p.summary.toLowerCase().includes(searchTerm) || 
           p.location.toLowerCase().includes(searchTerm)
         );
         tourMatches = [...tourMatches, ...matches];
       }
     });
  }

  let serviceMatches = [];
  if (serviceData && serviceData.services) {
    serviceMatches = serviceData.services.filter(s => 
      s.title.toLowerCase().includes(searchTerm) || 
      s.summary.toLowerCase().includes(searchTerm)
    );
  } else if (Array.isArray(serviceData)) {
    serviceMatches = serviceData.filter(s => s.title && s.title.toLowerCase().includes(searchTerm));
  }

  let articleMatches = [];
  if (articleData && articleData.articles) {
    articleMatches = articleData.articles.filter(a => 
      a.title.toLowerCase().includes(searchTerm) || 
      a.excerpt.toLowerCase().includes(searchTerm) || 
      a.category.toLowerCase().includes(searchTerm)
    );
  } else if (Array.isArray(articleData)) {
    articleMatches = articleData.filter(a => a.title && a.title.toLowerCase().includes(searchTerm));
  }

  const totalResults = tourMatches.length + serviceMatches.length + articleMatches.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-12 px-6 md:px-18">
        <div className="max-w-[80rem] mx-auto">
          <h1 className="text-3xl font-black text-[#172433] mb-2">
            Hasil Pencarian untuk "{query}"
          </h1>
          <p className="text-[#667386] mb-12">
            Menemukan {totalResults} hasil yang relevan.
          </p>

          {tourMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#172433] mb-6 border-b pb-4">Paket Wisata & Destinasi</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tourMatches.map((tour, index) => (
                  <TourPackageCard key={index} tourPackage={tour} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          )}

          {serviceMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#172433] mb-6 border-b pb-4">Layanan (Hotel, Visa, dll)</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {serviceMatches.map((service, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer rounded-2xl bg-white p-5 shadow-sm border border-[#e1e6eb] transition-all hover:-translate-y-1 hover:shadow-md"
                    onClick={(e) => onNavigate(e, { page: 'service', slug: service.slug })}
                  >
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                      <img src={service.heroImage} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="text-lg font-bold text-[#172433]">{service.title}</h3>
                    <p className="mt-2 text-sm text-[#667386] line-clamp-2">{service.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {articleMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#172433] mb-6 border-b pb-4">Artikel (Kuliner, Panduan, dll)</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articleMatches.map((article, index) => (
                  <ArticleListCard key={index} article={article} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-20 text-center">
              <Search className="mx-auto h-16 w-16 text-[#e1e6eb] mb-4" />
              <h3 className="text-xl font-bold text-[#172433]">Tidak ada hasil yang ditemukan</h3>
              <p className="text-[#667386] mt-2">Coba gunakan kata kunci lain untuk pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
`;

if (!code.includes('function SearchPage')) {
  code += '\n' + searchPageComponent;
  fs.writeFileSync('d:/TOUR AND TRAVEL/frontend/src/App.jsx', code);
  console.log('SearchPage component added.');
}
