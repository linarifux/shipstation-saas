
import { HashLoader } from "react-spinners"; // 🔥 Loader

export default function EmptyState({ isLoading }) {
  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 items-center justify-center flex"> 
        <HashLoader size={40} color="#38bdf8" />
      </div>
    );
  }
}
