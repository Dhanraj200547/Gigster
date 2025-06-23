import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Gigster
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Connecting students with part-time jobs in catering, delivery, events, and more.
        </p>
      </div>
    </div>
  );
}
