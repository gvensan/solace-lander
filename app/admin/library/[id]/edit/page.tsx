import { notFound } from "next/navigation";
import { LibraryForm } from "../../LibraryForm";
import { saveLibraryItem } from "../../../actions";
import { getLibraryItem } from "@/lib/data/library";

export const dynamic = "force-dynamic";

export default async function EditLibraryItem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getLibraryItem(id);
  if (!item) notFound();

  return (
    <div>
      <p className="overline text-deep-blue">Library</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">Edit Library Item</h1>
      <LibraryForm item={item} action={saveLibraryItem.bind(null, id)} />
    </div>
  );
}
