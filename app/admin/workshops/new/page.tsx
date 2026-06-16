import { WorkshopForm } from "../WorkshopForm";
import { saveWorkshop } from "../../actions";

export const dynamic = "force-dynamic";

export default function NewWorkshop() {
  return (
    <div>
      <p className="overline text-classic-green">Workshops</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">New Workshop</h1>
      <WorkshopForm action={saveWorkshop.bind(null, null)} />
    </div>
  );
}
