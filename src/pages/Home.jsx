import { useNavigate } from "react-router-dom";
import Analytics from "./Admin/Analytics";
import {
Search,
Heart,
Droplets,
Clock3,
CalendarDays,
ChevronRight,
} from "lucide-react";

function Home() {
const navigate = useNavigate();

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

const quickActions = [
{
title: "Find Donors",
description: "Search by blood group",
},
{
title: "Available Donors",
description: "View active donors",
},
{
title: "Blood Groups",
description: "Explore donor availability",
},
{
title: "Live Statistics",
description: "Real-time analytics",
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

return (
  <div className="min-h-screen bg-[#F6F7FB] pt-24 pb-10 px-4">
    {" "}
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero */}

      <div
        className="
    relative
    overflow-hidden
    rounded-[32px]
    shadow-xl
    min-h-[220px]
    p-8
    text-white
  "
      >
        {/* Background Banner */}
        <img
          src="./public/banner.png"
          alt="Banner"
          className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
        />

        {/* Dark Overlay */}
        <div
          className="
      absolute
      inset-0
      bg-black/40
    "
        />

        {/* Content */}
        <div className="relative z-10 max-w-[65%]">
          <h1 className="text-3xl font-black leading-tight">
            Need Blood
            <br />
            Urgently?
          </h1>

          <p className="text-red-100 mt-3 text-sm">
            Search verified blood donors instantly and connect faster during
            emergencies.
          </p>

          <button
            onClick={() => navigate("/donors")}
            className="
        mt-6
        bg-white
        text-[#B3001B]
        px-6
        py-3
        rounded-2xl
        font-bold
        flex
        items-center
        gap-2
      "
          >
            Find Donors
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Logo */}
        <img
          src="./public/logo 3.png"
          alt="Thudipp Logo"
          className="
      absolute
      -right-4
      top-7
      w-45
      h-45
      object-contain
      z-10
      opacity-95
    "
        />
      </div>
      {/* Analytics */}

      <Analytics />

      {/* Blood Facts */}

      <div>
        <h2 className="text-xl font-bold mb-4">Blood Donation Facts</h2>

        <div className="grid grid-cols-2 gap-4">
          {facts.map((fact) => {
            const Icon = fact.icon;

            return (
              <div
                key={fact.title}
                className="
                bg-white
                rounded-3xl
                p-5
                shadow-sm
                border
                border-gray-100
              "
              >
                <Icon size={22} className="text-[#B3001B] mb-3" />

                <h3 className="font-bold text-sm">{fact.title}</h3>

                <p className="text-xs text-gray-500 mt-2">{fact.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}

      <div>
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="
              bg-white
              rounded-3xl
              p-5
              shadow-sm
              border
              border-gray-100
            "
            >
              <h3 className="font-semibold text-sm">{faq.q}</h3>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}

      <div className="text-center py-4">
        <h3 className="font-black text-[#B3001B] text-lg">Thudipp ❤️</h3>

        <p className="text-gray-500 text-sm mt-1">
          Connecting Donors. Saving Lives.
        </p>
      </div>
    </div>
  </div>
);
}

export default Home;
