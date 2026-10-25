import { redirect } from "next/navigation";

type Params = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: Params) {
  await params;
  redirect("/");
}
