import Link from 'next/link';

export const metadata = {
  title: 'Disclaimer - Zani',
  description: 'Legal disclaimer and terms of use for Zani anime streaming website',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-12 md:px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Disclaimer
        </h1>

        <div className="bg-[#151b3d] rounded-lg p-6 md:p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Content Disclaimer</h2>
            <p className="leading-relaxed">
              Zani does not host any files on our servers. All content is provided by non-affiliated third parties.
              We do not store or distribute any video files, and all streams are embedded from external sources.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Third-Party Content</h2>
            <p className="leading-relaxed">
              All anime content, videos, and streams displayed on this website are sourced from publicly available
              third-party APIs and services. We do not control, verify, or endorse the content provided by these
              external sources.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Copyright Notice</h2>
            <p className="leading-relaxed">
              All anime titles, images, and content are the property of their respective copyright holders and
              distributors. If you believe that any content on this site infringes on your copyright, please
              contact the original content providers or hosting services directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Use at Your Own Risk</h2>
            <p className="leading-relaxed">
              By using this website, you acknowledge that you access content at your own risk. We are not responsible
              for any legal issues that may arise from accessing content through our platform. Users are encouraged
              to respect copyright laws and support official releases when available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Age Restrictions</h2>
            <p className="leading-relaxed">
              Some anime content may contain mature themes, violence, or other content not suitable for all audiences.
              Parents and guardians are advised to monitor the content accessed by minors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">No Warranties</h2>
            <p className="leading-relaxed">
              This website is provided &quot;as is&quot; without any warranties, expressed or implied. We make no guarantees
              about the availability, quality, accuracy, or legality of the content accessed through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Support Official Releases</h2>
            <p className="leading-relaxed">
              We strongly encourage users to support anime creators and the industry by purchasing official merchandise,
              subscribing to legal streaming services, and watching content through authorized channels whenever possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Changes to Disclaimer</h2>
            <p className="leading-relaxed">
              We reserve the right to modify this disclaimer at any time without prior notice. Continued use of the
              website constitutes acceptance of any changes to these terms.
            </p>
          </section>

          <div className="pt-6 border-t border-purple-900/30">
            <p className="text-sm text-gray-400 mb-4">
              Last updated: January 2024
            </p>
            <p className="text-sm text-gray-400">
              If you have any questions or concerns about this disclaimer, please feel free to reach out through
              our contact channels.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
