import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useLoaderStore from "../../../stores/loaderStore";
import { getCardAnalytics } from "../../../services/dcAnalyticsApi";

const DCAnalyticsTab = ({ cardSlug }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const { showLoader, hideLoader } = useLoaderStore();

  // Fetch analytics data from API
  const fetchAnalytics = async () => {
    if (!cardSlug) {
      toast.error("Card slug is required");
      return;
    }

    showLoader();
    try {
      const response = await getCardAnalytics(cardSlug);
      setAnalyticsData(response.data);
    } catch (error) {
      toast.error("Failed to load analytics");
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  // Export analytics data as CSV
  const exportToCSV = () => {
    if (!analyticsData) {
      toast.error("No data available to export");
      return;
    }

    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add overview section
      csvContent += "Digital Card Analytics\n";
      csvContent += "Metric,Value\n";
      csvContent += `Total Views,${analyticsData.views}\n`;
      csvContent += `Call Taps,${analyticsData.tapsCall}\n`;
      csvContent += `Email Taps,${analyticsData.tapsEmail}\n`;
      csvContent += `Website Taps,${analyticsData.tapsWebsite}\n`;
      csvContent += `Social Taps,${analyticsData.tapsSocial}\n\n`;

      // Add social breakdown section if available
      if (
        analyticsData.socialBreakdown &&
        Object.keys(analyticsData.socialBreakdown).length > 0
      ) {
        csvContent += "Social Platform Breakdown\n";
        csvContent += "Platform,Taps\n";
        Object.entries(analyticsData.socialBreakdown).forEach(
          ([platform, taps]) => {
            csvContent += `${platform},${taps}\n`;
          }
        );
      }

      // Create timestamp for filename
      const now = new Date();
      const timestamp = now
        .toISOString()
        .replace(/[:.]/g, "-") // Replace colons and periods with hyphens
        .replace("T", "_") // Replace T with underscore
        .slice(0, 19); // Remove timezone information

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `card_analytics_export_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export successful");
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [cardSlug]);

  return (
    <div className="w-full px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h2>
          <p className="text-gray-600">
            Track your link performance and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={exportToCSV}
            className="flex bg-gray-50 items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
          >
            Export
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Analytics Content */}
      <OverviewTab analyticsData={analyticsData} />
    </div>
  );
};

// Overview tab showing metrics and breakdown
const OverviewTab = ({ analyticsData }) => {
  if (!analyticsData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Views"
          value={analyticsData.views}
          color="blue"
        />
        <MetricCard
          title="Call Taps"
          value={analyticsData.tapsCall}
          color="lightBlue"
        />
        <MetricCard
          title="Email Taps"
          value={analyticsData.tapsEmail}
          color="orange"
        />
        <MetricCard
          title="Website Taps"
          value={analyticsData.tapsWebsite}
          color="green"
        />
        <MetricCard
          title="Social Taps"
          value={analyticsData.tapsSocial}
          color="purple"
        />
      </div>

      {/* Social Breakdown */}
      {analyticsData.socialBreakdown &&
        Object.keys(analyticsData.socialBreakdown).length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all mb-8">
            <h3 className="text-size-18 font-semibold text-gray-900 mb-3">
              Social Platform Breakdown
            </h3>
            <p className="text-size-14 text-gray-600 mb-4">
              Taps by social media platform.
            </p>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <TableHeader title="Platform" />
                    <TableHeader title="Taps" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(analyticsData.socialBreakdown).map(
                    ([platform, taps], i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary capitalize">
                          {platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {taps}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <h3 className="text-size-18 font-semibold text-gray-900 mb-3">
          Analytics Summary
        </h3>
        <p className="text-size-14 text-gray-600 mb-4">
          Overview of your digital card performance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Total Engagement
            </h4>
            <p className="text-2xl font-bold text-primary">
              {analyticsData.views +
                analyticsData.tapsCall +
                analyticsData.tapsEmail +
                analyticsData.tapsWebsite +
                analyticsData.tapsSocial}
            </p>
            <p className="text-sm text-gray-600">Views + All Taps</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Total Taps
            </h4>
            <p className="text-2xl font-bold text-primary">
              {analyticsData.tapsCall +
                analyticsData.tapsEmail +
                analyticsData.tapsWebsite +
                analyticsData.tapsSocial}
            </p>
            <p className="text-sm text-gray-600">All interaction taps</p>
          </div>
        </div>
      </div>
    </>
  );
};

// Individual metric card
const MetricCard = ({ title, value, color }) => {
  const colorMap = {
    blue: "bg-blue-500",
    lightBlue: "bg-blue-300",
    orange: "bg-orange-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
  };

  return (
    <div
      className={`bg-white relative p-3 rounded-lg border border-grey-500 shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 ${colorMap[color]} rounded-sm`}></div>
        <div className="flex-1 text-end">
          <p className="text-size-16 font-normal text-gray-400 mb-1">{title}</p>
          <h3 className="text-size-24 font-semibold text-gray-900">{value}</h3>
        </div>
      </div>
      <div
        className={`mt-4 h-1 w-full ${colorMap[color]} absolute bottom-0 left-0 rounded-b-full`}
      ></div>
    </div>
  );
};

// Table header component
const TableHeader = ({ title }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">
    {title}
  </th>
);

export default DCAnalyticsTab;
