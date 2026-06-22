import { notFound } from "next/navigation";
import { PillarForm } from "../../PillarForm";
import { savePillar } from "../../../actions";
import { getPillar } from "@/lib/data/pillars";

export const dynamic = "force-dynamic";

export default async function EditPillar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pillar = getPillar(id);
  if (!pillar) notFound();

  return (
    <div>
      <p className="overline text-classic-green">Focus Areas</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">Edit Focus Area</h1>
      <PillarForm pillar={pillar} action={savePillar.bind(null, id)} />
    </div>
  );
}
