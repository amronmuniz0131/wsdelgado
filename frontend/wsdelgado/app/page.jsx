"use client";

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
      <main>
        {/* Hero Section */}
        <section className="relative pb-0 lg:pb-28 ">
          <div className="max-w-[100%] mx-auto">
            <div className="aspect-[21/9] w-full relative mb-12">
              {/* Wireframe Hero Placeholder */}
              {/* <Placeholder className="w-full h-full rounded-sm" /> */}
              <img
                src="https://constructestimates.com/wp-content/uploads/2023/08/construction-company.png"
                alt=""
                className="w-full h-full object-cover"
              />

              <div className="hidden lg:block md:absolute top-1/2 left-12 -translate-y-1/2 max-w-lg bg-white/75 p-8 backdrop-blur-sm shadow-sm rounded-xl z-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  WSDelgado Builders
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Lorem ipsum sit o dolor amet consectetur adipiscing elit.
                  Building your dreams with precision and excellence.
                </p>
                <button onClick={() => window.location.href = "/about"} className="px-6 py-3 bg-white border border-gray-900 text-gray-900 font-medium hover:bg-gray-50 transition-colors min-w-[140px]">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight uppercase">
              Our Services
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                id: 1,
                name: "demolition",
                image:
                  "https://www.capitalrecycling.com.au/wp-content/uploads/2023/02/86-Victoria-Avenue-Dalkeith-35-scaled.jpg",
              },
              {
                id: 2,
                name: "glassworks",
                image:
                  "https://www.schiavello.com/__data/assets/image/0015/29202/glassworks-australia-banner.jpg",
              },
              {
                id: 3,
                name: "renovation",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGwVRCe9gfTke8xHCvty8sbRLYxoG4yrUwgg&s",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex flex-col group cursor-pointer hover:scale-105 transition-transform duration-500"
              >
                <div className="aspect-square mb-6 overflow-hidden">
                  {/* <Placeholder className="w-full h-full transition-transform duration-500 group-hover:scale-105" /> */}
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 capitalize">
                  {item.name}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights Section */}
        {/* <section className="py-16 w-full">
           <div className="h-64 md:h-96 w-full relative">
             <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border-y border-gray-200">
               <div className="w-full h-full absolute">
                 <div className="w-full h-[1px] bg-gray-300 absolute top-0 left-0 transform origin-top-left rotate-[15deg] opacity-20"></div>
                 <div className="w-full h-[1px] bg-gray-300 absolute bottom-0 left-0 transform origin-bottom-left -rotate-[15deg] opacity-20"></div>
               </div>
               <h2 className="text-4xl font-bold z-10 bg-white px-8 py-4 shadow-sm border border-gray-100">Highlights</h2>
             </div>
           </div>
          </section> */}

        {/* Location & About Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Location Row */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="aspect-square w-full">
              <Placeholder className="w-full h-full" text="Map View" />
            </div>
            <div className="md:pl-10">
              <h2 className="text-3xl font-bold mb-6">Location</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Stay in loop with our company news. Sign up to our newsletter
                and receive the freshest info about our latest projects and
                locations.
              </p>
              <button className="px-6 py-2 border border-gray-300 rounded hover:border-gray-900 transition-colors">
                View on Map
              </button>
            </div>
          </div>

          {/* About Row */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 md:pr-10">
              <h2 className="text-3xl font-bold mb-6">About Us</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes."
              </p>
              <p className="text-gray-600 leading-relaxed">
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
                sem. Nulla consequat massa quis enim.
              </p>
            </div>
            <div className="order-1 md:order-2 aspect-square w-full">
              {/* <Placeholder className="w-full h-full" text="Team Image" /> */}
              <img
                src="https://pollackpeacebuilding.com/wp-content/uploads/2024/11/construction-.jpg"
                alt=""
                className="rounded-xl w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3">Client’s Feedback</h2>
              <p className="text-gray-500 font-medium">People love this!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm text-center flex flex-col items-center"
                >
                  <p className="text-gray-600 italic mb-6 leading-relaxed text-sm">
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                    Aenean commodo ligula eget dolor. Aene an massa."
                  </p>

                  <div className="flex gap-1 text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < 4 ? "currentColor" : "none"}
                        strokeWidth={i < 4 ? 0 : 2}
                      />
                    ))}
                  </div>

                  <div className="mt-auto">
                    <h4 className="font-bold text-sm">John Doe {item}</h4>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Client
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
