// 2
'use client';

import React, { useMemo } from 'react';
import type { PopulatedAppointment } from '@/types';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface WeekViewProps {
  appointments: PopulatedAppointment[];
  weekDate: Date;
}

const getAppointmentColorClass = (type: string) => {
  switch (type.toLowerCase()) {
    case 'checkup': return 'bg-blue-500';
    case 'consultation': return 'bg-green-500';
    case 'follow-up': return 'bg-yellow-500';
    case 'procedure': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export function WeekView({ appointments, weekDate }: WeekViewProps) {
  const days = useMemo(() => {
    const start = startOfWeek(weekDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekDate]);

  const timeSlots = useMemo(() => Array.from({ length: 10 }, (_, i) => `${8 + i}:00`), []);

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-fixed bg-white text-sm rounded-lg shadow-sm">
          {/* Sticky Header */}
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider w-24 border-b">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day.toISOString()}
                  className="px-4 py-3 text-center font-semibold text-gray-700 uppercase border-b"
                >
                  {format(day, 'EEE d')}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {timeSlots.map((slot) => (
              <tr key={slot}>
                <td className="px-4 py-3 text-gray-600 font-medium border-r border-gray-100 bg-gray-50">
                  {slot}
                </td>
                {days.map((day) => {
                  const hour = parseInt(slot.split(':')[0]);
                  const appointmentsInSlot = appointments.filter((apt) => {
                    const aptDate = new Date(apt.startTime);
                    return isSameDay(aptDate, day) && aptDate.getHours() === hour;
                  });

                  return (
                    <td
                      key={day.toISOString()}
                      className="px-2 py-4 align-top min-h-[60px] text-center border-l border-gray-100"
                    >
                      <div className="space-y-2">
                        {appointmentsInSlot.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-2 rounded-md text-white text-xs font-medium leading-tight shadow-sm hover:scale-[1.03] transition-transform ${getAppointmentColorClass(
                              apt.type
                            )}`}
                            title={`${format(new Date(apt.startTime), 'HH:mm')} - ${apt.patient.name} (${apt.type})`}
                          >
                            {apt.patient.name}
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
