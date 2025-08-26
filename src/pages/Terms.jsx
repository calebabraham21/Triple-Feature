const Terms = () => {
  return (
    <div className="min-h-screen app-gradient">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-white mb-4">Terms of Use</h1>
        <div className="space-y-3 text-white/85 text-sm">
          <p>This site is provided for fun and personal entertainment. It comes with no warranties of any kind, express or implied. Use at your own risk.</p>
          <p>We are not liable for any damages or losses arising from your use of this site.</p>
          <p>This site links to and displays information from third-party sources, including The Movie Database (TMDB) and various streaming services. We do not control or endorse third-party content and are not responsible for their availability, accuracy, or policies.</p>
        </div>

        <h2 className="text-xl font-semibold text-white mt-8 mb-3">Privacy Policy</h2>
        <div className="space-y-3 text-white/85 text-sm">
          <p><span className="font-semibold text-white">What we collect:</span> account email (for authentication) and basic usage logs (non-sensitive, for troubleshooting and product improvement).</p>
          <p><span className="font-semibold text-white">Who processes it:</span> Supabase handles authentication and securely stores your account data. TMDB provides movie data; requests to TMDB may include metadata necessary to retrieve information.</p>
          <p><span className="font-semibold text-white">We don’t sell your data.</span> We also don’t share personal data with third parties for advertising.</p>
          <p><span className="font-semibold text-white">Data removal:</span> If you’d like your data deleted or want a copy of your information, contact us at <a href="mailto:caleb@thetriplefeature.org" className="text-accent-blue underline">caleb@thetriplefeature.org</a>.</p>
        </div>

        <p className="text-white/60 text-xs mt-8">Effective date: {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default Terms;


