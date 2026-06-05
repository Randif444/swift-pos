import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateProductForm from "../create/Form";

// --- FRONTEND LAYER ---
// Core Page Component Declaration
export default async function CreateProductPage() {
  const supabase = await createClient();

  // --- BACKEND LAYER (VIBECODING) ---
  // Auth Session Security Guard Pipeline
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // --- FRONTEND LAYER ---
  // Presentational Layout & Form Wrapper View Rendering
  return (
    <div className="bg-white min-h-screen">
      <CreateProductForm />
    </div>
  );
}