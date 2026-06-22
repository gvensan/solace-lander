import { GroupForm } from "../GroupForm";
import { saveGroup } from "../../actions";

export const dynamic = "force-dynamic";

export default function NewGroup() {
  return (
    <div>
      <p className="overline text-deep-blue">Reference Groups</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">New Group</h1>
      <GroupForm action={saveGroup.bind(null, null)} />
    </div>
  );
}
