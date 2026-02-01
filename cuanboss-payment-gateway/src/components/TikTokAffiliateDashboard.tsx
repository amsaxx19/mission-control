'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface VideoMetrics {
  id: string;
  title: string;
  postedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  ctr: number; // Click-through rate
  conversions: number;
  revenue: number;
}

interface DailyStats {
  date: string;
  views: number;
  revenue: number;
  conversions: number;
}

interface TikTokAffiliateDashboardProps {
  sellerId: string;
}

/**
 * TikTok Affiliate Analytics Dashboard
 * 
 * Tracks:
 * - Video performance metrics
 * - Revenue per video
 * - CTR and conversion rates
 * - Daily/weekly trends
 * 
 * Usage:
 * ```tsx
 * <TikTokAffiliateDashboard sellerId="seller_123" />
 * ```
 */
export const TikTokAffiliateDashboard: React.FC<TikTokAffiliateDashboardProps> = ({ sellerId }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<VideoMetrics[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [sellerId, timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [metricsRes, dailyRes] = await Promise.all([
        fetch(`/api/tiktok/metrics?sellerId=${sellerId}&range=${timeRange}`),
        fetch(`/api/tiktok/daily-stats?sellerId=${sellerId}&range=${timeRange}`),
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (dailyRes.ok) setDailyStats(await dailyRes.json());
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Calculate summary stats
  const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);
  const avgCtr = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + m.ctr, 0) / metrics.length 
    : 0;
  const rpm = totalViews > 0 ? (totalRevenue / totalViews) * 1000 : 0;

  const topVideos = [...metrics]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">TikTok Affiliate Analytics</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === '7d' ? '7 Hari' : range === '30d' ? '30 Hari' : '90 Hari'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-5 text-white">
          <p className="text-pink-100 text-sm font-medium">Total Views</p>
          <p className="text-2xl font-bold mt-1">{formatNumber(totalViews)}</p>
          <p className="text-xs text-pink-200 mt-2">
            RPM: {formatPrice(rpm)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <p className="text-green-100 text-sm font-medium">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-green-200 mt-2">
            {metrics.length} videos
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
          <p className="text-blue-100 text-sm font-medium">Conversions</p>
          <p className="text-2xl font-bold mt-1">{totalConversions}</p>
          <p className="text-xs text-blue-200 mt-2">
            {totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(2) : 0}% CR
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-5 text-white">
          <p className="text-purple-100 text-sm font-medium">Avg CTR</p>
          <p className="text-2xl font-bold mt-1">{avgCtr.toFixed(2)}%</p>
          <p className="text-xs text-purple-200 mt-2">
            Click-through rate
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}M`}
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => formatPrice(value)}
                labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID')}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Views Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Views Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => formatNumber(value)}
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => formatNumber(value)}
                labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID')}
              />
              <Bar dataKey="views" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Videos */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Top Performing Videos</h3>
        </div>
        
        {topVideos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada data video
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {topVideos.map((video, index) => (
              <div key={video.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{video.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatNumber(video.views)} views • {video.ctr.toFixed(1)}% CTR
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(video.revenue)}</p>
                  <p className="text-sm text-green-600">
                    {video.conversions} sales
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SOP Reminder */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-blue-900">SOP Tim (Adek)</p>
            <ul className="mt-1 text-sm text-blue-700 space-y-1">
              <li>• Upload 4 video/hari (jam 11 siang, 4 sore, 7 malam, 10 malam)</li>
              <li• Pakai sound trending dari Kalodata</li>
              <li>• CTA: "Link di bio" + "Komentar 'INFO' buat guide gratis"</li>
              <li>• Reply semua komen dalam 1 jam</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokAffiliateDashboard;
