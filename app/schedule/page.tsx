

'use client';

// Import React hooks and necessary types
import { useState } from 'react';
import type { CalendarView, Doctor } from '@/types';

// Import the service to fetch data and the main view component
import { appointmentService } from '@/services/appointmentService';
import { ScheduleView } from '@/components/ScheduleView';

export default function SchedulePage() {
  /**
   * TODO 2: Set up state for selected doctor and date
   * This is the "source of truth" for the application's state.
   * - `selectedDoctorId`: Starts as an empty string to prompt the user to make a selection.
   * - `selectedDate`: Defaults to the current date.
   * - `view`: Defaults to the 'day' view.
   */
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('day');

  /**
   * Fetch the list of all doctors once from the service layer.
   * This list is then passed down through props to the DoctorSelector component.
   * This avoids having the DoctorSelector fetch its own data, making it more reusable.
   */
  const allDoctors: Doctor[] = appointmentService.getAllDoctors();

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Appointment Schedule
          </h1>
          <p className="text-gray-600">
            View and manage doctor appointments for our hospital.
          </p>
        </header>

        {/* 
          TODO 1: Import and use the ScheduleView component
          The placeholder div has been replaced with the actual ScheduleView component.
          We pass all the state and the state setter functions down as props.
          This is a common pattern called "lifting state up".
        */}
        <ScheduleView
          doctors={allDoctors}
          selectedDoctorId={selectedDoctorId}
          selectedDate={selectedDate}
          view={view}
          onDoctorChange={setSelectedDoctorId}
          onDateChange={setSelectedDate}
          onViewChange={setView}
        />
      </div>
    </main>
  );
}