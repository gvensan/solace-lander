import { notFound } from "next/navigation";
import { GroupForm } from "../../GroupForm";
import { saveGroup } from "../../../actions";
import { getGroup } from "@/lib/data/groups";

export const dynamic = "force-dynamic";

export default async function EditGroup({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = getGroup(id);
  if (!group) notFound();

  return (
    <div>
      <p className="overline text-deep-blue">Reference Groups</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">Edit Group</h1>
      <GroupForm group={group} action={saveGroup.bind(null, id)} />
    </div>
  );
}
