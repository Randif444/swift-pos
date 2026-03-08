import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateProductForm from "../create/Form";

export default async function CreateProductPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="bg-white min-h-screen">
      <CreateProductForm />
    </div>
  );
}
