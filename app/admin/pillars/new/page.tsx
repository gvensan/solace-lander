import { PillarForm } from "../PillarForm";
import { savePillar } from "../../actions";

export const dynamic = "force-dynamic";

export default function NewPillar() {
  return (
    <div>
      <p className="overline text-deep-blue">Focus Areas</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">New Focus Area</h1>
      <PillarForm action={savePillar.bind(null, null)} />
    </div>
  );
}
