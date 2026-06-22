import { notFound } from "next/navigation";
import { EventForm } from "../../../events/EventForm";
import { saveMarketingEvent } from "../../../actions";
import { getMarketingEvent } from "@/lib/data/marketing-events";

export const dynamic = "force-dynamic";

export default async function EditMarketingEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getMarketingEvent(id);
  if (!event) notFound();

  return (
    <div>
      <p className="overline text-deep-blue">Events</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">Edit Event</h1>
      <EventForm event={event} action={saveMarketingEvent.bind(null, id)} backHref="/admin/marketing-events" />
    </div>
  );
}
