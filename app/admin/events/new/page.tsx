import { EventForm } from "../EventForm";
import { saveEvent } from "../../actions";

export const dynamic = "force-dynamic";

export default function NewEvent() {
  return (
    <div>
      <p className="overline text-deep-blue">Events</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">New Event</h1>
      <EventForm action={saveEvent.bind(null, null)} />
    </div>
  );
}
