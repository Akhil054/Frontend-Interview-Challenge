// hooks/useDoctors.ts
import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import type { Doctor } from '@/types';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // This effect runs only once on component mount
      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means it runs only once

  return { doctors, loading, error };
}