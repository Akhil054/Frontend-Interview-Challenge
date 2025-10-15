'use client';

import type { CalendarView, Doctor } from '@/types';
import { useMemo } from 'react';
import { startOfWeek, endOfWeek, startOfDay, endOfDay, format } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';
import { DoctorSelector } from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';

interface ScheduleViewProps {
  doctors: Doctor[];
  selectedDoctorId: string;
  selectedDate: Date;
  view: CalendarView;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}

export function ScheduleView({
  doctors,
  selectedDoctorId,
  selectedDate,
  view,
  onDoctorChange,
  onDateChange,
  onViewChange,
}: ScheduleViewProps) {
  
  const { startDate, endDate } = useMemo(() => {
    if (view === 'week') {
      return { startDate: startOfWeek(selectedDate, { weekStartsOn: 1 }), endDate: endOfWeek(selectedDate, { weekStartsOn: 1 }) };
    }
    return { startDate: startOfDay(selectedDate), endDate: endOfDay(selectedDate) };
  }, [selectedDate, view]);

  const { appointments, doctor, loading, error } = useAppointments({
    doctorId: selectedDoctorId,
    startDate,
    endDate,
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {doctor ? `Dr. ${doctor.name} - ${doctor.specialty}` : 'Select a Doctor'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {view === 'day' 
              ? format(selectedDate, 'MMMM d, yyyy')
              : `Week of ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DoctorSelector doctors={doctors} selectedDoctorId={selectedDoctorId} onDoctorChange={onDoctorChange} />
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => onViewChange('day')}
              className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${view === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Day
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${view === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Week
            </button>
          </div>
        </div>
      </header>

      <main>
        {loading && <div className="text-center p-12 font-semibold text-gray-500">Loading schedule...</div>}
        {error && <div className="text-center p-12 text-red-500">Error: {error.message}</div>}
        
        {!loading && !error && selectedDoctorId && (
          view === 'day' ? (
            <DayView appointments={appointments} />
          ) : (
            <WeekView appointments={appointments} weekDate={startDate} />
          )
        )}
        
        {!selectedDoctorId && !loading && (
             <div className="text-center p-16 bg-gray-50 rounded-lg">
                 <h3 className="text-lg font-semibold text-gray-700">Please Select a Doctor</h3>
                 <p className="text-gray-500 mt-2">Choose a doctor to view their schedule.</p>
             </div>
        )}
      </main>
    </div>
  );
}