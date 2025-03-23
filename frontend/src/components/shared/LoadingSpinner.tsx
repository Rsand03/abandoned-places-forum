export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center w-full h-full fixed top-0 left-0 z-50 bg-white opacity-80">
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-t-transparent border-blue-700 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
