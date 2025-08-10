const AboutMe = () => {
  return (
    <div className="min-h-screen cinema-gradient">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">About Me</h1>
        <p className="text-cinema-light mb-6">
          This is a placeholder for your personal bio. You can share your background, your love for movies,
          and what inspired you to build Triple Feature. Add links or images later if you like.
        </p>
        <div className="bg-cinema-dark border border-cinema-gray rounded-lg p-6">
          <p className="text-gray-200">
            “Film is truth 24 frames per second.” — Jean-Luc Godard
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;


