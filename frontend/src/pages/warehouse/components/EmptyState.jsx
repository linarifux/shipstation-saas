import { HashLoader } from "react-spinners";

export default function EmptyState({ isLoading }) {
  if (isLoading) {
    return (
      <div className="justify-center flex flex-col items-center py-20">
        <HashLoader size={50} color="#38bdf8" />
      </div>
    );
  }
}
