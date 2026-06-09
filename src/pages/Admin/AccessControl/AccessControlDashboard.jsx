import { useNavigate } from "react-router-dom";
import { UserPlus, Users, ChevronRight, ShieldCheck } from "lucide-react";

function AccessControlDashboard() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Volunteer",
      description: "Add new volunteer account",
      icon: UserPlus,
      page: "/admin/create-volunteer",
    },
    {
      title: "View Volunteers",
      description: "Manage permissions and accounts",
      icon: Users,
      page: "/admin/view-volunteers",
    },
  ];

  return (
    <div className="min-h-screen pt-25 bg-[#F8F8F8] p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-6">
          <div className="bg-white rounded-3xl text-center p-6 mx-auto  shadow-sm mb-5">
            <h1 className="text-3xl font-black text-[#B3001B] ">
              Access Control
            </h1>
          </div>
        </div>

        {/* Cards */}

        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={() => navigate(action.page)}
                className="
                  w-full
                  bg-white
                  rounded-3xl
                  p-5
                  shadow-md
                  border border-gray-100
                  hover:shadow-lg
                  transition-all
                  duration-200
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        w-14 h-14
                        rounded-2xl
                        bg-red-50
                        flex items-center justify-center
                      "
                    >
                      <Icon size={26} className="text-[#B3001B]" />
                    </div>

                    <div className="text-left">
                      <h3 className="font-bold text-gray-900">
                        {action.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AccessControlDashboard;
