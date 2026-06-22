import { notFound } from "next/navigation";
import { EventForm } from "../../EventForm";
import { saveEvent } from "../../../actions";
import { getEvent } from "@/lib/data/events";

export const dynamic = "force-dynamic";

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  return (
    <div>
      <p className="overline text-deep-blue">Events</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">Edit Event</h1>
      <EventForm event={event} action={saveEvent.bind(null, id)} />
    </div>
  );
}
