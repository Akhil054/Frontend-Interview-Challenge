
'use client';

// Import the Doctor type definition.
import type { Doctor } from '@/types';

// Define the props for the component.
// It now accepts the list of doctors directly, making it a "controlled" component.
interface DoctorSelectorProps {
  doctors: Doctor[]; // Receives the full list of doctors as a prop.
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
}

/**
 * DoctorSelector Component
 *
 * A reusable dropdown for selecting a doctor. It does not fetch its own data;
 * instead, it receives the list of doctors via props. This is a best practice
 * for creating reusable UI components.
 */
export function DoctorSelector({
  doctors,
  selectedDoctorId,
  onDoctorChange,
}: DoctorSelectorProps) {
  return (
    <div className="doctor-selector w-full md:w-64">
      {/* 
        The label is visually hidden ("sr-only") for a cleaner UI, 
        but remains accessible to screen readers.
      */}
      <label htmlFor="doctor-select" className="sr-only">Select a doctor</label>

      {/* 
        A native HTML <select> element is used for maximum accessibility and mobile support.
        - `value` is bound to the selectedDoctorId prop from the parent.
        - `onChange` calls the function passed via the onDoctorChange prop.
      */}
      <select
        id="doctor-select"
        value={selectedDoctorId}
        onChange={(e) => onDoctorChange(e.target.value)}
        className="block w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
      >
        {/* A disabled, non-selectable option serves as a placeholder */}
        <option value="" disabled>Select a doctor...</option>
        
        {/* Map over the `doctors` array passed in via props to create an <option> for each one */}
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            Dr. {doctor.name} - {doctor.specialty}
          </option>
        ))}
      </select>
    </div>
  );
}