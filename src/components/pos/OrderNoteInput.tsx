// src/components/pos/OrderNoteInput.tsx

interface Props {
  note: string;
  setNote: (note: string) => void;
}

export default function OrderNoteInput({ note, setNote }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
        Order Note
      </p>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Take away, No sugar..."
        className="w-full p-3 rounded-md bg-gray-100 dark:bg-white/5 focus:ring-2 focus:ring-green-500 outline-none"
      />
    </div>
  );
}