/**
 * useAppointments Hook
 *
 * This is a custom hook that encapsulates the business logic for fetching
 * and managing appointments. It separates the "how to get data" from the
 * "how to display data".
 */

import { useState, useEffect, useMemo } from 'react';
import type { Doctor, PopulatedAppointment } from '@/types';
import { appointmentService } from '@/services/appointmentService';

// The hook only needs these parameters for filtering.
interface UseAppointmentsParams {
  doctorId: string;
  startDate: Date;
  endDate: Date;
}

// This defines the data structure the hook will return to the component.
interface UseAppointmentsReturn {
  appointments: PopulatedAppointment[];
  doctor: Doctor | undefined;
  loading: boolean;
  error: Error | null;
}

export function useAppointments(params: UseAppointmentsParams): UseAppointmentsReturn {
  const { doctorId, startDate, endDate } = params;

  // Internal state for the hook to manage.
  const [appointments, setAppointments] = useState<PopulatedAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the doctor lookup for efficiency. This only re-runs if doctorId changes.
  const doctor = useMemo(() => {
    if (!doctorId) return undefined;
    return appointmentService.getDoctorById(doctorId);
  }, [doctorId]);

  // The core effect that fetches data whenever the filters change.
  useEffect(() => {
    // If no doctor is selected, clear data and stop loading.
    if (!doctorId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    // This function contains the data fetching logic.
    const fetchData = () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call the service layer to get the fully populated data.
        // This is the key: we get the data ready for the UI right here.
        const fetchedAppointments = appointmentService.getPopulatedAppointmentsByDoctorAndDateRange(
          doctorId,
          startDate,
          endDate
        );

        setAppointments(fetchedAppointments);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, startDate, endDate]); // Re-run this effect if any of these dependencies change.

  return {
    appointments,
    doctor,
    loading,
    error,
  };
}