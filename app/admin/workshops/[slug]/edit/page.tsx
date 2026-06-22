import { notFound } from "next/navigation";
import { WorkshopForm } from "../../WorkshopForm";
import { saveWorkshop } from "../../../actions";
import { getWorkshop } from "@/lib/data/workshops";

export const dynamic = "force-dynamic";

export default async function EditWorkshop({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = getWorkshop(slug);
  if (!workshop) notFound();

  return (
    <div>
      <p className="overline text-deep-blue">Workshops</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">Edit Workshop</h1>
      <WorkshopForm workshop={workshop} action={saveWorkshop.bind(null, slug)} />
    </div>
  );
}
