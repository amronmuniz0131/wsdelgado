"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Placeholder } from "@/components/Placeholder";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative pb-0 lg:pb-28" aria-labelledby="hero-heading">
          <div className="max-w-[100%] mx-auto">
            <div className="aspect-[21/9] w-full relative mb-12">
              <Image
                src="https://constructestimates.com/wp-content/uploads/2023/08/construction-company.png"
                alt="WSDelgado Builders construction site overview"
                fill
                priority
                className="object-cover"
              />

              <div className="hidden lg:block md:absolute top-1/2 left-12 -translate-y-1/2 max-w-lg bg-white/75 p-8 backdrop-blur-sm shadow-sm rounded-xl z-20">
                <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  WSDelgado Builders: Building Your Future
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Precision, excellence, and dedication in every project. Building your dreams with the highest standards in the industry.
                </p>
                <button 
                  onClick={() => window.location.href = "/about"} 
                  className="px-6 py-3 bg-white border border-gray-900 text-gray-900 font-medium hover:bg-gray-50 transition-colors min-w-[140px]"
                  aria-label="Learn more about WSDelgado Builders"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="services-heading">
          <div className="text-center mb-16">
            <h2 id="services-heading" className="text-3xl font-bold tracking-tight uppercase">
              Our Expertise & Services
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                id: 1,
                name: "Professional Demolition",
                image: "https://www.capitalrecycling.com.au/wp-content/uploads/2023/02/86-Victoria-Avenue-Dalkeith-35-scaled.jpg",
                description: "Safe and efficient demolition services for various project scales."
              },
              {
                id: 2,
                name: "Custom Glassworks",
                image: "https://www.schiavello.com/__data/assets/image/0015/29202/glassworks-australia-banner.jpg",
                description: "Exquisite glass design and installation for modern structures."
              },
              {
                id: 3,
                name: "Complete Renovation",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGwVRCe9gfTke8xHCvty8sbRLYxoG4yrUwgg&s",
                description: "Transforming spaces with high-quality interior and exterior renovations."
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex flex-col group cursor-pointer hover:scale-105 transition-transform duration-500"
              >
                <div className="aspect-square mb-6 overflow-hidden relative">
                  <Image
                    src={item.image}
                    alt={`${item.name} construction service`}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 capitalize">
                  {item.name}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {item.description} Our team ensures the highest quality in {item.name.toLowerCase()} for every client.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Location & About Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="about-heading">
          {/* Location Row */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="aspect-square w-full relative">
              <Placeholder className="w-full h-full" text="Map View" />
            </div>
            <div className="md:pl-10">
              <h2 className="text-3xl font-bold mb-6">Our Location</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We are strategically located to serve our clients better. Visit us or get in touch for more information about our latest locations.
              </p>
              <button 
                className="px-6 py-2 border border-gray-300 rounded hover:border-gray-900 transition-colors"
                aria-label="View our location on google maps"
              >
                View on Map
              </button>
            </div>
          </div>

          {/* About Row */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 md:pr-10">
              <h2 id="about-heading" className="text-3xl font-bold mb-6">About WSDelgado</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                With years of experience in the construction industry, WSDelgado Builders has established a reputation for reliability and quality workmanship.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We specialize in delivering projects that meet the unique needs of our clients, on time and within budget.
              </p>
            </div>
            <div className="order-1 md:order-2 aspect-square w-full relative">
              <Image
                src="https://pollackpeacebuilding.com/wp-content/uploads/2024/11/construction-.jpg"
                alt="WSDelgado Builders team at work"
                width={600}
                height={600}
                className="rounded-xl object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50/50" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="testimonials-heading" className="text-3xl font-bold mb-3">Client’s Feedback</h2>
              <p className="text-gray-500 font-medium">Hear what our satisfied clients say about us.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <article
                  key={item}
                  className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm text-center flex flex-col items-center"
                >
                  <p className="text-gray-600 italic mb-6 leading-relaxed text-sm">
                    "WSDelgado Builders exceeded our expectations with their attention to detail and professional approach to our home renovation project."
                  </p>

                  <div className="flex gap-1 text-yellow-500 mb-4" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < 5 ? "currentColor" : "none"}
                        strokeWidth={i < 5 ? 0 : 2}
                      />
                    ))}
                  </div>

                  <div className="mt-auto">
                    <h4 className="font-bold text-sm">Happy Client {item}</h4>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Verified Client
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
