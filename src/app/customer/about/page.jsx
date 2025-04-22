import PageSectionHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { FaHeart, FaLeaf, FaRibbon, FaGem, FaStar } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <section className="container mx-auto px-6 py-6">
        <PageSectionHeader
          title={"About Us"}
          subtitle="Where elegance meets comfort, and fashion becomes an expression of
            your unique beauty."
        />

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 bg-pink-100 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-pink-300"></div>
            <div className="relative z-10 text-center p-8">
              <FaStar className="text-6xl text-pink-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-pink-800 font-serif">
                Est. 2014
              </h3>
              <p className="text-pink-700 mt-2">
                {new Date().getFullYear() - 2014} years of fashion excellence
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-pink-800 mb-6 font-serif">
              Redefining Women's Fashion
            </h2>
            <p className="text-pink-700 mb-4">
              Icequeenbyice was born from a simple idea: that every woman
              deserves to feel confident and beautiful in clothes that celebrate
              her individuality. What began as a small boutique with a carefully
              curated selection has blossomed into a beloved brand known for its
              distinctive aesthetic.
            </p>
            <p className="text-pink-700 mb-6">
              We don't follow trends - we create them. Our designs blend
              timeless elegance with contemporary flair, using only the finest
              fabrics and craftsmanship. Each piece is conceived to become a
              staple in your wardrobe, season after season.
            </p>
            <Link href="/customer/product">
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
                Discover Our Collections
              </button>
            </Link>
          </div>
        </div>

        <div className="text-center mb-24">
          <h2 className="text-3xl font-bold text-pink-800 mb-16 font-serif">
            Our Philosophy
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaHeart className="text-4xl mb-4 text-pink-600" />,
                title: "Passionate Design",
                text: "Every stitch tells a story of our dedication to creating pieces you'll love",
              },
              {
                icon: <FaLeaf className="text-4xl mb-4 text-pink-600" />,
                title: "Sustainable Luxury",
                text: "We're committed to ethical sourcing and reducing our environmental impact",
              },
              {
                icon: <FaRibbon className="text-4xl mb-4 text-pink-600" />,
                title: "Impeccable Quality",
                text: "Premium materials and craftsmanship that stands the test of time",
              },
              {
                icon: <FaGem className="text-4xl mb-4 text-pink-600" />,
                title: "Timeless Style",
                text: "Designs that transcend seasons and trends",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-pink-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-pink-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-100 rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-pink-800 mb-12 text-center font-serif">
            Our Journey
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: "2014",
                event: "Founded in Abuja",
                detail: "Launched our first boutique in the heart of Wuse II.",
              },
              {
                year: "2016",
                event: "Expanded Within the FCT",
                detail: "Opened two more outlets across Gwarinpa and Maitama.",
              },
              {
                year: "2019",
                event: "Online Store Goes Live",
                detail:
                  "Enabled seamless nationwide shopping from Abuja to Lagos.",
              },
              {
                year: "2021",
                event: "Made-in-Nigeria Showcase",
                detail:
                  "Hosted our first local fashion event featuring Abuja-based designers.",
              },
              {
                year: "2023",
                event: "Eco Packaging Rollout",
                detail:
                  "Transitioned to sustainable packaging across all Abuja outlets.",
              },
              {
                year: "2024",
                event: "10 Years in Style",
                detail:
                  "Celebrating a decade of elegance and innovation from Abuja.",
              },
            ].map((milestone, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md"
              >
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-bold text-pink-800 mb-2">
                  {milestone.event}
                </h3>
                <p className="text-pink-600 italic">{milestone.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Love */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-pink-800 mb-6 font-serif">
            Loved By Thousands
          </h2>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto mb-10">
            Join our community of stylish women who trust Swanky for their
            wardrobe essentials
          </p>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className="text-3xl text-pink-500" />
            ))}
          </div>
          <p className="text-pink-700 mt-4">4.9/5 from 10,000+ reviews</p>
        </div>
      </section>
    </div>
  );
}
