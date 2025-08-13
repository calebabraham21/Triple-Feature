import { motion } from 'framer-motion';
import { Code, Github, ExternalLink } from 'lucide-react';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen cinema-gradient pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code size={48} className="text-accent-purple" />
            <h1 className="text-4xl font-bold text-white">Projects</h1>
          </div>
          <p className="text-xl text-white/80">Coming Soon</p>
        </motion.div>

        {/* Placeholder Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cinema-dark/50 border border-cinema-light/20 rounded-2xl p-8 text-center"
        >
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-white mb-4">Projects – TBD</h2>
          <p className="text-white/70 text-lg mb-6">
            I'm currently working on some exciting projects. Check back soon for updates!
          </p>
          
          {/* GitHub Link */}
          <div className="flex justify-center">
            <a
              href="https://github.com/calebabraham21"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cinema-gray hover:bg-cinema-light border border-cinema-light rounded-lg text-white transition-all duration-200 hover:scale-105"
            >
              <Github size={20} />
              <span>View My GitHub</span>
              <ExternalLink size={16} className="text-white/60" />
            </a>
          </div>
        </motion.div>

        {/* Future Project Placeholders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          {/* Project 1 */}
          <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-xl p-6">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="text-lg font-semibold text-white mb-2">Triple Feature</h3>
            <p className="text-white/70 text-sm">
              A movie recommendation app that helps you discover your next favorite film.
            </p>
          </div>

          {/* Project 2 */}
          <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-xl p-6">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-lg font-semibold text-white mb-2">More Coming Soon</h3>
            <p className="text-white/70 text-sm">
              I'm always working on new ideas. Stay tuned for more projects!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
