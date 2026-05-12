const Terms = () => {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12">

        <div className="wizard-step-label mb-3">Legal</div>
        <h1 className="font-cinema text-2xl sm:text-3xl font-medium text-ink mb-8">Terms &amp; Privacy</h1>

        <div className="border-t border-smoke">

          <section className="py-7 border-b border-smoke">
            <h2 className="font-cinema text-base font-medium text-ink mb-4">Terms of Use</h2>
            <div className="space-y-3 text-sm text-fog leading-relaxed">
              <p>This site is provided for fun and personal entertainment. It comes with no warranties of any kind, express or implied. Use at your own risk.</p>
              <p>We are not liable for any damages or losses arising from your use of this site.</p>
              <p>This site links to and displays information from third-party sources, including The Movie Database (TMDB) and various streaming services. We do not control or endorse third-party content and are not responsible for their availability, accuracy, or policies.</p>
            </div>
          </section>

          <section className="py-7 border-b border-smoke">
            <h2 className="font-cinema text-base font-medium text-ink mb-4">Privacy Policy</h2>
            <div className="space-y-3 text-sm text-fog leading-relaxed">
              <p>
                <span className="font-semibold text-ink">We don't collect any personal data.</span> There are no accounts, no logins, and no tracking. Nothing you do on this site is stored or associated with you.
              </p>
              <p>
                TMDB provides movie data; requests to TMDB may include metadata necessary to retrieve film information. We have no control over TMDB's own data practices.
              </p>
              <p>
                Questions? Reach us at{' '}
                <a
                  href="mailto:caleb@thetriplefeature.org"
                  className="text-ink underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  caleb@thetriplefeature.org
                </a>.
              </p>
            </div>
          </section>

          <p className="pt-6 text-xs text-fog">Effective date: {new Date().getFullYear()}</p>

        </div>
      </div>
    </div>
  );
};

export default Terms;
