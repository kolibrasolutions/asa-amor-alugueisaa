const IntroSection = () => {
  return (
    <section id="sobre" className="py-20 bg-asa-beige">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-8">
            Lorem Ipsum Dolor Sit Amet
          </h2>
          <p className="text-lg text-asa-gray leading-relaxed mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
            ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-lg text-asa-gray leading-relaxed mb-8">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
            nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-asa-blush/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-asa-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-asa-dark mb-2">
                Lorem Ipsum
              </h3>
              <p className="text-asa-gray">
                Consectetur adipiscing elit
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-asa-blush/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-asa-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1a1 1 0 102 0V7zM12 7a1 1 0 10-2 0v1a1 1 0 102 0V7zM8 7a1 1 0 10-2 0v1a1 1 0 102 0V7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-asa-dark mb-2">
                Dolor Sit
              </h3>
              <p className="text-asa-gray">
                Sed do eiusmod tempor
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-asa-blush/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-asa-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold text-asa-dark mb-2">
                Amet Elit
              </h3>
              <p className="text-asa-gray">
                Ut enim ad minim veniam
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
