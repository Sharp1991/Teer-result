'use client';

export default function AIPredictionButton() {
  const handleClick = () => {
    alert('AI Analytics & Predictions available to premium users');
  };

  return (
    <button 
      onClick={handleClick}
      className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold text-lg w-full shadow-lg"
    >
      <div className="flex items-center justify-center space-x-2">
        <span>🔮</span>
        <span>AI Analytics & Predictions</span>
      </div>
      <div className="text-sm opacity-90 mt-1">Premium Feature - Upgrade to Access</div>
    </button>
  );
}
