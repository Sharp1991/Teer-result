"use client";
import { useState, useEffect } from "react";

export default function TeerStatistics({ language = 'en' }) {
  const t = language === 'bn'
    ? {
        loading: 'পরিসংখ্যান লোড হচ্ছে...',
        unavailable: 'পরিসংখ্যান পাওয়া যাচ্ছে না — পরে আবার চেষ্টা করুন',
        firstRound: 'প্রথম রাউন্ড',
        secondRound: 'দ্বিতীয় রাউন্ড',
        hotNumbers: '🔥 হট নম্বর (শেষ ৬০ রাউন্ড)',
        dueNumbers: '⏰ দীর্ঘদিন আসেনি এমন নম্বর',
        frequentNumbers: '⚡ ঘন ঘন আসা নম্বর',
        nonFrequentNumbers: '🐌 কম আসা নম্বর (দীর্ঘ বিরতি)',
        yearlyHot: '📅 বার্ষিক হট নম্বর (শেষ ৩৬৫ রাউন্ড)',
        yearlyCold: '❄️ বার্ষিক কোল্ড নম্বর (শেষ ৩৬৫ রাউন্ড)',
        allTimeHot: '🏆 সর্বকালের হট নম্বর',
        allTimeCold: '🧊 সর্বকালের কোল্ড নম্বর',
        refresh: '🔄 ডেটা রিফ্রেশ করুন',
        times: 'বার',
        days: 'দিন',
      }
    : {
        loading: 'Loading statistics...',
        unavailable: 'Statistics unavailable - Please try again later',
        firstRound: 'First Round',
        secondRound: 'Second Round',
        hotNumbers: '🔥 Hot Numbers (Last 60 Rounds)',
        dueNumbers: '⏰ Due Numbers (Longest Since Last)',
        frequentNumbers: '⚡ Frequent Numbers (Shortest Gaps)',
        nonFrequentNumbers: '🐌 Non-Frequent Numbers (Longest Gaps)',
        yearlyHot: '📅 Yearly Hot (Last 365 Rounds)',
        yearlyCold: '❄️ Yearly Cold (Last 365 Rounds)',
        allTimeHot: '🏆 All Time Hot',
        allTimeCold: '🧊 All Time Cold',
        refresh: '🔄 Refresh Data',
        times: 'times',
        days: 'd',
      }

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState("firstRound");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/statistics');
      const data = await res.json();
      if (data.success) setStats(data.statistics);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600 text-sm">{t.loading}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {t.unavailable}
      </div>
    );
  }

  const roundData = stats[activeRound];
  const isFirstRound = activeRound === "firstRound";

  return (
    <div className="space-y-4">
      {/* Round Selector */}
      <div className="flex justify-center mb-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setActiveRound("firstRound")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isFirstRound 
                ? "bg-blue-600 text-white" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.firstRound}
          </button>
          <button
            onClick={() => setActiveRound("secondRound")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isFirstRound 
                ? "bg-green-600 text-white" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.secondRound}
          </button>
        </div>
      </div>

      {/* Hot Numbers - Last 60 Rounds */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.hotNumbers}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.hotNumbers?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="text-lg font-bold text-red-700">{item.number}</div>
              <div className="text-xs text-red-600 mt-1">{item.count}{t.times}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Due Numbers - Longest Since Last Appearance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.dueNumbers}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.dueNumbers?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-lg font-bold text-blue-700">{item.number}</div>
              <div className="text-xs text-blue-600 mt-1">{item.days}{t.days}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequent Numbers - Shortest Gaps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.frequentNumbers}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.frequentNumbers?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-green-50 border border-green-200 rounded-md">
              <div className="text-lg font-bold text-green-700">{item.number}</div>
              <div className="text-xs text-green-600 mt-1">{item.days}{t.days}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Frequent Numbers - Longest Gaps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.nonFrequentNumbers}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.nonFrequentNumbers?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-purple-50 border border-purple-200 rounded-md">
              <div className="text-lg font-bold text-purple-700">{item.number}</div>
              <div className="text-xs text-purple-600 mt-1">{item.days}{t.days}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Hot - Last 365 Rounds */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.yearlyHot}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.yearlyHot?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-orange-50 border border-orange-200 rounded-md">
              <div className="text-lg font-bold text-orange-700">{item.number}</div>
              <div className="text-xs text-orange-600 mt-1">{item.count}{t.times}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Cold - Last 365 Rounds */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.yearlyCold}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.yearlyCold?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-gray-100 border border-gray-300 rounded-md">
              <div className="text-lg font-bold text-gray-700">{item.number}</div>
              <div className="text-xs text-gray-600 mt-1">{item.count}{t.times}</div>
            </div>
          ))}
        </div>
      </div>

      {/* All Time Hot */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.allTimeHot}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.allTimeHot?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="text-lg font-bold text-yellow-700">{item.number}</div>
              <div className="text-xs text-yellow-600 mt-1">{item.count}{t.times}</div>
            </div>
          ))}
        </div>
      </div>

      {/* All Time Cold */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          {t.allTimeCold}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.allTimeCold?.map((item) => (
            <div key={item.number} className="text-center p-2 bg-indigo-50 border border-indigo-200 rounded-md">
              <div className="text-lg font-bold text-indigo-700">{item.number}</div>
              <div className="text-xs text-indigo-600 mt-1">{item.count}{t.times}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center pt-2">
        <button
          onClick={fetchStatistics}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          {t.refresh}
        </button>
      </div>
    </div>
  );
}
