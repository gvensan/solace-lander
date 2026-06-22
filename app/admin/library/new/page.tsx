import { LibraryForm } from "../LibraryForm";
import { saveLibraryItem } from "../../actions";

export const dynamic = "force-dynamic";

export default function NewLibraryItem() {
  return (
    <div>
      <p className="overline text-deep-blue">Library</p>
      <h1 className="mt-1 mb-8 text-3xl text-deep-blue">New Library Item</h1>
      <LibraryForm action={saveLibraryItem.bind(null, null)} />
    </div>
  );
}
