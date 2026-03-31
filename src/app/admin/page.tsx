import { redirect } from "next/navigation";

// Admin page redirects to homepage – editing happens inline on the real site
export default function AdminPage() {
  redirect("/");
}
