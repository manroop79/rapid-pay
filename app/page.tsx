import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import { authOptions } from "@/lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  console.log("Session:", session); // Debugging log

  if (!session) {
    // Server-side redirection to the sign-in page
    redirect("/auth/signin");
  } else {
    // Server-side redirection to the home page
    redirect("/home");
  }

  // Return null or a placeholder component to satisfy the function return type
  return null;
}