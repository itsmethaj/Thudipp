import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; 
import {
  Heart,
  Droplets,
  Clock3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  Layers,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoSlideRef = useRef(null);

  const facts = [
    {
      icon: Heart,
      title: "Save 3 Lives",
      description: "One blood donation can help save up to three lives.",
    },
    {
      icon: Droplets,
      title: "Essential Resource",
      description: "Blood cannot be manufactured in laboratories.",
    },
    {
      icon: Clock3,
      title: "Quick Process",
      description: "Most donations take only 10-15 minutes.",
    },
    {
      icon: CalendarDays,
      title: "Donate Again",
      description: "Healthy adults can usually donate every 3 months.",
    },
  ];

  const faqs = [
    {
      q: "Who can donate blood?",
      a: "Healthy individuals between 18 and 65 years of age can usually donate blood.",
    },
    {
      q: "Is blood donation safe?",
      a: "Yes. Blood donation is a safe and medically supervised process.",
    },
    {
      q: "How often can I donate?",
      a: "Most healthy adults can donate blood every 3 months.",
    },
    {
      q: "Why are donor contacts hidden?",
      a: "To protect donor privacy and prevent misuse of personal information.",
    },
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("image_url")
          .order("created_at", { ascending: true });

        if (!error) {
          setBanners(data?.map((b) => b.image_url) || []);
        }
      } catch (err) {
        console.error("Error loading remote banners:", err);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    if (banners.length > 1) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000); 
    }
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [banners]);

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-24 sm:pt-28 pb-12 px-4 sm:px-8">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {banners.length > 0 && (
          <div
            className="group relative overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-md w-full aspect-video max-h-[400px] bg-white border border-gray-100"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          >
            {banners.map((url, index) => (
              <div
                key={url}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${
                  index === currentSlide
                    ? "opacity-100 scale-100 z-0"
                    : "opacity-0 scale-100 pointer-events-none"
                }`}
              >
                <img
                  src={url}
                  alt={`Hero Banner Track ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}

            {banners.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/10 hover:bg-black/30 text-gray-700 hover:text-black backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/10 hover:bg-black/30 text-gray-700 hover:text-black backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "w-6 bg-[#B3001B]"
                          : "w-1.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#B3001B] text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-full mb-3">
                  Concept Preview
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  About Thudipp
                </h2>
                <div className="h-1 w-12 bg-[#B3001B] rounded-full mt-2 mb-4" />
              </div>

              <div className="space-y-4 text-gray-500 text-xs sm:text-sm leading-relaxed font-medium">
                <p>
                  Thudipp is a concept blood donor management platform developed
                  to demonstrate how technology can simplify donor discovery and
                  emergency blood requests. The project explores a structured
                  and privacy-conscious approach to maintaining donor records,
                  searching by blood group, and connecting individuals during
                  critical situations.
                </p>
                <p>
                  At its current stage, Thudipp serves as a prototype and
                  learning project. The donor information available within the
                  system is intended for demonstration and testing purposes and
                  should not be considered an official or verified blood donor
                  registry.
                </p>
                <p>
                  A key focus of the project is privacy and responsible data
                  handling. Personal contact details are not publicly displayed,
                  and the platform is designed around the idea that authorized
                  coordinators can act as intermediaries when communication is
                  required. The long-term vision of Thudipp is to evolve into a
                  reliable, secure, and community-driven platform that could
                  help connect donors and recipients more efficiently while
                  respecting user privacy and data protection.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 bg-gray-50/50 rounded-2xl p-4 sm:p-5 border border-gray-100/60">
              <div className="bg-white rounded-xl p-3.5 border border-gray-100 flex items-center gap-3.5 shadow-sm">
                <div className="p-2.5 bg-red-50 text-[#B3001B] rounded-xl shrink-0">
                  <Search size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Fast Queries
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    Instant matching records simulation
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-100 flex items-center gap-3.5 shadow-sm">
                <div className="p-2.5 bg-red-50 text-[#B3001B] rounded-xl shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Privacy Safeguards
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    Masked contact detail protocols
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-100 flex items-center gap-3.5 shadow-sm">
                <div className="p-2.5 bg-red-50 text-[#B3001B] rounded-xl shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Scalable Architecture
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    Ready for production data inputs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="px-1">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Blood Donation Facts
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Crucial insights regarding lifecycle resource assistance
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div
                  key={fact.title}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-red-200 transition-colors duration-300"
                >
                  <div>
                    <div className="p-2.5 bg-red-50 w-max rounded-xl mb-4 text-[#B3001B]">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900">
                      {fact.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-2 leading-relaxed font-medium">
                      {fact.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="px-1">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Quick references regarding policy rules and standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-gray-200/80 transition-colors duration-200"
              >
                <h3 className="font-bold text-sm text-gray-900 flex items-start gap-2">
                  <span className="text-[#B3001B] font-black text-base leading-none">
                    Q.
                  </span>
                  {faq.q}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-2.5 ml-4 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center pt-10 pb-4 border-t border-gray-200/50">
          <h3 className="font-black text-[#B3001B] text-lg tracking-wider flex items-center justify-center gap-1.5">
            THUDIPP <span className="animate-pulse text-sm">❤️</span>
          </h3>
          <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
            Interactive System Preview • Blueprint Concept Framework
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
