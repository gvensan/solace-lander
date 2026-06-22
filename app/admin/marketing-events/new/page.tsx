import { EventForm } from "../../events/EventForm";
import { saveMarketingEvent } from "../../actions";

export const dynamic = "force-dynamic";

export default function NewMarketingEvent() {
  return (
    <div>
      <p className="overline text-deep-blue">Events</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">New Event</h1>
      <EventForm action={saveMarketingEvent.bind(null, null)} backHref="/admin/marketing-events" />
    </div>
  );
}
