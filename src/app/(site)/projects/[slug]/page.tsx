import { redirect } from "next/navigation";
import { getProjectBySlug } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (project?.projectUrl && project.projectUrl.startsWith("http")) {
    redirect(project.projectUrl);
  }

  redirect("/projects");
}
