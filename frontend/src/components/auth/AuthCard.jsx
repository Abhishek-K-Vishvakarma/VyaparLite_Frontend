export default function AuthCard({subtitle, children }) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-800 text-center">
        Vyapar<span className="text-blue-600">Lite</span>
      </h1>

      <p className="text-center text-slate-500 mt-2 mb-8">
        {subtitle}
      </p>

      {children}
    </div>
  );
}
