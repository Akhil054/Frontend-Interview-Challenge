

'use client';

import type { PopulatedAppointment } from '@/types';
import { format } from 'date-fns';

interface DayViewProps {
  appointments: PopulatedAppointment[];
}

// Soft pastel badge color mapping
const getAppointmentBadgeClasses = (type: string) => {
  switch (type.toLowerCase()) {
    case 'checkup': return 'bg-blue-100 text-blue-800';
    case 'consultation': return 'bg-green-100 text-green-800';
    case 'follow-up': return 'bg-yellow-100 text-yellow-800';
    case 'procedure': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function DayView({ appointments }: DayViewProps) {
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm text-sm">
          {/* Sticky header */}
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b w-1/3">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                Duration
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((apt) => {
                const duration =
                  (new Date(apt.endTime).getTime() - new Date(apt.startTime).getTime()) / (1000 * 60);
                return (
                  <tr
                    key={apt.id}
                    className="hover:bg-blue-50 transition-all duration-200 ease-in-out"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium whitespace-nowrap">
                      {format(new Date(apt.startTime), 'HH:mm')} - {format(new Date(apt.endTime), 'HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-gray-700 leading-5">{apt.patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAppointmentBadgeClasses(
                          apt.type
                        )}`}
                      >
                        {apt.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{duration} min</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500 italic"
                >
                  No appointments scheduled for this day.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
