import { supabase } from "../supabase";

export async function logActivity(
  action,
  targetType,
  targetAdmissionNo,
  details = ""
) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  await supabase
    .from("activity_logs")
    .insert([
      {
        actor_username:
          user?.username,
          
        action,

        target_type:
          targetType,

        target_admission_no:
          targetAdmissionNo,

        details,
      },
    ]);
}